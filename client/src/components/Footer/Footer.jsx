import useLang from "../../i18n/useLang"

function Footer() {
  const { t } = useLang()

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <a href="/" className="footer-brand">
          {t("brand.first")} <span>{t("brand.highlight")}</span>
        </a>
        <p>{t("footer.line")}</p>
        <span className="footer-note">{t("footer.note")}</span>
      </div>
    </footer>
  )
}

export default Footer
