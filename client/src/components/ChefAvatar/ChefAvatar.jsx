// صورة شخصية مرسومة: قبعة طباخ فوق دائرة فيها أول حرف من الاسم
const COLORS = ["#5b8a5f", "#b65035", "#c98f2e", "#3f7a8c", "#7a5aa6", "#8e6641"]

const colorFor = (name = "") =>
  COLORS[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % COLORS.length]

function ChefAvatar({ name = "", size = 96, admin = false }) {
  const initial = [...name.trim()][0]?.toUpperCase() || "؟"
  const bg = colorFor(name)

  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" role="img" aria-label={name}>
      <circle cx="50" cy="65" r="46" fill={bg} />
      <circle cx="50" cy="65" r="46" fill="none" stroke="#fff9eb" strokeWidth="4" />
      <text
        x="50"
        y="82"
        textAnchor="middle"
        fontSize="42"
        fontWeight="700"
        fill="#fff9eb"
        fontFamily="'Reem Kufi', 'IBM Plex Sans Arabic', sans-serif"
      >
        {initial}
      </text>
      <g>
        <path
          d="M27 34c-9-4-8-18 3-18 2-9 14-12 20-5 6-7 18-4 20 5 11 0 12 14 3 18z"
          fill="#fff" stroke="#e3d6c0" strokeWidth="2"
        />
        <rect x="28" y="31" width="44" height="10" rx="4" fill="#fff" stroke="#e3d6c0" strokeWidth="2" />
      </g>
      {admin && (
        <g>
          <circle cx="84" cy="96" r="13" fill="#e7b65e" stroke="#fff9eb" strokeWidth="3" />
          <path d="M77 98l3-7 4 4 4-4 3 7z" fill="#352b1e" />
        </g>
      )}
    </svg>
  )
}

export default ChefAvatar
