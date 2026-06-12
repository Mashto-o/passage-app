import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, MessageCircle, Sofa, Toilet } from 'lucide-react'
import { Button, CommentInput, ReviewSection } from '../components'
import type { ReviewSectionQuestion } from '../components'
import { analyzePhoto } from '../utils/mockAI'
import DoorWidth100 from '../assets/icons/door-width-100.svg?react'

// ── Types ──────────────────────────────────────────────────────────

type SectionId        = 'entrance' | 'toilet' | 'inside'
type AccessibilityVal = 'accessible' | 'partiallyAccessible' | 'inaccessible' | null

interface SectionState {
  status:             'empty' | 'analyzing' | 'done'
  photoSrc:           string | null
  accessibilityValue: AccessibilityVal
  aiSetAccessibility: boolean
  isOpen:             boolean
  questions:          ReviewSectionQuestion[]
}

// ── Section config ─────────────────────────────────────────────────

const SECTION_CONFIG: {
  id:        SectionId
  label:     string
  questions: { id: string; label: string }[]
}[] = [
  {
    id:    'entrance',
    label: 'Entrance',
    questions: [
      { id: 'e1', label: 'I could enter without help'              },
      { id: 'e2', label: 'The door width was wide enough'          },
      { id: 'e3', label: 'I could open the door independently'     },
      { id: 'e4', label: 'The slope of the ramp was manageable'    },
    ],
  },
  {
    id:    'toilet',
    label: 'Toilet',
    questions: [
      { id: 't1', label: 'My chair could fit inside'          },
      { id: 't2', label: 'There is a space for manoeuvre'     },
      { id: 't3', label: 'There were grab bars present'       },
    ],
  },
  {
    id:    'inside',
    label: 'Inside',
    questions: [
      { id: 'i1', label: 'There was enough space to move between furniture' },
      { id: 'i2', label: 'The main service is on the ground floor'          },
      { id: 'i3', label: 'I could reach the second floor without any help'  },
    ],
  },
]

// ── Initial state ──────────────────────────────────────────────────

function initSections(): Record<SectionId, SectionState> {
  const out = {} as Record<SectionId, SectionState>
  for (const cfg of SECTION_CONFIG) {
    out[cfg.id] = {
      status:             'empty',
      photoSrc:           null,
      accessibilityValue: null,
      aiSetAccessibility: false,
      isOpen:             false,
      questions:          cfg.questions.map(q => ({ ...q, value: null, aiSet: false })),
    }
  }
  return out
}

// ── Screen ─────────────────────────────────────────────────────────

