// النسخة التجريبية (Demo): تشتغل بدون سيرفر، مثل لما الموقع منشور على GitHub Pages.
// كل البيانات تنحفظ بمتصفح الزائر (localStorage)، ومرام تقترح من وصفات الموقع نفسها.
// تنشغل لما يكون VITE_DEMO=true وقت البناء.
import mockRecipes from "../data/mockRecipes"
import recipeDetails from "../data/recipeDetails"

const DB_KEY = "shno-demo-db"
const DAY = 24 * 60 * 60 * 1000
const PLANS = { monthly: { price: 5000, days: 30 }, yearly: { price: 48000, days: 365 } }
const METHODS = ["zaincash", "qicard", "fastpay"]
const LIMITS = { guest: 3, free: 5 }

// حساب تجريبي للمدير، حتى الزائر يشوف لوحة التحكم
export const DEMO_ADMIN = { email: "demo@shno.app", password: "demo1234" }

const daysAgo = (n) => new Date(Date.now() - n * DAY).toISOString()

// بيانات أولية (أمثلة تجريبية، مو مستخدمين حقيقيين)
const seed = () => ({
  nextId: 7,
  users: [
    { id: 1, name: "مديرة الموقع", email: DEMO_ADMIN.email, password: DEMO_ADMIN.password, role_id: 2, is_active: true, created_at: daysAgo(30) },
    { id: 2, name: "مستخدم تجريبي 1", email: "user1@example.com", password: "x", role_id: 1, is_active: true, created_at: daysAgo(12), premium_plan: "monthly", premium_until: daysAgo(-18) },
    { id: 3, name: "مستخدم تجريبي 2", email: "user2@example.com", password: "x", role_id: 1, is_active: true, created_at: daysAgo(9) },
    { id: 4, name: "مستخدم تجريبي 3", email: "user3@example.com", password: "x", role_id: 1, is_active: true, created_at: daysAgo(5), premium_plan: "yearly", premium_until: daysAgo(-360) },
    { id: 5, name: "مستخدم تجريبي 4", email: "user4@example.com", password: "x", role_id: 1, is_active: false, created_at: daysAgo(3) },
    { id: 6, name: "مستخدم تجريبي 5", email: "user5@example.com", password: "x", role_id: 1, is_active: true, created_at: daysAgo(1) },
  ],
  subscriptions: [
    { user_id: 2, plan: "monthly", method: "zaincash", amount: 5000, status: "active", started_at: daysAgo(12) },
    { user_id: 4, plan: "yearly", method: "qicard", amount: 48000, status: "active", started_at: daysAgo(5) },
  ],
  favorites: [],
  usage: {},
})

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || "null") || seed()
  } catch {
    return seed()
  }
}
const save = (db) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  } catch {
    /* التخزين مو متاح */
  }
}

const fail = (status, message, extra = {}) => {
  const error = new Error(message)
  error.status = status
  error.code = extra.code
  error.data = { message, ...extra }
  throw error
}

const isPremium = (u) => Boolean(u?.premium_until && new Date(u.premium_until) > new Date())

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role_id: u.role_id,
  is_admin: u.role_id === 2,
  is_active: u.is_active !== false,
  is_premium: isPremium(u),
  premium_plan: isPremium(u) ? u.premium_plan : null,
  premium_until: isPremium(u) ? u.premium_until : null,
  created_at: u.created_at,
})

const currentUser = (db, token) => {
  const id = Number(String(token || "").replace("demo-", ""))
  return db.users.find((u) => u.id === id) || null
}
const requireUser = (db, token) => {
  const u = currentUser(db, token)
  if (!u) fail(401, "Invalid or expired token")
  return u
}
const requireAdmin = (db, token) => {
  const u = requireUser(db, token)
  if (u.role_id !== 2) fail(403, "Admins only")
  return u
}

// ---------- مرام: تقترح من وصفات الموقع حسب المكونات ----------
const norm = (s) => String(s).trim().toLowerCase().replace(/^ال/, "").replace(/ة$/, "")

