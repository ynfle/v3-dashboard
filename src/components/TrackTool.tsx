import React, { useCallback } from 'react'

import {
  ProvideActionable,
  useProvideActionableState,
  useActionableState,
} from '../hooks/useActionableOnly'
import { usePage } from '../hooks/useUrlState'

import { SwitchToggle } from './SwitchToggle'
import { ViewSelectLink } from './ViewSelectLink'
import { PageSelectLink } from './PageSelectLink'
import { useRemoteConfig } from '../hooks/useRemoteConfig'
import { TrackIcon } from './TrackIcon'
import { TrackDescription } from './TrackDescription'
import { TrackContributing } from './TrackContributing'
import { TrackMaintaining } from './TrackMaintaining'
import { TrackNewExercise } from './TrackNewExercise'
import { ExerciseDetails } from './views/ExerciseDetails'
import { LaunchList } from './views/LaunchList'
import { ExerciseTree } from './views/ExerciseTree'

const DEFAULT_PAGE: Page = 'contributing'

export interface TrackToolProps {
  trackId: TrackIdentifier
  onUnselect: () => void
}

export function TrackTool({
  trackId,
  onUnselect,
}: TrackToolProps): JSX.Element {
  return (
    <ProvideActionable value={useProvideActionableState()}>
      <section>
        <div className="d-flex justify-content-start flex-row align-items-center w-50">
          <UnselectTrackButton onClick={onUnselect} />
          <TogglePageButton />
        </div>

        <PageView trackId={trackId} />
      </section>
    </ProvideActionable>
  )
}

function PageView({ trackId }: { trackId: TrackIdentifier }): JSX.Element {
  const [selectedPage] = usePage()
  const actualPage = selectedPage || DEFAULT_PAGE

  switch (actualPage) {
    case 'maintaining': {
      return <TrackMaintaining trackId={trackId} />
    }
    case 'new-exercise': {
      return <TrackNewExercise trackId={trackId} />
    }
    default: {
      return <TrackContributing trackId={trackId} />
    }
  }
}

function TogglePageButton(): JSX.Element {
  return (
    <div className="btn-group">
      <PageSelectLink page="contributing">Contributing</PageSelectLink>
      <PageSelectLink page="maintaining">Maintaining</PageSelectLink>
      <PageSelectLink page="new-exercise">New exercise</PageSelectLink>
    </div>
  )
}

function UnselectTrackButton({
  onClick,
}: {
  onClick: TrackToolProps['onUnselect']
}): JSX.Element {
  const doClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onClick()
    },
    [onClick]
  )

  return (
    <a
      href="/"
      className="btn btn-sm btn-outline-danger mr-3"
      onClick={doClick}
    >
      Select different track
    </a>
  )
}

const DEFAULT_VIEW = 'launch'

function SwitchActionableState(): JSX.Element {
  const [current, onChange] = useActionableState()

  const doToggle = useCallback(() => onChange((prev) => !prev), [onChange])

  return (
    <SwitchToggle
      inActiveLabel="All"
      activeLabel="Actionable"
      onToggle={doToggle}
      actionableOnly={current}
    />
  )
}

function ViewSelect(): JSX.Element {
  return (
    <div className="btn-group w-100">
      <ViewSelectLink view="launch">Launch</ViewSelectLink>
      <ViewSelectLink view="tree">Tree</ViewSelectLink>
    </div>
  )
}

function Header({ trackId }: { trackId: TrackIdentifier }): JSX.Element {
  const { config, done } = useRemoteConfig(trackId)

  return (
    <header
      className="card mt-4 mb-4"
      style={{ maxWidth: '25rem', width: '100%' }}
    >
      <figure style={{ maxWidth: 234, padding: '0 10px', margin: '10px auto' }}>
        <TrackIcon className="card-img-top" trackId={trackId} />
      </figure>
      <h1 className="sr-only card-title">{trackId}</h1>
      {done && (
        <div className="card-body">
          <TrackDescription config={config} />
        </div>
      )}
    </header>
  )
}

interface TrackViewProps {
  trackId: TrackIdentifier
  view: View
  onShowExercise: (exercise: ExerciseIdentifier) => void
  onHideExercise: () => void
}

function TrackView({
  trackId,
  view,
  onShowExercise,
  onHideExercise,
}: TrackViewProps): JSX.Element | null {
  switch (view) {
    case 'details': {
      return <ExerciseDetails trackId={trackId} onHide={onHideExercise} />
    }
    case 'launch': {
      return <LaunchList trackId={trackId} />
    }
    case 'tree': {
      return <ExerciseTree trackId={trackId} />
    }
    default: {
      return null
    }
  }
}
