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
 * State Variables
 * @type {Ref<string>} email - User's email address
 * @type {Ref<string>} otp - One-time password (verification code)
 * @type {Ref<string>} password - New password
 * @type {Ref<string|null>} errorMsg - Error message to display
 * @type {Ref<boolean>} resetPending - Reset Pending
 */
const email: Ref<string> = ref(typeof route.query.email === "string" ? route.query.email : "")
const otp = ref("")
const password = ref("")
const errorMsg = ref<string | null>(null)
const resetPending = ref(false)

/**
 * Sets the error message to display.
 * @param {string | null} message - The error message to set
 */
function setError(message: string | null) {
  errorMsg.value = message
}

/**
 * Handles password reset form submission.
 * Validates input and calls the auth client reset password method.
 * Redirects to sign in page on success.
 * @returns {Promise<void>}
 */
async function resetPassword(): Promise<void> {
  setError(null)
  if (!email.value || !otp.value || !password.value) {
    setError("Fill in your email, code, and new password.")
    return
  }
  if (resetPending.value) return
  resetPending.value = true
  try {
    const { error } = await authClient.emailOtp.resetPassword({
      email: email.value,
      otp: otp.value,
      password: password.value,
    })
    if (error) {
      setError(error.message ?? "An error occurred")
      return
    }
    await navigateTo("/auth/sign-in")
  } finally {
    resetPending.value = false
  }
}
</script>

<template>
  <form :class="cn('flex flex-col gap-6', props.class)" @submit.prevent="resetPassword">
    <FieldGroup>
      <div class="flex flex-col items-center gap-1 text-center">
        <h1 class="text-2xl font-bold">Reset your password</h1>
        <p class="text-muted-foreground text-sm text-balance">
          Enter the code from your email and choose a new password.
        </p>
      </div>
      <Field>
        <FieldLabel for="email"> Email</FieldLabel>
        <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
      </Field>
      <Field>
        <FieldLabel for="otp"> Reset code</FieldLabel>
        <Input id="otp" v-model="otp" placeholder="123456" required />
      </Field>
      <Field>
        <FieldLabel for="password"> New password</FieldLabel>
        <Input id="password" v-model="password" type="password" required />
      </Field>
      <Field>
        <Button type="submit" :disabled="resetPending">
          <Spinner v-if="resetPending" class="mr-2" />
          Reset password
        </Button>
      </Field>

      <Field v-if="errorMsg">
        <p class="text-sm text-destructive text-center">{{ errorMsg }}</p>
      </Field>

      <Field>
        <FieldDescription class="text-center">
          Need to sign in?
          <NuxtLink to="/auth/sign-in">Back to login</NuxtLink>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>
</template>
