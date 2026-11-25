# STOCK.NET — Sistema Integral de Gestión de Inventario, POS y Cadena de Suministro

Bienvenido al repositorio oficial de **STOCK.NET**, refactorizado hacia una arquitectura web moderna **Frontend-First** con **React 18**, **Vite**, **Tailwind CSS**, **Zustand** (con persistencia reactiva en `localStorage`) y **arquitectura Feature-First**.

---

## 🚀 Tecnologías Principales

- **Core:** [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Estilos & Diseño:** [Tailwind CSS](https://tailwindcss.com/) configurado fielmente con los tokens de *Structured Functional Modernism* (`#FCF9F3`, Slate Blue `#4A6B8A`, Amber `#E6A017`, fuentes Montserrat e Inter).
- **Enrutamiento:** [React Router v6](https://reactrouter.com/) con rutas protegidas por roles, layout maestro y página 404.
- **Estado Global & Persistencia:** [Zustand](https://zustand-demo.pmnd.rs/) con middleware `persist` (`localStorage`) y sincronización transaccional entre módulos.
- **Iconografía:** [Lucide React](https://lucide.dev/) (SVGs ligeros y accesibles).
- **Formularios & Validación:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/).

---

## 📚 Índice de Documentación Técnica (`/docs/`)

Toda la documentación técnica requerida se encuentra disponible en formato Markdown y estructurada con rigor de ingeniería de software:

1. 📋 [**Especificación de Requisitos IEEE-830 (`docs/especificacion-requisitos-ieee830.md`)**](file:///c:/Users/santi/Documents/Analisis%20y%20Desarrollo%20de%20software/Proyecto%20final/docs/especificacion-requisitos-ieee830.md)  
   Documentación completa con 46 Requisitos Funcionales (RF01 a RF46) y 13 Requisitos No Funcionales (RNF01 a RNF13), transcritos y formalizados según la plantilla estándar IEEE-830.
2. 🏛️ [**Arquitectura Frontend (`docs/01-arquitectura-frontend.md`)**](file:///c:/Users/santi/Documents/Analisis%20y%20Desarrollo%20de%20software/Proyecto%20final/docs/01-arquitectura-frontend.md)  
   Explicación de la arquitectura *Feature-First*, flujo de datos unidireccional con Zustand, sincronización de integridad referencial y estrategias de enrutamiento por roles.
3. 🎨 [**Guía de Estilos y Tokens Visuales (`docs/02-guia-estilos-ui.md`)**](file:///c:/Users/santi/Documents/Analisis%20y%20Desarrollo%20de%20software/Proyecto%20final/docs/02-guia-estilos-ui.md)  
   Inventario completo de tokens cromáticos, tipografía (`Montserrat` / `Inter`), escalas de densidad, radios, sombras y catálogo de componentes compartidos.
4. 🗄️ [**Diccionario de Datos Mock y Persistencia (`docs/03-diccionario-datos-mock.md`)**](file:///c:/Users/santi/Documents/Analisis%20y%20Desarrollo%20de%20software/Proyecto%20final/docs/03-diccionario-datos-mock.md)  
   Modelos TypeScript-like de todas las entidades (`Product`, `Category`, `Sale`, `Customer`, `Supplier`, `CreditAccount`, `User`), tipos y llaves de `localStorage`.
5. 🛡️ [**Bitácora de Implementación — Auditoría Fase 2 (`docs/bitacora-implementacion-fase2.md`)**](file:///c:/Users/santi/Documents/Analisis%20y%20Desarrollo%20de%20software/Proyecto%20final/docs/bitacora-implementacion-fase2.md)  
   Registro pormenorizado de los 46 RF, 13 RNF, árbol exhaustivo de archivos creados y contratos de arquitectura para prevenir inconsistencias y alucinaciones.
6. 🔍 [**Bitácora de Auditoría, Limpieza y Compilación — Fase 3 (`docs/bitacora-auditoria-fase3.md`)**](file:///c:/Users/santi/Documents/Analisis%20y%20Desarrollo%20de%20software/Proyecto%20final/docs/bitacora-auditoria-fase3.md)  
   Certificación estática de código (0 logs, 0 TODOs), verificación de build de producción con Vite 6, auditoría de responsividad multidispositivo y estados vacíos.
7. 📄 [**Plantilla Original Word (`docs/Formato_IEEE_830. STOCK.NET.docx`)**](file:///c:/Users/santi/Documents/Analisis%20y%20Desarrollo%20de%20software/Proyecto%20final/docs/Formato_IEEE_830.%20STOCK.NET.docx)  
   Documento base original preservado en el repositorio.

---

## 🛠️ Instalación y Puesta en Marcha

### Prerrequisitos
- **Node.js:** Versión 18.0 o superior (verificado en Node v24).
- **npm:** Versión 9 o superior.

### Pasos de Ejecución
1. Clonar o posicionarse en la carpeta raíz del proyecto:
   ```bash
   cd "Proyecto final"
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo en caliente:
   ```bash
   npm run dev
   ```
4. Construir la versión de producción optimizada:
   ```bash
   npm run build
   ```

---

## 👥 Credenciales de Prueba (Simulador de Roles)

El sistema incluye operadores de muestra para evaluar los flujos de seguridad y control de acceso:

| Rol | Correo / Usuario | Contraseña | Destino por Defecto |
| :--- | :--- | :--- | :--- |
| **Administrador Propietario** | `admin@stocknet.com` | `admin123` | `/dashboard` (Acceso total) |
| **Administrador BD / Almacén** | `almacen@stocknet.com` | `almacen123` | `/dashboard` (Catálogo, compras y ajustes) |
| **Empleado / Cajero** | `cajero@stocknet.com` | `cajero123` | `/pos` (Exclusivo ventas y caja) |

*En la pantalla de inicio de sesión (`/login`) se dispone además de un **Simulador Rápido de Roles** para alternar de perfil en un solo clic sin necesidad de escribir credenciales.*

---

## 🔄 Restablecimiento de Datos de Prueba (*Reset Mock Data*)

Para facilitar demostraciones, evaluaciones de calidad y auditoría, la barra superior (**Header**) incluye un botón con icono de refresco que permite reiniciar todos los datos a sus valores iniciales predeterminados en cualquier momento, purgando las claves de `localStorage`.
