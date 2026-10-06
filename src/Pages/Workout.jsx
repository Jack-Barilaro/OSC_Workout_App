import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExerciseCard from '../Components/ExerciseCard';
import ExerciseForm from '../Components/ExerciseForm';
import { finishActiveWorkout, loadActiveWorkout, saveActiveWorkout } from '../utils/workoutStorage';
import './Workout.css';

function createWorkout() {
  return {
    id: crypto.randomUUID(),
    name: '',
    startTime: new Date().toISOString(),
    exercises: [],
  };
}

function formatElapsedTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

function Workout() {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(() => loadActiveWorkout() || createWorkout());
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    saveActiveWorkout(workout);
  }, [workout]);

  useEffect(() => {
    function updateTimer() {
      const secondsSinceStart = Math.floor(
        (Date.now() - new Date(workout.startTime).getTime()) / 1000
      );
      setElapsedSeconds(Math.max(0, secondsSinceStart));
    }

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [workout.startTime]);

  function openNewExerciseForm() {
    setExerciseToEdit(null);
    setShowExerciseForm(true);
  }

  function saveExercise(exercise) {
    setWorkout((currentWorkout) => {
      const alreadyExists = currentWorkout.exercises.some((item) => item.id === exercise.id);
      const exercises = alreadyExists
        ? currentWorkout.exercises.map((item) => item.id === exercise.id ? exercise : item)
        : [...currentWorkout.exercises, exercise];
      return { ...currentWorkout, exercises };
    });
    setExerciseToEdit(null);
    setShowExerciseForm(false);
  }

  function updateExercise(updatedExercise) {
    setWorkout((currentWorkout) => ({
      ...currentWorkout,
      exercises: currentWorkout.exercises.map((exercise) => (
        exercise.id === updatedExercise.id ? updatedExercise : exercise
      )),
    }));
  }

  function editExercise(exercise) {
    setExerciseToEdit(exercise);
    setShowExerciseForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function removeExercise(exerciseId) {
    const shouldRemove = window.confirm('Remove this exercise from the workout?');
    if (!shouldRemove) return;

    setWorkout((currentWorkout) => ({
      ...currentWorkout,
      exercises: currentWorkout.exercises.filter((exercise) => exercise.id !== exerciseId),
    }));
  }

  function finishWorkout() {
    if (workout.exercises.length === 0) return;
    const shouldFinish = window.confirm('Finish this workout and return home?');
    if (!shouldFinish) return;

    finishActiveWorkout(workout);
    navigate('/');
  }

  return (
    <main className="workout-page">
      <header className="workout-header">
        <div>
          <p className="eyebrow">Active workout</p>
          <h1>Build Your Workout</h1>
          <p className="workout-timer" aria-label={`Workout time ${formatElapsedTime(elapsedSeconds)}`}>
            {formatElapsedTime(elapsedSeconds)}
          </p>
        </div>
        <button
          type="button"
          className="finish-button"
          disabled={workout.exercises.length === 0}
          onClick={finishWorkout}
        >
          Finish Workout
        </button>
      </header>

      <label className="workout-name-field">
        Workout name <span>(optional)</span>
        <input
          value={workout.name}
          onChange={(event) => setWorkout({ ...workout, name: event.target.value })}
          placeholder="Example: Push Day"
        />
      </label>

      {showExerciseForm && (
        <ExerciseForm
          exerciseToEdit={exerciseToEdit}
          onSave={saveExercise}
          onCancel={() => {
            setShowExerciseForm(false);
            setExerciseToEdit(null);
          }}
        />
      )}

      {!showExerciseForm && (
        <button type="button" className="primary-button add-exercise-button" onClick={openNewExerciseForm}>
          + Add Exercise
        </button>
      )}

      {workout.exercises.length === 0 && !showExerciseForm ? (
        <section className="empty-workout">
          <h2>No exercises yet</h2>
          <p>Add your first custom exercise to start building this workout.</p>
        </section>
      ) : (
        <section className="exercise-list" aria-label="Workout exercises">
          {workout.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onChange={updateExercise}
              onEdit={() => editExercise(exercise)}
              onRemove={() => removeExercise(exercise.id)}
            />
          ))}
        </section>
      )}
    </main>
  );
}

export default Workout;
