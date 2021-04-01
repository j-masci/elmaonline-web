import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Layout from './components/Layout';

export const store = {
  thing: 123,
};

export const Comp = () => {
  const { thing } = useStoreState(store => store.Sandbox);

  return (
    <Layout t="sandbox">
      <div>{thing}</div>
    </Layout>
  );
};
