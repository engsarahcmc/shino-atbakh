import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar.jsx"
import Footer from "../../components/Footer/Footer.jsx"
import useLang from "../../i18n/useLang"
import useAuth from "../../auth/useAuth"
import authErrorKey from "../../auth/errorMessage"
import "./Login.css"

function Login() {
  const { t } = useLang()
  const { login, register, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // إذا جاي من صفحة ثانية (مثل بريميوم) نرجعه لها بعد الدخول
  const next = location.state?.from || "/profile"
  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (isLoggedIn) return <Navigate to={next} replace />

  const isRegister = mode === "register"
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!form.email || !form.password || (isRegister && !form.name)) {
      return setError(t("auth.errors.required"))
    }
    if (isRegister && form.password.length < 6) {
      return setError(t("auth.errors.short"))
    }
    setBusy(true)
    try {
      if (isRegister) await register(form.name.trim(), form.email.trim(), form.password)
      else await login(form.email.trim(), form.password)
      navigate(next)
    } catch (err) {
      setError(t(authErrorKey(err)))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="lg">
        <div className="container lg-inner">
          <div className="lg-art" aria-hidden="true">
            <img src={`/maram/full-${isRegister ? "excited" : "idle"}.webp`} alt="" />
          </div>

          <div className="lg-card">
            <div className="lg-tabs" role="tablist">
              {["login", "register"].map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  className={mode === m ? "on" : ""}
                  onClick={() => {
                    setMode(m)
                    setError(null)
                  }}
                >
                  {t(m === "login" ? "auth.loginTab" : "auth.registerTab")}
                </button>
              ))}
            </div>

            <h1>{t(isRegister ? "auth.welcomeNew" : "auth.welcomeBack")}</h1>
            <p className="lg-body">{t(isRegister ? "auth.registerBody" : "auth.loginBody")}</p>

            <form onSubmit={submit} noValidate>
              {isRegister && (
                <label>
                  <span>{t("auth.name")}</span>
                  <input value={form.name} onChange={update("name")} autoComplete="name" />
                </label>
              )}
              <label>
                <span>{t("auth.email")}</span>
                <input type="email" dir="ltr" value={form.email} onChange={update("email")} autoComplete="email" />
              </label>
              <label>
                <span>{t("auth.password")}</span>
                <input
                  type="password"
                  dir="ltr"
                  value={form.password}
                  onChange={update("password")}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                />
                {isRegister && <small>{t("auth.passwordHint")}</small>}
              </label>

              {error && <p className="lg-error" role="alert">{error}</p>}

              <button type="submit" className="lg-submit" disabled={busy}>
                {busy ? t("auth.working") : t(isRegister ? "auth.registerButton" : "auth.loginButton")}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Login
