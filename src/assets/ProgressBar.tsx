type ProgressBarProps = {
  value: number // 0-5
  label: string
}

export default function ProgressBar({
  value,
  label,
}: ProgressBarProps) {

  // convert 0-5 stars to 0-100%
  const percentage = (value / 5) * 100

  return (
    <div className="relative w-32 h-20">

      <svg
        viewBox="0 0 36 36"
        className="w-full h-full rotate-180"
      >
        {/* background arc */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          strokeWidth="2"
          strokeDasharray="50 100"
          className="stroke-gray-300"
        />

        {/* progress arc */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          strokeWidth="2"
          strokeDasharray={`${percentage / 2} 100`}
          strokeLinecap="round"
          className="stroke-[#ff9e00]"
        />
      </svg>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
        <p className="text-2xl font-bold text-[#ff9e00]">
          {value.toFixed(1)}
        </p>

        <p className="text-xs text-gray-600">
          {label}
        </p>
      </div>

    </div>
  )
}