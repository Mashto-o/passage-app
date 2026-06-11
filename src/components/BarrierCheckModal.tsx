import React from 'react'
import { Button } from './index'

// ── Types ──────────────────────────────────────────────────────────────────

type BarrierCheckModalProps = {
  isOpen: boolean
  barrierLabel: string
  barrierImageSrc: string
  onYes: () => void
  onNo: () => void
  onSkip: () => void
}

// ── Component ──────────────────────────────────────────────────────────────

export const BarrierCheckModal: React.FC<BarrierCheckModalProps> = ({
  isOpen,
  barrierLabel,
  barrierImageSrc,
  onYes,
  onNo,
  onSkip,
}) => {
  if (!isOpen) return null

  return (
    /* Full-screen overlay — sits above ActiveNavigationSheet (z-100) */
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[rgba(26,26,26,0.6)]">

      {/* Card */}
      <div className="bg-neutral-0 rounded-[48px] px-[24px] py-[32px] flex flex-col gap-[12px] items-center w-[354px]">

        {/* Title */}
        <span className="text-neutral-900 font-semibold text-[16px] leading-[1.4] text-center">
          Is this barrier still there?
        </span>

        {/* Barrier photo + label */}
        <div className="flex flex-col items-center gap-[8px]">
          {/* Wrapper clips to rounded corners — img has no radius of its own */}
          <div className="w-[165px] h-[200px] rounded-[24px] overflow-hidden border border-neutral-200">
            <img
              src={barrierImageSrc}
              alt={barrierLabel}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-neutral-900 text-[14px] font-normal leading-none text-center w-[165px]">
            {barrierLabel}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-[12px] items-center w-[280px]">

          {/* Yes — primary */}
          <Button
            variant="primary"
            label="Yes, still there"
            className="w-full"
            onClick={onYes}
          />

          {/* No — success variant */}
          <Button
            variant="success"
            label="No, it's gone"
            className="w-full"
            onClick={onNo}
          />

          {/* Skip — ghost-like, no bg, no border */}
          <button
            type="button"
            className="text-neutral-500 font-semibold text-[16px] h-[48px] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            onClick={onSkip}
          >
            Skip — I'm not sure
          </button>

        </div>

        {/* Footer note */}
        <span className="text-neutral-700 text-[14px] font-normal leading-[1.5] text-center">
          Your answer helps other users on this route
        </span>

      </div>
    </div>
  )
}
