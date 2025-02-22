import React from 'react';
import styled from 'styled-components';
import { has } from 'lodash';
import Header from 'components/Header';
import code19 from 'images/hacktober/code19.png';
import code20 from 'images/hacktober/code20.png';

const images = {
  19: code19,
  20: code20,
};

const titles = {
  19: 'Participated in 2019 EOL Hacktober',
  20: 'Participated in 2020 EOL Hacktober',
};

const a = {
  2: ['19', '20'],
  38: ['19'],
  6879: ['19'],
  144: ['20'],
  95: ['20'],
  137: ['20'],
};

const AchievementsHacktober = ({ KuskiIndex }) => {
  return (
    <>
      {has(a, KuskiIndex) && (
        <>
          <Header h3>Hacktober achievements</Header>
          <Container>
            {a[KuskiIndex].map(x => (
              <img key={x} src={images[x]} alt={x} title={titles[x]} />
            ))}
          </Container>
        </>
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  img {
    padding: 8px;
  }
`;

export default AchievementsHacktober;
