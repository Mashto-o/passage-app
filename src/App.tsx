import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button, AccessibilityBadge, SelectionCard, ReviewCard } from './components'
import type { AccessibilityBadgeProps } from './components'

import WheelchairManual   from './assets/illustrations/wheelchair-manual.svg?react'
import WheelchairElectric from './assets/illustrations/wheelchair-electric.svg?react'
import NoWheelchair       from './assets/illustrations/no-wheelchair.svg?react'
import Cane               from './assets/illustrations/cane.svg?react'
import Stroller           from './assets/illustrations/stroller.svg?react'
import Prosthesis         from './assets/illustrations/prosthesis.svg?react'

const badgeVariants: AccessibilityBadgeProps['variant'][] = [
  'accessible',
  'inaccessible',
  'partial',
  'unknown',
]

const mobilityCards = [
  {
    id:       'wheelchair-manual',
    icon:     <WheelchairManual width={32} height={32} />,
    label:    'Manual wheelchair',
    subtitle: 'Standard self-propelled chair',
  },
  {
    id:       'wheelchair-electric',
    icon:     <WheelchairElectric width={32} height={32} />,
    label:    'Electric wheelchair',
    subtitle: 'Motorised chair',
  },
  {
    id:       'no-wheelchair',
    icon:     <NoWheelchair width={32} height={32} />,
    label:    'Walking',
    subtitle: 'No mobility aid needed',
  },
  {
    id:       'cane',
    icon:     <Cane width={32} height={32} />,
    label:    'Cane or crutches',
    subtitle: 'Walking with support',
  },
  {
    id:       'stroller',
    icon:     <Stroller width={32} height={32} />,
    label:    'Stroller',
    subtitle: 'Pushchair or pram',
  },
  {
    id:       'prosthesis',
    icon:     <Prosthesis width={32} height={32} />,
    label:    'Prosthesis',
    subtitle: 'Prosthetic limb user',
  },
]

function App() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-neutral-100 flex items-start justify-center py-xl">
      <div className="max-w-sm w-full mx-auto px-lg flex flex-col gap-sm">

        {/* ── ReviewCards ── */}
        <ReviewCard
          authorName="Kateryna"
          mobilityIcon={<WheelchairManual width={22} height={22} />}
          timestamp="1 week ago"
          reviewText="Smooth ramp at the entrance. Aisles inside are wide enough for an active chair."
        />
        <ReviewCard
          authorName="Yurii"
          mobilityIcon={<Cane width={22} height={22} />}
          timestamp="3 days ago"
          reviewText="The lift was working but quite narrow. Manageable with a manual chair."
        />

        {/* ── Divider ── */}
        <div className="h-px bg-neutral-200 my-sm" />

        {/* ── SelectionCards ── */}
        {mobilityCards.map(({ id, icon, label, subtitle }) => (
          <SelectionCard
            key={id}
            icon={icon}
            label={label}
            subtitle={subtitle}
            selected={selectedCard === id}
            onClick={() => setSelectedCard(id)}
          />
        ))}

        {/* ── Divider ── */}
        <div className="h-px bg-neutral-200 my-sm" />

        {/* ── Buttons ── */}
        <div className="bg-neutral-0 rounded-lg p-md flex flex-col gap-sm">
          <p className="text-caption-sm text-neutral-500">primary</p>
          <Button variant="primary" label="Primary button" fullWidth />

          <p className="text-caption-sm text-neutral-500">secondary</p>
          <Button variant="secondary" label="Secondary button" fullWidth />

          <p className="text-caption-sm text-neutral-500">ghost</p>
          <Button variant="ghost" label="Ghost button" fullWidth />

          <p className="text-caption-sm text-neutral-500">link</p>
          <Button variant="link" label="Link button" fullWidth />

          <p className="text-caption-sm text-neutral-500">destructive</p>
          <Button variant="destructive" label="Destructive button" fullWidth />

          <p className="text-caption-sm text-neutral-500">primary · icon right</p>
          <Button
            variant="primary"
            label="Continue"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
            fullWidth
          />

          <p className="text-caption-sm text-neutral-500">disabled</p>
          <Button variant="primary" label="Primary button" fullWidth disabled />
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-neutral-200 my-sm" />

        {/* ── AccessibilityBadge md ── */}
        <p className="text-caption-sm text-neutral-500">accessibility badge · md</p>
        <div className="flex gap-lg items-start justify-center">
          {badgeVariants.map((v) => (
            <div key={v} className="flex flex-col items-center gap-xs">
              <AccessibilityBadge variant={v} size="md" />
              <span className="text-caption-sm text-neutral-500">{v}</span>
            </div>
          ))}
        </div>

        {/* ── AccessibilityBadge sm ── */}
        <p className="text-caption-sm text-neutral-500">accessibility badge · sm</p>
        <div className="flex gap-lg items-start justify-center">
          {badgeVariants.map((v) => (
            <div key={v} className="flex flex-col items-center gap-xs">
              <AccessibilityBadge variant={v} size="sm" />
              <span className="text-caption-sm text-neutral-500">{v}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default App
