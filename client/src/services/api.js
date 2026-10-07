// كل طلبات الواجهة للسيرفر من هذا الملف
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" }

  if (auth) {
    const token = localStorage.getItem("token")
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    // السيرفر مطفي أو الرابط غلط
    const error = new Error("Server unreachable")
    error.offline = true
    throw error
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || `Request failed (${response.status})`)
    error.status = response.status
    error.code = data.code
    error.data = data
    throw error
  }

  return data
}

// ---------- Maram AI ----------
// نرسل التوكن إذا موجود، حتى السيرفر يعرف حد الاستخدام (زائر / مجاني / بريميوم)
export const suggestRecipes = (ingredients, options = {}) =>
  request("/suggest", { method: "POST", body: { ingredients, ...options }, auth: true })
export const getAiRecipe = (recipe) =>
  request("/suggest/recipe", { method: "POST", body: recipe })

// ---------- Explore ----------
export const getCategories = () => request("/categories")
export const getPopularRecipes = () => request("/categories/popular")
export const getRecipesByCategory = (id) => request(`/categories/${id}/recipes`)
export const searchRecipes = (q) =>
  request(`/categories/search?q=${encodeURIComponent(q)}`)

// ---------- Users ----------
export const register = (data) => request("/users/register", { method: "POST", body: data })
export const login = (data) => request("/users/login", { method: "POST", body: data })
export const getProfile = () => request("/users/profile", { auth: true })
export const updateProfile = (data) =>
  request("/users/profile", { method: "PUT", body: data, auth: true })

// ---------- Admin ----------
export const getAdminStats = () => request("/admin/stats", { auth: true })
export const getAdminUsers = (search = "") =>
  request(`/admin/users?search=${encodeURIComponent(search)}`, { auth: true })
export const setUserRole = (id, role) =>
  request(`/admin/users/${id}/role`, { method: "PATCH", body: { role }, auth: true })
export const setUserStatus = (id, isActive) =>
  request(`/admin/users/${id}/status`, { method: "PATCH", body: { isActive }, auth: true })
export const deleteUser = (id) =>
  request(`/admin/users/${id}`, { method: "DELETE", auth: true })

// ---------- Favorites ----------
export const getFavorites = () => request("/favorites", { auth: true })
export const addFavorite = (recipeId) =>
  request("/favorites", { method: "POST", body: { recipeId }, auth: true })
export const removeFavorite = (recipeId) =>
  request(`/favorites/${recipeId}`, { method: "DELETE", auth: true })

// ---------- Weekly meals ----------
export const getWeeklyMeals = () => request("/weekly-meals", { auth: true })
export const addWeeklyMeal = (data) =>
  request("/weekly-meals", { method: "POST", body: data, auth: true })
export const deleteWeeklyMeal = (id) =>
  request(`/weekly-meals/${id}`, { method: "DELETE", auth: true })

// ---------- Premium (الدفع تجريبي) ----------
export const getPremiumPlans = () => request("/premium/plans")
export const getPremiumStatus = () => request("/premium/status", { auth: true })
export const subscribePremium = (plan, method) =>
  request("/premium/subscribe", { method: "POST", body: { plan, method }, auth: true })
export const cancelPremium = () => request("/premium/cancel", { method: "POST", auth: true })
