import React from 'react';
import ExerciseSet from './ExerciseSet';
import { TRACKING_OPTIONS } from './ExerciseForm';

function makeEmptySet(trackingType) {
  const newSet = { id: crypto.randomUUID(), completed: false };
  if (trackingType === 'weight-reps') return { ...newSet, weight: '', reps: '' };
  if (trackingType === 'reps') return { ...newSet, reps: '' };
  if (trackingType === 'time') return { ...newSet, duration: '' };
  return { ...newSet, distance: '', duration: '' };
}

function ExerciseCard({ exercise, onChange, onEdit, onRemove }) {
  const trackingLabel = TRACKING_OPTIONS.find(
    (option) => option.value === exercise.trackingType
  )?.label;

  function updateSet(setIndex, updatedSet) {
    const updatedSets = exercise.sets.map((set, index) => (
      index === setIndex ? updatedSet : set
    ));
    onChange({ ...exercise, sets: updatedSets });
  }

  function toggleSet(setIndex) {
    const currentSet = exercise.sets[setIndex];
    updateSet(setIndex, { ...currentSet, completed: !currentSet.completed });
  }

  function addSet() {
    onChange({
      ...exercise,
      sets: [...exercise.sets, makeEmptySet(exercise.trackingType)],
    });
  }

  return (
    <article className="exercise-card">
      <div className="exercise-card-heading">
        <div>
          <p className="exercise-muscles">
            {exercise.mainMuscle}
            {exercise.secondaryMuscles.length > 0 && ` · ${exercise.secondaryMuscles.join(', ')}`}
          </p>
          <h2>{exercise.name}</h2>
          <p className="tracking-label">{trackingLabel}</p>
        </div>
        <div className="card-actions">
          <button type="button" className="text-button" onClick={onEdit}>Edit</button>
          <button type="button" className="danger-button" onClick={onRemove}>Remove</button>
        </div>
      </div>

      {exercise.notes && <p className="exercise-notes">{exercise.notes}</p>}

      <div className="sets-list">
        {exercise.sets.map((set, index) => (
          <ExerciseSet
            key={set.id}
            set={set}
            setNumber={index + 1}
            trackingType={exercise.trackingType}
            onChange={(updatedSet) => updateSet(index, updatedSet)}
            onToggle={() => toggleSet(index)}
          />
        ))}
      </div>

      <button type="button" className="secondary-button" onClick={addSet}>+ Add Set</button>
    </article>
  );
}

export default ExerciseCard;
