
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
  res.send('السيرفر شغال ✅');
});

function validateSuggestInput(body) {
  const { ingredients, people, mealType } = body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return 'يجب إرسال قائمة مكونات لا تقل عن عنصر واحد (ingredients)';
  }
  if (people !== undefined && (typeof people !== 'number' || people <= 0)) {
    return 'عدد الأشخاص (people) يجب أن يكون رقمًا أكبر من صفر';
  }
  const validMealTypes = ['فطور', 'غداء', 'عشاء', 'سناك'];
  if (mealType && !validMealTypes.includes(mealType)) {
    return `نوع الوجبة (mealType) يجب أن يكون واحدًا من: ${validMealTypes.join(', ')}`;
  }

  return null;
}

function buildPrompt(ingredients, people, mealType) {
  return `
أنت مساعد طبخ ذكي اسمه "مرام" متخصص بالمطبخ العراقي والعربي.
المستخدم عنده هذي المكونات: ${ingredients.join('، ')}.
${people ? `عدد الأشخاص: ${people}.` : ''}
${mealType ? `نوع الوجبة المطلوبة: ${mealType}.` : ''}

اقترح 2 إلى 3 وصفات مناسبة بناءً على هذي المكونات فقط (أو معظمها).
أرجع الرد بصيغة JSON فقط بدون أي نص إضافي قبله أو بعده، بهذا الشكل بالضبط:

{
  "suggestions": [
    {
      "name": "اسم الوصفة",
      "matchPercentage": رقم من 0 إلى 100,
      "time": "مدة التحضير بالدقائق",
      "servings": ${people || 4},
      "ingredients": ["مكون1", "مكون2"]
    }
  ]
}
`;
}

app.post('/api/suggest', async (req, res) => {
  const validationError = validateSuggestInput(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { ingredients, people, mealType } = req.body;

  try {
const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });    const prompt = buildPrompt(ingredients, people, mealType);

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const cleanedText = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    res.status(200).json(parsed);

  } catch (error) {
    console.error('خطأ بالاتصال بـ AI:', error.message);
    res.status(500).json({ error: 'حدث خطأ أثناء توليد الاقتراحات، حاولي مرة أخرى' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`السيرفر يشتغل على http://localhost:${PORT}`);
});