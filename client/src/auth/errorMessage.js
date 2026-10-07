// يحوّل خطأ السيرفر لرسالة مفهومة
export default function authErrorKey(error) {
  if (error.offline) return "auth.errors.offline"
  if (error.status === 401) return "auth.errors.invalid"
  if (error.status === 409) return "auth.errors.exists"
  if (error.status === 403) return "auth.errors.inactive"
  return "auth.errors.generic"
}
