export default defineEventHandler(async () => {
  const users = await prisma.user.findMany({})
  return {
    success: true,
    data: users,
  }
})
