import { useState } from 'react'
import { ArrowRight, Star, AlertTriangle, CheckCircle, XCircle, TrafficCone } from 'lucide-react'
import { Button, AccessibilityBadge, SelectionCard, ReviewCard, PreferenceCard, AccessibilityCard, PhotoCard, PlacePhotoCard, Chip, StatusBadge, Divider, Dropdown, TextInput } from './components'
import type { AccessibilityBadgeProps } from './components'

import imgCobblestone   from './assets/images/cobblestone.png'
import imgDrainChannel  from './assets/images/drain-channel.png'
import imgKerb          from './assets/images/kerb.png'
import imgNarrowDoorway from './assets/images/narrow-doorway.png'
import imgSingleStep    from './assets/images/single-step.png'
import imgSteepSlope    from './assets/images/steep-slope.png'

import WheelchairManual   from './assets/illustrations/wheelchair-manual.svg?react'
import WheelchairElectric from './assets/illustrations/wheelchair-electric.svg?react'
import NoWheelchair       from './assets/illustrations/no-wheelchair.svg?react'
import Cane               from './assets/illustrations/cane.svg?react'
import Stroller           from './assets/illustrations/stroller.svg?react'
import Prosthesis         from './assets/illustrations/prosthesis.svg?react'

import DoorWidth90        from './assets/icons/door-width-90.svg?react'
import DoorWidth100       from './assets/icons/door-width-100.svg?react'
import DoorWidth120       from './assets/icons/door-width-120.svg?react'
import SlopeNone          from './assets/icons/slope-none.svg?react'
import SlopeModerate      from './assets/icons/slope-moderate.svg?react'
import SlopeSteep         from './assets/icons/slope-steep.svg?react'
import StairsAvoided      from './assets/icons/stairs-avoided.svg?react'
import StairsSingle       from './assets/icons/stairs-single.svg?react'
import StairsMultiple     from './assets/icons/stairs-multiple.svg?react'
import SurfaceCobblestone from './assets/icons/surface-cobblestone.svg?react'
import SurfaceUneven      from './assets/icons/surface-uneven.svg?react'
import SurfaceSmooth      from './assets/icons/surface-smooth.svg?react'

const badgeVariants: AccessibilityBadgeProps['variant'][] = [
  'accessible',
  'inaccessible',
  'partial',
  'unknown',
]

const mobilityCards = [
  { id: 'wheelchair-manual',   icon: <WheelchairManual   width={32} height={32} />, label: 'Manual wheelchair',  subtitle: 'Standard self-propelled chair' },
  { id: 'wheelchair-electric', icon: <WheelchairElectric width={32} height={32} />, label: 'Electric wheelchair', subtitle: 'Motorised chair'                },
  { id: 'no-wheelchair',       icon: <NoWheelchair       width={32} height={32} />, label: 'Walking',             subtitle: 'No mobility aid needed'         },
  { id: 'cane',                icon: <Cane               width={32} height={32} />, label: 'Cane or crutches',    subtitle: 'Walking with support'           },
  { id: 'stroller',            icon: <Stroller           width={32} height={32} />, label: 'Stroller',            subtitle: 'Pushchair or pram'              },
  { id: 'prosthesis',          icon: <Prosthesis         width={32} height={32} />, label: 'Prosthesis',          subtitle: 'Prosthetic limb user'           },
]

