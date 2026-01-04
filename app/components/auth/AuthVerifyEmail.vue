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
 * Local State Variables
 * @type {Ref<string>} email - User's email address
 * @type {Ref<string>} otp - One-time password (verification code)
 * @type {Ref<string|null>} errorMsg - Error message to display
 * @type {Ref<boolean>} verifyPending - Verification Pending
 * @type {Ref<boolean>} resendPending - Resend Code Pending
 */
const email: Ref<string> = ref(typeof route.query.email === "string" ? route.query.email : "")
const otp = ref("")
const errorMsg = ref<string | null>(null)
const verifyPending = ref(false)
const resendPending = ref(false)
/**
 * Computes the next URL to redirect to after verification.
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
 * Resends the verification code to the user's email.
 * @returns {Promise<void>}
 */
async function resend(): Promise<void> {
  setError(null)
  if (!email.value) {
    setError("Enter your email to resend the code.")
    return
  }
  if (resendPending.value) return
  resendPending.value = true
  try {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: email.value,
      type: "email-verification",
    })
    if (error) {
      setError(error.message ?? "An error occurred")
    }
  } finally {
    resendPending.value = false
  }
}

/**
 * Verifies the user's email using the provided OTP code.
 * Redirects to the next URL on success.
 * @returns {Promise<void>}
 */
async function verify(): Promise<void> {
  setError(null)
  if (!email.value || !otp.value) {
    setError("Enter your email and code to verify.")
    return
  }
  if (verifyPending.value) return
  verifyPending.value = true
  try {
    const { error } = await authClient.emailOtp.verifyEmail({
      email: email.value,
      otp: otp.value,
    })
    if (error) {
      setError(error.message ?? "An error occurred")
      return
    }
    await navigateTo(nextUrl.value)
  } finally {
    verifyPending.value = false
  }
}
</script>

<template>
  <form :class="cn('flex flex-col gap-6', props.class)" @submit.prevent="verify">
    <FieldGroup>
      <div class="flex flex-col items-center gap-1 text-center">
        <h1 class="text-2xl font-bold">Verify your email</h1>
        <p class="text-muted-foreground text-sm text-balance">
          Enter the code we sent to your inbox.
        </p>
      </div>
      <Field>
        <FieldLabel for="email"> Email</FieldLabel>
        <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
      </Field>
      <Field>
        <FieldLabel for="otp"> Verification code</FieldLabel>
        <Input id="otp" v-model="otp" placeholder="123456" required />
      </Field>
      <Field>
        <div class="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" :disabled="verifyPending">
            <Spinner v-if="verifyPending" class="mr-2" />
            Verify email
          </Button>
          <Button variant="outline" type="button" :disabled="resendPending" @click="resend">
            <Spinner v-if="resendPending" class="mr-2" />
            Resend code
          </Button>
        </div>
      </Field>
      <Field v-if="errorMsg">
        <p class="text-sm text-destructive text-center">{{ errorMsg }}</p>
      </Field>
      <Field>
        <FieldDescription class="text-center">
          Need to sign in instead?
          <NuxtLink to="/auth/sign-in">Back to login</NuxtLink>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>
</template>
