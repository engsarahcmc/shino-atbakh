function HealthScore({ score }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-[#263238]">
          Health Score
        </span>

        <span className="text-sm font-bold text-[#4CAF50]">
          {score}/100
        </span>
      </div>

      <div className="w-full h-3 bg-[#E8F5E9] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#4CAF50] rounded-full transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export default HealthScore