import { useState } from "react"
import { NavLink } from "react-router-dom"
import useLang from "../i18n/useLang"
import useAuth from "../auth/useAuth"
import ChefAvatar from "./ChefAvatar/ChefAvatar.jsx"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, lang, toggle } = useLang()
  const { user, isLoggedIn, isAdmin, isPremium } = useAuth()

  const links = [
    { key: "home", path: "/" },
    { key: "weekly", path: "/weekly" },
    { key: "explore", path: "/explore" },
    { key: "favorites", path: "/favorites" },
  ]

  // رابط بريميوم يطلع لغير المشتركين بس
  const premiumLink = !isPremium && (
    <NavLink to="/premium" className="nav-premium" onClick={() => setMenuOpen(false)}>
      <span aria-hidden="true">✦</span> {t("premium.nav")}
    </NavLink>
  )

  const account = isLoggedIn ? (
    <>
      {isAdmin && (
        <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "active is-current" : ""}`} onClick={() => setMenuOpen(false)}>
          {t("auth.admin")}
        </NavLink>
      )}
      <NavLink to="/profile" className="nav-user" onClick={() => setMenuOpen(false)}>
        <ChefAvatar name={user.name} size={30} admin={isAdmin} />
        <span>{user.name.split(" ")[0]}</span>
        {isPremium && <span className="nav-crown" title={t("premium.badge")} aria-label={t("premium.badge")}>✦</span>}
      </NavLink>
    </>
  ) : (
    <NavLink to="/login" className="nav-login" onClick={() => setMenuOpen(false)}>
      {t("auth.navLogin")}
    </NavLink>
  )

  const langButton = (
    <button
      type="button"
      className="lang-toggle"
      onClick={toggle}
      lang={lang === "ar" ? "en" : "ar"}
    >
      {t("nav.switchLang")}
    </button>
  )

  return (
    <nav className="site-nav sticky top-0 z-50">
      <div className="container nav-inner">
        <NavLink to="/" className="brand-mark">
          <span className="brand-icon" aria-hidden="true">✳</span>
          <span>
            {t("brand.first")}{" "}
            <span className="brand-highlight">{t("brand.highlight")}</span>
            <small>{t("brand.tagline")}</small>
          </span>
        </NavLink>

        <div className="desktop-nav">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? "active is-current" : ""}`}
            >
              {t(`nav.${link.key}`)}
            </NavLink>
          ))}
          {premiumLink}
          {account}
          {langButton}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t("nav.close") : t("nav.open")}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-nav">
          <div className="container mobile-nav-links">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-link"
              >
                {t(`nav.${link.key}`)}
              </NavLink>
            ))}
            {premiumLink}
            {account}
            {langButton}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
