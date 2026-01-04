<script setup lang="ts">

const error = useError()

const statusCode = computed(() => error.value?.statusCode ?? 500)
const statusMessage = computed(() => error.value?.statusMessage ?? "Unexpected error")
const detailMessage = computed(() => {
  if (!error.value?.message || error.value?.message === error.value?.statusMessage) return null
  return error.value.message
})

const handleClear = () => clearError({ redirect: "/" })
</script>

<template>
  <main class="bg-muted/40 min-h-svh py-10">
    <div class="mx-auto w-full max-w-2xl px-4">
      <Empty class="bg-background">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon name="lucide:altert-triangle" class="size-5" />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>{{ statusMessage }}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div class="text-muted-foreground text-xs uppercase tracking-[0.3em]">
            Error {{ statusCode }}
          </div>
          <p v-if="detailMessage" class="text-muted-foreground text-sm">
            {{ detailMessage }}
          </p>
          <Button @click="handleClear">Back home</Button>
        </EmptyContent>
      </Empty>
    </div>
  </main>
</template>
