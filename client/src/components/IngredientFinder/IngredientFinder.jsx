import { useState } from "react"
import { useNavigate } from "react-router-dom"
import IngredientChip from "../IngredientChip/IngredientChip"
import Button from "../Button/Button"

function IngredientFinder() {
  const navigate = useNavigate()
  const [input, setInput] = useState("")
  const [ingredients, setIngredients] = useState([])

  const addIngredient = () => {
    const value = input.trim()

    if (!value) {
      return
    }

    if (ingredients.includes(value)) {
      setInput("")
      return
    }

    setIngredients((current) => [...current, value])
    setInput("")
  }

  const removeIngredient = (ingredient) => {
    setIngredients((current) =>
      current.filter((item) => item !== ingredient)
    )
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      addIngredient()
    }
  }

  return (
    <section className="py-20 bg-white">

      <div className="container max-w-4xl">

        <div className="text-center mb-10">

          <span className="text-[#4CAF50] font-semibold">
            AI Recipe Finder
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-[#263238] mt-2 mb-4">
            What's inside your fridge?
          </h2>

          <p className="text-[#757575]">
            Add your ingredients and we'll find meals you can make.
          </p>

        </div>

        <div className="bg-[#FFFDF7] rounded-3xl p-6 md:p-8 border border-[#E0E0E0]">

          <div className="flex flex-col sm:flex-row gap-3">

            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. chicken, tomato, rice..."
              className="flex-1 px-5 py-4 rounded-2xl bg-white border border-[#E0E0E0] outline-none focus:border-[#4CAF50]"
            />

            <Button onClick={addIngredient}>
              Add Ingredient
            </Button>

          </div>

          {ingredients.length > 0 && (
            <div className="mt-6">

              <p className="font-semibold mb-3">
                Your ingredients
              </p>

              <div className="flex flex-wrap gap-3">

                {ingredients.map((ingredient) => (
                  <IngredientChip
                    key={ingredient}
                    ingredient={ingredient}
                    onRemove={removeIngredient}
                  />
                ))}

              </div>

            </div>
          )}

          <button
            type="button"
            onClick={() => navigate("/ai-results", { state: { ingredients } })}
            disabled={ingredients.length === 0}
            className="w-full mt-8 bg-[#FF7043] hover:opacity-90 text-white py-4 rounded-2xl font-semibold transition"
          >
            🤖 Find Recipes With AI
          </button>

        </div>

      </div>

    </section>
  )
}

export default IngredientFinder