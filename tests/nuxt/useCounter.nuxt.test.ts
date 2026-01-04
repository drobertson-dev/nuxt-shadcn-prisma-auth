import { describe, expect, it } from 'vitest'
import { computed, defineComponent } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useCounter } from '#imports'

describe('useCounter', () => {
  it('increments the shared counter state', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { state, increment, reset } = useCounter()
        reset()
        increment()

        const count = computed(() => state.value.count)
        return { count }
      },
      template: '<div>{{ count }}</div>',
    })

    const wrapper = await mountSuspended(TestComponent)
    expect(wrapper.text()).toBe('1')
  })
})
