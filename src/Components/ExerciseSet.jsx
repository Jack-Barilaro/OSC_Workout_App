import React from 'react';

function NumberField({ label, value, onChange, step = '1' }) {
  return (
    <label className="set-field">
      <span>{label}</span>
      <input type="number" min="0" step={step} value={value} onChange={onChange} />
    </label>
  );
}

function ExerciseSet({ set, setNumber, trackingType, onChange, onToggle }) {
  function updateValue(field, value) {
    onChange({ ...set, [field]: value });
  }

  return (
    <div className={set.completed ? 'exercise-set completed-set' : 'exercise-set'}>
      <strong>Set {setNumber}</strong>

      {trackingType === 'weight-reps' && (
        <NumberField label="Weight (lb)" value={set.weight} onChange={(event) => updateValue('weight', event.target.value)} step="0.5" />
      )}
      {(trackingType === 'weight-reps' || trackingType === 'reps') && (
        <NumberField label="Reps" value={set.reps} onChange={(event) => updateValue('reps', event.target.value)} />
      )}
      {(trackingType === 'time' || trackingType === 'distance') && (
        <NumberField label="Time (seconds)" value={set.duration} onChange={(event) => updateValue('duration', event.target.value)} />
      )}
      {trackingType === 'distance' && (
        <NumberField label="Distance (miles)" value={set.distance} onChange={(event) => updateValue('distance', event.target.value)} step="0.01" />
      )}

      <label className="complete-control">
        <input type="checkbox" checked={set.completed} onChange={onToggle} />
        Complete
      </label>
    </div>
  );
}

export default ExerciseSet;
