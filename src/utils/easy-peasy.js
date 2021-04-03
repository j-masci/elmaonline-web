import { action } from 'easy-peasy';

// an action which can update any data in the store via a callback
export const getUpdater = () => {
  return action((state, func) => {
    func(state);
  });
};

export const getSetter = key => {
  return action((state, payload) => {
    state[key] = payload;
  });
};
