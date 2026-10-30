# missable.

**Never miss an achievement again.** Un compañero de juego que permite completar objetivos sin adelantarse a la historia.

Primera etapa del frontend: React, Vite, TypeScript estricto, Tailwind CSS 4, componentes shadcn/ui adaptados sobre Radix, React Router, Lucide y Motion. Solo frontend: sin backend simulado, autenticación ni llamadas a la Steam Web API.

## Ejecutar

Requiere Node.js 22.12+ o 24 LTS y npm. El proyecto se construyó con Node 24.

```sh
npm ci
npm run dev
```

Abre la dirección que muestra Vite, normalmente `http://127.0.0.1:5173`.

```sh
npm test          # Reglas, almacenamiento, filtros, rutas y protección de spoilers
npm run build    # TypeScript y build de producción en dist/
npm run preview  # Revisar el build localmente
```

El servidor de producción debe redirigir rutas desconocidas a `index.html`, conservando la URL, para que React Router resuelva enlaces directos como `/games/persona-3/guide`.

## Qué incluye

- Dashboard centrado en retomar Persona 3 Reload, actualizar la etapa y revisar objetivos.
- Biblioteca de seis juegos con búsqueda, filtros por avance, ordenación y estados vacíos.
- Fichas de juegos con progreso, categorías y acceso a guías de ejemplo.
- Cuatro guías interactivas de demostración con búsqueda, categorías combinables, estados, checklist y pistas.
- Tres niveles de spoilers. Activar el nivel 3 requiere confirmación; las instrucciones se revelan individualmente bajo demanda. Al reducir el nivel, se desmontan los paneles abiertos.
- Nombres e iconos secretos protegidos. Las búsquedas utilizan la misma proyección segura que las tarjetas.
- Persistencia de etapa, checklist y preferencias en `localStorage`, con esquema versionado, validación y mensajes ante errores.
- Motor de estimación preparado en `features/progress/inferProgress.ts`: utiliza hitos narrativos y fechas de desbloqueo para calcular una etapa mínima alcanzada. Incluye confianza de la evidencia, separación entre historial de cuenta y partida, y datos sintéticos en `data/progress-inference-demo.ts`. Todavía no está conectado a la interfaz ni a Steam; no cambia el progreso manual.
- Navegación móvil, diálogos con gestión de foco, etiquetas accesibles, enlace para saltar al contenido y respeto por movimiento reducido.

## Datos y recursos

**Todos los logros, cantidades, avances, etapas y reglas son ficticios.** No son una guía real para ninguno de los juegos representados. El estado inicial incluye logros marcados como ejemplo; no procede de una cuenta de Steam. Las etapas no representan capítulos ni fechas reales de Persona 3 Reload.

No hay estimaciones verificadas de horas ni partidas: la interfaz indica «Sin dato verificado». No se han inventado fechas límite reales.

Los nombres de los juegos y sus portadas permiten identificar el catálogo. Las imágenes se cargan desde el CDN público de Steam, sin consultar su API. Requieren conexión y tienen un reemplazo visual ante errores; no se distribuyen imágenes descargadas en este repositorio. Manrope se sirve localmente mediante Fontsource. Los nombres, marcas e imágenes pertenecen a sus respectivos titulares.

## Estructura

```text
src/
  components/                 Componentes visuales compartidos y primitivas ui/
  data/                       Juegos y logros ficticios
  features/
    achievements/             Filas de logros y resumen de objetivos
    games/                    Tarjetas, búsqueda y selectores de progreso
    progress/                 Estado local, persistencia y evaluador ficticio
    spoiler-protection/       Proyección segura y selector de nivel
  layouts/                    Navegación, shell y pie de página
  pages/                      Composición de pantallas
  styles/                     Tokens y estilos por área
  types/                      Contratos de dominio
  lib/                        Utilidades compartidas
```

Las funciones de reglas, búsqueda, presentación segura y almacenamiento no dependen de componentes. Esto permite probarlas y reemplazar sus fuentes de datos sin reescribir las pantallas. Los motivos de las decisiones están en [DECISIONS.md](DECISIONS.md).

## Verificación de esta entrega

- Build de producción y comprobación de TypeScript: correctos.
- 48 pruebas automatizadas: correctas, incluidas inferencia narrativa, rutas y ausencia de contenido protegido en el HTML inicial.
- La instalación final de dependencias informó cero vulnerabilidades. Un intento posterior de repetir `npm audit` no pudo contactar al registro por un error DNS (`ENOTFOUND`).
- Revisión interactiva y responsive en navegador: **pendiente**. El entorno de ejecución bloqueó la apertura del servidor local con `listen EPERM`; no se considera una prueba visual completada.

## Próxima etapa

1. Revisar escritorio, móvil, teclado y navegación con un lector de pantalla en el navegador local.
2. Sustituir un pequeño grupo de ejemplos de Persona 3 Reload por información verificada, con fuente, fecha y revisión de seguridad de spoilers.
3. Definir un contrato de reglas verificadas y su adaptador antes de introducir Flask/PostgreSQL.
4. Incorporar Steam OpenID y sincronización de logros después, manteniendo las claves y llamadas autenticadas en el servidor.

Pendientes deliberados: datos reales, integración de Steam, cuentas, sincronización, historial de partidas, interfaz para confirmar estimaciones y reglas complejas basadas en decisiones. No se ha publicado ni desplegado el proyecto.

# achivrun
