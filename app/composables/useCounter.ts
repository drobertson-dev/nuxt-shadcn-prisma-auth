type CounterState = {
  count: number
  lastUpdated: string | null
}

// Global/shared state: defined outside the composable and keyed by useState.
const useCounterState = () =>
  useState<CounterState>('counter', () => ({
    count: 0,
    lastUpdated: null,
  }))

export const useCounter = () => {
  const state = useCounterState()

  const increment = (by = 1) => {
    state.value.count += by
    state.value.lastUpdated = new Date().toISOString()
  }

  const reset = () => {
    state.value = { count: 0, lastUpdated: null }
  }

  return {
    state,
    increment,
    reset,
  }
}
