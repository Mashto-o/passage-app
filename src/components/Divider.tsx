import React from 'react'

export interface DividerProps {
  className?: string
}

export const Divider: React.FC<DividerProps> = ({ className = '' }) => (
  <div className={`w-full border-t border-neutral-200 ${className}`} />
)
