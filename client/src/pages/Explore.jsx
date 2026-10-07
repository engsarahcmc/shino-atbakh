import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer/Footer.jsx"
import RecipeCard from "../components/RecipeCard/RecipeCard.jsx"
import SearchBar from "../components/searchBar/searchBar.jsx"
import useLang from "../i18n/useLang"
import mockRecipes from "../data/mockRecipes"

const FILTERS = ["All", "Eastern", "Western", "Healthy", "Quick"]

function Explore() {
  const { t, pick } = useLang()
  const [params, setParams] = useSearchParams()
  const fromUrl = params.get("filter")
  const activeFilter = FILTERS.includes(fromUrl) ? fromUrl : "All"
  const setActiveFilter = (filter) =>
    setParams(filter === "All" ? {} : { filter }, { replace: true })
  const [query, setQuery] = useState("")

  const byFilter = (recipe) => {
    if (activeFilter === "All") return true
    if (activeFilter === "Healthy") return recipe.healthScore >= 90
    if (activeFilter === "Quick") return recipe.time <= 25
    return recipe.region === activeFilter
  }

  const recipes = mockRecipes
    .filter(byFilter)
    .filter((r) => !query.trim() || pick(r.name).toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="page-shell">
      <Navbar />
      <main className="py-16">
        <div className="container">
          <div className="reveal-item page-heading">
            <span className="section-eyebrow">{t("explore.eyebrow")}</span>
            <h1>{t("explore.title1")} <em>{t("explore.titleEm")}</em></h1>
            <p>{t("explore.body")}</p>
          </div>

          <div className="reveal-item max-w-3xl mx-auto mb-8">
            <SearchBar onSearch={setQuery} />
          </div>

          <div className="reveal-item flex flex-wrap justify-center gap-3 mb-12">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
                className={`filter-pill ${activeFilter === filter ? "selected" : ""}`}
              >
                {t(`explore.filters.${filter}`)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {recipes.length === 0 && <p className="text-center text-[#757575] mt-10">{t("home.noResults")}</p>}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Explore
