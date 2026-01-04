<script setup lang="ts">
import type { HTMLAttributes, Ref } from "vue"
import { cn } from "~/lib/utils"
import { authClient } from "~/lib/auth-client"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

/**
 * State Variables
 * @type {Ref<string>} email - User's email address
 * @type {Ref<string|null>} errorMsg - Error message to display
 * @type {Ref<boolean>} sendPending - Send Pendingß
 */
const email: Ref<string> = ref("")
const errorMsg = ref<string | null>(null)
const sendPending = ref(false)

/**
 * Sets the error message to display.
 * @param {string | null} message - The error message to set
 */
function setError(message: string | null) {
  errorMsg.value = message
}

/**
 * Sends a password reset OTP to the user's email and navigates to reset page.
 * @returns {Promise<void>}
 */
async function sendResetOtp(): Promise<void> {
  setError(null)
  if (!email.value) {
    setError("Enter your email to reset your password.")
    return
  }
  if (sendPending.value) return
  sendPending.value = true
  try {
    const { error } = await authClient.forgetPassword.emailOtp({
      email: email.value,
    })
    if (error) {
      setError(error.message ?? "An error occurred")
      return
    }
    await navigateTo(`/auth/reset-password?email=${encodeURIComponent(email.value)}`)
  } finally {
    sendPending.value = false
  }
}
</script>

<template>
  <form :class="cn('flex flex-col gap-6', props.class)" @submit.prevent="sendResetOtp">
    <FieldGroup>
      <div class="flex flex-col items-center gap-1 text-center">
        <h1 class="text-2xl font-bold">Forgot your password?</h1>
        <p class="text-muted-foreground text-sm text-balance">
          We'll send a one-time code to reset your password.
        </p>
      </div>
      <Field>
        <FieldLabel for="email"> Email</FieldLabel>
        <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
      </Field>
      <Field>
        <Button type="submit" :disabled="sendPending">
          <Spinner v-if="sendPending" class="mr-2" />
          Send reset code
        </Button>
      </Field>
      <Field v-if="errorMsg">
        <p class="text-sm text-destructive text-center">{{ errorMsg }}</p>
      </Field>
      <Field>
        <FieldDescription class="text-center">
          Remembered your password?
          <NuxtLink to="/auth/sign-in">Back to login</NuxtLink>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>
</template>
