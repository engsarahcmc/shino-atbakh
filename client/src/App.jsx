import { useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

import Home from "./pages/Home"
import WeeklyMeals from "./pages/weeklymeals"
import Favorites from "./pages/favorites"
import Explore from "./pages/Explore"
import Profile from "./pages/Profile/Profile"
import Login from "./pages/Login/Login"
import Admin from "./pages/Admin/Admin"
import AIRecipe from "./pages/AIRecipe/AIRecipe"
import AIResults from "./pages/AIResults/AIResults"
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail"
import Premium from "./pages/Premium/Premium"
import usePageAnimations from "./animations/usePageAnimations"

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

// يرجع لأعلى الصفحة عند التنقل بين الصفحات
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AnimatedRoutes() {
  usePageAnimations()

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weekly" element={<WeeklyMeals />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-results" element={<AIResults />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/ai-recipe" element={<AIRecipe />} />
        <Route path="/premium" element={<Premium />} />
      </Routes>
    </>
  )
}

export default App
