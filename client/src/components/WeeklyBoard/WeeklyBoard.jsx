import { useEffect, useRef, useState } from "react"
import useLang from "../../i18n/useLang"
import weeklyRecipes from "./weeklyRecipes"
import "./WeeklyBoard.css"

const JS_DAY = [6, 0, 1, 2, 3, 4, 5] // ترتيبنا يبدأ من السبت
const MAGNETS = ["#b65035", "#e7b65e", "#31452e", "#d9824a", "#7a5aa6", "#3f8fb5", "#c9463d"]
const TILT = [-1.5, 1, -0.5, 1.8, -1.2, 0.6, -2]
const STORAGE_KEY = "shno-week"
const DEFAULT_PLAN = ["tabsi", null, "shak", null, "adas", "dolma", null]

const randomItem = (list) => list[Math.floor(Math.random() * list.length)]

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")
    if (saved?.plan?.length === 7) return saved
  } catch {
    /* تجاهل */
  }
  return { plan: DEFAULT_PLAN, checked: {} }
}

function WeeklyBoard() {
  const { t, lang } = useLang()
  const [state, setState] = useState(load)
  const [editing, setEditing] = useState(null)
  const [overIndex, setOverIndex] = useState(null)
  const [message, setMessage] = useState(null)
  const [mood, setMood] = useState("idle")
  const dragFrom = useRef(null)
  const dialogRef = useRef(null)
  const { plan, checked } = state
  const days = t("weekly.days")
  const todayIndex = JS_DAY.indexOf(new Date().getDay())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* تجاهل */
    }
  }, [state])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (editing !== null && !dialog.open) dialog.showModal()
    if (editing === null && dialog.open) dialog.close()
  }, [editing])

  const say = (text, nextMood = "idle") => {
    setMessage(text)
    setMood(nextMood)
  }

  const planned = plan.filter(Boolean).length
  const summary =
    planned === 0 ? t("weekly.sumEmpty")
      : planned === 7 ? t("weekly.sumFull")
        : t("weekly.sumSome", { n: planned, left: 7 - planned })

  const setPlan = (next) => setState((s) => ({ ...s, plan: next }))

  const choose = (key, text) => {
    const next = [...plan]
    next[editing] = key
    setPlan(next)
    say(text ?? t("weekly.chosenMsg", { r: weeklyRecipes[key].n[lang], d: days[editing] }), "excited")
    setEditing(null)
  }

  const surprise = () => {
    const used = new Set(plan)
    const keys = Object.keys(weeklyRecipes)
    const pool = keys.filter((k) => !used.has(k))
    const list = pool.length ? pool : keys
    const key = randomItem(list)
    choose(key, t("weekly.surpriseMsg", { r: weeklyRecipes[key].n[lang] }))
  }

  const remove = (i) => {
    const next = [...plan]
    next[i] = null
    setPlan(next)
    say(t("weekly.removedMsg", { d: days[i] }))
  }

  const drop = (i) => {
    const from = dragFrom.current
    setOverIndex(null)
    dragFrom.current = null
    if (from === null || from === i) return
    const next = [...plan]
    ;[next[from], next[i]] = [next[i], next[from]]
    setPlan(next)
    say(t("weekly.movedMsg", { from: days[from], to: days[i] }), "excited")
  }

  // قائمة المشتريات: كل مكونات الأسبوع، والأكثر تكراراً فوق
  const counts = {}
  plan.filter(Boolean).forEach((key) =>
    weeklyRecipes[key].i[lang].forEach((x) => { counts[x] = (counts[x] || 0) + 1 })
  )
  const items = Object.keys(counts).sort((a, b) => counts[b] - counts[a])
  const left = items.filter((x) => !checked[x]).length

  return (
    <div className="wb">
      <div className="wb-top">
        <div>
          <h1>{t("weekly.title")}</h1>
          <p className="wb-lede">{t("weekly.body")}</p>
        </div>
        <div className="wb-maram">
          <div className="wb-bubble" aria-live="polite">{message ?? summary}</div>
          <div className="wb-ava">
            <img key={mood + (message ?? "")} src={`/maram/avatar-${planned === 7 && !message ? "happy" : mood}.webp`} alt={t("fridge.maramAlt")} />
          </div>
        </div>
      </div>

      <div className="wb-layout">
        <section className="wb-door" aria-label={t("weekly.doorLabel")}>
          <div className="wb-week">
            {days.map((day, i) => {
              const r = plan[i] && weeklyRecipes[plan[i]]
              return (
                <article
                  key={day}
                  className={`wb-note ${i === todayIndex ? "today" : ""} ${overIndex === i ? "over" : ""}`}
                  style={{ "--r": `${TILT[i]}deg` }}
                  onDragOver={(e) => {
                    if (dragFrom.current === null) return
                    e.preventDefault()
                    setOverIndex(i)
                  }}
                  onDragLeave={() => setOverIndex(null)}
                  onDrop={(e) => {
                    e.preventDefault()
                    drop(i)
                  }}
                >
                  <span className="wb-magnet" style={{ background: MAGNETS[i] }} />
                  <h2 className="wb-day">
                    {day}
                    {i === todayIndex && <small>{t("weekly.today")}</small>}
                  </h2>
                  {r ? (
                    <>
                      <button
                        type="button"
                        className="wb-meal"
                        draggable
                        onDragStart={(e) => {
                          dragFrom.current = i
                          e.dataTransfer.effectAllowed = "move"
                          e.dataTransfer.setData("text/plain", String(i))
                        }}
                        onClick={() => setEditing(i)}
                      >
                        <span className="wb-emo" aria-hidden="true">{r.e}</span>
                        <span className="wb-name">{r.n[lang]}</span>
                        <span className="wb-time">{r.t} {t("weekly.minutes")}</span>
                      </button>
                      <button type="button" className="wb-rm" onClick={() => remove(i)}>
                        {t("weekly.remove")}
                      </button>
                    </>
                  ) : (
                    <button type="button" className="wb-add" onClick={() => setEditing(i)}>
                      {t("weekly.addMeal")}
                    </button>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        <aside className="wb-sticky" aria-labelledby="wb-shop-title">
          <h2 id="wb-shop-title">{t("weekly.shopTitle")}</h2>
          <p className="wb-sub">
            {items.length ? (left ? t("weekly.shopLeft", { left, total: items.length }) : t("weekly.shopDone")) : ""}
          </p>
          <ul className="wb-shop">
            {items.length === 0 && <li className="wb-shop-empty">{t("weekly.shopEmpty")}</li>}
            {items.map((x) => (
              <li key={x}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(checked[x])}
                    onChange={(e) =>
                      setState((s) => ({ ...s, checked: { ...s.checked, [x]: e.target.checked } }))
                    }
                  />
                  <span>{x}</span>
                  {counts[x] > 1 && <span className="wb-x">{t("weekly.forMeals", { n: counts[x] })}</span>}
                </label>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <dialog
        ref={dialogRef}
        className="wb-dialog"
        aria-labelledby="wb-pick-title"
        onClose={() => setEditing(null)}
        onClick={(e) => e.target === e.currentTarget && setEditing(null)}
      >
        <div className="wb-dh">
          <h2 id="wb-pick-title">{editing !== null ? t("weekly.pickTitle", { d: days[editing] }) : ""}</h2>
          <button type="button" className="wb-close" aria-label={t("weekly.close")} onClick={() => setEditing(null)}>×</button>
        </div>
        <div className="wb-list">
          {Object.entries(weeklyRecipes).map(([key, r]) => (
            <button key={key} type="button" className="wb-pick" onClick={() => choose(key)}>
              <span className="wb-emo" aria-hidden="true">{r.e}</span>
              <span>
                <b>{r.n[lang]}</b>
                <span className="wb-t">{r.t} {t("weekly.minutes")} · {r.i[lang].slice(0, 3).join(lang === "ar" ? "، " : ", ")}…</span>
              </span>
            </button>
          ))}
        </div>
        <button type="button" className="wb-surprise" onClick={surprise}>{t("weekly.surprise")}</button>
      </dialog>
    </div>
  )
}

export default WeeklyBoard
