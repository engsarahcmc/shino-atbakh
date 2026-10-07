import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar.jsx"
import Footer from "../../components/Footer/Footer.jsx"
import ChefAvatar from "../../components/ChefAvatar/ChefAvatar.jsx"
import useLang from "../../i18n/useLang"
import useAuth from "../../auth/useAuth"
import * as api from "../../services/api"
import "./Admin.css"

const STAT_KEYS = [
  "users", "admins", "newThisWeek", "inactive", "recipes", "favorites",
  "premiumUsers", "revenue", "aiToday",
]
const STAT_ICONS = { users: "👥", admins: "🛡️", newThisWeek: "✨", inactive: "⏸️", recipes: "📖", favorites: "♥",
  premiumUsers: "✦", revenue: "💰", aiToday: "🤖",
}

// أرقام الربح (بريميوم) تطلع بصف مميز
const MONEY_KEYS = ["premiumUsers", "revenue", "aiToday"]

function Gate({ children }) {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="py-16 min-h-[70vh]">
        <div className="container ad-gate">{children}</div>
      </main>
      <Footer />
    </div>
  )
}

function Admin() {
  const { t, lang } = useLang()
  const { user, isLoggedIn, isAdmin } = useAuth()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("loading")
  const [toast, setToast] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const dialogRef = useRef(null)

  const load = useCallback(async (term) => {
    try {
      const [s, u] = await Promise.all([api.getAdminStats(), api.getAdminUsers(term)])
      setStats(s)
      setUsers(u.users)
      setTotal(u.total)
      setStatus("ready")
    } catch {
      setStatus("error")
    }
  }, [])

  // بحث بعد ما يوقف المستخدم عن الكتابة شوية
  useEffect(() => {
    if (!isAdmin) return
    const id = setTimeout(() => load(search), 300)
    return () => clearTimeout(id)
  }, [search, isAdmin, load])

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (toDelete && !d.open) d.showModal()
    if (!toDelete && d.open) d.close()
  }, [toDelete])

  if (!isLoggedIn) {
    return (
      <Gate>
        <img src="/maram/full-thinking.webp" alt="" />
        <h1>{t("admin.title")}</h1>
        <p>{t("admin.guest")}</p>
        <Link to="/login" className="ad-btn">{t("auth.navLogin")}</Link>
      </Gate>
    )
  }

  if (!isAdmin) {
    return (
      <Gate>
        <img src="/maram/full-confused.webp" alt="" />
        <h1>{t("admin.title")}</h1>
        <p>{t("admin.denied")}</p>
        <Link to="/" className="ad-btn">{t("nav.home")}</Link>
      </Gate>
    )
  }

  const flash = (text, ok = true) => {
    setToast({ text, ok })
    setTimeout(() => setToast(null), 2500)
  }

  const run = async (action) => {
    try {
      await action()
      flash(t("admin.done"))
      load(search)
    } catch (err) {
      flash(t("admin.actionError", { m: err.message }), false)
    }
  }

  const date = (value) =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-IQ" : "en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value))

  return (
    <div className="page-shell">
      <Navbar />
      <main className="ad">
        <div className="container">
          <header className="ad-head">
            <div>
              <h1>{t("admin.title")}</h1>
              <p>{t("admin.body")}</p>
            </div>
            <img src="/maram/avatar-idle.webp" alt="" className="ad-maram" />
          </header>

          {status === "error" && <p className="ad-error" role="alert">{t("admin.loadError")}</p>}

          <section className="ad-stats" aria-label={t("admin.title")}>
            {STAT_KEYS.map((key) => (
              <div className={`ad-stat ${MONEY_KEYS.includes(key) ? "money" : ""}`} key={key}>
                <span className="ad-stat-icon" aria-hidden="true">{STAT_ICONS[key]}</span>
                <b>{stats ? Number(stats[key] ?? 0).toLocaleString("en-US") : "—"}</b>
                <span>{t(`admin.stats.${key}`)}</span>
              </div>
            ))}
          </section>

          <section className="ad-panel">
            <div className="ad-toolbar">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("admin.search")}
                aria-label={t("admin.search")}
              />
              <span className="ad-count">{t("admin.count", { n: total })}</span>
            </div>

            {status === "loading" && <p className="ad-muted">{t("admin.loading")}</p>}
            {status === "ready" && users.length === 0 && <p className="ad-muted">{t("admin.empty")}</p>}

            {users.length > 0 && (
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>{t("admin.colUser")}</th>
                      <th>{t("admin.colRole")}</th>
                      <th>{t("admin.colStatus")}</th>
                      <th>{t("admin.colJoined")}</th>
                      <th>{t("admin.colActions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const me = u.id === user.id
                      const active = u.is_active !== false
                      return (
                        <tr key={u.id} className={active ? "" : "off"}>
                          <td>
                            <div className="ad-user">
                              <ChefAvatar name={u.name} size={40} admin={u.is_admin} />
                              <div>
                                <b>{u.name} {me && <em className="ad-you">{t("admin.you")}</em>}</b>
                                <span dir="ltr">{u.email}</span>
                                {u.google_account && <small className="ad-google">{t("admin.google")}</small>}
                              </div>
                            </div>
                          </td>
                          <td>
                            <select
                              value={u.is_admin ? "admin" : "user"}
                              disabled={me}
                              aria-label={t("admin.colRole")}
                              onChange={(e) => run(() => api.setUserRole(u.id, e.target.value))}
                            >
                              <option value="user">{t("admin.roleUser")}</option>
                              <option value="admin">{t("admin.roleAdmin")}</option>
                            </select>
                          </td>
                          <td>
                            <span className={`ad-status ${active ? "on" : ""}`}>
                              {active ? t("admin.active") : t("admin.inactive")}
                            </span>
                          </td>
                          <td className="ad-date">{u.created_at ? date(u.created_at) : "—"}</td>
                          <td>
                            <div className="ad-actions">
                              <button
                                type="button"
                                disabled={me}
                                onClick={() => run(() => api.setUserStatus(u.id, !active))}
                              >
                                {active ? t("admin.deactivate") : t("admin.activate")}
                              </button>
                              <button type="button" className="danger" disabled={me} onClick={() => setToDelete(u)}>
                                {t("admin.delete")}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {toast && <div className={`ad-toast ${toast.ok ? "" : "bad"}`} role="status">{toast.text}</div>}

        <dialog ref={dialogRef} className="ad-dialog" onClose={() => setToDelete(null)}>
          {toDelete && (
            <>
              <h2>{t("admin.confirmTitle", { name: toDelete.name })}</h2>
              <p>{t("admin.confirmBody")}</p>
              <div className="ad-dialog-actions">
                <button type="button" onClick={() => setToDelete(null)}>{t("admin.confirmNo")}</button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => {
                    const target = toDelete
                    setToDelete(null)
                    run(() => api.deleteUser(target.id))
                  }}
                >
                  {t("admin.confirmYes")}
                </button>
              </div>
            </>
          )}
        </dialog>
      </main>
      <Footer />
    </div>
  )
}

export default Admin
