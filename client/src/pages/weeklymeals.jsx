import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer/Footer.jsx"
import WeeklyBoard from "../components/WeeklyBoard/WeeklyBoard.jsx"

function WeeklyMeals() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="py-16">
        <div className="container">
          <WeeklyBoard />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default WeeklyMeals
