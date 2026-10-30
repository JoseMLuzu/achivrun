import { describe, expect, it } from 'vitest'
import { createInitialState, parseSavedState } from './storage'

describe('persisted state boundary', () => {
  it('roundtrips spoiler level, narrative stage and a manually completed objective', () => {
    const state = createInitialState()
    state.spoilerLevel = 2
    state.progress['persona-3']!.chapter = 3
    state.progress['persona-3']!.completedIds.push('persona-3-1')
    expect(parseSavedState(JSON.stringify(state))).toEqual(state)
  })
  it('rejects corrupted storage and unknown schema versions', () => {
    expect(() => parseSavedState('{')).toThrow()
    expect(() => parseSavedState('{"version":2}')).toThrow()
  })
  it.each([0, 4, '3', null])('rejects invalid spoiler level %s', (spoilerLevel) => {
    expect(() =>
      parseSavedState(JSON.stringify({ ...createInitialState(), spoilerLevel })),
    ).toThrow()
  })
  it.each([-1, 4, 1.5, '1'])('rejects invalid narrative stage %s', (chapter) => {
    const state = createInitialState()
    expect(() =>
      parseSavedState(
        JSON.stringify({
          ...state,
          progress: { ...state.progress, 'persona-3': { ...state.progress['persona-3'], chapter } },
        }),
      ),
    ).toThrow()
  })
  it('drops foreign achievements and deduplicates valid IDs', () => {
    const state = createInitialState()
    state.progress['persona-3']!.completedIds = [
      'persona-3-1',
      'persona-3-1',
      'hades-1',
      'nonexistent',
    ]
    expect(parseSavedState(JSON.stringify(state)).progress['persona-3']!.completedIds).toEqual([
      'persona-3-1',
    ])
  })
})
