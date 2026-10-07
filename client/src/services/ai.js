const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"

async function aiRequest(endpoint, data) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    throw new Error("AI request failed")
  }

  return response.json()
}

export function analyzeIngredients(ingredients) {
  return aiRequest("/ai/analyze-ingredients", {
    ingredients,
  })
}

export function generateRecipes(ingredients, preferences = {}) {
  return aiRequest("/ai/generate-recipes", {
    ingredients,
    preferences,
  })
}

export function classifyCuisine(recipe) {
  return aiRequest("/ai/classify-cuisine", {
    recipe,
  })
}

export function analyzeHealth(recipe) {
  return aiRequest("/ai/health-score", {
    recipe,
  })
}