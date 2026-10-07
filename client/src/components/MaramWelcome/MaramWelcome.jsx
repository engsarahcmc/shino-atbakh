import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useLang from "../../i18n/useLang"
import mockRecipes from "../../data/mockRecipes"
import "./MaramWelcome.css"

const randomRecipeId = () => mockRecipes[Math.floor(Math.random() * mockRecipes.length)].id

// كل اختيار: شكل مرام وجملتها لما الماوس يمر عليه
const CHOICES = [
  { key: "fridge", icon: "🧊", mood: "excited" },
  { key: "week", icon: "🗓️", mood: "thinking" },
  { key: "surprise", icon: "🎲", mood: "happy" },
]

function MaramWelcome() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [hover, setHover] = useState(null)

  const active = CHOICES.find((c) => c.key === hover)
  const mood = active ? active.mood : "idle"
  const bubble = active ? t(`welcome.preview.${active.key}`) : t("welcome.question")

  const choose = (key) => {
    if (key === "fridge") {
      document.getElementById("maram-fridge")?.scrollIntoView({ behavior: "smooth" })
    } else if (key === "week") {
      navigate("/weekly")
    } else {
      navigate(`/recipe/${randomRecipeId()}`)
    }
  }

  return (
    <section className="mw" aria-labelledby="mw-title">
      <div className="mw-tiles" aria-hidden="true" />

      <div className="container mw-inner">
        <div className="mw-copy">
          <span className="mw-kicker">
            <span className="mw-dot" aria-hidden="true" />
            {t("welcome.kicker")}
          </span>
          <h1 id="mw-title">
            {t("welcome.title1")}
            <br />
            <span>{t("welcome.title2")}</span>
          </h1>
          <p className="mw-body">{t("welcome.body")}</p>

          <div className="mw-choices" role="group" aria-label={t("welcome.question")}>
            {CHOICES.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`mw-choice ${c.key === "fridge" ? "primary" : ""}`}
                onMouseEnter={() => setHover(c.key)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(c.key)}
                onBlur={() => setHover(null)}
                onClick={() => choose(c.key)}
              >
                <span className="mw-choice-icon" aria-hidden="true">{c.icon}</span>
                <span>
                  <b>{t(`welcome.choices.${c.key}.title`)}</b>
                  <small>{t(`welcome.choices.${c.key}.hint`)}</small>
                </span>
              </button>
            ))}
          </div>

          <ul className="mw-facts">
            {t("welcome.facts").map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>

        <div className="mw-stage">
          <div className="mw-sun" aria-hidden="true" />
                   <span className="mw-float f1" aria-hidden="true">🍅</span>
          <span className="mw-float f2" aria-hidden="true">🌶️</span>
          <span className="mw-float f3" aria-hidden="true">🧅</span>
          <span className="mw-float f4" aria-hidden="true">🍆</span>
          <span className="mw-float f5" aria-hidden="true">🥕</span>
          <span className="mw-float f6" aria-hidden="true">🍋</span>
          <span className="mw-float f7" aria-hidden="true">🧄</span>
          <span className="mw-float f8" aria-hidden="true">🫑</span>
          <span className="mw-float f9" aria-hidden="true">🥚</span>
          <span className="mw-float f10" aria-hidden="true">🍄</span>
          <span className="mw-float f11" aria-hidden="true">🌿</span>
          <span className="mw-float f12" aria-hidden="true">🥬</span>

          <div className="mw-bubble" aria-live="polite">
            <span className="mw-hello">{t("welcome.hello")}</span>
            <span key={bubble} className="mw-line">{bubble}</span>
          </div>

          <img
            key={mood}
            className="mw-maram"
            src={`/maram/full-${mood}.webp`}
            alt={t("welcome.maramAlt")}
          />
          <div className="mw-counter" aria-hidden="true" />
          <span className="mw-board" aria-hidden="true" />
          <span className="mw-pot" aria-hidden="true">🍲</span>
        </div>
      </div>
    </section>
  )
}

export default MaramWelcome
