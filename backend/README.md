# SFICI Backend - API REST

Servidor API REST para la plataforma SFICI. Gestiona autenticacion JWT, configuracion institucional, catalogo de productos financieros, solicitudes de credito con validacion biometrica e historial de simulaciones.

## Stack

- **Express 4.21** - Framework HTTP
- **Prisma 6.19** - ORM con migraciones
- **SQLite** - Base de datos embebida (desarrollo)
- **Zod 3.24** - Validacion de esquemas
- **jsonwebtoken** - Autenticacion JWT
- **bcryptjs** - Hash de contrasenas
- **Morgan** - Logging HTTP

## Inicio Rapido

```bash
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

El servidor inicia en `http://localhost:3001`.

## Scripts

| Script | Comando | Descripcion |
|--------|---------|-------------|
| `dev` | `node --watch src/server.js` | Desarrollo con hot reload |
| `start` | `node src/server.js` | Produccion |
| `db:push` | `prisma db push` | Sincronizar schema con DB |
| `db:migrate` | `prisma migrate dev` | Crear migracion |
| `db:studio` | `prisma studio` | UI visual de la base de datos |

## Variables de Entorno

| Variable | Descripcion | Default |
|----------|------------|---------|
| `PORT` | Puerto del servidor | `3001` |
| `DATABASE_URL` | Conexion a SQLite | `file:./dev.db` |
| `FRONTEND_ORIGIN` | Origen CORS permitido | `http://localhost:5173` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | `sfici-dev-secret-2026` |

## Modelo de Datos

### User

Usuarios del sistema (administradores y clientes).

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | String (UUID) | Identificador unico |
| email | String (unique) | Correo electronico |
| passwordHash | String | Hash bcrypt de la contrasena |
| role | String | `admin` o `client` |
| cedula | String? (unique) | Cedula de identidad |
| nombres, apellidos | String? | Nombre completo |
| telefono, direccion, ciudadResidencia | String? | Datos de contacto |
| fechaNacimiento, estadoCivil | String? | Datos personales |
| empresa, antiguedadLaboral | String? | Datos laborales |
| ingresosMensuales, egresosMensuales | Float? | Datos financieros |

### InstitutionalProfile

Perfil unico de la institucion financiera (singleton con id="default").

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| nombre | String | Nombre de la institucion |
| ruc | String | Identificacion tributaria |
| direccion, telefonos, email | String | Datos de contacto |
| lema | String | Slogan institucional |
| pieDocumentos | String | Pie de pagina para PDFs |
| colorPrimario, colorSecundario | String | Colores hex de marca |
| logoDataUrl | String? | Logo en base64 data URL |

### CreditProduct

Producto de credito configurable por el administrador.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| nombre | String | Nombre del producto |
| tasaAnual, tasaMoratoria | Float | Tasas de interes (%) |
| montoMin, montoMax | Float | Rango de montos permitidos |
| plazoMinMeses, plazoMaxMeses | Int | Rango de plazos en meses |
| periodicidades | String (JSON) | Frecuencias de pago habilitadas |
| porcentajeEntrada | Float | Porcentaje de entrada requerido |
| cobrosIds | String (JSON) | IDs de cobros indirectos asociados |
| activo | Boolean | Si el producto esta disponible |

### Charge

Cobro indirecto asociable a productos de credito.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| nombre | String | Nombre del cobro |
| tipo | String | `fijo` o `porcentaje` |
| valor | Float | Monto fijo o porcentaje |
| frecuencia | String | `mensual` o `unico` |
| naturaleza | String | `obligatorio` u `opcional` |

### InvestmentProduct

Producto de inversion configurable.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| nombre | String | Nombre del producto |
| tasaAnual | Float | Tasa de rendimiento anual (%) |
| montoMin | Float | Monto minimo de inversion |
| plazoMeses | String (JSON) | Plazos disponibles en meses |
| capitalizacion | String | Frecuencia de capitalizacion |
| penalizacionRetiro | Float | Penalizacion por retiro anticipado (%) |
| impuesto | Float | Impuesto aplicable (%) |
| renovacionAuto | Boolean | Renovacion automatica al vencimiento |

### CreditRequest