function App() {
  const [selectedCard,          setSelectedCard]          = useState<string | null>(null)
  const [selectedDoor,          setSelectedDoor]          = useState<string | null>(null)
  const [selectedSlope,         setSelectedSlope]         = useState<string | null>(null)
  const [selectedStairs,        setSelectedStairs]        = useState<string | null>(null)
  const [selectedSurface,       setSelectedSurface]       = useState<string | null>(null)
  const [selectedAccessibility, setSelectedAccessibility] = useState<string | null>(null)
  const [selectedPhotos,        setSelectedPhotos]        = useState<Set<string>>(new Set())
  const [fromValue,             setFromValue]             = useState('')
  const [toValue,               setToValue]               = useState('')

  const togglePhoto = (id: string) =>
    setSelectedPhotos(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

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

        {/* ── PreferenceCards ── */}
        <div className="flex flex-col gap-lg">

          {/* Group 1 — Door width */}
          <div className="flex flex-col gap-sm">
            <p className="text-body-sm text-neutral-500">Minimum door width</p>
            <div className="flex flex-row items-stretch gap-xs">
              <PreferenceCard icon={<DoorWidth90  width={36} height={36} />} label="< 90 cm"   selected={selectedDoor === '90'}  onClick={() => setSelectedDoor('90')}  />
              <PreferenceCard icon={<DoorWidth100 width={36} height={36} />} label="90–100 cm" selected={selectedDoor === '100'} onClick={() => setSelectedDoor('100')} />
              <PreferenceCard icon={<DoorWidth120 width={36} height={36} />} label="> 100 cm"  selected={selectedDoor === '120'} onClick={() => setSelectedDoor('120')} />
            </div>
          </div>

          {/* Group 2 — Slope tolerance (worst → best) */}
          <div className="flex flex-col gap-sm">
            <p className="text-body-sm text-neutral-500">Slope tolerance</p>
            <div className="flex flex-row items-stretch gap-xs">
              <PreferenceCard icon={<SlopeSteep    width={36} height={36} />} label="Steep"    selected={selectedSlope === 'steep'}    onClick={() => setSelectedSlope('steep')}    />
              <PreferenceCard icon={<SlopeModerate width={36} height={36} />} label="Moderate" selected={selectedSlope === 'moderate'} onClick={() => setSelectedSlope('moderate')} />
              <PreferenceCard icon={<SlopeNone     width={36} height={36} />} label="Flat only" selected={selectedSlope === 'none'}    onClick={() => setSelectedSlope('none')}     />
            </div>
          </div>

          {/* Group 3 — Stairs (worst → best) */}
          <div className="flex flex-col gap-sm">
            <p className="text-body-sm text-neutral-500">Stairs</p>
            <div className="flex flex-row items-stretch gap-xs">
              <PreferenceCard icon={<StairsMultiple width={36} height={36} />} label="Multiple"    selected={selectedStairs === 'multiple'} onClick={() => setSelectedStairs('multiple')} />
              <PreferenceCard icon={<StairsSingle   width={36} height={36} />} label="Single step" selected={selectedStairs === 'single'}   onClick={() => setSelectedStairs('single')}   />
              <PreferenceCard icon={<StairsAvoided  width={36} height={36} />} label="Ramp only"   selected={selectedStairs === 'avoided'}  onClick={() => setSelectedStairs('avoided')}  />
            </div>
          </div>

          {/* Group 4 — Surface (worst → best) */}
          <div className="flex flex-col gap-sm">
            <p className="text-body-sm text-neutral-500">Surface type</p>
            <div className="flex flex-row items-stretch gap-xs">
              <PreferenceCard icon={<SurfaceCobblestone width={36} height={36} />} label="Cobblestone"     selected={selectedSurface === 'cobblestone'} onClick={() => setSelectedSurface('cobblestone')} />
              <PreferenceCard icon={<SurfaceUneven      width={36} height={36} />} label="Uneven pavement" selected={selectedSurface === 'uneven'}      onClick={() => setSelectedSurface('uneven')}      />
              <PreferenceCard icon={<SurfaceSmooth      width={36} height={36} />} label="Flat only"       selected={selectedSurface === 'smooth'}      onClick={() => setSelectedSurface('smooth')}      />
            </div>
          </div>

        </div>

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

        {/* ── TextInputs ── */}
        <div className="bg-neutral-0 rounded-lg p-md flex flex-col gap-sm">
          <p className="text-caption-sm text-neutral-500">text input</p>
          <TextInput
            label="From"
            placeholder="Current location"
            value={fromValue}
            onChange={setFromValue}
          />
          <TextInput
            label="To"
            placeholder="Search destination"
            value={toValue}
            onChange={setToValue}
          />
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-neutral-200 my-sm" />

        {/* ── Dropdowns ── */}
        <div className="bg-neutral-0 rounded-lg p-md flex flex-col items-start gap-sm">
          <p className="text-caption-sm text-neutral-500">default · closed</p>
          <Dropdown
            label="4 stations"
            items={['1 station', '2 stations', '3 stations', '4 stations']}
          />

          <p className="text-caption-sm text-neutral-500">default · open</p>
          <Dropdown
            label="4 stations"
            items={['1 station', '2 stations', '3 stations', '4 stations']}
            defaultOpen
          />

          <p className="text-caption-sm text-neutral-500">warning · closed</p>
          <Dropdown
            label="3 barriers"
            items={['Steep slope', 'Narrow doorway', 'Cobblestone']}
            icon={<TrafficCone size={16} />}
            bgColor="bg-warning-100"
            textColor="text-warning-500"
          />

          <p className="text-caption-sm text-neutral-500">warning · open</p>
          <Dropdown
            label="3 barriers"
            items={['Steep slope', 'Narrow doorway', 'Cobblestone']}
            icon={<TrafficCone size={16} />}
            bgColor="bg-warning-100"
            textColor="text-warning-500"
            defaultOpen
          />
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-neutral-200 my-sm" />

        {/* ── Divider ── */}
        <div className="bg-neutral-0 rounded-lg p-md flex flex-col gap-sm">
          <p className="text-caption-sm text-neutral-500">divider</p>
          <Divider />
          <p className="text-body-sm text-neutral-700">Smooth ramp at the entrance. Aisles inside are wide enough for an active wheelchair.</p>
          <Divider />
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-neutral-200 my-sm" />

        {/* ── StatusBadges ── */}
        <div className="bg-neutral-0 rounded-lg p-md flex flex-col items-start gap-sm">
          <p className="text-caption-sm text-neutral-500">positive · no icon</p>
          <div className="inline-flex"><StatusBadge variant="positive" label="Accessible" /></div>

          <p className="text-caption-sm text-neutral-500">positive · with icon</p>
          <div className="inline-flex"><StatusBadge variant="positive" label="Accessible" icon={<CheckCircle size={16} />} /></div>

          <p className="text-caption-sm text-neutral-500">warning · no icon</p>
          <div className="inline-flex"><StatusBadge variant="warning" label="Partially accessible" /></div>

          <p className="text-caption-sm text-neutral-500">negative · no icon</p>
          <div className="inline-flex"><StatusBadge variant="negative" label="Inaccessible" /></div>

          <p className="text-caption-sm text-neutral-500">negative · with icon</p>
          <div className="inline-flex"><StatusBadge variant="negative" label="Inaccessible" icon={<XCircle size={16} />} /></div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-neutral-200 my-sm" />

        {/* ── Chips ── */}
        <div className="bg-neutral-0 rounded-lg p-md flex flex-col items-start gap-sm">
          <p className="text-caption-sm text-neutral-500">primary · no icon</p>
          <Chip variant="primary" label="Outside" />

          <p className="text-caption-sm text-neutral-500">primary · with icon</p>
          <Chip variant="primary" label="Accessible" icon={<Star size={13} />} />

          <p className="text-caption-sm text-neutral-500">secondary · no icon</p>
          <Chip variant="secondary" label="Inside" />

          <p className="text-caption-sm text-neutral-500">secondary · with icon</p>
          <Chip variant="secondary" label="Caution" icon={<AlertTriangle size={13} />} />
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-neutral-200 my-sm" />

        {/* ── PlacePhotoCards ── */}
        <div className="bg-neutral-0 rounded-lg p-md flex flex-col gap-sm">
          <p className="text-caption-sm text-neutral-500">place photo cards</p>
          <div className="flex flex-row gap-xs">
            <PlacePhotoCard
              location="Outside"
              updatedAt="1 week ago"
            />
            <PlacePhotoCard
              src="https://placehold.co/165x165"
              alt="Place photo"
              location="Inside"
              updatedAt="3 days ago"
            />
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-neutral-200 my-sm" />

        {/* ── PhotoCards ── */}
        <div className="bg-neutral-0 rounded-lg p-md flex flex-col gap-sm">
          <p className="text-caption-sm text-neutral-500">photo cards</p>
          <div className="flex flex-row flex-wrap gap-xs">
            <PhotoCard src={imgCobblestone}   alt="Cobblestone surface" label="Cobblestone"    selected={selectedPhotos.has('cobblestone')}   onClick={() => togglePhoto('cobblestone')}   />
            <PhotoCard src={imgDrainChannel}  alt="Drain channel"       label="Drain channel"  selected={selectedPhotos.has('drain-channel')} onClick={() => togglePhoto('drain-channel')} />
            <PhotoCard src={imgKerb}          alt="Kerb"                label="Kerb"           selected={selectedPhotos.has('kerb')}          onClick={() => togglePhoto('kerb')}          />
            <PhotoCard src={imgNarrowDoorway} alt="Narrow doorway"      label="Narrow doorway" selected={selectedPhotos.has('narrow-doorway')} onClick={() => togglePhoto('narrow-doorway')} />
            <PhotoCard src={imgSingleStep}    alt="Single step"         label="Single step"    selected={selectedPhotos.has('single-step')}   onClick={() => togglePhoto('single-step')}   />
            <PhotoCard src={imgSteepSlope}    alt="Steep slope"         label="Steep slope"    selected={selectedPhotos.has('steep-slope')}   onClick={() => togglePhoto('steep-slope')}   />
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-neutral-200 my-sm" />

        {/* ── AccessibilityCards ── */}
        <div className="bg-neutral-0 rounded-lg p-md flex flex-col gap-sm">
          <p className="text-caption-sm text-neutral-500">accessibility filter cards</p>
          <div className="flex flex-row gap-xs">
            <AccessibilityCard
              accessibility="accessible"
              selected={selectedAccessibility === 'accessible'}
              onClick={() => setSelectedAccessibility(selectedAccessibility === 'accessible' ? null : 'accessible')}
            />
            <AccessibilityCard
              accessibility="partiallyAccessible"
              selected={selectedAccessibility === 'partiallyAccessible'}
              onClick={() => setSelectedAccessibility(selectedAccessibility === 'partiallyAccessible' ? null : 'partiallyAccessible')}
            />
            <AccessibilityCard
              accessibility="inaccessible"
              selected={selectedAccessibility === 'inaccessible'}
              onClick={() => setSelectedAccessibility(selectedAccessibility === 'inaccessible' ? null : 'inaccessible')}
            />
          </div>
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
        <div className="flex gap-lg items-start justify-center pb-xl">
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
