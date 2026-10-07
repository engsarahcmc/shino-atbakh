function IngredientChip({ ingredient, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F5E9] px-4 py-2 text-[#2E7D32]">
      {ingredient}
      <button
        type="button"
        onClick={() => onRemove(ingredient)}
        aria-label={`Remove ${ingredient}`}
        className="font-bold hover:text-[#1B5E20]"
      >
        ×
      </button>
    </span>
  )
}

export default IngredientChip