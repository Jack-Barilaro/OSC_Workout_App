import {
  clearActiveWorkout,
  finishActiveWorkout,
  loadActiveWorkout,
  saveActiveWorkout,
} from './workoutStorage';

const ACTIVE_WORKOUT_KEY = 'osc-active-workout';
const LAST_WORKOUT_KEY = 'osc-last-workout';

beforeEach(() => {
  localStorage.clear();
});

test('saves and loads the active workout', () => {
  const workout = {
    id: 'workout-1',
    name: 'Push Day',
    startTime: '2026-10-06T12:00:00.000Z',
    exercises: [],
  };

  saveActiveWorkout(workout);

  expect(loadActiveWorkout()).toEqual(workout);
});

test('finishing a workout clears the active draft and saves the result', () => {
  const workout = {
    id: 'workout-1',
    name: 'Push Day',
    startTime: '2026-10-06T12:00:00.000Z',
    exercises: [],
  };

  saveActiveWorkout(workout);
  finishActiveWorkout(workout);

  const finishedWorkout = JSON.parse(localStorage.getItem(LAST_WORKOUT_KEY));
  expect(localStorage.getItem(ACTIVE_WORKOUT_KEY)).toBeNull();
  expect(finishedWorkout.name).toBe('Push Day');
  expect(finishedWorkout.endTime).toBeTruthy();
});

test('clears the active workout before starting over', () => {
  saveActiveWorkout({ id: 'old-workout', exercises: [] });

  clearActiveWorkout();

  expect(loadActiveWorkout()).toBeNull();
});
