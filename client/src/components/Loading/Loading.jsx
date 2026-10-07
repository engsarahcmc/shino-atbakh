function Loading({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">

      <div className="w-12 h-12 border-4 border-[#E8F5E9] border-t-[#4CAF50] rounded-full animate-spin" />

      <p className="mt-4 text-[#757575]">
        {text}
      </p>

    </div>
  )
}

export default Loading