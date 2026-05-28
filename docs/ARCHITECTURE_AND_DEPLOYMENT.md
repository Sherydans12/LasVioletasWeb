# Arquitectura y despliegue — Las Violetas Web

Manual técnico del despliegue en producción con **Next.js standalone** sobre **Coolify** (o cualquier orquestador compatible con contenedores Docker).

---

## 1. Stack y modo de compilación

| Componente | Tecnología |
|------------|------------|
| Framework | Next.js 16 (`output: "standalone"`) |
| Runtime | Node.js (servidor `node .next/standalone/server.js`) |
| Base de datos | PostgreSQL + Prisma |
| Autenticación | Auth.js (NextAuth v5) |
| Archivos | Sistema de archivos local (`UPLOAD_DIR`) |

El modo **standalone** empaqueta solo las dependencias necesarias en `.next/standalone/`. El script `postbuild` copia `public/` y `.next/static/` dentro de ese directorio para que el contenedor sirva assets estáticos del build.

**Importante:** Los archivos subidos por usuarios **no** forman parte del build. Deben vivir en un volumen persistente montado en el contenedor.

---

## 2. Variables de entorno críticas

```env
# URL canónica (metadata, sitemap, OG)
NEXT_PUBLIC_SITE_URL=https://colegiolasvioletas.cl

# PostgreSQL
DATABASE_URL=postgresql://...

# Auth.js
AUTH_SECRET=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...

# Almacenamiento
MAX_STORAGE_GB=10
UPLOAD_DIR=/app/storage
```

### `UPLOAD_DIR`

- Ruta absoluta o relativa al **directorio de trabajo del proceso Node** en runtime.
- Por defecto (si no se define): `join(process.cwd(), 'storage')`.
- En Docker/Coolify se recomienda **`/app/storage`** montado como volumen nombrado.

### `MAX_STORAGE_GB`

Define la cuota lógica mostrada en el panel (`StorageQuotaWidget`). La suma de `tamanoBytes` en tablas `Media` y `Documento` no puede superar este límite al subir archivos nuevos.

---

## 3. Volúmenes persistentes en Coolify

Ejemplo de montaje:

| Ruta en host (ejemplo) | Ruta en contenedor | Contenido |
|------------------------|-------------------|-----------|
| `las-violetas-storage` | `/app/storage` | Uploads (`galeria/`, `noticias/`, `documentos/`) |
| (opcional) backup DB | — | PostgreSQL gestionado aparte |

Estructura esperada dentro del volumen:

```
storage/
├── galeria/
├── noticias/
└── documentos/
```

Sin volumen, cada redeploy **borra** los archivos subidos aunque las URLs sigan en la base de datos (404 al servir).

---

## 4. Enrutamiento y acceso administrativo oculto

### Panel admin

- Rutas bajo `/admin/*` (galería, noticias, perfil, etc.).
- Protegidas por middleware de Auth.js (`matcher` incluye `/admin/:path*`).

### Login oculto

- Constante: `HIDDEN_LOGIN_PATH = "/acceso-privado"` (`src/lib/auth-routes.ts`).
- **No** hay enlaces públicos en Navbar/Footer hacia esta ruta.
- Rutas legadas `/login` y `/gestion-violetas` redirigen a `/` (middleware).

### Rate limiting de subidas

POST a `/api/noticias`, `/api/media` y `/api/documentos` están limitados (30 req/min por IP) en `src/middleware.ts`.

---

## 5. Flujo de peticiones (resumen)

```
Usuario público  →  Páginas RSC / estáticas
Admin autenticado →  /admin/* + APIs REST
Archivo /uploads/...  →  Route Handler dinámico (lee desde UPLOAD_DIR)
```

Los archivos **no** se sirven desde `public/uploads` en producción nueva; la URL `/uploads/{categoria}/{archivo}` es interceptada por `src/app/uploads/[dir]/[file]/route.ts`.

---

## 6. Checklist de despliegue

1. Configurar PostgreSQL y ejecutar `prisma db push` (o migraciones) en el entorno.
2. Definir `AUTH_SECRET`, credenciales admin y Turnstile.
3. Montar volumen en `UPLOAD_DIR` (ej. `/app/storage`).
4. Build: `npm run build` (genera standalone).
5. Start: `node .next/standalone/server.js` (puerto `PORT`, default 3000).
6. Verificar health: home, `/galeria`, subida en `/admin/galeria`, lectura de un archivo `/uploads/galeria/...`.

---

## 7. Migración desde `public/uploads`

Si existían archivos en `public/uploads/`:

1. Copiar el contenido a `storage/` manteniendo subcarpetas (`galeria`, `noticias`, `documentos`).
2. Las URLs en BD (`/uploads/...`) siguen siendo válidas gracias al route handler dinámico.

---

## 8. Referencias en código

| Archivo | Responsabilidad |
|---------|-----------------|
| `next.config.ts` | `output: "standalone"`, cabeceras de seguridad |
| `src/lib/upload-paths.ts` | Resolución segura de `UPLOAD_DIR` |
| `src/middleware.ts` | Auth, rate limit, rutas legadas |
| `src/lib/storage.ts` | Cuota de disco |
| `.env.example` | Plantilla de variables |
