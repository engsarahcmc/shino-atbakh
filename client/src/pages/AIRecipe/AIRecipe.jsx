import { useCallback, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Navbar from "../../components/Navbar.jsx"
import Footer from "../../components/Footer/Footer.jsx"
import useLang from "../../i18n/useLang"
import { getAiRecipe } from "../../services/api"
import "../RecipeDetail/RecipeDetail.css"
import "./AIRecipe.css"

const SAVED_KEY = "shno-ai-recipe"

// الوصفة تجي من الثلاجة، وإذا المستخدم حدّث الصفحة ناخذها من sessionStorage
const readRecipe = (state) => {
  if (state?.recipe) return state
  try {
    return JSON.parse(sessionStorage.getItem(SAVED_KEY) || "null")
  } catch {
    return null
  }
}

const cacheKey = (name, lang) => `shno-ai-steps:${lang}:${name}`

const readCache = (name, lang) => {
  try {
    return JSON.parse(sessionStorage.getItem(cacheKey(name, lang)) || "null")
  } catch {
    return null
  }
}

function AIRecipe() {
  const { lang } = useLang()
  const location = useLocation()
  const saved = readRecipe(location.state)
  // key يخلي الصفحة تبدأ من جديد إذا تغيرت اللغة أو الوصفة
  return <AIRecipeView key={`${lang}:${saved?.recipe?.name}`} saved={saved} />
}

function AIRecipeView({ saved }) {
  const { t, lang } = useLang()
  const recipe = saved?.recipe
  const people = saved?.people || 2
  const [details, setDetails] = useState(() => (recipe ? readCache(recipe.name, lang) : null))
  const [status, setStatus] = useState(details ? "ready" : "loading")
  const [checked, setChecked] = useState({})
  const [done, setDone] = useState({})

  const fetchDetails = useCallback(() => {
    if (!recipe) return
    getAiRecipe({ name: recipe.name, ingredients: recipe.ingredients || [], people, lang })
      .then((data) => {
        setDetails(data)
        setStatus("ready")
        try {
          sessionStorage.setItem(cacheKey(recipe.name, lang), JSON.stringify(data))
        } catch {
          /* تجاهل */
        }
      })
      .catch((error) => setStatus(error.offline ? "offline" : error.status === 503 ? "busy" : "error"))
  }, [recipe, people, lang])

  useEffect(() => {
    if (!details) fetchDetails()
    // نطلب مرة وحدة عند فتح الصفحة
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const retry = () => {
    setStatus("loading")
    fetchDetails()
  }

  if (!recipe) {
    return (
      <div className="page-shell">
        <Navbar />
        <main className="py-16 min-h-[70vh]">
          <div className="container empty-state">
            <img className="empty-maram" src="/maram/full-confused.webp" alt="" />
            <p>{t("aiRecipe.missing")}</p>
            <Link className="button button-olive" to="/#maram-fridge">{t("aiRecipe.toFridge")}</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const steps = details?.steps || []
  const ingredients = details?.ingredients || recipe.ingredients || []
  const stepsDone = steps.filter((_, i) => done[i]).length
  const errorText = {
    offline: t("fridge.errorOffline"),
    busy: t("fridge.busy"),
    error: t("fridge.error"),
  }[status]

  return (
    <div className="page-shell">
      <Navbar />
      <main className="rd">
        <div className="container">
          <Link to="/#maram-results" className="rd-back">{t("aiRecipe.back")}</Link>

          <header className="rd-head">
            <div className="rd-media">
              <div className="rd-art air-art" aria-hidden="true">
                <img src="/maram/full-happy.webp" alt="" />
              </div>
            </div>
            <div className="rd-intro">
              <span className="section-eyebrow">{t("aiRecipe.badge")}</span>
              <h1>{recipe.name}</h1>
              {recipe.description && <p>{recipe.description}</p>}
              <dl className="rd-facts">
                <div><dt>{t("detail.time")}</dt><dd>{recipe.time} {t("recipe.minutes")}</dd></div>
                <div><dt>{t("detail.serves")}</dt><dd>{t("fridge.servings", { n: people })}</dd></div>
                <div><dt>{t("detail.steps")}</dt><dd>{steps.length || "…"}</dd></div>
              </dl>
            </div>
          </header>

          {status === "loading" && (
            <div className="air-wait" role="status">
              <img src="/maram/avatar-thinking.webp" alt="" />
              <p>{t("aiRecipe.preparing")}</p>
            </div>
          )}

          {errorText && (
            <div className="air-wait bad" role="alert">
              <img src="/maram/avatar-confused.webp" alt="" />
              <p>{errorText}</p>
              <button type="button" onClick={retry}>{t("aiRecipe.retry")}</button>
            </div>
          )}

          {status === "ready" && (
            <div className="rd-body">
              <section className="rd-ingredients" aria-labelledby="air-ing">
                <h2 id="air-ing">{t("detail.ingredients")}</h2>
                <p className="rd-hint">{t("detail.ingredientsHint")}</p>
                <ul>
                  {ingredients.map((item, i) => (
                    <li key={i}>
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

              <section className="rd-steps" aria-labelledby="air-steps">
                <div className="rd-steps-head">
                  <h2 id="air-steps">{t("detail.method")}</h2>
                  <span className="rd-progress">{t("detail.progress", { done: stepsDone, total: steps.length })}</span>
                </div>
                <ol>
                  {steps.map((step, i) => (
                    <li key={i} className={done[i] ? "done" : ""}>
                      <button type="button" aria-pressed={Boolean(done[i])} onClick={() => setDone({ ...done, [i]: !done[i] })}>
                        <span className="rd-num" aria-hidden="true">{done[i] ? "✓" : i + 1}</span>
                        <span>{step}</span>
                      </button>
                    </li>
                  ))}
                </ol>

                {details.tip && (
                  <div className="air-tip">
                    <img src="/maram/avatar-idle.webp" alt="" />
                    <div>
                      <b>{t("aiRecipe.tipTitle")}</b>
                      <p>{details.tip}</p>
                    </div>
                  </div>
                )}

                {steps.length > 0 && stepsDone === steps.length && (
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

export default AIRecipe
