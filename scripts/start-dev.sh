#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

die() {
  printf 'Error: %s\n' "$1" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "No se encontro '$1'. Instalalo y volve a ejecutar este script."
}

read_env_value() {
  local name="$1"
  local line value first last

  line="$(awk -v name="$name" '$0 ~ "^[[:space:]]*" name "[[:space:]]*=" { print; exit }' .env)"
  value="${line#*=}"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"

  if (( ${#value} >= 2 )); then
    first="${value:0:1}"
    last="${value: -1}"
    if [[ ( "$first" == '"' && "$last" == '"' ) || ( "$first" == "'" && "$last" == "'" ) ]]; then
      value="${value:1:${#value}-2}"
    fi
  fi

  printf '%s' "$value"
}

seed=false
for argument in "$@"; do
  case "$argument" in
    --seed)
      seed=true
      ;;
    *)
      die "Argumento desconocido: $argument. Usa --seed de forma opcional."
      ;;
  esac
done

if [[ ! -f .env ]]; then
  [[ -f .env.example ]] || die "No existe .env ni .env.example en $PROJECT_ROOT."
  cp .env.example .env
  die "Se creo .env desde .env.example. Completa DATABASE_URL y NEXTAUTH_SECRET y vuelve a ejecutar el script."
fi

require_command node
require_command npm
require_command docker

database_url="$(read_env_value DATABASE_URL)"
[[ "$database_url" == postgresql://* || "$database_url" == postgres://* ]] || die "DATABASE_URL debe apuntar a PostgreSQL en .env."

nextauth_secret="$(read_env_value NEXTAUTH_SECRET)"
secret_lower="${nextauth_secret,,}"
if (( ${#nextauth_secret} < 32 )) || [[ "$secret_lower" == *cambiar* || "$secret_lower" == *replace* || "$secret_lower" == *example* ]]; then
  die "NEXTAUTH_SECRET debe ser un secreto aleatorio de al menos 32 caracteres."
fi

if [[ "$seed" == true ]]; then
  admin_email="$(read_env_value ADMIN_EMAIL)"
  admin_password="$(read_env_value ADMIN_PASSWORD)"
  [[ -n "$admin_email" && ${#admin_password} -ge 12 ]] || die "Para usar --seed completa ADMIN_EMAIL y ADMIN_PASSWORD en .env."
fi

printf 'Verificando Docker...\n'
docker info >/dev/null 2>&1 || die "Docker no esta iniciado o el daemon no responde."
docker compose version >/dev/null 2>&1 || die "Docker Compose no esta disponible."

printf 'Levantando PostgreSQL...\n'
docker compose up -d postgres

database_ready=false
for ((attempt = 1; attempt <= 30; attempt++)); do
  if docker compose exec -T postgres pg_isready -U devcore -d devcore >/dev/null 2>&1; then
    database_ready=true
    break
  fi
  sleep 2
done

[[ "$database_ready" == true ]] || die "PostgreSQL no estuvo listo despues de 60 segundos. Revisa: docker compose logs postgres"

if [[ ! -d node_modules ]]; then
  printf 'Instalando dependencias...\n'
  npm ci
fi

printf 'Generando Prisma Client...\n'
npx prisma generate

printf 'Aplicando migraciones versionadas...\n'
npx prisma migrate deploy

if [[ "$seed" == true ]]; then
  printf 'Creando o verificando el administrador inicial...\n'
  npm run seed
fi

printf 'Iniciando Next.js en http://localhost:3000\n'
exec npm run dev
