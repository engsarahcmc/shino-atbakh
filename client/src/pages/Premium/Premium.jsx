import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar.jsx"
import Footer from "../../components/Footer/Footer.jsx"
import useLang from "../../i18n/useLang"
import useAuth from "../../auth/useAuth"
import { subscribePremium } from "../../services/api"
import "./Premium.css"

// نفس الأرقام اللي بالسيرفر (server/src/config/premium.js)
const PLANS = { monthly: 5000, yearly: 48000 }
const FREE_LIMIT = 5
const METHODS = [
  { key: "zaincash", field: "phone", mark: "Z" },
  { key: "qicard", field: "card", mark: "Qi" },
  { key: "fastpay", field: "phone", mark: "F" },
]

const money = (n) => Number(n).toLocaleString("en-US")

function Premium() {
  const { t, lang } = useLang()
  const { isLoggedIn, isPremium, user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [plan, setPlan] = useState("yearly")
  const [open, setOpen] = useState(false)

  const until = user?.premium_until
    ? new Intl.DateTimeFormat(lang === "ar" ? "ar-IQ" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(user.premium_until))
    : ""

  const start = () => {
    if (!isLoggedIn) return navigate("/login", { state: { from: "/premium" } })
    setOpen(true)
  }

  const freeFeatures = t("premium.freeFeatures").map((f) => f.replace("{n}", FREE_LIMIT))
  const premiumFeatures = t("premium.premiumFeatures")

  return (
    <div className="page-shell">
      <Navbar />
      <main className="pm">
        <section className="pm-hero">
          <div className="pm-tiles" aria-hidden="true" />
          <div className="container pm-hero-inner">
            <div>
              <h1>{t("premium.title")}</h1>
              <p>{t("premium.body")}</p>
              <p className="pm-demo" role="note"><span aria-hidden="true">ⓘ</span> {t("premium.demo")}</p>
            </div>
            <img src="/maram/full-excited.webp" alt="" className="pm-maram" />
          </div>
        </section>

        <section className="container pm-plans" aria-label={t("premium.premiumName")}>
          <div className="pm-toggle" role="radiogroup" aria-label={t("premium.premiumName")}>
            {["monthly", "yearly"].map((key) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={plan === key}
                className={plan === key ? "on" : ""}
                onClick={() => setPlan(key)}
              >
                {t(`premium.${key}`)}
                {key === "yearly" && <small>{t("premium.save")}</small>}
              </button>
            ))}
          </div>

          <div className="pm-grid">
            <article className="pm-plan free">
              <h2>{t("premium.freeName")}</h2>
              <p className="pm-price"><b>0</b> {t("premium.currency")}</p>
              <ul>
                {freeFeatures.map((f, i) => (
                  <li key={f} className={i === freeFeatures.length - 1 ? "muted" : ""}>{f}</li>
                ))}
              </ul>
              {!isPremium && <span className="pm-current">{t("premium.current")}</span>}
            </article>

            <article className="pm-plan gold">
              <span className="pm-seal" aria-hidden="true">✦</span>
              <h2>{t("premium.premiumName")}</h2>
              <p className="pm-price">
                <b>{money(PLANS[plan])}</b> {t("premium.currency")}{" "}
                <span>{plan === "monthly" ? t("premium.perMonth") : t("premium.perYear")}</span>
              </p>
              <ul>
                {premiumFeatures.map((f) => <li key={f}>{f}</li>)}
              </ul>
              {isPremium ? (
                <p className="pm-active">
                  {t("premium.active", { plan: t(`premium.${user.premium_plan}`), d: until })}{" "}
                  <Link to="/profile">{t("premium.manage")}</Link>
                </p>
              ) : (
                <button type="button" className="pm-cta" onClick={start}>
                  {isLoggedIn ? t("premium.cta") : t("premium.loginFirst")}
                </button>
              )}
            </article>
          </div>
        </section>
      </main>
      <Footer />

      {open && (
        <Checkout
          plan={plan}
          onClose={() => setOpen(false)}
          onDone={() => refreshUser().catch(() => {})}
        />
      )}
    </div>
  )
}

// نافذة الدفع التجريبية
function Checkout({ plan, onClose, onDone }) {
  const { t } = useLang()
  const navigate = useNavigate()
  const dialogRef = useRef(null)
  const [method, setMethod] = useState("zaincash")
  const [number, setNumber] = useState("")
  const [step, setStep] = useState("form") // form | paying | done | error
  const [invalid, setInvalid] = useState(false)
  const field = METHODS.find((m) => m.key === method).field

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  const pay = async (e) => {
    e.preventDefault()
    const digits = number.replace(/\s/g, "")
    const ok = field === "phone" ? /^07\d{9}$/.test(digits) : /^\d{16}$/.test(digits)
    if (!ok) return setInvalid(true)
    setInvalid(false)
    setStep("paying")
    try {
      // تأخير بسيط حتى يبين مثل الدفع الحقيقي
      await Promise.all([subscribePremium(plan, method), new Promise((r) => setTimeout(r, 1400))])
      await onDone()
      setStep("done")
    } catch {
      setStep("error")
    }
  }

  return (
    <dialog ref={dialogRef} className="pm-dialog" onClose={onClose} aria-labelledby="pm-dialog-title">
      <button type="button" className="pm-x" onClick={onClose} aria-label={t("premium.close")}>×</button>

      {step === "done" ? (
        <div className="pm-done" role="status">
          <img src="/maram/full-happy.webp" alt="" />
          <h2 id="pm-dialog-title">{t("premium.successTitle")}</h2>
          <p>{t("premium.successBody")}</p>
          <button type="button" className="pm-pay" onClick={() => navigate("/")}>{t("premium.start")}</button>
        </div>
      ) : (
        <form onSubmit={pay} noValidate>
          <h2 id="pm-dialog-title">{t("premium.checkoutTitle")}</h2>
          <p className="pm-summary">
            {t("premium.premiumName")} {t(`premium.${plan}`)}
            <b>{money(PLANS[plan])} {t("premium.currency")}</b>
          </p>

          <fieldset className="pm-methods" disabled={step === "paying"}>
            <legend>{t("premium.chooseMethod")}</legend>
            {METHODS.map((m) => (
              <label key={m.key} className={method === m.key ? "on" : ""}>
                <input
                  type="radio"
                  name="method"
                  value={m.key}
                  checked={method === m.key}
                  onChange={() => { setMethod(m.key); setNumber(""); setInvalid(false) }}
                />
                <span className={`pm-mark ${m.key}`} aria-hidden="true">{m.mark}</span>
                {t(`premium.methods.${m.key}`)}
              </label>
            ))}
          </fieldset>

          <label className="pm-field">
            <span>{t(`premium.${field}`)}</span>
            <input
              dir="ltr"
              inputMode="numeric"
              autoComplete="off"
              value={number}
              onChange={(e) => setNumber(e.target.value.replace(/[^\d\s]/g, ""))}
              placeholder={t(`premium.${field}Hint`)}
              aria-invalid={invalid}
              disabled={step === "paying"}
            />
          </label>
          {invalid && <p className="pm-err" role="alert">{t("premium.invalid")}</p>}
          {step === "error" && <p className="pm-err" role="alert">{t("premium.error")}</p>}

          <button type="submit" className="pm-pay" disabled={step === "paying"}>
            {step === "paying" ? t("premium.processing") : t("premium.pay", { amount: money(PLANS[plan]) })}
          </button>
          <p className="pm-demo small">{t("premium.demo")}</p>
        </form>
      )}
    </dialog>
  )
}

export default Premium
