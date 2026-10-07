import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer/Footer.jsx"
import useLang from "../i18n/useLang"

function Profile() {
  const { t } = useLang()

  return (
    <div className="page-shell">
      <Navbar />
      <main className="py-16 min-h-[70vh]">
        <div className="container max-w-4xl">
          <div className="reveal-item profile-panel">
            <div className="text-center mb-10">
              <div className="profile-avatar" aria-hidden="true">👩🏻‍🍳</div>
              <span className="section-eyebrow">{t("profile.eyebrow")}</span>
              <h1>{t("profile.title")}</h1>
              <p>{t("profile.body")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t("profile.cards").map((card) => (
                <div className="reveal-item preference-card" key={card.title}>
                  <span className="preference-icon" aria-hidden="true">{card.icon}</span>
                  <h3>{card.title}</h3>
                  <p>{card.value}</p>
                </div>
              ))}
            </div>

            <button type="button" className="button button-olive profile-edit">{t("profile.edit")}</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Profile
