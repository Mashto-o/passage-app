import React from 'react'

export interface DividerProps {
  className?: string
}

export const Divider: React.FC<DividerProps> = ({ className = '' }) => (
  <div className={`h-px w-full bg-neutral-200 overflow-hidden ${className}`} />
)
