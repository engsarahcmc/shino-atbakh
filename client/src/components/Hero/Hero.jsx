import { Link } from "react-router-dom"
import useLang from "../../i18n/useLang"

const heroImage =
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=90"

function Hero() {
  const { t } = useLang()

  return (
    <section className="hero-section">
      <div className="container hero-layout">
        <div className="hero-copy reveal-item">
          <span className="hero-kicker">
            <span className="hero-kicker-dot" />
            {t("hero.kicker")}
          </span>
          <h1>
            {t("hero.title1")}
            <br />
            <span>{t("hero.title2")}</span>
          </h1>
          <p>{t("hero.body")}</p>
          <div className="hero-actions">
            <a className="button button-sun" href="#maram-fridge">
              {t("hero.cta")} <span aria-hidden="true">{t("hero.ctaArrow")}</span>
            </a>
            <Link className="hero-secondary-link" to="/weekly">
              {t("hero.secondary")} <span aria-hidden="true">{t("hero.secondaryArrow")}</span>
            </Link>
          </div>
          <div className="hero-social-proof">
            <span className="proof-avatars" aria-hidden="true">
              <span>🍅</span><span>🌿</span><span>🍋</span>
            </span>
            <span><strong>{t("hero.proofStrong")}</strong> {t("hero.proof")}</span>
          </div>
        </div>

        <div className="hero-photo-wrap reveal-item">
          <img className="hero-photo" src={heroImage} alt={t("hero.photoAlt")} />
          <div className="hero-photo-shade" />
          <div className="hero-photo-caption">
            <span className="caption-label">{t("hero.captionLabel")}</span>
            <strong>{t("hero.captionTitle")}</strong>
            <span>{t("hero.captionMeta")}</span>
          </div>
          <div className="hero-sticker" aria-hidden="true">
            <span>♡</span>
            {t("hero.sticker1")}<br />{t("hero.sticker2")}
          </div>
        </div>
      </div>
      <div className="hero-bottom-note">
        <span>{t("hero.bottom1")}</span>
        <span className="note-line" />
        <span>{t("hero.bottom2")}</span>
      </div>
    </section>
  )
}

export default Hero
