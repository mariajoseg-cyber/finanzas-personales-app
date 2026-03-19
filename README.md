# Finanzas Personales Chile (React + Vite)

Aplicación web simple para controlar tus **ingresos, descuentos, gastos, deudas y ahorro mensual**.
Toda la información se guarda en `localStorage`, por lo que no necesitas backend.

## Características

- Ingresos mensuales con cálculo automático de total.
- Descuentos editables (AFP y Salud) y sueldo líquido estimado.
- Gastos dinámicos: agregar, editar y eliminar categorías.
- Deudas con cuota mensual y barra de progreso de pago.
- Resumen general con indicadores positivos (verde) o déficit (rojo).
- Meta de ahorro mensual con validación automática.
- Historial por mes (enero a diciembre).
- Datos de ejemplo realistas incluidos para enero y febrero.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalación

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

Luego abre la URL que muestra Vite (normalmente `http://localhost:5173`).

## Build de producción

```bash
npm run build
npm run preview
```

## Cómo modificar la app

### Archivos principales

- `src/App.jsx`: lógica de la aplicación, formularios, cálculos y almacenamiento.
- `src/styles.css`: estilos visuales (tarjetas, colores, responsive).
- `src/main.jsx`: punto de entrada de React.

### Estructura general del proyecto

```text
finanzas-personales-app/
├─ index.html
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   └─ styles.css
```

## Persistencia de datos

- Clave usada en navegador: `finanzas-personales-chile`
- Si deseas reiniciar los datos, borra esa clave desde las herramientas del navegador.

## Notas

- Montos en formato de pesos chilenos (`CLP`).
- Todos los textos de la interfaz están en español.
