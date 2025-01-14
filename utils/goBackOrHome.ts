export default function () {
  if (!import.meta.client) return

  const router = useRouter()

  if (history.state && history.state.back) {
    router.back()
  }
  else {
    router.push('/')
  }
}
