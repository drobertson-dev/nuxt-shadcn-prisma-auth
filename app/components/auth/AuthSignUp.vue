<script setup lang="ts">
import type { HTMLAttributes, Ref } from "vue"
import { cn } from "~/lib/utils"
import { authClient } from "~/lib/auth-client"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

/**
 * Route composable for accessing route information.
 */
const route = useRoute()
/**
 * Runtime configuration composable for accessing public/private config.
 */
const runtimeConfig = useRuntimeConfig()
/**
 * Local State Variables
 * @type {Ref<string>} name - User's full name
 * @type {Ref<string>} email - User's email address
 * @type {Ref<string>} password - User's password
 * @type {Ref<string>} confirmPassword - User's password confirmation
 * @type {Ref<string|null>} errorMsg - Error message to display
 * @type {Ref<string>} signUpPending - Sign Up Pending
 * @type {Ref<string>} googlePending - Google Oauth Pending
 * @type {Ref<string|null>} githubPending - Github Oath Pending
 */
const name: Ref<string> = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const errorMsg = ref<string | null>(null)
const signUpPending = ref(false)
const googlePending = ref(false)
const githubPending = ref(false)
/**
 * OAuth Providers
 * @returns {Record<string, boolean>} - Enabled OAuth providers from runtime config
 */
const oauthProviders = computed(() => runtimeConfig.public.authProviders ?? {})
/**
 * Whether Google OAuth is enabled
 * @returns {boolean}
 */
const googleEnabled = computed(() => Boolean(oauthProviders.value.google))
/**
 * Whether GitHub OAuth is enabled
 * @returns {boolean}
 */
const githubEnabled = computed(() => Boolean(oauthProviders.value.github))

/**
 * Computes the next URL to redirect to after sign up.
 * @returns {string}
 */
const nextUrl = computed(() => {
  const next = route.query.next
  return typeof next === "string" && next.length > 0 ? next : "/"
})
/**
 * Sets the error message to display.
 * @param {string | null} message - The error message to set
 */
function setError(message: string | null) {
  errorMsg.value = message
}
/**
 * Handles the sign-up form submission.
 * Validates input and calls the auth client sign up method.
 * Redirects to verify email page on success.
 * @returns {Promise<void>}
 */
async function onSignUp(): Promise<void> {
  setError(null)
  if (!name.value || !email.value || !password.value) {
    setError("Name, email, and password are required.")
    return
  }
  if (password.value !== confirmPassword.value) {
    setError("Passwords do not match.")
    return
  }
  if (signUpPending.value) return
  signUpPending.value = true
  try {
    const { error } = await authClient.signUp.email({
      name: name.value,
      email: email.value,
      password: password.value,
    })
    if (error) {
      setError(error.message ?? "An error occurred")
      return
    }
    const params = new URLSearchParams({
      email: email.value,
      next: nextUrl.value,
    })
    await navigateTo(`/auth/verify-email?${params.toString()}`)
  } finally {
    signUpPending.value = false
  }
}
/**
 * Initiates sign up with Google OAuth provider.
 * @returns {Promise<void>}
 */
async function signUpGoogle(): Promise<void> {
  if (!googleEnabled.value || googlePending.value) return
  googlePending.value = true
  await authClient.signIn.social({ provider: "google" })
}
/**
 * Initiates sign up with GitHub OAuth provider.
 * @returns {Promise<void>}
 */
async function signUpGithub(): Promise<void> {
  if (!githubEnabled.value || githubPending.value) return
  githubPending.value = true
  await authClient.signIn.social({ provider: "github" })
}
</script>

<template>
  <form :class="cn('flex flex-col gap-6', props.class)" @submit.prevent="onSignUp">
    <FieldGroup>
      <div class="flex flex-col items-center gap-1 text-center">
        <h1 class="text-2xl font-bold">Create your account</h1>
        <p class="text-muted-foreground text-sm text-balance">
          Fill in the form below to create your account
        </p>
      </div>
      <Field>
        <FieldLabel for="name"> Full Name</FieldLabel>
        <Input id="name" v-model="name" type="text" placeholder="John Doe" required />
      </Field>
      <Field>
        <FieldLabel for="email"> Email</FieldLabel>
        <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
      </Field>
      <Field>
        <FieldLabel for="password"> Password</FieldLabel>
        <Input id="password" v-model="password" type="password" required />
        <FieldDescription> Must be at least 8 characters long.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="confirm-password"> Confirm Password</FieldLabel>
        <Input id="confirm-password" v-model="confirmPassword" type="password" required />
        <FieldDescription>Please confirm your password.</FieldDescription>
      </Field>
      <Field>
        <Button type="submit" :disabled="signUpPending">
          <Spinner v-if="signUpPending" class="mr-2" />
          Create Account
        </Button>
      </Field>
      <Field v-if="errorMsg">
        <p class="text-sm text-destructive text-center">{{ errorMsg }}</p>
      </Field>
      <FieldSeparator v-if="googleEnabled || githubEnabled">Or continue with</FieldSeparator>
      <Field v-if="googleEnabled || githubEnabled">
        <div class="grid gap-2">
          <Button
            v-if="googleEnabled"
            variant="outline"
            type="button"
            :disabled="googlePending"
            @click="signUpGoogle"
          >
            <Spinner v-if="googlePending" class="mr-2" />
            Continue with Google
          </Button>
          <Button
            v-if="githubEnabled"
            variant="outline"
            type="button"
            :disabled="githubPending"
            @click="signUpGithub"
          >
            <Spinner v-if="githubPending" class="mr-2" />
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Continue with GitHub
          </Button>
        </div>
      </Field>
      <Field>
        <FieldDescription class="px-6 text-center">
          Already have an account?
          <NuxtLink to="/auth/sign-in">Sign in</NuxtLink>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>
</template>
