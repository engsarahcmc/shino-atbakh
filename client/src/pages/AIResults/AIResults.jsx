import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import Navbar from "../../components/Navbar.jsx"
import Footer from "../../components/Footer/Footer.jsx"
import RecipeCard from "../../components/RecipeCard/RecipeCard.jsx"
import { suggestRecipes } from "../../services/api"
import useLang from "../../i18n/useLang"

function AIResults() {
  const location = useLocation()
  const navigate = useNavigate()

  const ingredients = location.state?.ingredients || []

  const [recipes, setRecipes] = useState([])
  const { t, lang } = useLang()
  const ingredientsKey = ingredients.join("|")
  const [status, setStatus] = useState(
    ingredients.length ? "loading" : "ready"
  ) // loading | ready | error

  useEffect(() => {
    if (!ingredientsKey) return

    let cancelled = false

    suggestRecipes(ingredientsKey.split("|"), { lang })
      .then((data) => {
        if (cancelled) return
        // نحول رد مرام لشكل بطاقة الوصفة
        setRecipes(
          data.suggestions.map((s, i) => ({
            id: `ai-${i}`,
            name: s.name,
            description: s.description,
            cuisine: s.cuisine || t("ai.pick"),
            image: "/recipe-placeholder.svg",
            time: s.time,
            match: s.matchPercentage,
            ingredients: s.ingredients,
          }))
        )
        setStatus("ready")
      })
      .catch((error) => !cancelled && setStatus(error.code === "DAILY_LIMIT" ? "limit" : "error"))

    return () => { cancelled = true }
  }, [ingredientsKey, lang, t])

  return (
    <div className="page-shell">

      <Navbar />

      <main className="py-16 min-h-[70vh]">

        <div className="container">

          <button
            onClick={() => navigate("/")}
            className="text-[#2E7D32] font-semibold mb-8"
          >
            {t("ai.back")}
          </button>

          <div className="reveal-item page-heading">
            <span className="section-eyebrow">{t("ai.eyebrow")}</span>
            <h1>{t("ai.title1")} <em>{t("ai.titleEm")}</em></h1>
            <p>{t("ai.body")}</p>

            <div className="flex flex-wrap justify-center gap-2">

              {ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="ingredient-result-chip"
                >
                  {ingredient}
                </span>
              ))}

            </div>

          </div>

          {status === "loading" && (
            <div className="empty-state">
              <div className="text-6xl mb-5">🍳</div>
              <h2 className="text-2xl font-bold mb-3">{t("ai.thinkingTitle")}</h2>
              <p className="text-[#757575]">{t("ai.thinkingBody")}</p>
            </div>
          )}

          {status === "limit" && (
            <div className="empty-state">
              <img className="empty-maram" src="/maram/full-confused.webp" alt="" />
              <h2 className="text-2xl font-bold mb-3">{t("premium.limitReached")}</h2>
              <Link to="/premium" className="button button-sun">✦ {t("premium.upgrade")}</Link>
            </div>
          )}

          {status === "error" && (
            <div className="empty-state">
              <h2 className="text-2xl font-bold mb-3">{t("ai.errorTitle")}</h2>
              <p className="text-[#757575]">{t("ai.errorBody")}</p>
            </div>
          )}

          {status === "ready" && (recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                />
              ))}

            </div>
          ) : (
            <div className="empty-state">

              <div className="text-6xl mb-5">
                🍳
              </div>

              <h2 className="text-2xl font-bold mb-3">
                {t("ai.noneTitle")}
              </h2>

              <p className="text-[#757575]">
                {t("ai.noneBody")}
              </p>

            </div>
          ))}

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default AIResults