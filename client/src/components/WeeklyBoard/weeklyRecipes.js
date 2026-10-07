// وصفات تجريبية لباب الأسبوع، لحد ما نربط /api/weekly-meals مال فاطمة
const weeklyRecipes = {
  tabsi: { e: "🍗", t: 45, n: { ar: "تبسي دجاج بالخضار", en: "Chicken & veg tabsi" },
    i: { ar: ["دجاج", "فلفل", "طماطة", "جزر", "بصل"], en: ["chicken", "pepper", "tomato", "carrot", "onion"] } },
  shak: { e: "🍳", t: 20, n: { ar: "شكشوكة", en: "Shakshuka" },
    i: { ar: ["بيض", "طماطة", "فلفل", "بصل"], en: ["eggs", "tomato", "pepper", "onion"] } },
  adas: { e: "🥣", t: 35, n: { ar: "شوربة عدس", en: "Lentil soup" },
    i: { ar: ["عدس", "بصل", "جزر", "كمون"], en: ["lentils", "onion", "carrot", "cumin"] } },
  dolma: { e: "🫑", t: 90, n: { ar: "دولمة", en: "Dolma" },
    i: { ar: ["رز", "لحم", "طماطة", "فلفل", "بصل", "ورق عنب"], en: ["rice", "meat", "tomato", "pepper", "onion", "vine leaves"] } },
  fasol: { e: "🍛", t: 60, n: { ar: "تمن ومرق فاصوليا", en: "Rice & bean stew" },
    i: { ar: ["رز", "فاصوليا", "لحم", "طماطة"], en: ["rice", "beans", "meat", "tomato"] } },
  maqlub: { e: "🍆", t: 70, n: { ar: "مقلوبة باذنجان", en: "Eggplant maqluba" },
    i: { ar: ["رز", "باذنجان", "دجاج", "بصل"], en: ["rice", "eggplant", "chicken", "onion"] } },
  fattoush: { e: "🥗", t: 15, n: { ar: "سلطة فتوش", en: "Fattoush salad" },
    i: { ar: ["خس", "طماطة", "خيار", "خبز"], en: ["lettuce", "tomato", "cucumber", "bread"] } },
  kubba: { e: "🧆", t: 80, n: { ar: "كبة حلب", en: "Kubba Halab" },
    i: { ar: ["رز", "لحم", "بصل"], en: ["rice", "meat", "onion"] } },
}

export default weeklyRecipes
