import { useState } from "react"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer/Footer.jsx"
import RecipeCard from "../components/RecipeCard/RecipeCard.jsx"
import useLang from "../i18n/useLang"
import mockRecipes from "../data/mockRecipes"

function Favorites() {
  const { t } = useLang()
  const [recipes, setRecipes] = useState(
    mockRecipes.map((recipe, index) => ({ ...recipe, favorite: index < 2 }))
  )

  const toggleFavorite = (recipe) => {
    setRecipes((current) =>
      current.map((item) => (item.id === recipe.id ? { ...item, favorite: !item.favorite } : item))
    )
  }

  const favorites = recipes.filter((recipe) => recipe.favorite)

  return (
    <div className="page-shell">
      <Navbar />
      <main className="py-16 min-h-[70vh]">
        <div className="container">
          <div className="reveal-item page-heading page-heading-left">
            <span className="section-eyebrow">{t("favorites.eyebrow")}</span>
            <h1>{t("favorites.title1")} <em>{t("favorites.titleEm")}</em></h1>
            <p>{t("favorites.body")}</p>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} onFavorite={toggleFavorite} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <img className="empty-maram" src="/maram/full-confused.webp" alt="" />
              <h2>{t("favorites.emptyTitle")}</h2>
              <p>{t("favorites.emptyBody")}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Favorites
