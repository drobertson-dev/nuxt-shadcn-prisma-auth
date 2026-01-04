import { authClient } from '~/lib/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch)
  if (!session.value) {
    return navigateTo(`/auth/sign-in?next=${encodeURIComponent(to.fullPath)}`)
  }
})
