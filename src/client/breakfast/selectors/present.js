

export function getPresentState(state) {
  const presentState = {};
  Object.keys(state).forEach((key) => {
    if (state[key].present) presentState[key] = state[key].present;
    else presentState[key] = state[key];
  });

  return presentState;
}
