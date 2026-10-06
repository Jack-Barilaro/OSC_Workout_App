const ACTIVE_WORKOUT_KEY = 'osc-active-workout';
const LAST_WORKOUT_KEY = 'osc-last-workout';

export function loadActiveWorkout() {
  try {
    const savedWorkout = localStorage.getItem(ACTIVE_WORKOUT_KEY);
    return savedWorkout ? JSON.parse(savedWorkout) : null;
  } catch (error) {
    console.error('The saved workout could not be loaded.', error);
    return null;
  }
}

export function saveActiveWorkout(workout) {
  localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(workout));
}

export function clearActiveWorkout() {
  localStorage.removeItem(ACTIVE_WORKOUT_KEY);
}

export function finishActiveWorkout(workout) {
  const finishedWorkout = {
    ...workout,
    endTime: new Date().toISOString(),
  };

  localStorage.setItem(LAST_WORKOUT_KEY, JSON.stringify(finishedWorkout));
  clearActiveWorkout();
}