const suggest = (db, token, { ingredients = [], people, lang = "ar" }) => {
  if (!Array.isArray(ingredients) || !ingredients.length) fail(400, "ingredients must be a non-empty array")

  const user = currentUser(db, token)
  const today = new Date().toISOString().slice(0, 10)
  const key = `${user ? `user:${user.id}` : "guest"}:${today}`
  const limit = user ? LIMITS.free : LIMITS.guest
  const used = db.usage[key] || 0
  const unlimited = isPremium(user)
  if (!unlimited && used >= limit) {
    fail(429, "Daily limit reached", { code: "DAILY_LIMIT", usage: { used, limit, remaining: 0, guest: !user } })
  }

  const asked = ingredients.map(norm)
  const scored = mockRecipes
    .map((r) => {
      const list = recipeDetails[r.id]?.ingredients?.[lang] || []
      const hits = asked.filter((a) => list.some((x) => norm(x).includes(a)))
      return { r, list, score: hits.length / asked.length }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const suggestions = scored.map(({ r, list, score }) => ({
    id: r.id,
    name: r.name[lang] || r.name.ar,
    description: r.description[lang] || r.description.ar,
    time: r.time,
    servings: people || recipeDetails[r.id]?.servings || 2,
    matchPercentage: Math.round(40 + score * 55),
    ingredients: list,
  }))

  const result = { suggestions }
  if (!unlimited) {
    db.usage[key] = used + 1
    save(db)
    result.usage = { used: used + 1, limit, remaining: Math.max(limit - used - 1, 0), guest: !user }
  }
  // تأخير بسيط حتى تبين مرام كأنها تفكر
  return new Promise((resolve) => setTimeout(() => resolve(result), 900))
}

const recipeFor = ({ name, lang = "ar" }) => {
  const r = mockRecipes.find((x) => x.name.ar === name || x.name.en === name)
  const d = r && recipeDetails[r.id]
  if (!d) fail(404, "Recipe not found")
  return {
    ingredients: d.ingredients[lang] || d.ingredients.ar,
    steps: d.steps[lang] || d.steps.ar,
    tip: lang === "en" ? "Taste as you go and adjust the salt at the end." : "ذوقي الأكلة وأنتِ تطبخين، وعدّلي الملح بالنهاية.",
  }
}

// ---------- المسارات ----------
export async function demoRequest(path, { method = "GET", body = {}, token } = {}) {
  const db = load()
  const [route, query = ""] = path.split("?")
  const params = new URLSearchParams(query)
  const is = (m, p) => method === m && route === p
  const match = (m, re) => (method === m ? route.match(re) : null)
  let m

  if (is("POST", "/suggest")) return suggest(db, token, body)
  if (is("POST", "/suggest/recipe")) return recipeFor(body)

  if (is("POST", "/users/register")) {
    const { name, email, password } = body
    if (!name || !email || !password) fail(400, "All fields are required")
    if (db.users.some((u) => u.email === email.toLowerCase())) fail(409, "Email already exists")
    const user = { id: db.nextId++, name, email: email.toLowerCase(), password, role_id: 1, is_active: true, created_at: new Date().toISOString() }
    db.users.push(user)
    save(db)
    return { message: "User registered successfully", user: publicUser(user) }
  }
  if (is("POST", "/users/login")) {
    const user = db.users.find((u) => u.email === String(body.email || "").toLowerCase())
    if (!user || user.password !== body.password) fail(401, "Invalid email or password")
    if (user.is_active === false) fail(403, "This account has been deactivated")
    return { message: "Login successful", token: `demo-${user.id}`, user: publicUser(user) }
  }
  if (is("GET", "/users/profile")) return { user: publicUser(requireUser(db, token)) }
  if (is("PUT", "/users/profile")) {
    const user = requireUser(db, token)
    if (!body.name || !body.email) fail(400, "Name and email are required")
    if (db.users.some((u) => u.id !== user.id && u.email === body.email.toLowerCase())) fail(409, "Email already exists")
    user.name = body.name
    user.email = body.email.toLowerCase()
    save(db)
    return { message: "Profile updated successfully", user: publicUser(user) }
  }

  if (is("GET", "/favorites")) {
    const user = requireUser(db, token)
    return { favorites: db.favorites.filter((f) => f.user_id === user.id) }
  }

  if (is("GET", "/premium/plans")) return { plans: PLANS, methods: METHODS, limits: LIMITS, currency: "IQD", demo: true }
  if (is("POST", "/premium/subscribe")) {
    const user = requireUser(db, token)
    const { plan, method: pay } = body
    if (!PLANS[plan]) fail(400, "Invalid plan")
    if (!METHODS.includes(pay)) fail(400, "Invalid payment method")
    const start = isPremium(user) ? new Date(user.premium_until) : new Date()
    user.premium_plan = plan
    user.premium_until = new Date(start.getTime() + PLANS[plan].days * DAY).toISOString()
    db.subscriptions.push({ user_id: user.id, plan, method: pay, amount: PLANS[plan].price, status: "active", started_at: new Date().toISOString() })
    save(db)
    return { message: "Premium activated (demo payment)", isPremium: true, plan, until: user.premium_until }
  }
  if (is("POST", "/premium/cancel")) {
    const user = requireUser(db, token)
    user.premium_plan = null
    user.premium_until = null
    db.subscriptions.forEach((s) => s.user_id === user.id && (s.status = "cancelled"))
    save(db)
    return { message: "Subscription cancelled", isPremium: false }
  }

  if (is("GET", "/admin/stats")) {
    requireAdmin(db, token)
    const today = new Date().toISOString().slice(0, 10)
    return {
      users: db.users.length,
      admins: db.users.filter((u) => u.role_id === 2).length,
      newThisWeek: db.users.filter((u) => Date.now() - new Date(u.created_at) < 7 * DAY).length,
      inactive: db.users.filter((u) => u.is_active === false).length,
      recipes: mockRecipes.length,
      favorites: db.favorites.length,
      premiumUsers: db.users.filter(isPremium).length,
      revenue: db.subscriptions.reduce((sum, s) => sum + s.amount, 0),
      aiToday: Object.entries(db.usage).filter(([k]) => k.endsWith(today)).reduce((sum, [, n]) => sum + n, 0),
    }
  }
  if (is("GET", "/admin/users")) {
    requireAdmin(db, token)
    const q = (params.get("search") || "").trim().toLowerCase()
    const users = db.users
      .filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.includes(q))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((u) => ({ ...publicUser(u), google_account: false }))
    return { users, total: users.length }
  }
  if ((m = match("PATCH", /^\/admin\/users\/(\d+)\/role$/))) {
    const admin = requireAdmin(db, token)
    const user = db.users.find((u) => u.id === Number(m[1]))
    if (!user) fail(404, "User not found")
    if (user.id === admin.id && body.role !== "admin") fail(400, "You cannot remove your own admin role")
    user.role_id = body.role === "admin" ? 2 : 1
    save(db)
    return { message: "Role updated", user: publicUser(user) }
  }
  if ((m = match("PATCH", /^\/admin\/users\/(\d+)\/status$/))) {
    const admin = requireAdmin(db, token)
    const user = db.users.find((u) => u.id === Number(m[1]))
    if (!user) fail(404, "User not found")
    if (user.id === admin.id) fail(400, "You cannot deactivate your own account")
    user.is_active = Boolean(body.isActive)
    save(db)
    return { message: "Status updated", user: publicUser(user) }
  }
  if ((m = match("DELETE", /^\/admin\/users\/(\d+)$/))) {
    const admin = requireAdmin(db, token)
    const id = Number(m[1])
    if (id === admin.id) fail(400, "You cannot delete your own account")
    db.users = db.users.filter((u) => u.id !== id)
    save(db)
    return { message: "User deleted" }
  }

  // باقي المسارات (Explore، الوجبات) الواجهة تستخدم بياناتها المحلية
  return {}
}
