import { Link } from "react-router-dom"
import useLang from "../../i18n/useLang"

function CategoryCard({ icon, title, description, to }) {
  const { t } = useLang()

  return (
    <Link to={to} className="reveal-item category-card card-hover">
      <span className="category-icon" aria-hidden="true">{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className="category-arrow" aria-hidden="true">{t("recipe.arrow")}</span>
    </Link>
  )
}

export default CategoryCard
