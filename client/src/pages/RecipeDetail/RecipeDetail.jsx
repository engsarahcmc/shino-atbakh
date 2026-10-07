import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import Navbar from "../../components/Navbar.jsx"
import Footer from "../../components/Footer/Footer.jsx"
import useLang from "../../i18n/useLang"
import useAuth from "../../auth/useAuth"
import mockRecipes from "../../data/mockRecipes"
import recipeDetails from "../../data/recipeDetails"
import "./RecipeDetail.css"

function RecipeDetail() {
  const { id } = useParams()
  const { t, pick, lang } = useLang()
  const { isPremium } = useAuth()
  const [checked, setChecked] = useState({})
  const [done, setDone] = useState({})
  const [broken, setBroken] = useState(false)

  const recipe = mockRecipes.find((r) => String(r.id) === id)
  const details = recipeDetails[id]

  if (!recipe || !details) {
    return (
      <div className="page-shell">
        <Navbar />
        <main className="py-16 min-h-[70vh]">
          <div className="container empty-state">
            <img className="empty-maram" src="/maram/full-confused.webp" alt="" />
            <h2>{t("detail.notFound")}</h2>
            <Link className="button button-olive" to="/explore">{t("detail.browse")}</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // الوصفات الحصرية تنقفل لغير المشتركين
  const locked = recipe.premium && !isPremium
  const ingredients = details.ingredients[lang]
  const steps = details.steps[lang]
  const stepsDone = steps.filter((_, i) => done[i]).length

  return (
    <div className="page-shell">
      <Navbar />
      <main className="rd">
        <div className="container">
          <Link to="/explore" className="rd-back">{t("detail.back")}</Link>

          <header className="rd-head">
            <div className="rd-media">
              {recipe.image && !broken ? (
                <img src={recipe.image} alt={pick(recipe.name)} onError={() => setBroken(true)} />
              ) : (
                <div className="rd-art" style={{ background: recipe.tint }} aria-hidden="true">{recipe.art}</div>
              )}
            </div>
            <div className="rd-intro">
              <span className="section-eyebrow">
                {pick(recipe.cuisine)}
                {recipe.premium && <span className="rd-premium"> ✦ {t("premium.badge")}</span>}
              </span>
              <h1>{pick(recipe.name)}</h1>
              <p>{pick(recipe.description)}</p>
              <dl className="rd-facts">
                <div><dt>{t("detail.time")}</dt><dd>{recipe.time} {t("recipe.minutes")}</dd></div>
                <div><dt>{t("detail.serves")}</dt><dd>{t("fridge.servings", { n: details.servings })}</dd></div>
                <div><dt>{t("detail.steps")}</dt><dd>{steps.length}</dd></div>
              </dl>
            </div>
          </header>

          {locked ? (
            <section className="rd-locked" aria-labelledby="rd-locked-title">
              <ul className="rd-locked-peek" aria-hidden="true">
                {ingredients.slice(0, 5).map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="rd-locked-card">
                <img src="/maram/avatar-excited.webp" alt="" />
                <h2 id="rd-locked-title">{t("premium.lockedTitle")}</h2>
                <p>{t("premium.lockedBody")}</p>
                <Link to="/premium" className="rd-unlock">🔒 {t("premium.unlock")}</Link>
              </div>
            </section>
          ) : (
          <div className="rd-body">
            <section className="rd-ingredients" aria-labelledby="rd-ing-title">
              <h2 id="rd-ing-title">{t("detail.ingredients")}</h2>
              <p className="rd-hint">{t("detail.ingredientsHint")}</p>
              <ul>
                {ingredients.map((item, i) => (
                  <li key={item}>
                    <label>
                      <input
                        type="checkbox"
                        checked={Boolean(checked[i])}
                        onChange={(e) => setChecked({ ...checked, [i]: e.target.checked })}
                      />
                      <span>{item}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rd-steps" aria-labelledby="rd-steps-title">
              <div className="rd-steps-head">
                <h2 id="rd-steps-title">{t("detail.method")}</h2>
                <span className="rd-progress">{t("detail.progress", { done: stepsDone, total: steps.length })}</span>
              </div>
              <ol>
                {steps.map((step, i) => (
                  <li key={i} className={done[i] ? "done" : ""}>
                    <button
                      type="button"
                      aria-pressed={Boolean(done[i])}
                      onClick={() => setDone({ ...done, [i]: !done[i] })}
                    >
                      <span className="rd-num" aria-hidden="true">{done[i] ? "✓" : i + 1}</span>
                      <span>{step}</span>
                    </button>
                  </li>
                ))}
              </ol>
              {stepsDone === steps.length && (
                <div className="rd-done">
                  <img src="/maram/avatar-happy.webp" alt="" />
                  <p>{t("detail.allDone")}</p>
                </div>
              )}
            </section>
          </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default RecipeDetail
