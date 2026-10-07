function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}) {
  const baseClasses =
    "px-6 py-3 rounded-xl font-semibold transition-all duration-300"

  const variantClasses = {
    primary:
      "bg-[#4CAF50] text-white hover:bg-[#2E7D32] hover:scale-105",
    secondary:
      "bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]",
    accent:
      "bg-[#FF7043] text-white hover:opacity-90 hover:scale-105",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  )
}

export default Button