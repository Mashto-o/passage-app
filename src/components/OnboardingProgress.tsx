import React from 'react'

export interface OnboardingProgressProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
  className = '',
}) => {
  const fillPercent = Math.min((currentStep / totalSteps) * 100, 100)

  return (
    <div className={`flex items-center gap-[12px] ${className}`}>
      {/* Progress bar */}
      <div className="relative w-[165px] h-[7px]">
        {/* Track */}
        <div className="absolute inset-0 bg-neutral-200 rounded-[48px]" />
        {/* Fill */}
        <div
          className="absolute left-0 top-0 h-full bg-primary-500 rounded-[48px] transition-all duration-300"
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      {/* Step counter */}
      <span className="w-[30px] text-right text-[14px] font-medium leading-[1.4] tracking-[0.56px] uppercase text-neutral-700">
        {currentStep}/{totalSteps}
      </span>
    </div>
  )
}
