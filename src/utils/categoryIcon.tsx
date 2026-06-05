import React from 'react'
import { Hospital, Utensils, Landmark, ShoppingCart, Trees, Toilet, Pill } from 'lucide-react'
import ShelterIcon from '../assets/icons/shelter.svg?react'

// Shared helper — used by map markers, place popup, PlaceListItem, and all future place-detail screens.
// Import from here whenever a category icon is needed.

export function getCategoryIcon(category: string, size: number): React.JSX.Element {
  const cls = 'text-neutral-0'
  if (category === 'hospital')    return <Hospital     size={size} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'restaurant')  return <Utensils     size={size} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'landmark')    return <Landmark     size={size} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'supermarket') return <ShoppingCart size={size} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'park')        return <Trees        size={size} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'bank')        return <Landmark     size={size} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'toilet')      return <Toilet       size={size} strokeWidth={1} className={cls} aria-hidden />
  if (category === 'pharmacy')    return <Pill         size={size} strokeWidth={1} className={cls} aria-hidden />
  return <ShelterIcon width={size} height={size} stroke="currentColor" strokeWidth={1} className={cls} aria-hidden />
}
