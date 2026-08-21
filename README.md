# DevCore - Sistema de gestión

Aplicación full-stack para registro de clientes, autenticación, seguimiento
de proyectos y administración de usuarios. Incluye una landing pública y un
panel protegido para clientes y administradores.

## Stack

- Next.js 16 con App Router y React Server Components.
- React 18.
- NextAuth 4.24.15 con Credentials y sesiones JWT.
- Prisma 5.18 sobre PostgreSQL.
- Tailwind CSS para el panel y CSS propio para la landing.
- Zod para validación de entradas.
- Upstash Redis opcional para rate limiting distribuido.

## Requisitos

- Node.js 20.9 o superior.
- npm 11 o superior recomendado.
- Docker Desktop para PostgreSQL local.

## Desarrollo local

1. Instalar dependencias:

   ```bash
   npm ci
   ```

2. Levantar PostgreSQL:

   ```bash
   docker compose up -d postgres
   ```

3. Crear la configuración local:

   ```bash
   copy .env.example .env
   ```

   En macOS/Linux usar `cp .env.example .env`.

4. Completar `.env`:

   - `NEXTAUTH_SECRET`: generar con
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - `ADMIN_EMAIL`: email del administrador inicial.
   - `ADMIN_PASSWORD`: contraseña aleatoria de al menos 12 caracteres.

5. Crear o actualizar el esquema local:

   ```bash
   npx prisma migrate dev
   ```

6. Crear el administrador inicial:

   ```bash
   npm run seed
   ```

   El seed no usa credenciales predeterminadas, no imprime contraseñas y no
   sobrescribe cuentas existentes.

7. Iniciar la aplicación:

   ```bash
   npm run dev
   ```

   Abrir `http://localhost:3000`.

### Arranque automatico

Los scripts de `scripts/` automatizan el arranque local, incluyendo la
verificacion de requisitos, PostgreSQL, dependencias, Prisma y migraciones.

En PowerShell:

```powershell
.\scripts\start-dev.ps1
```

En Linux o macOS:

```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

Para crear o verificar el administrador inicial durante el arranque:

```powershell
.\scripts\start-dev.ps1 -Seed
```

```bash
./scripts/start-dev.sh --seed
```

El seed es opcional para evitar modificar datos cada vez que se inicia el
servidor. Los cambios futuros del esquema deben crear una migracion explicita
con `npx prisma migrate dev --name descripcion_del_cambio`.

## Entornos

- Desarrollo: PostgreSQL de Docker definido en `compose.yaml`.
- Staging: base Neon independiente y secretos propios.
- Producción: base Neon independiente, backups y migraciones aprobadas.

En staging y producción, configurar también `UPSTASH_REDIS_REST_URL` y
`UPSTASH_REDIS_REST_TOKEN`. Sin esas variables se usa un limitador en memoria,
útil solo para desarrollo y no suficiente para múltiples instancias.

## Migraciones

Crear una migración durante el desarrollo:

```bash
npx prisma migrate dev --name descripcion_del_cambio
```

Aplicar migraciones ya versionadas en staging/producción:

```bash
npx prisma migrate deploy
```

No usar `prisma db push` ni `prisma migrate dev` contra producción. Hacer un
backup antes de las migraciones que modifiquen datos o restricciones.

## Scripts

```bash
npm run dev       # desarrollo
npm run lint      # ESLint
npm run test      # pruebas unitarias
npm run build     # build de producción
npm run start     # servidor de producción
npm run seed      # administrador inicial
npm audit         # auditoría de dependencias
```

## Rutas principales

| Ruta | Acceso | Función |
| --- | --- | --- |
| `/` | Público | Landing institucional |
| `/login` | Público | Inicio de sesión |
| `/registro` | Público | Registro de clientes |
| `/panel` | Autenticado | Proyectos del usuario |
| `/admin` | `ADMIN` | Resumen administrativo |
| `/admin/usuarios` | `ADMIN` | Usuarios, roles y administradores |
| `/admin/proyectos` | `ADMIN` | Alta, edición y baja de proyectos |

## Seguridad

- Las acciones administrativas revalidan el usuario y el rol actual en la
  base de datos.
- `sessionVersion` permite invalidar sesiones JWT después de cambios de rol,
  contraseña o estado de cuenta.
- El middleware/proxy solo es una primera barrera; no reemplaza la autorización
  del servidor.
- Los callbacks de login aceptan únicamente rutas internas.
- Registro y login tienen rate limiting.
- Los roles, estados y el rango de avance están restringidos en PostgreSQL.
- Las acciones sensibles generan registros de auditoría.

## Estructura

```text
app/(site)             landing pública
app/(app)              login, registro, panel y administración
app/api                Route Handlers
components             componentes compartidos
lib/auth.js            configuración NextAuth
lib/authz.js           autorización contra la base actual
lib/validation.js      esquemas y normalización
lib/rateLimit.js       limitación distribuida o fallback local
lib/audit.js           auditoría de acciones sensibles
prisma/schema.prisma   modelos, enums e índices
prisma/migrations      historial de cambios de base
proxy.js               protección temprana de rutas privadas
tests                  pruebas automatizadas
```
