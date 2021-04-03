import { useState, useEffect } from 'react';
import {
  action,
  thunk,
  actionOn,
  computed,
  thunkOn,
  useStoreActions,
  useStoreState,
} from 'easy-peasy';
import { getSetter, getUpdater } from 'utils/easy-peasy';
import { LevelData, ReplaysSearchByLevel } from 'api';

const asyncProcess = (initVal, get) => {
  const cacheMap = new Map();

  return {
    // the get function mutates this when calling actions.set, etc.
    output: initVal,
    input: undefined,
    _update: action((state, func) => {
      func(state.output);
    }),
    _reset: action((state, payload) => {
      state.output = initVal;
    }),
    _set: action((state, payload) => {
      state.output = { ...state.output, payload };
    }),
    // todo: can actions return values?
    _get: action((state, payload) => {
      return state.output;
    }),
    setInput: action((state, payload) => {
      state.input = payload;
    }),
    onSetInput: thunkOn(
      store => store.setInput,
      async (actions, payload, helpers) => {
        const state = helpers.getState();

        // state.input === payload ?

        actions.set({ loading: true });

        const result = await get(
          state.input,
          {
            set: actions._set,
            get: actions._get,
            update: actions._update,
            reset: actions._reset,
            // unlikely to need?
            setInput: actions.setInput,
          },
          cacheMap,
        );

        actions.set({ loading: false });
      },
    ),
  };
};

const useStoreEffect = (mapStore, withStoreActions) => {
  const store = useStoreActions(mapStore);

  useEffect(() => {
    withStoreActions(store);
  });
};

const ComponentExample = props => {
  const { levelData, replays } = useStoreState(
    store => store.Level.levelProcess.output,
  );

  const { setInput } = useStoreActions(store => store.Level.levelProcess);

  useEffect(() => {
    setInput(props.levelIndex, props.tab);
  });

  useStoreEffect(
    store => store.Level,
    level => level.levelData.setInput(props.levelIndex),
  );
  return <div>hi</div>;
};

const Comp2 = props => {
  const actions = useStoreActions(store => store.Level);

  useEffect(() => {
    actions.helpers.setInput(props.levelIndex, props.tab);
  });

  return <div>hi</div>;
};

const idkYet = (propName, propUpdater, getter) => {
  return {
    cache: '?',
    setInput: action((state, payload) => {}),
    onSetInput: actionOn(
      state => state.setInput,
      async (actions, payload, helpers) => {
        // ..

        const _actions = {
          update: actions[propUpdater],
          set: key => {
            /// ...
          },
        };

        const idk = getter(payload, _actions);
      },
    ),
  };
};

const b = {
  prop: {
    _values: {},
    index: null,
    value: computed(state => {
      return state._values[state.index];
    }),
  },
};

export default {
  output: {
    idk: 123,
  },
  updateOutput: getUpdater('output'),
  helper: idkYet('output', 'updateOutput', async (input, update, state) => {
    update(output => (output = {}));

    const levelData = await LevelData(input.LevelIndex);

    update(output => {
      output.levelData = levelData;
    });
  }),

  levelProcess: asyncProcess(
    {
      levelData: {},
      replays: {},
    },
    async (input, actions, cacheMap) => {
      // const output = actions.get();

      // set levelProcess.output to initial value
      actions.reset();

      const levelData = await LevelData(input.levelIndex);

      actions.set({ levelData });

      // 2nd api request, dependant on first
      const replays = await ReplaysSearchByLevel(levelData.levelIndex);

      actions.set({ replays });
    },
  ),
};
