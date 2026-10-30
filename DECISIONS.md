# Decisiones de la primera etapa

## Identidad visual

Carbón, gris plata y Manrope variable. El acento neutral se comparte entre botones, progreso, navegación y marca; los avisos conservan sus colores semánticos. La portada del juego ocupa el papel principal; los paneles secundarios ayudan a tomar decisiones sin convertir el inicio en un tablero de estadísticas. Los estilos están separados por área y usan tokens compartidos de Tailwind.

Las primitivas de shadcn/ui se mantienen como código propio en `components/ui`, con variantes CVA y comportamiento accesible de Radix para diálogos. Esto evita incorporar un sistema de componentes completo para una interfaz pequeña. `components.json` deja preparado el registro y sus alias.

La escala tipográfica utiliza tokens en rem: contenido principal de 16 px, controles y texto secundario de 14 px, etiquetas de 12 px y encabezados de sección de 18 px con la configuración predeterminada del navegador. Los tamaños se conservan en móvil; se reorganizan columnas y controles para dar espacio a la lectura.

## Dominio separado de la presentación

`Game`, `Achievement`, `PlayerProgress` y `AchievementWarning` son interfaces independientes de React. `AchievementCategory`, `SpoilerLevel` y los estados son uniones cerradas para excluir valores inválidos. Un logro admite múltiples categorías.

Los componentes consumen fixtures de `data/`, nunca contienen condiciones reales de un juego. El evaluador devuelve un estado y un mensaje seguro; una futura respuesta del backend puede adaptarse a ese contrato. La ausencia de una regla produce «sin determinar», no una garantía de seguridad.

## Antiespoilers como política compartida

`presentAchievement` decide qué puede presentarse y buscarse según el nivel. La identidad secreta se oculta en los niveles 1 y 2. No se usan imágenes de logros: un icono neutral evita filtrar spoilers visuales.

El nivel 3 se activa después de confirmar y cada bloque de instrucciones requiere otra acción explícita. El contenido cerrado no se inserta en el HTML. Las filas se remontan al cambiar de nivel para cerrar cualquier revelación previa. Es protección de la experiencia visual, no control de acceso: los fixtures están incluidos en el bundle del frontend.

## Estado local pequeño y versionado

React Context es suficiente para compartir etapa, checklist y nivel. Un estado mínimo evita duplicar porcentajes: estos se derivan del checklist. No se añadió un gestor global ni una capa de caché para datos que aún no vienen de un servidor.

El esquema `missable:v1` valida tipos, etapas e identificadores al leerlo. Descarta IDs ajenos y duplicados; los datos inválidos vuelven al escenario inicial con aviso. Si el navegador impide guardar, la sesión continúa en memoria y muestra el límite al usuario.

No se escucha todavía el evento `storage` entre pestañas. La persistencia local no constituye sincronización ni reemplaza una cuenta.

## Estimación a partir de logros desbloqueados

`inferProgress` recibe eventos con fecha de desbloqueo y un mapa curado de hitos narrativos. Usa el hito más avanzado conocido; un logro opcional más reciente no elimina esa evidencia. No deduce un límite superior de logros ausentes ni aplica un orden lineal a juegos con progresión no lineal.

El resultado expresa «alcanzaste al menos esta etapa», no una ubicación exacta. La confianza se refiere a la evidencia del hito: es alta cuando el último desbloqueo es ese hito y está asociado explícitamente a la partida seleccionada. El historial de cuenta, logros posteriores sin significado narrativo o desbloqueos simultáneos producen confianza media. Sin evidencia válida devuelve estado desconocido.

Los eventos sin asociación explícita a una partida son historial de cuenta. No prueban el estado de un guardado actual, especialmente al repetir el juego. Las estimaciones siempre requieren confirmación y nunca modifican `PlayerProgress` ni activan por sí mismas advertencias de expiración.

Los resultados contienen índices y motivos, sin nombres, iconos ni descripciones de logros. Una futura interfaz debe presentar etiquetas de etapa seguras para el nivel de spoilers. Los mapas de demostración están separados de los verificados. El ejemplo usa un juego enteramente ficticio, sin atribuir hitos reales a Persona 3 Reload.

El algoritmo está preparado y probado como función de dominio. La recepción de eventos desde Steam y el panel para confirmar una sugerencia todavía no están conectados. El checklist actual no guarda fechas ni identifica partidas, por lo que no se utiliza para inventar un historial de desbloqueos.

## Alcance incremental

El dashboard y la biblioteca forman el núcleo de la primera etapa. Las fichas y guías son recorridos básicos para probar modelos y navegación; no incluyen reglas avanzadas ni contenido real. Se omitieron estadísticas no verificadas de horas y partidas.

Se añadieron pruebas para límites que afectan al producto: ventanas de ejemplo, persistencia corrupta, categorías, búsqueda segura y ausencia de spoilers en el HTML. El build comprueba TypeScript. La revisión visual interactiva queda pendiente por la restricción `EPERM` del entorno local.
