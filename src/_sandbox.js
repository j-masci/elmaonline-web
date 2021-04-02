import React, { useEffect, useState } from 'react';
import {
  useStoreState,
  useStoreActions,
  action,
  thunk,
  computed,
} from 'easy-peasy';
import Layout from './components/Layout';

const ascynProp = (initialValue, getter) => {
  return {
    loading: false,
    value: initialValue,
    desiredInput: null,
    currentInput: null,
    setInput: action((state, payload) => {
      state.desiredInput = state;
    }),
    updateState: action((state, func) => {
      func(state);
    }),
    fetch: thunk(async (actions, payload, helpers) => {
      actions.updateState(state => {
        state.loading = true;
      });

      const value = await getter(payload);

      actions.updateState(state => {
        state.loading = false;
      });
    }),
  };
};

export const store = {
  thing: 123,
  nested: {
    a: 10,
    b: 20,
  },
};

export const Comp = () => {
  const state = useStoreState(store => store.Sandbox);
  const actions = useStoreActions(store => store);

  console.log(actions);

  useEffect(() => {
    actions.Sandbox.shit(900);
  });

  return (
    <Layout t="sandbox">
      <div>{state.thing}</div>
      <div>{state.fuck}</div>
    </Layout>
  );
};
