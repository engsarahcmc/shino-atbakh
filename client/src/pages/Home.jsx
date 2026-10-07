import { useState } from "react"

import MaramWelcome from "../components/MaramWelcome/MaramWelcome.jsx"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer/Footer.jsx"
import CategoryCard from "../components/Categorycard/categorycard.jsx"
import RecipeCard from "../components/RecipeCard/RecipeCard.jsx"
import MaramFridge from "../components/MaramFridge/MaramFridge.jsx"
import SearchBar from "../components/searchBar/searchBar.jsx"
import useLang from "../i18n/useLang"

import mockRecipes from "../data/mockRecipes"

function Home() {
  const { t, pick } = useLang()
  const [recipes, setRecipes] = useState(mockRecipes)
  const [query, setQuery] = useState("")

  const handleFavorite = (recipe) => {
    setRecipes((current) =>
      current.map((item) => (item.id === recipe.id ? { ...item, favorite: !item.favorite } : item))
    )
  }

  const shown = query.trim()
    ? recipes.filter((r) => pick(r.name).toLowerCase().includes(query.toLowerCase()))
    : recipes

  return (
    <div className="page-shell">
      <Navbar />

      <MaramWelcome />

      <MaramFridge />

      <section className="reveal-section py-20 bg-white">
        <div className="container">
          <div className="section-heading text-center mb-12">
            <span className="section-eyebrow">{t("home.moodEyebrow")}</span>
            <h2>
              {t("home.moodTitle1")} <em>{t("home.moodTitleEm")}</em> {t("home.moodTitle2")}
            </h2>
            <p>{t("home.moodBody")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t("home.moods").map((mood) => (
              <CategoryCard key={mood.title} icon={mood.icon} title={mood.title} description={mood.description} to={`/explore?filter=${mood.filter}`} />
            ))}
          </div>
        </div>
      </section>

      <section id="popular-recipes" className="reveal-section py-20 bg-[#FFFDF7]">
        <div className="container">
          <div className="section-heading max-w-3xl mx-auto mb-12">
            <span className="section-eyebrow">{t("home.popularEyebrow")}</span>
            <h2>
              {t("home.popularTitle1")} <em>{t("home.popularTitleEm")}</em>
            </h2>
            <p>{t("home.popularBody")}</p>
            <SearchBar onSearch={setQuery} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shown.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onFavorite={handleFavorite} />
            ))}
          </div>

          {shown.length === 0 && <p className="text-center text-[#757575] mt-10">{t("home.noResults")}</p>}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