Solicitud de credito con datos del cliente, simulacion, documentos y biometria.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| estado | String | Pendiente, Observacion, En revision, Aprobado, Rechazado |
| cedula, nombres, apellidos, email, telefono | String | Datos del cliente |
| direccion, ciudadResidencia, fechaNacimiento | String | Datos personales |
| estadoCivil, empresa, antiguedadLaboral | String | Datos adicionales |
| ingresosMensuales, egresosMensuales | Float | Datos financieros |
| productoId, productoNombre | String | Producto seleccionado |
| monto, plazoMeses, periodicidad | Mixed | Parametros del credito |
| metodoAmortizacion | String | `frances` o `aleman` |
| totalPagar, cuotaMensual | Float | Resultado de simulacion |
| docCedulaFrontal, docCedulaTrasera | String? | Fotos de cedula (base64) |
| docComprobanteIngresos, docPlanillaServicios | String? | Documentos (base64) |
| docDeclaracionImpuestos | String? | Documento opcional (base64) |
| selfieBase64 | String? | Selfie del cliente (base64) |
| biometriaScore | Float? | Score de similitud facial (0-1) |
| biometriaAprobada | Boolean | Resultado de validacion biometrica |
| notasAsesor | String? | Observaciones del asesor |
| fechaRevision | DateTime? | Fecha de revision por asesor |

### SimulationHistory

Registro de simulaciones realizadas por clientes.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| fecha | DateTime | Fecha de la simulacion |
| usuario | String | Nombre del cliente |
| tipoCredito | String | Producto utilizado |
| monto, totalPagar | Float | Montos simulados |
| metodo | String | Metodo de amortizacion |
| estado | String | Estado de la simulacion |

## Endpoints

### Autenticacion

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | — | Registro de clientes |
| `POST` | `/api/auth/login` | — | Login (retorna JWT) |
| `GET` | `/api/auth/me` | JWT | Obtener usuario actual |

### Catalogo

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| `GET` | `/api/catalog` | — | Obtener productos y cobros |
| `PUT` | `/api/catalog` | Admin | Reemplazar catalogo completo |

### Perfil Institucional

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| `GET` | `/api/institution/profile` | — | Obtener perfil actual |
| `PUT` | `/api/institution/profile` | Admin | Actualizar perfil |

### Solicitudes de Credito

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| `POST` | `/api/requests` | JWT | Crear solicitud completa |
| `GET` | `/api/requests` | Admin | Listar todas las solicitudes |
| `GET` | `/api/requests/by-cedula/:cedula` | JWT | Solicitudes por cedula |
| `GET` | `/api/requests/:id` | JWT | Detalle de una solicitud |
| `PATCH` | `/api/requests/:id/review` | Admin | Cambiar estado + notas |

### Historial

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| `GET` | `/api/history` | JWT | Listar simulaciones |
| `POST` | `/api/history` | JWT | Crear entrada |
| `PATCH` | `/api/history/:id/status` | JWT | Actualizar estado |

## Arquitectura

```
backend/src/
├── server.js             # Bootstrap: morgan, cors, seed, graceful shutdown
├── app.js                # Express app + middleware chain
├── config/
│   └── env.js            # Variables de entorno (PORT, JWT_SECRET, etc.)
├── db/
│   └── prisma.js         # Singleton PrismaClient
├── middleware/
│   ├── authMiddleware.js  # JWT authenticate, requireRole, loadUser
│   ├── errorHandler.js    # Manejo centralizado de errores
│   └── validate.js        # Middleware de validacion Zod
├── routes/
│   ├── api.js             # Router principal
│   ├── auth.js            # POST register, login, GET me
│   ├── catalog.js         # GET/PUT catalogo
│   ├── institution.js     # GET/PUT perfil institucional
│   ├── history.js         # GET/POST/PATCH historial
│   └── requests.js        # POST/GET/PATCH solicitudes
├── services/
│   ├── authService.js     # Register, login, JWT, hash
│   ├── catalogService.js  # CRUD catalogo + seed
│   ├── institutionService.js  # CRUD perfil
│   ├── historyService.js  # CRUD historial
│   ├── requestsService.js # CRUD solicitudes de credito
│   └── seedDefaults.js    # Datos iniciales por defecto
├── schemas/
│   ├── authSchemas.js     # Zod: register, login
│   ├── catalogSchemas.js  # Zod: catalogo
│   ├── institutionSchemas.js  # Zod: perfil
│   ├── historySchemas.js  # Zod: historial
│   └── requestsSchemas.js # Zod: solicitudes
└── lib/
    ├── httpErrors.js      # Clase HttpError
    └── jsonFields.js      # Helpers JSON para SQLite
```

## Seeding

Al iniciar, el servidor verifica si existen datos y crea el usuario admin por defecto si no existe. Tambien inserta productos, cobros e inversiones de ejemplo.

## Notas de Desarrollo

- Los campos que almacenan arrays (periodicidades, cobrosIds, plazoMeses) se serializan como JSON strings en SQLite
- El catalogo se reemplaza atomicamente usando `$transaction` de Prisma (deleteMany + createMany)
- CORS esta configurado para aceptar peticiones solo del `FRONTEND_ORIGIN`
- El body limit de JSON esta en 15MB para soportar documentos y fotos en base64
- Las solicitudes de credito almacenan fotos de cedula, selfie y documentos como base64 en la DB
