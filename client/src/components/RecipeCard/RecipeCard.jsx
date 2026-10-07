import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useLang from "../../i18n/useLang"
import useAuth from "../../auth/useAuth"

function RecipeCard({ recipe, onFavorite }) {
  const { t, pick } = useLang()
  const { isPremium } = useAuth()
  // وصفة حصرية والمستخدم مو مشترك
  const locked = recipe.premium && !isPremium
  const navigate = useNavigate()
  const [broken, setBroken] = useState(false)
  const name = pick(recipe.name)
  // وصفات الـ AI ما عندها صفحة تفاصيل بعد
  const canOpen = typeof recipe.id === "number"
  const open = () => canOpen && navigate(`/recipe/${recipe.id}`)

  return (
    <article
      className={`recipe-card card-hover ${canOpen ? "is-link" : ""}`}
      onClick={open}
    >
      <div className="recipe-image image-zoom">
        {recipe.image && !broken ? (
          <img src={recipe.image} alt={name} loading="lazy" onError={() => setBroken(true)} />
        ) : (
          <div className="recipe-art" style={{ background: recipe.tint || "#eef4ec" }} role="img" aria-label={name}>
            <span aria-hidden="true">{recipe.art || "🍽️"}</span>
          </div>
        )}
        <span className="recipe-cuisine">{pick(recipe.cuisine)}</span>
        {recipe.premium && (
          <span className={`recipe-premium ${locked ? "locked" : ""}`}>
            <span aria-hidden="true">{locked ? "🔒" : "✦"}</span> {t("premium.badge")}
          </span>
        )}
        {onFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onFavorite(recipe)
            }}
            className="recipe-favorite"
            aria-label={recipe.favorite ? t("recipe.removeFav") : t("recipe.addFav")}
            aria-pressed={Boolean(recipe.favorite)}
          >
            {recipe.favorite ? "♥" : "♡"}
          </button>
        )}
      </div>
      <div className="recipe-body">
        <div className="recipe-title-row">
          <h3>
            {canOpen ? (
              <a
                href={`/recipe/${recipe.id}`}
                className="recipe-link"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  open()
                }}
              >
                {name}
              </a>
            ) : (
              name
            )}
          </h3>
        </div>
        <p className="recipe-description">{pick(recipe.description)}</p>
        <div className="recipe-meta">
          <span><span aria-hidden="true">◷</span> {recipe.time} {t("recipe.minutes")}</span>
          <span className="recipe-match">{recipe.match}% {t("recipe.match")}</span>
        </div>
        <div className="recipe-card-bottom">
          <span className="recipe-callout">{canOpen ? t("detail.open") : t("recipe.callout")}</span>
          <span className="recipe-arrow" aria-hidden="true">{t("recipe.arrow")}</span>
        </div>
      </div>
    </article>
  )
}

export default RecipeCard
