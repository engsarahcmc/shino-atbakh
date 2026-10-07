// المكونات وطريقة التحضير لكل وصفة تجريبية (حسب رقم الوصفة)
const recipeDetails = {
  1: {
    servings: 2,
    ingredients: {
      ar: ["200 غرام باستا", "4 حبات طماطم ناضجة", "2 فص ثوم", "حفنة ريحان طازج", "2 ملعقة زيت زيتون", "ملح وفلفل"],
      en: ["200 g pasta", "4 ripe tomatoes", "2 garlic cloves", "A handful of fresh basil", "2 tbsp olive oil", "Salt and pepper"],
    },
    steps: {
      ar: ["اسلق الباستا في ماء مغلي مملح حتى تنضج، ثم صفّها.", "قطّع الطماطم مكعبات صغيرة واهرس الثوم.", "سخّن الزيت وقلّب الثوم دقيقة، ثم أضف الطماطم واتركها 8 دقائق.", "أضف الباستا إلى الصلصة وقلّب، ثم زيّنها بالريحان وقدّمها."],
      en: ["Boil the pasta in salted water until tender, then drain.", "Dice the tomatoes and crush the garlic.", "Heat the oil, stir the garlic for a minute, add the tomatoes and cook for 8 minutes.", "Toss the pasta in the sauce, top with basil and serve."],
    },
  },
  2: {
    servings: 3,
    ingredients: {
      ar: ["500 غرام صدر دجاج", "كوبان رز", "جزرة وكوب بازلاء", "بصلة", "ملعقة بهارات مشكلة", "ملح وزيت"],
      en: ["500 g chicken breast", "2 cups rice", "1 carrot and 1 cup peas", "1 onion", "1 tbsp mixed spices", "Salt and oil"],
    },
    steps: {
      ar: ["تبّل الدجاج بالبهارات والملح واتركه 15 دقيقة.", "اشوِ الدجاج أو اقلِه حتى ينضج ثم قطّعه شرائح.", "حمّر البصل وأضف الجزر والبازلاء، ثم الرز والماء واتركه حتى ينضج.", "قدّم الرز في طبق وضع الدجاج فوقه."],
      en: ["Season the chicken with spices and salt; rest for 15 minutes.", "Grill or pan-fry the chicken until cooked, then slice.", "Brown the onion, add carrot and peas, then rice and water; cook until tender.", "Serve the rice in a bowl topped with the chicken."],
    },
  },
  3: {
    servings: 2,
    ingredients: {
      ar: ["خسة صغيرة", "خيارتان", "3 حبات طماطم", "نصف بصلة", "عصير ليمونة", "3 ملاعق زيت زيتون"],
      en: ["1 small lettuce", "2 cucumbers", "3 tomatoes", "Half an onion", "Juice of 1 lemon", "3 tbsp olive oil"],
    },
    steps: {
      ar: ["اغسل الخضروات جيداً وجفّفها.", "قطّع الخس والخيار والطماطم والبصل.", "اخلط الليمون والزيت والملح في وعاء صغير.", "أضف الصلصة إلى الخضروات وقلّب قبل التقديم مباشرة."],
      en: ["Wash and dry the vegetables well.", "Chop the lettuce, cucumbers, tomatoes and onion.", "Whisk lemon juice, oil and salt in a small bowl.", "Pour over the salad and toss just before serving."],
    },
  },
  4: {
    servings: 2,
    ingredients: {
      ar: ["4 بيضات", "حبة طماطم", "نصف فلفل ملون", "بصلة صغيرة", "ملعقة زبدة", "ملح وفلفل"],
      en: ["4 eggs", "1 tomato", "Half a bell pepper", "1 small onion", "1 tbsp butter", "Salt and pepper"],
    },
    steps: {
      ar: ["قطّع الخضروات قطعاً صغيرة.", "اخفق البيض مع الملح والفلفل.", "ذوّب الزبدة وقلّب الخضروات 3 دقائق.", "اسكب البيض فوقها واتركه على نار هادئة حتى يتماسك."],
      en: ["Finely chop the vegetables.", "Whisk the eggs with salt and pepper.", "Melt the butter and cook the vegetables for 3 minutes.", "Pour in the eggs and cook on low heat until set."],
    },
  },
  5: {
    servings: 6,
    ingredients: {
      ar: ["ورق عنب وبصل وفلفل وباذنجان للحشو", "كوبان رز", "300 غرام لحم مفروم", "4 حبات طماطم", "ملعقة دبس رمان", "بهارات وملح"],
      en: ["Vine leaves, onions, peppers and eggplant for stuffing", "2 cups rice", "300 g minced meat", "4 tomatoes", "1 tbsp pomegranate molasses", "Spices and salt"],
    },
    steps: {
      ar: ["اخلط الرز واللحم والطماطم المفرومة والبهارات لعمل الحشوة.", "افرغ الخضروات واحشُها، ولفّ ورق العنب بالحشوة.", "رتّبها في قدر، وأضف الماء ودبس الرمان.", "اطبخها على نار هادئة ساعة تقريباً، ثم اقلب القدر في صينية."],
      en: ["Mix rice, meat, chopped tomatoes and spices for the filling.", "Hollow out the vegetables, stuff them, and roll the vine leaves.", "Arrange in a pot and add water and pomegranate molasses.", "Simmer for about an hour, then flip the pot onto a tray."],
    },
  },
  6: {
    servings: 5,
    ingredients: {
      ar: ["3 أكواب رز", "دجاجة مقطعة", "كوب بازلاء وجزرة", "حفنة مكسرات وزبيب", "شعرية محمصة", "بهارات برياني"],
      en: ["3 cups rice", "1 chicken, cut", "1 cup peas and 1 carrot", "A handful of nuts and raisins", "Toasted vermicelli", "Biryani spices"],
    },
    steps: {
      ar: ["اسلق الدجاج مع البهارات واحتفظ بالمرق.", "حمّر الشعرية ثم أضف الرز ومرق الدجاج.", "اقلِ الجزر والبازلاء، وحمّص المكسرات والزبيب.", "اخلط كل شيء مع الرز وقدّمه مع الدجاج."],
      en: ["Boil the chicken with spices and keep the broth.", "Toast the vermicelli, then add rice and chicken broth.", "Fry the carrots and peas; toast the nuts and raisins.", "Fold everything into the rice and serve with the chicken."],
    },
  },
  7: {
    servings: 4,
    ingredients: {
      ar: ["كوب عدس أحمر", "بصلة", "جزرة", "ملعقة كمون", "5 أكواب ماء", "ليمونة للتقديم"],
      en: ["1 cup red lentils", "1 onion", "1 carrot", "1 tsp cumin", "5 cups water", "Lemon to serve"],
    },
    steps: {
      ar: ["اغسل العدس جيداً.", "حمّر البصل والجزر في قليل من الزيت.", "أضف العدس والماء والكمون واتركه 25 دقيقة.", "اخلطه بالخلاط وقدّمه مع الليمون."],
      en: ["Rinse the lentils well.", "Sauté the onion and carrot in a little oil.", "Add lentils, water and cumin; simmer for 25 minutes.", "Blend smooth and serve with lemon."],
    },
  },
  8: {
    servings: 2,
    ingredients: {
      ar: ["4 بيضات", "3 حبات طماطم", "فلفلة", "بصلة", "ملعقة كمون", "ملح وفلفل"],
      en: ["4 eggs", "3 tomatoes", "1 pepper", "1 onion", "1 tsp cumin", "Salt and pepper"],
    },
    steps: {
      ar: ["حمّر البصل والفلفل في مقلاة.", "أضف الطماطم المقطعة والكمون واتركها تتكثف.", "اصنع حفراً صغيرة واكسر البيض فيها.", "غطِّ المقلاة حتى ينضج البيض، وقدّمها مع الخبز."],
      en: ["Sauté the onion and pepper in a pan.", "Add chopped tomatoes and cumin; let it thicken.", "Make small wells and crack the eggs into them.", "Cover until the eggs set, and serve with bread."],
    },
  },
  9: {
    servings: 5,
    ingredients: {
      ar: ["3 حبات باذنجان", "400 غرام لحم مفروم", "بصلة", "4 حبات طماطم", "معجون طماطم", "بهارات وملح"],
      en: ["3 eggplants", "400 g minced meat", "1 onion", "4 tomatoes", "Tomato paste", "Spices and salt"],
    },
    steps: {
      ar: ["قطّع الباذنجان شرائح واقلِه.", "اصنع كرات صغيرة من اللحم والبصل والبهارات واقلِها.", "رتّب الباذنجان والكرات وشرائح الطماطم في صينية.", "اسكب صلصة الطماطم فوقها وأدخلها الفرن 40 دقيقة."],
      en: ["Slice and fry the eggplants.", "Shape small meatballs with onion and spices, then fry.", "Layer eggplant, meatballs and tomato slices in a tray.", "Pour tomato sauce over and bake for 40 minutes."],
    },
  },
  10: {
    servings: 3,
    ingredients: {
      ar: ["خس وخيار وطماطم", "فجل ونعناع", "رغيف خبز محمص", "ملعقة دبس رمان", "سماق", "زيت زيتون وليمون"],
      en: ["Lettuce, cucumber and tomatoes", "Radish and mint", "1 toasted flatbread", "1 tbsp pomegranate molasses", "Sumac", "Olive oil and lemon"],
    },
    steps: {
      ar: ["قطّع الخضروات قطعاً متوسطة.", "حمّص الخبز وقطّعه مربعات.", "اخلط دبس الرمان والليمون والزيت والسماق.", "اخلط كل شيء وأضف الخبز قبل التقديم حتى يبقى مقرمشاً."],
      en: ["Chop the vegetables into medium pieces.", "Toast the bread and cut it into squares.", "Mix molasses, lemon, oil and sumac.", "Toss everything and add the bread just before serving."],
    },
  },
  11: {
    servings: 2,
    ingredients: {
      ar: ["عجينة بيتزا", "صلصة طماطم", "200 غرام جبن موزاريلا", "أوراق ريحان", "زيت زيتون"],
      en: ["Pizza dough", "Tomato sauce", "200 g mozzarella", "Basil leaves", "Olive oil"],
    },
    steps: {
      ar: ["سخّن الفرن على أعلى حرارة.", "افرد العجينة رقيقة وادهنها بالصلصة.", "وزّع الجبن فوقها.", "اخبزها 10 دقائق، ثم زيّنها بالريحان والزيت."],
      en: ["Preheat the oven to its highest setting.", "Stretch the dough thin and spread the sauce.", "Scatter the cheese on top.", "Bake for 10 minutes, then finish with basil and oil."],
    },
  },
  12: {
    servings: 3,
    ingredients: {
      ar: ["كوب طحين", "كوب حليب", "بيضة", "ملعقة سكر", "ملعقة صغيرة بيكنج باودر", "عسل أو فواكه للتقديم"],
      en: ["1 cup flour", "1 cup milk", "1 egg", "1 tbsp sugar", "1 tsp baking powder", "Honey or fruit to serve"],
    },
    steps: {
      ar: ["اخلط المكونات الجافة في وعاء.", "أضف الحليب والبيض واخفق حتى يصبح الخليط ناعماً.", "اسكب مغرفة في مقلاة ساخنة وقلبها عند ظهور الفقاعات.", "قدّمها مع العسل أو الفواكه."],
      en: ["Mix the dry ingredients in a bowl.", "Add milk and egg and whisk until smooth.", "Pour a ladle into a hot pan; flip when bubbles appear.", "Serve with honey or fruit."],
    },
  },
  13: {
    servings: 5,
    ingredients: {
      ar: ["2 كوب رز", "كوب برغل ناعم", "300 غرام لحم مفروم", "بصلتان", "بهارات وكركم", "زيت للقلي"],
      en: ["2 cups rice", "1 cup fine bulgur", "300 g minced meat", "2 onions", "Spices and turmeric", "Oil for frying"],
    },
    steps: {
      ar: ["اسلق الرز مع الكركم حتى ينضج جيداً، ثم اهرسه مع البرغل.", "حمّر اللحم مع البصل والبهارات لعمل الحشوة.", "شكّل أقراصاً من عجينة الرز واحشها باللحم وأغلقها.", "اقلِ الأقراص حتى تصبح ذهبية، وقدّمها ساخنة."],
      en: ["Boil the rice with turmeric until very soft, then mash with the bulgur.", "Brown the meat with onion and spices for the filling.", "Shape rice dough into discs, fill with meat and seal.", "Fry until golden and serve hot."],
    },
  },
  14: {
    servings: 4,
    ingredients: {
      ar: ["2 كوب فاصوليا بيضاء منقوعة", "300 غرام لحم", "معجون طماطم", "بصلة", "2 كوب رز", "بهارات وملح"],
      en: ["2 cups soaked white beans", "300 g meat", "Tomato paste", "1 onion", "2 cups rice", "Spices and salt"],
    },
    steps: {
      ar: ["اسلق اللحم مع البصل والبهارات حتى ينضج.", "أضف الفاصوليا ومعجون الطماطم والماء، واتركها على نار هادئة 40 دقيقة.", "اطبخ الرز منفصلاً حتى يصبح منفوشاً.", "قدّم المرق فوق التمن أو بجانبه."],
      en: ["Simmer the meat with onion and spices until tender.", "Add the beans, tomato paste and water; simmer for 40 minutes.", "Cook the rice separately until fluffy.", "Serve the stew over or beside the rice."],
    },
  },
  15: {
    servings: 4,
    ingredients: {
      ar: ["دجاجة مقطعة", "كوب حمص منقوع", "2 حبة لومي (ليمون أسود)", "بصلة", "خبز عراقي", "بهارات وكركم"],
      en: ["1 chicken, cut", "1 cup soaked chickpeas", "2 dried limes", "1 onion", "Iraqi flatbread", "Spices and turmeric"],
    },
    steps: {
      ar: ["اسلق الدجاج مع البصل والبهارات واللومي.", "أضف الحمص واتركه حتى ينضج.", "قطّع الخبز قطعاً ورتّبه في صحن عميق.", "اسكب المرق فوق الخبز وضع الدجاج في الأعلى."],
      en: ["Boil the chicken with onion, spices and dried lime.", "Add the chickpeas and cook until tender.", "Tear the bread into pieces in a deep dish.", "Pour the broth over the bread and top with chicken."],
    },
  },
  16: {
    servings: 4,
    ingredients: {
      ar: ["2 كوب حمص منقوع", "بصلة", "4 فصوص ثوم", "حفنة بقدونس وكزبرة", "ملعقة كمون", "زيت للقلي"],
      en: ["2 cups soaked chickpeas", "1 onion", "4 garlic cloves", "Parsley and coriander", "1 tsp cumin", "Oil for frying"],
    },
    steps: {
      ar: ["اطحن الحمص مع البصل والثوم والأعشاب.", "أضف الكمون والملح واترك الخليط 15 دقيقة.", "شكّل أقراصاً صغيرة.", "اقلِها في زيت ساخن حتى تصبح ذهبية ومقرمشة."],
      en: ["Blend chickpeas with onion, garlic and herbs.", "Add cumin and salt; rest for 15 minutes.", "Shape into small patties.", "Deep-fry until golden and crisp."],
    },
  },
  17: {
    servings: 4,
    ingredients: {
      ar: ["2 كوب حمص مسلوق", "3 ملاعق طحينة", "عصير ليمونة", "فص ثوم", "زيت زيتون", "ملح"],
      en: ["2 cups cooked chickpeas", "3 tbsp tahini", "Juice of 1 lemon", "1 garlic clove", "Olive oil", "Salt"],
    },
    steps: {
      ar: ["ضع الحمص في الخلاط مع قليل من ماء السلق.", "أضف الطحينة والليمون والثوم والملح.", "اخلط حتى يصبح ناعماً جداً.", "قدّمه في صحن وزيّنه بزيت الزيتون."],
      en: ["Put the chickpeas in a blender with a little cooking water.", "Add tahini, lemon, garlic and salt.", "Blend until very smooth.", "Serve drizzled with olive oil."],
    },
  },
  18: {
    servings: 10,
    ingredients: {
      ar: ["3 أكواب طحين", "كوب زبدة ذائبة", "ملعقة خميرة", "500 غرام عجينة تمر", "ملعقة هيل مطحون", "صفار بيضة للوجه"],
      en: ["3 cups flour", "1 cup melted butter", "1 tsp yeast", "500 g date paste", "1 tsp ground cardamom", "Egg yolk to glaze"],
    },
    steps: {
      ar: ["اعجن الطحين مع الزبدة والخميرة والماء، واتركها ترتاح ساعة.", "اخلط التمر مع الهيل.", "افرد العجينة، وضع التمر، ولفّها وقطّعها.", "ادهنها بصفار البيض واخبزها 20 دقيقة."],
      en: ["Knead flour with butter, yeast and water; rest for an hour.", "Mix the dates with cardamom.", "Roll out the dough, spread the dates, roll up and slice.", "Glaze with egg yolk and bake for 20 minutes."],
    },
  },
  19: {
    servings: 4,
    ingredients: {
      ar: ["6 حبات طماطم", "بصلة", "2 فص ثوم", "كوبان مرق", "ريحان", "ملعقة زيت زيتون"],
      en: ["6 tomatoes", "1 onion", "2 garlic cloves", "2 cups stock", "Basil", "1 tbsp olive oil"],
    },
    steps: {
      ar: ["حمّر البصل والثوم في الزيت.", "أضف الطماطم المقطعة والمرق واتركها 20 دقيقة.", "اخلطها بالخلاط حتى تصبح ناعمة.", "قدّمها مع الريحان وقطع الخبز المحمص."],
      en: ["Sauté onion and garlic in the oil.", "Add chopped tomatoes and stock; simmer for 20 minutes.", "Blend until smooth.", "Serve with basil and toasted bread."],
    },
  },
  20: {
    servings: 2,
    ingredients: {
      ar: ["خسة رومانية", "صدر دجاج", "خبز محمص مكعبات", "جبن بارميزان", "صلصة سيزر", "ليمون"],
      en: ["Romaine lettuce", "1 chicken breast", "Croutons", "Parmesan", "Caesar dressing", "Lemon"],
    },
    steps: {
      ar: ["تبّل الدجاج واشوِه ثم قطّعه شرائح.", "قطّع الخس وضعه في وعاء كبير.", "أضف الخبز المحمص والجبن والصلصة.", "ضع الدجاج في الأعلى وقدّمها فوراً."],
      en: ["Season, grill and slice the chicken.", "Chop the lettuce into a large bowl.", "Add croutons, cheese and dressing.", "Top with the chicken and serve right away."],
    },
  },
  21: {
    servings: 4,
    ingredients: {
      ar: ["500 غرام لحم مفروم", "4 خبز برغر", "شرائح جبن", "خس وطماطم", "بصلة", "ملح وفلفل"],
      en: ["500 g minced beef", "4 burger buns", "Cheese slices", "Lettuce and tomato", "1 onion", "Salt and pepper"],
    },
    steps: {
      ar: ["تبّل اللحم بالملح والفلفل وشكّله أقراصاً.", "اشوِ الأقراص 4 دقائق لكل جهة.", "ضع الجبن فوقها حتى يذوب.", "رتّب البرغر في الخبز مع الخضروات."],
      en: ["Season the meat and shape into patties.", "Grill 4 minutes per side.", "Add cheese on top until melted.", "Assemble in buns with the vegetables."],
    },
  },
  22: {
    servings: 4,
    ingredients: {
      ar: ["سمكة كبيرة مفتوحة", "2 حبة طماطم", "بصلة", "كركم وملح", "ليمون", "خبز عراقي"],
      en: ["1 large fish, butterflied", "2 tomatoes", "1 onion", "Turmeric and salt", "Lemon", "Iraqi bread"],
    },
    steps: {
      ar: ["نظّف السمكة وافتحها من الظهر.", "تبّلها بالكركم والملح.", "اشوِها على الفحم أو في الفرن حتى تنضج.", "زيّنها بالطماطم والبصل، وقدّمها مع الخبز والليمون."],
      en: ["Clean the fish and open it along the back.", "Season with turmeric and salt.", "Grill over charcoal or in the oven until cooked.", "Top with tomato and onion; serve with bread and lemon."],
    },
  },
}

export default recipeDetails
