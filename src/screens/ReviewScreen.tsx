import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sparkles, MessageCircle, Sofa, Toilet } from 'lucide-react'
import { Button, CommentInput, ReviewSection } from '../components'
import type { ReviewSectionQuestion } from '../components'
import { analyzePhoto } from '../utils/mockAI'
import { PLACES } from '../screens/MapScreen'
import { getPlaceFeatures } from '../utils/placeFeatures'
import DoorWidth100 from '../assets/icons/door-width-100.svg?react'

// ── Types ──────────────────────────────────────────────────────────────

type SectionId        = 'entrance' | 'toilet' | 'inside'
type AccessibilityVal = 'accessible' | 'partiallyAccessible' | 'inaccessible' | null

interface SectionState {
  status:             'empty' | 'analyzing' | 'done' | 'skipped'
  photoSrc:           string | null
  accessibilityValue: AccessibilityVal
  aiSetAccessibility: boolean
  isOpen:             boolean
  questions:          ReviewSectionQuestion[]
}

// ── Section config (keys only — labels resolved via t()) ───────────────

const QUESTION_KEYS: Record<SectionId, string[]> = {
  entrance: ['q1', 'q2', 'q3', 'q4'],
  toilet:   ['q1', 'q2', 'q3'],
  inside:   ['q1', 'q2', 'q3'],
}

// ── Initial state ──────────────────────────────────────────────────────

function initSections(ids: SectionId[]): Record<SectionId, SectionState> {
  const out = {} as Record<SectionId, SectionState>
  for (const id of ids) {
    out[id] = {
      status:             'empty',
      photoSrc:           null,
      accessibilityValue: null,
      aiSetAccessibility: false,
      isOpen:             false,
      questions:          QUESTION_KEYS[id].map(qKey => ({ id: qKey, label: qKey, value: null, aiSet: false })),
    }
  }
  return out
}

// ── Screen ─────────────────────────────────────────────────────────────

