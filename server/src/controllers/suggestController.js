const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// الموديل الأساسي، وبعده موديلات احتياطية إذا كان عليه ضغط
const MODELS = [
  process.env.GEMINI_MODEL || "gemini-3.8-flash",
  ...(process.env.GEMINI_FALLBACK_MODELS || "gemini-3.6-flash,gemini-3.5-flash")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean),
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// يجرب كل موديل مرتين، وإذا الخدمة مضغوطة (503) أو الموديل مو موجود ينتقل للي بعده
const generateWithFallback = async (prompt) => {
  let lastError;
  for (const modelName of MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error) {
        lastError = error;
        const busy = error.status === 503 || /503|overloaded|high demand/i.test(error.message);
        const missing = error.status === 404 || /404|not found/i.test(error.message);
        console.error(`AI (${modelName}, try ${attempt}):`, error.message);
        if (missing) break; // الموديل مو متاح، جرّب اللي بعده
        if (!busy) throw error; // خطأ ثاني (مثل المفتاح)، لا تكمل
        if (attempt === 1) await wait(1500);
      }
    }
  }
  lastError.busy = true;
  throw lastError;
};

// نقبل نوع الوجبة بالعربي أو الإنكليزي
const MEAL_TYPES = ["فطور", "غداء", "عشاء", "سناك", "breakfast", "lunch", "dinner", "snack"];

const validateSuggestInput = ({ ingredients, people, mealType, lang }) => {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return "ingredients must be a non-empty array";
  }
  if (people !== undefined && (typeof people !== "number" || people <= 0)) {
    return "people must be a number greater than 0";
  }
  if (mealType && !MEAL_TYPES.includes(String(mealType).toLowerCase())) {
    return `mealType must be one of: ${MEAL_TYPES.join(", ")}`;
  }
  if (lang && !["ar", "en"].includes(lang)) {
    return "lang must be 'ar' or 'en'";
  }
  return null;
};

const buildPrompt = ({ ingredients, people, mealType, lang = "ar" }) => {
  const language = lang === "en" ? "English" : "simple Modern Standard Arabic";
  return `
You are "Maram", a friendly cooking assistant specialised in Iraqi and Arabic cuisine.
The user has these ingredients: ${ingredients.join(", ")}.
${people ? `Number of people: ${people}.` : ""}
${mealType ? `Meal type: ${mealType}.` : ""}

Suggest 2 to 3 recipes that use these ingredients only (or most of them).
Write every text value in ${language}.
Return JSON only, with no text before or after it, in exactly this shape:
{
  "suggestions": [
    {
      "name": "recipe name",
      "description": "one short sentence",
      "cuisine": "cuisine type",
      "matchPercentage": 0-100,
      "time": number of minutes as an integer,
      "servings": ${people || 4},
      "ingredients": ["ingredient 1", "ingredient 2"]
    }
  ]
}`;
};

const suggestRecipes = async (req, res) => {
  const validationError = validateSuggestInput(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const text = await generateWithFallback(buildPrompt(req.body));
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed.suggestions)) {
      throw new Error("AI response has no suggestions array");
    }

    res.json(parsed);
  } catch (error) {
    console.error("AI suggest error:", error.message);
    if (error.busy) {
      return res.status(503).json({ message: "The AI service is busy right now, please try again shortly" });
    }
    res.status(500).json({ message: "Could not generate suggestions, please try again" });
  }
};

// ---------- تفاصيل وصفة اقترحتها مرام ----------
const buildRecipePrompt = ({ name, ingredients = [], people, lang = "ar" }) => {
  const language = lang === "en" ? "English" : "simple Modern Standard Arabic";
  return `
You are "Maram", a friendly cooking assistant specialised in Iraqi and Arabic cuisine.
Write the full recipe for: "${name}".
${ingredients.length ? `Main ingredients: ${ingredients.join(", ")}.` : ""}
Servings: ${people || 2}.
Write every text value in ${language}. Keep steps short and clear (one or two sentences each).
Return JSON only, with no text before or after it, in exactly this shape:
{
  "ingredients": ["ingredient with quantity", "..."],
  "steps": ["step 1", "step 2", "..."],
  "tip": "one short helpful tip"
}`;
};

const getRecipeDetails = async (req, res) => {
  const { name, ingredients, people, lang } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "name is required" });
  }
  if (ingredients !== undefined && !Array.isArray(ingredients)) {
    return res.status(400).json({ message: "ingredients must be an array" });
  }
  if (lang && !["ar", "en"].includes(lang)) {
    return res.status(400).json({ message: "lang must be 'ar' or 'en'" });
  }

  try {
    const text = await generateWithFallback(buildRecipePrompt({ name, ingredients, people, lang }));
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

    if (!Array.isArray(parsed.ingredients) || !Array.isArray(parsed.steps)) {
      throw new Error("AI response is missing ingredients or steps");
    }

    res.json(parsed);
  } catch (error) {
    console.error("AI recipe error:", error.message);
    if (error.busy) {
      return res.status(503).json({ message: "The AI service is busy right now, please try again shortly" });
    }
    res.status(500).json({ message: "Could not prepare the recipe, please try again" });
  }
};

module.exports = { suggestRecipes, getRecipeDetails };
