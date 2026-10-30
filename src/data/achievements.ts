import type { Achievement, AchievementCategory } from '@/types'
import { games } from './games'

// Entirely fictional fixtures. No names, windows or conditions describe real achievements.
const templates: Pick<
  Achievement,
  | 'title'
  | 'safeTitle'
  | 'categories'
  | 'safeDescription'
  | 'hint'
  | 'instructions'
  | 'availableFrom'
  | 'expiresAt'
>[] = [
  {
    title: 'Una oportunidad pendiente',
    safeTitle: 'Un objetivo por descubrir',
    categories: ['missable'],
    safeDescription: 'Hay una actividad opcional que puedes revisar en esta etapa.',
    hint: 'En este escenario ficticio, revisa las actividades opcionales antes de avanzar.',
    instructions:
      'Regla ficticia: completa la actividad A antes de seleccionar la etapa 03. Esta condición no existe en el juego real.',
    availableFrom: 0,
    expiresAt: 2,
  },
  {
    title: 'Un pequeño desvío',
    safeTitle: 'Objetivo opcional',
    categories: ['normal'],
    safeDescription: 'Un objetivo opcional está disponible para tu partida.',
    hint: 'Escenario ficticio: dedica un momento a explorar una actividad secundaria.',
    instructions:
      'Regla ficticia: marca la actividad B al terminar tu sesión. No corresponde a ningún logro real.',
    availableFrom: 1,
  },
  {
    title: 'El encuentro del observatorio',
    safeTitle: 'Logro secreto',
    categories: ['secret', 'story'],
    safeDescription: 'El nombre y los detalles de este objetivo están protegidos.',
    hint: 'Pista ficticia y segura: continúa a tu ritmo. No necesitas tomar una decisión ahora.',
    instructions:
      'Ejemplo de revelación: visita el observatorio imaginario al llegar a la etapa 04. Este lugar y esta condición son ficticios.',
  },
  {
    title: 'Otra vuelta al camino',
    safeTitle: 'Una nueva partida',
    categories: ['ng-plus'],
    safeDescription: 'Ejemplo de un objetivo asociado a una segunda partida.',
    hint: 'Escenario ficticio: conserva un espacio de guardado para volver después.',
    instructions:
      'Regla ficticia: inicia una segunda partida de demostración. No representa un requisito real del juego.',
    availableFrom: 3,
  },
  {
    title: 'Una tarea a tiempo',
    safeTitle: 'Objetivo con ventana limitada',
    categories: ['missable', 'secret'],
    safeDescription: 'Un objetivo protegido requiere atención antes de avanzar.',
    hint: 'Escenario ficticio: comprueba tu lista de actividades antes de pasar a la etapa 04.',
    instructions:
      'Regla ficticia: completa la actividad C en la etapa 03. No corresponde a una fecha ni misión de Persona 3 Reload.',
    availableFrom: 2,
    expiresAt: 3,
  },
  {
    title: 'Explorar juntos',
    safeTitle: 'Objetivo adicional',
    categories: ['dlc', 'multiplayer'],
    safeDescription: 'Ejemplo de clasificación combinada; no describe modos del juego real.',
    hint: 'Este registro sirve para probar filtros de DLC y multijugador.',
    instructions:
      'No hay instrucciones reales: es un registro ficticio para comprobar categorías combinables.',
  },
]
const initialCounts = [24, 14, 10, 30, 0, 40]
export const achievements: Achievement[] = games.flatMap((game, gameIndex) =>
  Array.from({ length: 40 }, (_, index) => {
    const template = templates[index % templates.length]!
    return {
      ...template,
      ...(index >= 6
        ? {
            categories: ['normal'] as AchievementCategory[],
            safeDescription: 'Objetivo ficticio para probar tu lista de progreso.',
            hint: 'Registro de ejemplo: marca este objetivo cuando quieras probar el seguimiento.',
            instructions:
              'Este registro no corresponde a un logro real. Puedes completarlo manualmente para probar la interfaz.',
            availableFrom: index % 4,
            expiresAt: undefined,
          }
        : {}),
      id: `${game.id}-${index + 1}`,
      gameId: game.id,
      title: index < 6 ? template.title : `Objetivo de ejemplo ${index + 1}`,
      safeTitle:
        index >= 6
          ? `Objetivo de ejemplo ${index + 1}`
          : template.categories.includes('secret')
            ? 'Logro secreto'
            : template.safeTitle,
      initiallyCompleted:
        (index >= 6 && index < 6 + (initialCounts[gameIndex] ?? 0)) || gameIndex === 5,
      isDemo: true,
    }
  }),
)
export const categoryLabels: Record<AchievementCategory, string> = {
  normal: 'Normal',
  missable: 'Perdible',
  story: 'Historia',
  'ng-plus': 'New Game+',
  multiplayer: 'Multijugador',
  dlc: 'DLC',
  secret: 'Secreto',
}