export const ReviewScreen: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const state = (location.state ?? {}) as {
    placeId?:   string
    placeName?: string
    address?:   string
  }

  const place = PLACES.find(p => p.id === (state.placeId ?? '')) ?? null
  const features = place ? getPlaceFeatures(place) : null
  const activeSectionIds: SectionId[] = (
    ['entrance', 'toilet', 'inside'] as const
  ).filter(key => !features || features[key])

  const [sections, setSections] = useState<Record<SectionId, SectionState>>(
    () => initSections(activeSectionIds)
  )
  const [comment,  setComment]  = useState('')

  const isSectionComplete = (id: SectionId): boolean => {
    const s = sections[id]
    return (
      s.status === 'done' &&
      s.accessibilityValue !== null &&
      s.questions.every(q => q.value !== null)
    )
  }

  const allDone =
    activeSectionIds.some(id => isSectionComplete(id)) &&
    activeSectionIds.every(id => isSectionComplete(id) || sections[id].status === 'skipped')

  // ── Helpers to resolve localized question labels ─────────────────

  const getQuestions = (id: SectionId): ReviewSectionQuestion[] =>
    sections[id].questions.map(q => ({
      ...q,
      label: t(`reviewScreen.sections.${id}.${q.id}`),
    }))

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

  const handleReset = (id: SectionId) => {
    setSections(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        status:             'empty',
        photoSrc:           null,
        accessibilityValue: null,
        aiSetAccessibility: false,
        isOpen:             false,
        questions:          prev[id].questions.map(q => ({ ...q, value: null, aiSet: false })),
      },
    }))
  }

  const handleFillManually = (id: SectionId) => {
    setSections(prev => ({
      ...prev,
      [id]: { ...prev[id], status: 'done', isOpen: true },
    }))
  }

  const handleSkip = (id: SectionId) => {
    setSections(prev => ({
      ...prev,
      [id]: { ...prev[id], status: 'skipped', isOpen: false },
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
    <main className="min-h-screen overflow-y-auto bg-neutral-50 px-lg pt-[56px] pb-[120px]">
      <div className="flex flex-col gap-2xl">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-xs">
          <Button variant="back" label={t('common.back')} onClick={() => navigate(-1)} />
          <h1 className="text-display-md text-neutral-900">
            {state.placeName ?? t('reviewScreen.defaultTitle')}
          </h1>
          {state.address && (
            <p className="text-body-sm text-neutral-700">{state.address}</p>
          )}
        </div>

        {/* ── AI Banner ───────────────────────────────────────── */}
        <div className="bg-primary-100 rounded-lg p-md flex gap-sm items-start">
          <Sparkles size={20} strokeWidth={1.5} className="text-primary-500 shrink-0" />
          <p className="text-body-sm text-neutral-900">
            {t('reviewScreen.aiBanner')}
          </p>
        </div>

        {/* ── Accordion sections ──────────────────────────────── */}
        <div className="flex flex-col gap-xl">
          {activeSectionIds.map(id => {
            const s = sections[id]
            const label = t(`reviewScreen.sections.${id}.label`)
            return (
              <ReviewSection
                key={id}
                icon={sectionIcons[id]}
                label={label}
                isComplete={isSectionComplete(id)}
                inputLabel={t('reviewScreen.uploadPhotoFor', { section: label.toLowerCase() })}
                skipLabel={t('reviewScreen.skipSection')}
                fillManuallyLabel={t('reviewScreen.fillManually')}
                resetSectionLabel={t('reviewScreen.resetSection')}
                skippedLabel={t('reviewScreen.skipped')}
                photoSrc={s.photoSrc}
                status={s.status}
                accessibilityValue={s.accessibilityValue}
                aiSetAccessibility={s.aiSetAccessibility}
                onAccessibilityChange={v => handleAccessibilityChange(id, v)}
                onPhotoSelect={file => handlePhotoSelect(id, file)}
                onFillManually={() => handleFillManually(id)}
                onSkip={() => handleSkip(id)}
                onReset={() => handleReset(id)}
                questions={getQuestions(id)}
                onQuestionChange={(qId, v) => handleQuestionChange(id, qId, v)}
                isOpen={s.isOpen}
                onToggle={() => handleToggle(id)}
              />
            )
          })}
        </div>

        {/* ── Comment ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-md">
          <div className="flex items-center gap-xs">
            <MessageCircle size={24} strokeWidth={1.5} className="text-neutral-700" />
            <span className="text-caption-md uppercase tracking-caption-md text-neutral-700">
              {t('reviewScreen.commentTitle')}
            </span>
          </div>
          <p className="text-body-sm text-neutral-700">{t('reviewScreen.commentOptional')}</p>
          <div className="flex flex-row gap-xs flex-wrap">
            <button
              type="button"
              onClick={() => console.log('Chip: mainBarrierChip')}
              className="bg-neutral-200 text-neutral-700 text-caption-sm tracking-caption-sm px-xs py-2xs rounded-full whitespace-nowrap"
            >
              {t('reviewScreen.mainBarrierChip')}
            </button>
            <button
              type="button"
              onClick={() => console.log('Chip: helpfulForChip')}
              className="bg-neutral-200 text-neutral-700 text-caption-sm tracking-caption-sm px-xs py-2xs rounded-full whitespace-nowrap"
            >
              {t('reviewScreen.helpfulForChip')}
            </button>
          </div>
          <CommentInput value={comment} onChange={setComment} />
        </div>

      </div>

      {/* ── Sticky submit ────────────────────────────────────── */}
      <div className="fixed bottom-lg left-lg right-lg z-40">
        <Button
          variant="primary"
          label={t('reviewScreen.postReview')}
          fullWidth
          disabled={!allDone}
          onClick={handleSubmit}
        />
      </div>
    </main>
  )
}
