export type DisplayNameInput = {
  firstName: string
  lastName: string
  nickname?: string | null
}

export const formatDisplayName = ({ firstName, lastName, nickname }: DisplayNameInput) => {
  const baseName = `${firstName.trim()} ${lastName.trim()}`.trim()
  const trimmedNickname = nickname?.trim()

  if (!trimmedNickname) {
    return baseName
  }

  return `${baseName} (${trimmedNickname})`
}