export const ReviewScreen: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? {}) as {
    placeId?:   string
    placeName?: string
    address?:   string
  }

  const [sections, setSections] = useState<Record<SectionId, SectionState>>(initSections)
  const [comment,  setComment]  = useState('')

  const allDone = SECTION_CONFIG.every(cfg => sections[cfg.id].status === 'done')

  // ── Handlers ──────────────────────────────────────────────────

  const handlePhotoSelect = (id: SectionId, file: File) => {
    const src = URL.createObjectURL(file)
    setSections(prev => ({
      ...prev,
      [id]: { ...prev[id], photoSrc: src, status: 'analyzing' },
    }))
    setTimeout(() => {
      const result = analyzePhoto(id)
      setSections(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          status:             'done',
          isOpen:             true,
          accessibilityValue: result.accessibility,
          aiSetAccessibility: true,
          questions: prev[id].questions.map((q, i) => ({
            ...q,
            value: result.answers[i] ? 'yes' : 'no',
            aiSet: true,
          })),
        },
      }))
    }, 1600)
  }

  const handleAccessibilityChange = (
    id:    SectionId,
    value: 'accessible' | 'partiallyAccessible' | 'inaccessible',
  ) => {
    setSections(prev => ({
      ...prev,
      [id]: { ...prev[id], accessibilityValue: value, aiSetAccessibility: false },
    }))
  }

  const handleQuestionChange = (id: SectionId, qId: string, value: 'yes' | 'no') => {
    setSections(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        questions: prev[id].questions.map(q =>
          q.id === qId ? { ...q, value, aiSet: false } : q,
        ),
      },
    }))
  }

  const handleToggle = (id: SectionId) => {
    setSections(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: !prev[id].isOpen },
    }))
  }

  const handleSubmit = () => {
    console.log('Review submitted', { sections, comment })
    navigate(-1)
  }

  // ── Section icons ──────────────────────────────────────────────

  const sectionIcons: Record<SectionId, React.ReactNode> = {
    entrance: <DoorWidth100 width={16} height={16} aria-hidden />,
    toilet:   <Toilet     width={16} height={16} strokeWidth={1.5} aria-hidden />,
    inside:   <Sofa size={16} strokeWidth={1.5} aria-hidden />,
  }

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen overflow-y-auto bg-neutral-50 px-lg pt-[56px] pb-[120px]">
      <div className="flex flex-col gap-2xl">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-xs">
          <Button variant="back" label="Back" onClick={() => navigate(-1)} />
          <p className="text-display-md text-neutral-900">
            {state.placeName ?? 'Leave a review'}
          </p>
          {state.address && (
            <p className="text-body-sm text-neutral-700">{state.address}</p>
          )}
        </div>

        {/* ── AI Banner ───────────────────────────────────────── */}
        <div className="bg-primary-100 rounded-lg p-md flex gap-sm items-start">
          <Sparkles size={20} strokeWidth={1.5} className="text-primary-500 shrink-0" />
          <p className="text-body-sm text-neutral-900">
            AI-assisted review — Passage analyzes your photos to pre-fill accessibility
            details. Please check and correct anything that's wrong.
          </p>
        </div>

        {/* ── Accordion sections ──────────────────────────────── */}
        <div className="flex flex-col gap-xl">
          {SECTION_CONFIG.map(cfg => {
            const s = sections[cfg.id]
            return (
              <ReviewSection
                key={cfg.id}
                icon={sectionIcons[cfg.id]}
                label={cfg.label}
                photoSrc={s.photoSrc}
                status={s.status}
                accessibilityValue={s.accessibilityValue}
                aiSetAccessibility={s.aiSetAccessibility}
                onAccessibilityChange={v => handleAccessibilityChange(cfg.id, v)}
                onPhotoSelect={file => handlePhotoSelect(cfg.id, file)}
                questions={s.questions}
                onQuestionChange={(qId, v) => handleQuestionChange(cfg.id, qId, v)}
                isOpen={s.isOpen}
                onToggle={() => handleToggle(cfg.id)}
              />
            )
          })}
        </div>

        {/* ── Comment ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-md">
          <div className="flex items-center gap-xs">
            <MessageCircle size={24} strokeWidth={1.5} className="text-neutral-700" />
            <span className="text-caption-md uppercase tracking-caption-md text-neutral-700">
              Add a comment
            </span>
          </div>
          <p className="text-body-sm text-neutral-700">Optional - but helpful to others</p>
          <div className="flex flex-row gap-xs flex-wrap">
            <button
              type="button"
              onClick={() => console.log('Chip: The main barrier was...')}
              className="bg-neutral-200 text-neutral-700 text-caption-sm tracking-caption-sm px-xs py-2xs rounded-full whitespace-nowrap"
            >
              The main barrier was...
            </button>
            <button
              type="button"
              onClick={() => console.log('Chip: Helpful for users who...')}
              className="bg-neutral-200 text-neutral-700 text-caption-sm tracking-caption-sm px-xs py-2xs rounded-full whitespace-nowrap"
            >
              Helpful for users who...
            </button>
          </div>
          <CommentInput value={comment} onChange={setComment} />
        </div>

      </div>

      {/* ── Sticky submit ────────────────────────────────────── */}
      <div className="fixed bottom-lg left-lg right-lg z-40">
        <Button
          variant="primary"
          label="Post review"
          fullWidth
          disabled={!allDone}
          onClick={handleSubmit}
        />
      </div>
    </div>
  )
}
