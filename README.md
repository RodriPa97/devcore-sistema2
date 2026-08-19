# DevCore — Sistema de gestión (login + roles)

Esta es la primera parte del sistema de gestión: login real, registro de
usuarios y un panel de administrador que solo pueden ver los usuarios con
rol `ADMIN`. Los módulos de Stock, Ventas y Administración se van a ir
agregando adentro de este mismo proyecto más adelante.

No pude instalarlo ni probarlo en mi entorno de trabajo (no tiene acceso a
internet para bajar paquetes de npm), así que la primera vez que lo corras
en tu computadora avisame si algo tira error y lo vemos juntos.

## Qué necesitás tener instalado

- **Node.js** versión 18 o superior. Para chequear si ya lo tenés, abrí una
  terminal (en Windows: `cmd` o PowerShell) y escribí:

  ```
  node -v
  ```

  Si te tira un número como `v18.x` o más, ya lo tenés. Si dice que no
  reconoce el comando, descargalo de https://nodejs.org (la versión "LTS").

## Primera vez: cómo ponerlo en marcha

Abrí una terminal **dentro de la carpeta del proyecto** (en VS Code: menú
Terminal → Nueva terminal) y corré, uno por uno:

```
npm install
```

Esto descarga todo lo que el proyecto necesita. Puede tardar uno o dos
minutos.

```
copy .env.example .env
```

(En Mac/Linux sería `cp .env.example .env`). Esto crea tu archivo de
configuración local. Podés abrirlo y cambiar el email/contraseña del
administrador si querés, o dejarlo como está para probar.

```
npx prisma migrate dev --name init
```

Esto crea la base de datos (un archivo local, no hace falta instalar nada
aparte) con la tabla de usuarios.

```
npm run seed
```

Esto crea el usuario administrador inicial con los datos de tu `.env`
(por defecto: `admin@devcore.com` / `CambiarEsta123!`).

```
npm run dev
```

Esto prende el servidor. Dejá esta terminal abierta y andá a
**http://localhost:3000** en el navegador.

## Cómo probarlo

1. Entrá a `/registro` y creá una cuenta de prueba (va a quedar con rol
   `CLIENTE`).
2. Entrá a `/login` con esa cuenta — vas a ver que si intentás entrar a
   `/admin` te redirige a "no autorizado", porque no sos admin.
3. Cerrá sesión y entrá con el usuario administrador
   (`admin@devcore.com` / la contraseña de tu `.env`).
4. Ahora sí vas a poder entrar a `/admin` y a `/admin/usuarios`, donde
   podés ver todos los usuarios registrados y cambiarles el rol
   (hacer admin a un cliente, o sacarle el rol de admin a alguien).

## Las próximas veces

No hace falta repetir todos los pasos. Alcanza con:

```
npm run dev
```

## Estructura del proyecto (por si querés mirar el código)

- `app/login`, `app/registro` — pantallas públicas.
- `app/admin` — panel protegido, solo para rol `ADMIN`.
- `middleware.js` — es lo que bloquea `/admin` si no sos admin.
- `lib/auth.js` — configuración del login (NextAuth).
- `prisma/schema.prisma` — define la tabla de usuarios y sus roles.
