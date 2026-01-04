<script setup lang="ts">
import type { User } from '~~/shared/types'
import { authClient } from '~/lib/auth-client'

definePageMeta({
  middleware: ['auth'],
})

const { data: session } = await authClient.useSession(useFetch)

async function signOut() {
  await authClient.signOut()
  await navigateTo('/auth/sign-in')
}

const users = useState<User[]>('users', () => [])
const usersStatus = useState<'idle' | 'loading' | 'ready' | 'error'>('users-status', () => 'idle')
const usersError = useState<string | null>('users-error', () => null)

// One-time initialization should happen at the top level (page/layout) to avoid
// reactive re-fetches. Use callOnce for state initialization.
await callOnce('users:init', async () => {
  usersStatus.value = 'loading'
  usersError.value = null

  try {
    const response = await $fetch('/api/users')
    users.value = response.data
    usersStatus.value = 'ready'
  } catch (error) {
    usersStatus.value = 'error'
    usersError.value = error instanceof Error ? error.message : 'Unknown error'
  }
})

// Lazy fetch example - only runs when user triggers the search
const search = ref('')
const {
  data: searchResults,
  status: searchStatus,
  error: searchError,
  execute: runSearch,
} = await useLazyFetch('/api/users', {
  query: computed(() => ({ search: search.value })),
  immediate: false,
  default: () => [] as User[],
  transform: (response) => response.data,
})
const searchPending = computed(() => searchStatus.value === 'pending')
</script>

<template>
  <main class="bg-muted/40 min-h-svh py-10">
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
      <Card>
        <CardHeader class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>You're signed in and ready to go.</CardDescription>
          </div>
          <Button variant="outline" @click="signOut">Sign out</Button>
        </CardHeader>
        <CardContent>
          <pre class="bg-muted rounded-md p-4 text-xs overflow-x-auto whitespace-pre">
            {{ session }}
          </pre>
        </CardContent>
      </Card>

      <header class="space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight">Data fetching examples</h1>
        <p class="text-muted-foreground">
          Use callOnce for initial state and lazy fetches for user-driven queries.
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Initialize shared state</CardTitle>
            <CardDescription>
              callOnce runs once per request and hydrates a shared useState store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="usersStatus === 'loading'" class="text-sm text-muted-foreground">
              Loading users...
            </div>
            <div v-else-if="usersStatus === 'error'" class="text-sm text-destructive">
              {{ usersError }}
            </div>
            <ul v-else class="divide-y rounded-md border text-sm">
              <li v-for="user in users" :key="user.id" class="flex flex-col gap-1 p-3">
                <span class="font-medium">{{ user.name }}</span>
                <span class="text-muted-foreground">{{ user.email }}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lazy fetch on action</CardTitle>
            <CardDescription> This request runs only when the user clicks search.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <form class="space-y-3" @submit.prevent="runSearch()">
              <FieldGroup>
                <Field>
                  <FieldLabel for="user-search">Search users</FieldLabel>
                  <div class="flex flex-col gap-3 sm:flex-row">
                    <Input
                      id="user-search"
                      v-model="search"
                      type="text"
                      placeholder="Search by name"
                    />
                    <Button type="submit">Search</Button>
                  </div>
                  <FieldDescription>
                    Keep search reactive, but run the fetch manually.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>

            <div v-if="searchPending" class="text-sm text-muted-foreground">Searching...</div>
            <div v-else-if="searchError" class="text-sm text-destructive">
              {{ searchError?.message ?? 'Search failed' }}
            </div>
            <ul v-else class="divide-y rounded-md border text-sm">
              <li v-for="user in searchResults" :key="user.id" class="flex flex-col gap-1 p-3">
                <span class="font-medium">{{ user.name }}</span>
                <span class="text-muted-foreground">{{ user.email }}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>
