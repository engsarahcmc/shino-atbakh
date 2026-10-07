import { useEffect, useMemo, useState } from "react"
import translations from "./translations"
import { LanguageContext } from "./context"

const STORAGE_KEY = "shno-lang"

function readSaved() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "ar"
  } catch {
    return "ar"
  }
}

// يجيب نص من المفتاح، مثل t("nav.home") أو t("fridge.added", { x: "دجاج" })
function makeT(lang) {
  return (key, vars) => {
    const value = key.split(".").reduce((obj, part) => obj?.[part], translations[lang])
    if (typeof value !== "string" || !vars) return value ?? key
    return value.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "")
  }
}

function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readSaved)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.title = lang === "ar" ? "شنو أطبخ؟" : "Shno Atbakh? — What shall I cook?"
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* التخزين مو متاح، عادي */
    }
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      t: makeT(lang),
      toggle: () => setLang((current) => (current === "ar" ? "en" : "ar")),
      // يختار النص حسب اللغة إذا كان { ar, en }، وإلا يرجعه مثل ما هو
      pick: (text) => (text && typeof text === "object" ? text[lang] ?? text.ar : text),
    }),
    [lang]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export default LanguageProvider
