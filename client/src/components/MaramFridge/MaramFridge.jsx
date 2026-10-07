import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import useLang from "../../i18n/useLang"
import useAuth from "../../auth/useAuth"
import { suggestRecipes } from "../../services/api"
import "./MaramFridge.css"

// أماكن المكونات على صورة الثلاجة (نسبة مئوية من العرض والارتفاع)
const ITEMS = [
  { key: "lettuce", x: 20.8, y: 19.5 },
  { key: "strawberry", x: 27.1, y: 21.0 },
  { key: "grapes", x: 32.0, y: 20.7 },
  { key: "pepper", x: 20.8, y: 27.5 },
  { key: "broccoli", x: 24.5, y: 27.3 },
  { key: "blueberry", x: 29.3, y: 28.5 },
  { key: "eggs", x: 34.3, y: 27.8 },
  { key: "tomato", x: 34.5, y: 33.9 },
  { key: "chicken", x: 22.6, y: 37.1 },
  { key: "cheese", x: 29.3, y: 37.6 },
  { key: "milk", x: 40.6, y: 35.5 },
  { key: "carrot", x: 20.2, y: 48.8 },
  { key: "apple", x: 32.2, y: 45.9 },
  { key: "lemon", x: 35.0, y: 49.8 },
]

const LAST_KEY = "shno-fridge"

// آخر اقتراحات، حتى ترجع لما المستخدم يرجع من صفحة الوصفة
const readLast = () => {
  try {
    return JSON.parse(sessionStorage.getItem(LAST_KEY) || "null")
  } catch {
    return null
  }
}

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

