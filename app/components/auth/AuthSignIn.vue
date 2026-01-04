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
 * Session state for redirecting authenticated users.
 */
const { data: session } = await authClient.useSession(useFetch)
/**
 * State Variables
 * @type {Ref<string>} email - User's email address
 * @type {Ref<string>} password - User's password
 * @type {Ref<string>} otp - One-time password (verification code)
 * @type {Ref<boolean>} otpSent - Whether OTP has been sent
 * @type {Ref<string|null>} errorMsg - Error message to display
 * @type {Ref<boolean>} signInPending - Sign In Pending
 * @type {Ref<boolean>} otpSendPending - OTP Send Pending
 * @type {Ref<boolean>} otpSignInPending - OTP Sign In Pending
 * @type {Ref<boolean>} googlePending - Google Oauth Pending
 * @type {Ref<boolean>} githubPending - Github Oath Pending
 */
const email: Ref<string> = ref("")
const password = ref("")
const otp = ref("")
const otpSent = ref(false)
const errorMsg = ref<string | null>(null)
const signInPending = ref(false)
const otpSendPending = ref(false)
const otpSignInPending = ref(false)
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
 * Computes the next URL to redirect to after sign in.
 * @returns {string}
 */
const nextUrl = computed(() => {
  const next = route.query.next
  return typeof next === "string" && next.length > 0 ? next : "/"
})

watch(
  () => session.value,
  async (value) => {
    if (!value || !import.meta.client) return
    await navigateTo(nextUrl.value, { replace: true })
  },
  { immediate: true }
)
/**
 * Sets the error message to display.
 * @param {string | null} message - The error message to set
 */
function setError(message: string | null) {
  errorMsg.value = message
}
/**
 * Handles sign in with email and password.
 * Redirects to next URL on success.
 * @returns {Promise<void>}
 */
async function signInPassword(): Promise<void> {
  setError(null)
  if (!email.value || !password.value) {
    setError("Email and password are required.")
    return
  }
  if (signInPending.value) return
  signInPending.value = true
  try {
    const { error } = await authClient.signIn.email({
      email: email.value,
      password: password.value,
      rememberMe: true,
    })
    if (error) {
      setError(error.message ?? "An error occurred")
      return
    }
    await authClient.useSession(useFetch)
    await navigateTo(nextUrl.value, { replace: true })
  } finally {
    signInPending.value = false
  }
}
/**
 * Sends a one-time sign-in code to the user's email.
 * @returns {Promise<void>}
 */
async function sendSignInOtp(): Promise<void> {
  setError(null)
  if (!email.value) {
    setError("Enter your email to receive a code.")
    return
  }
  if (otpSendPending.value) return
  otpSendPending.value = true
  try {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: email.value,
      type: "sign-in",
    })
    if (error) {
      setError(error.message ?? "An error occurred")
      return
    }
    otpSent.value = true
  } finally {
    otpSendPending.value = false
  }
}
/**
 * Handles sign in with email and OTP code.
 * Redirects to next URL on success.
 * @returns {Promise<void>}
 */
async function signInOtp(): Promise<void> {
  setError(null)
  if (!email.value || !otp.value) {
    setError("Enter your email and code to sign in.")
    return
  }
  if (otpSignInPending.value) return
  otpSignInPending.value = true
  try {
    const { error } = await authClient.signIn.emailOtp({
      email: email.value,
      otp: otp.value,
    })
    if (error) {
      setError(error.message ?? "An error occurred")
      return
    }
    await authClient.useSession(useFetch)
    await navigateTo(nextUrl.value, { replace: true })
  } finally {
    otpSignInPending.value = false
  }
}
/**
 * Initiates sign in with Google OAuth provider.
 * @returns {Promise<void>}
 */
async function signInGoogle(): Promise<void> {
  if (!googleEnabled.value || googlePending.value) return
  googlePending.value = true
  await authClient.signIn.social({ provider: "google" })
}

/**
 * Initiates sign in with GitHub OAuth provider.
 * @returns {Promise<void>}
 */
async function signInGithub(): Promise<void> {
  if (!githubEnabled.value || githubPending.value) return
  githubPending.value = true
  await authClient.signIn.social({ provider: "github" })
}
</script>

<template>
  <form :class="cn('flex flex-col gap-6', props.class)" @submit.prevent="signInPassword">
    <FieldGroup>
      <div class="flex flex-col items-center gap-1 text-center">
        <h1 class="text-2xl font-bold">Login to your account</h1>
        <p class="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>

      <Field v-if="googleEnabled || githubEnabled">
        <div class="grid gap-2">
          <Button
            v-if="googleEnabled"
            variant="outline"
            type="button"
            :disabled="googlePending"
            @click="signInGoogle"
          >
            <Spinner v-if="googlePending" class="mr-2" />
            Continue with Google
          </Button>
          <Button
            v-if="githubEnabled"
            variant="outline"
            type="button"
            :disabled="githubPending"
            @click="signInGithub"
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

      <FieldSeparator v-if="googleEnabled || githubEnabled">Or continue with</FieldSeparator>

      <Field>
        <FieldLabel for="email"> Email </FieldLabel>
        <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
      </Field>
      <Field>
        <div class="flex items-center">
          <FieldLabel for="password"> Password </FieldLabel>
          <NuxtLink
            to="/auth/forgot-password"
            class="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </NuxtLink>
        </div>
        <Input id="password" v-model="password" type="password" required />
      </Field>
      <Field>
        <Button type="submit" :disabled="signInPending">
          <Spinner v-if="signInPending" class="mr-2" />
          Login
        </Button>
      </Field>

      <FieldSeparator>Or use a one-time code</FieldSeparator>
      <Field>
        <div class="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" type="button" :disabled="otpSendPending" @click="sendSignInOtp">
            <Spinner v-if="otpSendPending" class="mr-2" />
            Send code
          </Button>
          <span v-if="otpSent" class="text-xs text-muted-foreground">
            Code sent. Check your inbox.
          </span>
        </div>
      </Field>
      <Field>
        <div class="grid gap-2 sm:grid-cols-[1fr_auto]">
          <Input id="otp" v-model="otp" placeholder="123456" @keydown.enter.prevent="signInOtp" />
          <Button type="button" :disabled="otpSignInPending" @click="signInOtp">
            <Spinner v-if="otpSignInPending" class="mr-2" />
            Sign in with code
          </Button>
        </div>
      </Field>

      <Field v-if="errorMsg">
        <p class="text-sm text-destructive text-center">{{ errorMsg }}</p>
      </Field>

      <Field>
        <FieldDescription class="text-center">
          Don't have an account?
          <NuxtLink to="/auth/sign-up">Sign up</NuxtLink>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>
</template>
