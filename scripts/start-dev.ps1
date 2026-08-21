param(
    [switch]$Seed
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $ProjectRoot

function Stop-WithError {
    param([string]$Message)

    Write-Error $Message
    exit 1
}

function Require-Command {
    param([string]$Name)

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        Stop-WithError "No se encontro '$Name'. Instalalo y volve a ejecutar este script."
    }
}

function Invoke-Checked {
    param(
        [string]$CommandName,
        [string[]]$Arguments
    )

    & $CommandName @Arguments
    if ($LASTEXITCODE -ne 0) {
        Stop-WithError "El comando '$CommandName $($Arguments -join ' ')' fallo con codigo $LASTEXITCODE."
    }
}

function Get-DotEnvValue {
    param([string]$Name)

    $envPath = Join-Path $ProjectRoot ".env"
    $escapedName = [regex]::Escape($Name)

    foreach ($line in Get-Content -LiteralPath $envPath) {
        if ($line -match "^\s*$escapedName\s*=\s*(.*)$") {
            $value = $Matches[1].Trim()
            if ($value.Length -ge 2) {
                $first = $value.Substring(0, 1)
                $last = $value.Substring($value.Length - 1, 1)
                if (($first -eq '"' -and $last -eq '"') -or ($first -eq "'" -and $last -eq "'")) {
                    $value = $value.Substring(1, $value.Length - 2)
                }
            }
            return $value
        }
    }

    return ""
}

$envPath = Join-Path $ProjectRoot ".env"
$envExamplePath = Join-Path $ProjectRoot ".env.example"
if (-not (Test-Path -LiteralPath $envPath)) {
    if (-not (Test-Path -LiteralPath $envExamplePath)) {
        Stop-WithError "No existe .env ni .env.example en $ProjectRoot."
    }

    Copy-Item -LiteralPath $envExamplePath -Destination $envPath
    Stop-WithError "Se creo .env desde .env.example. Completa DATABASE_URL y NEXTAUTH_SECRET y vuelve a ejecutar el script."
}

Require-Command "node"
Require-Command "npm"
Require-Command "docker"

$databaseUrl = Get-DotEnvValue "DATABASE_URL"
if (-not ($databaseUrl.StartsWith("postgresql://") -or $databaseUrl.StartsWith("postgres://"))) {
    Stop-WithError "DATABASE_URL debe apuntar a PostgreSQL en .env."
}

$nextAuthSecret = Get-DotEnvValue "NEXTAUTH_SECRET"
$secretLower = $nextAuthSecret.ToLowerInvariant()
if ($nextAuthSecret.Length -lt 32 -or $secretLower.Contains("cambiar") -or $secretLower.Contains("replace") -or $secretLower.Contains("example")) {
    Stop-WithError "NEXTAUTH_SECRET debe ser un secreto aleatorio de al menos 32 caracteres."
}

if ($Seed) {
    $adminEmail = Get-DotEnvValue "ADMIN_EMAIL"
    $adminPassword = Get-DotEnvValue "ADMIN_PASSWORD"
    if ([string]::IsNullOrWhiteSpace($adminEmail) -or $adminPassword.Length -lt 12) {
        Stop-WithError "Para usar -Seed completa ADMIN_EMAIL y ADMIN_PASSWORD en .env."
    }
}

Write-Host "Verificando Docker Desktop..."
& cmd.exe /d /c "docker info >nul 2>&1"
if ($LASTEXITCODE -ne 0) {
    Stop-WithError "Docker Desktop no esta iniciado o el daemon no responde."
}

& cmd.exe /d /c "docker compose version >nul 2>&1"
if ($LASTEXITCODE -ne 0) {
    Stop-WithError "Docker Compose no esta disponible."
}

Write-Host "Levantando PostgreSQL..."
Invoke-Checked "docker" @("compose", "up", "-d", "postgres")

$databaseReady = $false
for ($attempt = 1; $attempt -le 30; $attempt++) {
    & cmd.exe /d /c "docker compose exec -T postgres pg_isready -U devcore -d devcore >nul 2>&1"
    if ($LASTEXITCODE -eq 0) {
        $databaseReady = $true
        break
    }
    Start-Sleep -Seconds 2
}

if (-not $databaseReady) {
    Stop-WithError "PostgreSQL no estuvo listo despues de 60 segundos. Revisa: docker compose logs postgres"
}

if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot "node_modules"))) {
    Write-Host "Instalando dependencias..."
    Invoke-Checked "npm.cmd" @("ci")
}

Write-Host "Generando Prisma Client..."
Invoke-Checked "npx.cmd" @("prisma", "generate")

Write-Host "Aplicando migraciones versionadas..."
Invoke-Checked "npx.cmd" @("prisma", "migrate", "deploy")

if ($Seed) {
    Write-Host "Creando o verificando el administrador inicial..."
    Invoke-Checked "npm.cmd" @("run", "seed")
}

Write-Host "Iniciando Next.js en http://localhost:3000"
& npm.cmd run dev
exit $LASTEXITCODE
