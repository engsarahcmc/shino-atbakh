import { Link } from "react-router-dom"
import useLang from "../../i18n/useLang"
import { IS_DEMO } from "../../services/api"

function Footer() {
  const { t } = useLang()

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link to="/" className="footer-brand">
          {t("brand.first")} <span>{t("brand.highlight")}</span>
        </Link>
        <p>{t("footer.line")}</p>
        <span className="footer-note">{t("footer.note")}</span>
        {IS_DEMO && <p className="footer-demo">{t("demo.footer")}</p>}
      </div>
    </footer>
  )
}

export default Footer
