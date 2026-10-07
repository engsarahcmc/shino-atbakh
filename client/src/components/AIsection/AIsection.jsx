import { useState } from "react"
import IngredientFinder from "../IngredientFinder/IngredientFinder.jsx"

function AISection() {
  const [finderOpen, setFinderOpen] = useState(false)

  return (
    <section className="pantry-section">
      <div className="container">
        <div className="pantry-card">
          <div className="pantry-copy">
            <span className="section-eyebrow">THE CLEVER LITTLE SOUS-CHEF</span>
            <h2>Good things are already in your fridge.</h2>
            <p>Tell us what you have. We’ll find the delicious part.</p>
            <button
              type="button"
              className="button button-sun"
              onClick={() => setFinderOpen((open) => !open)}
              aria-expanded={finderOpen}
            >
              {finderOpen ? "Close the pantry" : "Cook with what you have"}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
          <div className="pantry-art" aria-hidden="true">
            <span>🍅</span><span>🥑</span><span>🍋</span><span>🌿</span>
            <strong>use what<br />you love</strong>
          </div>
        </div>
        {finderOpen && <div className="pantry-finder"><IngredientFinder /></div>}
      </div>
    </section>
  )
}

export default AISection