function MaramFridge() {
  const { t, lang } = useLang()
  const { isPremium } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [last] = useState(readLast)
  const [ingredients, setIngredients] = useState(last?.asked || [])
  const [meal, setMeal] = useState(null)
  const [people, setPeople] = useState(2)
  const [custom, setCustom] = useState("")
  const [mood, setMood] = useState("idle")
  const [bubble, setBubble] = useState(null)
  const [status, setStatus] = useState(last ? "ready" : "idle") // idle | loading | ready | error
  const [results, setResults] = useState(last?.results || [])
  const [asked, setAsked] = useState(last?.asked || [])
  const [bump, setBump] = useState(0)
  const [usage, setUsage] = useState(null) // كم اقتراح باقي اليوم
  const [limitHit, setLimitHit] = useState(false)
  const potRef = useRef(null)
  const resultsRef = useRef(null)

  const say = (text, nextMood) => {
    setBubble(text)
    if (nextMood) setMood(nextMood)
  }

  const nameOf = (key) => t(`fridge.items.${key}`)

  // لما يرجع المستخدم من صفحة الوصفة، ننزل للاقتراحات
  useEffect(() => {
    if (location.hash !== "#maram-results") return
    const id = setTimeout(() => resultsRef.current?.scrollIntoView(), 150)
    return () => clearTimeout(id)
  }, [location.hash])

  const fly = (fromEl, label) => {
    if (!fromEl || !potRef.current || reducedMotion()) return
    const a = fromEl.getBoundingClientRect()
    const b = potRef.current.getBoundingClientRect()
    const chip = document.createElement("span")
    chip.className = "mf-fly"
    chip.textContent = label
    chip.style.left = `${a.left}px`
    chip.style.top = `${a.top}px`
    document.body.appendChild(chip)
    requestAnimationFrame(() => {
      chip.style.transform = `translate(${b.left + b.width / 2 - a.left}px, ${b.top - a.top}px) scale(.8)`
      chip.style.opacity = "0.2"
    })
    setTimeout(() => {
      chip.remove()
      setBump((n) => n + 1)
    }, 600)
  }

  const toggleItem = (key, el) => {
    const name = nameOf(key)
    if (ingredients.includes(name)) {
      const next = ingredients.filter((i) => i !== name)
      setIngredients(next)
      say(t("fridge.removed"), next.length ? "excited" : "idle")
    } else {
      setIngredients([...ingredients, name])
      fly(el, name)
      say(t(`fridge.lines.${key}`) === `fridge.lines.${key}` ? t("fridge.added", { x: name }) : t(`fridge.lines.${key}`), "excited")
    }
  }

  const addCustom = (value) => {
    const v = value.trim()
    if (!v || ingredients.includes(v)) return
    setIngredients([...ingredients, v])
    say(t("fridge.addedCustom", { x: v }), "excited")
  }

  const removeChip = (name) => {
    const next = ingredients.filter((i) => i !== name)
    setIngredients(next)
    say(t("fridge.removed"), next.length ? "excited" : "idle")
  }

  const ask = async () => {
    setStatus("loading")
    setMood("thinking")
    setBubble(null)
    setAsked(ingredients)
    try {
      const data = await suggestRecipes(ingredients, {
        people,
        lang,
        ...(meal ? { mealType: meal } : {}),
      })
      const list = data.suggestions || []
      setResults(list)
      setUsage(data.usage || null)
      setLimitHit(false)
      setStatus("ready")
      try {
        sessionStorage.setItem(LAST_KEY, JSON.stringify({ asked: ingredients, results: list }))
      } catch {
        /* تجاهل */
      }
      say(list.length ? t("fridge.found", { n: list.length }) : t("fridge.none"), list.length ? "happy" : "confused")
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" }), 50)
    } catch (error) {
      setStatus("error")
      // خلص الحد اليومي: نعرض الترقية لبريميوم
      if (error.code === "DAILY_LIMIT") {
        setLimitHit(true)
        setUsage(error.data?.usage || null)
        return say(error.data?.usage?.guest ? t("premium.limitGuest") : t("premium.limitReached"), "confused")
      }
      say(
        error.offline ? t("fridge.errorOffline") : error.status === 503 ? t("fridge.busy") : t("fridge.error"),
        "confused"
      )
    }
  }

  const sep = lang === "ar" ? "، " : ", "

  const openRecipe = (recipe) => {
    const state = { recipe, people }
    try {
      sessionStorage.setItem("shno-ai-recipe", JSON.stringify(state))
    } catch {
      /* تجاهل */
    }
    navigate("/ai-recipe", { state })
  }
  const count = ingredients.length
  const potLabel =
    count === 0 ? t("fridge.potEmpty")
      : count === 1 ? t("fridge.potOne")
        : count === 2 ? t("fridge.potTwo")
          : t("fridge.potMany", { n: count })

  return (
    <section id="maram-fridge" className="mf">
      <div className="mf-hero">
        <div className="mf-viewport">
          <div className="mf-stage">
            <img src="/maram/fridge.webp" alt={t("fridge.fridgeAlt")} />
            {ITEMS.map((item) => {
              const name = nameOf(item.key)
              const on = ingredients.includes(name)
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`mf-hot ${on ? "on" : ""}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  aria-label={name}
                  aria-pressed={on}
                  onClick={(e) => toggleItem(item.key, e.currentTarget)}
                >
                  <span className="mf-tip">{name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mf-panel">
          <span className="section-eyebrow">{t("fridge.eyebrow")}</span>
          <h2 className="mf-title">{t("fridge.title")}</h2>
          <p className="mf-lede">{t("fridge.body")}</p>

          <div className="mf-maram">
            <div className="mf-ava">
              <img
                key={mood}
                className={status === "loading" ? "think" : "pop"}
                src={`/maram/avatar-${mood}.webp`}
                alt={t("fridge.maramAlt")}
              />
            </div>
            <div className="mf-bubble" aria-live="polite">
              {status === "loading" ? (
                <>
                  {t("fridge.thinking")}{" "}
                  <span className="mf-dots"><span /><span /><span /></span>
                </>
              ) : (
                bubble ?? t("fridge.hello")
              )}
            </div>
          </div>

          <div className="mf-tray">
            <div className="mf-pothead">
              <svg
                ref={potRef}
                key={bump}
                className={`mf-pot ${count ? "full" : ""} ${bump ? "bump" : ""} ${status === "loading" ? "cook" : ""}`}
                viewBox="0 0 120 90"
                aria-hidden="true"
              >
                <g className="steam">
                  <path d="M42 20c-6-8 6-10 0-18" /><path d="M60 22c-6-8 6-10 0-18" /><path d="M78 20c-6-8 6-10 0-18" />
                </g>
                <g className="lid">
                  <rect x="26" y="30" width="68" height="7" rx="3.5" fill="#24361f" />
                  <rect x="54" y="24" width="12" height="7" rx="3" fill="#24361f" />
                </g>
                <path d="M22 40h76v26a18 18 0 0 1-18 18H40a18 18 0 0 1-18-18z" fill="#31452e" />
                <rect x="12" y="46" width="12" height="6" rx="3" fill="#24361f" />
                <rect x="96" y="46" width="12" height="6" rx="3" fill="#24361f" />
                <circle cx="60" cy="62" r="7" fill="#b65035" />
                <path d="M57 55q3-3 6 0" stroke="#e7b65e" strokeWidth="2" fill="none" />
              </svg>
              <div>
                <h3>{t("fridge.potTitle")}</h3>
                <p className="mf-count">{potLabel}</p>
              </div>
            </div>

            <div className="mf-chips">
              {count === 0 ? (
                <>
                  <p className="mf-empty">{t("fridge.emptyHint")}</p>
                  {t("fridge.quick").map((q) => (
                    <button key={q} type="button" className="mf-quick" onClick={() => addCustom(q)}>
                      + {q}
                    </button>
                  ))}
                </>
              ) : (
                ingredients.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="mf-chip"
                    aria-label={t("fridge.remove", { x: name })}
                    onClick={() => removeChip(name)}
                  >
                    {name} <b aria-hidden="true">×</b>
                  </button>
                ))
              )}
            </div>

            <form
              className="mf-add"
              onSubmit={(e) => {
                e.preventDefault()
                addCustom(custom)
                setCustom("")
              }}
            >
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder={t("fridge.addPlaceholder")}
                aria-label={t("fridge.addPlaceholder")}
              />
              <button type="submit">{t("fridge.addButton")}</button>
            </form>

            <div className="mf-opts">
              <div className="mf-meal" role="group" aria-label={t("fridge.mealLabel")}>
                {t("fridge.meals").map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={meal === m}
                    onClick={() => setMeal(meal === m ? null : m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="mf-step">
                <button type="button" aria-label={t("fridge.fewer")} onClick={() => setPeople(Math.max(1, people - 1))}>−</button>
                <span>{people}</span> {t("fridge.people")}
                <button type="button" aria-label={t("fridge.more")} onClick={() => setPeople(Math.min(12, people + 1))}>+</button>
              </div>
            </div>

            <button type="button" className="mf-go" disabled={!count || status === "loading" || limitHit} onClick={ask}>
              {t("fridge.go")}
            </button>
            {limitHit ? (
              <Link to="/premium" className="mf-upgrade">✦ {t("premium.upgrade")}</Link>
            ) : (
              usage && !isPremium && (
                <p className="mf-left">{t("premium.remaining", { n: usage.remaining, limit: usage.limit })}</p>
              )
            )}
          </div>
        </div>
      </div>

      {status === "ready" && (
        <div className="mf-results container" ref={resultsRef}>
          <div className="mf-reshead">
            <img
              className="mf-full"
              src={`/maram/full-${results.length ? "happy" : "confused"}.webp`}
              alt={t("fridge.maramFullAlt")}
            />
            <div>
              <h2>{t("fridge.resultsTitle")}</h2>
              <p>{results.length ? t("fridge.resultsFor", { x: asked.join(sep) }) : t("fridge.none")}</p>
            </div>
          </div>
          <div className="mf-grid">
            {results.map((r, i) => {
              const list = r.ingredients || []
              const have = list.filter((x) => asked.some((a) => x.includes(a) || a.includes(x)))
              const need = list.filter((x) => !have.includes(x))
              return (
                <article className="mf-card" key={i}>
                  <h3>
                    <button type="button" className="mf-card-link" onClick={() => openRecipe(r)}>
                      {r.name}
                    </button>
                  </h3>
                  {r.description && <p className="mf-desc">{r.description}</p>}
                  <div className="mf-meta">
                    {r.time} {t("recipe.minutes")} · {t("fridge.servings", { n: r.servings || people })}
                  </div>
                  <div className="mf-meter"><i style={{ width: `${r.matchPercentage}%` }} /></div>
                  <div className="mf-pct">{t("fridge.haveShare", { n: r.matchPercentage })}</div>
                  {have.length > 0 && <p className="mf-have">{t("fridge.have")}: {have.join(sep)}</p>}
                  {need.length > 0 && <p className="mf-need">{t("fridge.need")}: {need.join(sep)}</p>}
                  <button type="button" className="mf-open" onClick={() => openRecipe(r)}>
                    {t("aiRecipe.open")} <span aria-hidden="true">{t("recipe.arrow")}</span>
                  </button>
                </article>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

export default MaramFridge
