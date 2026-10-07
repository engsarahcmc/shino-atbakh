function ErrorMessage({
  message = "Something went wrong. Please try again.",
  onRetry,
}) {
  return (
    <div className="text-center py-16">

      <div className="text-5xl mb-5">
        😕
      </div>

      <h2 className="text-2xl font-bold text-[#263238] mb-3">
        Something went wrong
      </h2>

      <p className="text-[#757575] mb-6">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-[#4CAF50] hover:bg-[#2E7D32] text-white px-6 py-3 rounded-2xl font-semibold"
        >
          Try Again
        </button>
      )}

    </div>
  )
}

export default ErrorMessage