import React, { useEffect, useState } from 'react';

export const MUSCLE_OPTIONS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Forearms',
  'Quadriceps',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Core',
  'Full Body',
  'Cardio',
  'Other',
];

export const TRACKING_OPTIONS = [
  { value: 'weight-reps', label: 'Weight and reps' },
  { value: 'reps', label: 'Reps only' },
  { value: 'time', label: 'Time' },
  { value: 'distance', label: 'Distance' },
];

const EMPTY_FORM = {
  name: '',
  mainMuscle: '',
  secondaryMuscles: [],
  trackingType: 'weight-reps',
  numberOfSets: 3,
  notes: '',
};

function makeSet(trackingType) {
  const newSet = {
    id: crypto.randomUUID(),
    completed: false,
  };

  if (trackingType === 'weight-reps') return { ...newSet, weight: '', reps: '' };
  if (trackingType === 'reps') return { ...newSet, reps: '' };
  if (trackingType === 'time') return { ...newSet, duration: '' };
  return { ...newSet, distance: '', duration: '' };
}

function ExerciseForm({ exerciseToEdit, onSave, onCancel }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (exerciseToEdit) {
      setFormData({
        ...exerciseToEdit,
        numberOfSets: exerciseToEdit.sets.length,
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [exerciseToEdit]);

  function updateField(event) {
    const { name, value } = event.target;
    setFormData((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function updateSecondaryMuscles(event) {
    const selectedMuscles = Array.from(event.target.selectedOptions, (option) => option.value);
    setFormData((currentForm) => ({ ...currentForm, secondaryMuscles: selectedMuscles }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim() || !formData.mainMuscle) {
      setError('Exercise name and main muscle are required.');
      return;
    }

    const requestedSetCount = Number(formData.numberOfSets);
    if (requestedSetCount < 1 || requestedSetCount > 20) {
      setError('Number of sets must be between 1 and 20.');
      return;
    }

    const existingSets = exerciseToEdit?.sets || [];
    const trackingTypeChanged = exerciseToEdit?.trackingType !== formData.trackingType;
    const reusableSets = trackingTypeChanged ? [] : existingSets.slice(0, requestedSetCount);
    const sets = [...reusableSets];

    while (sets.length < requestedSetCount) {
      sets.push(makeSet(formData.trackingType));
    }

    onSave({
      id: exerciseToEdit?.id || crypto.randomUUID(),
      name: formData.name.trim(),
      mainMuscle: formData.mainMuscle,
      secondaryMuscles: formData.secondaryMuscles.filter(
        (muscle) => muscle !== formData.mainMuscle
      ),
      trackingType: formData.trackingType,
      notes: formData.notes.trim(),
      sets,
    });
  }

  return (
    <form className="exercise-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">Custom exercise</p>
          <h2>{exerciseToEdit ? 'Edit Exercise' : 'Create Exercise'}</h2>
        </div>
        <button type="button" className="text-button" onClick={onCancel}>Cancel</button>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-grid">
        <label>
          Exercise name <span aria-hidden="true">*</span>
          <input
            name="name"
            value={formData.name}
            onChange={updateField}
            placeholder="Example: Bench Press"
            autoFocus
          />
        </label>

        <label>
          Main muscle <span aria-hidden="true">*</span>
          <select name="mainMuscle" value={formData.mainMuscle} onChange={updateField}>
            <option value="">Select a muscle</option>
            {MUSCLE_OPTIONS.map((muscle) => <option key={muscle}>{muscle}</option>)}
          </select>
        </label>

        <label>
          Tracking type
          <select name="trackingType" value={formData.trackingType} onChange={updateField}>
            {TRACKING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label>
          Number of sets
          <input
            type="number"
            name="numberOfSets"
            min="1"
            max="20"
            value={formData.numberOfSets}
            onChange={updateField}
          />
        </label>

        <label className="full-width">
          Secondary muscles <span className="label-note">(Command/Ctrl-click to select several)</span>
          <select
            multiple
            name="secondaryMuscles"
            value={formData.secondaryMuscles}
            onChange={updateSecondaryMuscles}
          >
            {MUSCLE_OPTIONS.map((muscle) => <option key={muscle}>{muscle}</option>)}
          </select>
        </label>

        <label className="full-width">
          Notes <span className="label-note">(optional)</span>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={updateField}
            placeholder="Form reminders, equipment, or other details"
            rows="3"
          />
        </label>
      </div>

      <button className="primary-button" type="submit">
        {exerciseToEdit ? 'Save Changes' : 'Add Exercise'}
      </button>
    </form>
  );
}

export default ExerciseForm;
