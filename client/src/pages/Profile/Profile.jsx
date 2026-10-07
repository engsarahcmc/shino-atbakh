import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar.jsx"
import Footer from "../../components/Footer/Footer.jsx"
import ChefAvatar from "../../components/ChefAvatar/ChefAvatar.jsx"
import useLang from "../../i18n/useLang"
import useAuth from "../../auth/useAuth"
import authErrorKey from "../../auth/errorMessage"
import { cancelPremium, getFavorites, updateProfile } from "../../services/api"
import "./Profile.css"

const PREFS_KEY = "shno-prefs"

const loadPrefs = () => {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || "null") || { cuisines: [0, 1], time: 1, diet: 0 }
  } catch {
    return { cuisines: [0, 1], time: 1, diet: 0 }
  }
}

const plannedDays = () => {
  try {
    return (JSON.parse(localStorage.getItem("shno-week") || "null")?.plan || []).filter(Boolean).length
  } catch {
    return 0
  }
}

function Profile() {
  const { t, lang } = useLang()
  const { user, isLoggedIn, isAdmin, isPremium, logout, updateUser, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState(null)
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" })
  const [message, setMessage] = useState(null)
  const [prefs, setPrefs] = useState(loadPrefs)
  const [cancelling, setCancelling] = useState(false)

  const cancelSubscription = async () => {
    if (!window.confirm(t("premium.cancelConfirm"))) return
    setCancelling(true)
    try {
      await cancelPremium()
      await refreshUser()
    } catch {
      window.alert(t("premium.error"))
    } finally {
      setCancelling(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    getFavorites()
      .then((data) => setFavorites((data.favorites || data || []).length))
      .catch(() => setFavorites(null))
  }, [isLoggedIn])

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
    } catch {
      /* تجاهل */
    }
  }, [prefs])

  if (!isLoggedIn) {
    return (
      <div className="page-shell">
        <Navbar />
        <main className="py-16 min-h-[70vh]">
          <div className="container pf-guest">
            <img src="/maram/full-thinking.webp" alt="" />
            <h1>{t("profile.guestTitle")}</h1>
            <p>{t("profile.guestBody")}</p>
            <Link to="/login" className="pf-btn">{t("auth.navLogin")}</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const since = user.created_at
    ? new Intl.DateTimeFormat(lang === "ar" ? "ar-IQ" : "en-GB", { month: "long", year: "numeric" }).format(new Date(user.created_at))
    : null

  const save = async (e) => {
    e.preventDefault()
    setMessage(null)
    try {
      const data = await updateProfile({ name: form.name.trim(), email: form.email.trim() })
      updateUser(data.user)
      setMessage({ ok: true, text: t("profile.saved") })
    } catch (err) {
      setMessage({ ok: false, text: t(authErrorKey(err)) })
    }
  }

  const toggleCuisine = (i) =>
    setPrefs((p) => ({
      ...p,
      cuisines: p.cuisines.includes(i) ? p.cuisines.filter((x) => x !== i) : [...p.cuisines, i],
    }))

  return (
    <div className="page-shell">
      <Navbar />
      <main className="pf">
        <div className="container pf-grid">
          <section className="pf-card" aria-label={t("profile.cardLabel")}>
            <span className="pf-label">{t("profile.cardLabel")}</span>
            <div className="pf-avatar">
              <ChefAvatar name={user.name} size={120} admin={isAdmin} />
            </div>
            <h1>{user.name}</h1>
            <p className="pf-email" dir="ltr">{user.email}</p>
            <span className={`pf-role ${isAdmin ? "admin" : ""}`}>
              {isAdmin ? t("profile.roleAdmin") : t("profile.roleUser")}
            </span>
            {isPremium && <span className="pf-role premium">✦ {t("premium.badge")}</span>}
            {since && <p className="pf-since">{t("profile.memberSince", { d: since })}</p>}

            <div className="pf-stats">
              <div><b>{favorites ?? "—"}</b><span>{t("profile.statFavorites")}</span></div>
              <div><b>{plannedDays()}</b><span>{t("profile.statWeek")}</span></div>
            </div>

            <img className="pf-sign" src="/maram/avatar-happy.webp" alt="" />

            <div className="pf-actions">
              {isAdmin && <Link to="/admin" className="pf-btn">{t("profile.goAdmin")}</Link>}
              <button
                type="button"
                className="pf-btn ghost"
                onClick={() => {
                  logout()
                  navigate("/")
                }}
              >
                {t("auth.logout")}
              </button>
            </div>
          </section>

          <div className="pf-side">
            <section className={`pf-panel pf-sub ${isPremium ? "on" : ""}`}>
              <h2>{t("premium.profileTitle")}</h2>
              {isPremium ? (
                <>
                  <p>
                    {t("premium.profilePremium", {
                      plan: t(`premium.${user.premium_plan}`),
                      d: new Intl.DateTimeFormat(lang === "ar" ? "ar-IQ" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(user.premium_until)),
                    })}
                  </p>
                  <button type="button" className="pf-btn ghost-dark" onClick={cancelSubscription} disabled={cancelling}>
                    {t("premium.cancel")}
                  </button>
                </>
              ) : (
                <>
                  <p>{t("premium.profileFree")}</p>
                  <Link to="/premium" className="pf-btn gold">✦ {t("premium.upgrade")}</Link>
                </>
              )}
            </section>

            <section className="pf-panel">
              <h2>{t("profile.editTitle")}</h2>
              <form onSubmit={save} className="pf-form">
                <label>
                  <span>{t("auth.name")}</span>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label>
                  <span>{t("auth.email")}</span>
                  <input type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
                {message && (
                  <p className={message.ok ? "pf-ok" : "pf-err"} role="status">{message.text}</p>
                )}
                <button type="submit" className="pf-btn">{t("profile.save")}</button>
              </form>
            </section>

            <section className="pf-panel">
              <h2>{t("profile.prefsTitle")}</h2>
              <p className="pf-note">{t("profile.prefsNote")}</p>

              <h3>{t("profile.prefCuisine")}</h3>
              <div className="pf-chips">
                {t("profile.cuisines").map((c, i) => (
                  <button key={c} type="button" aria-pressed={prefs.cuisines.includes(i)} onClick={() => toggleCuisine(i)}>
                    {c}
                  </button>
                ))}
              </div>

              <h3>{t("profile.prefTime")}</h3>
              <div className="pf-chips">
                {t("profile.times").map((c, i) => (
                  <button key={c} type="button" aria-pressed={prefs.time === i} onClick={() => setPrefs({ ...prefs, time: i })}>
                    {c}
                  </button>
                ))}
              </div>

              <h3>{t("profile.prefDiet")}</h3>
              <div className="pf-chips">
                {t("profile.diets").map((c, i) => (
                  <button key={c} type="button" aria-pressed={prefs.diet === i} onClick={() => setPrefs({ ...prefs, diet: i })}>
                    {c}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Profile
