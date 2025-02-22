import React, { useState } from 'react';
import { useStoreState, useStoreActions, useStoreRehydrated } from 'easy-peasy';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import Recplayer from 'components/Recplayer';
import Play from 'components/Play';
import styled from 'styled-components';
import config from 'config';

const RecView = props => {
  const [play, setPlay] = useState(
    navigator.userAgent.toLowerCase().indexOf('firefox') === -1,
  );

  const isRehydrated = useStoreRehydrated();

  const { isWindow, BattleIndex, levelIndex, battleStatus } = props;

  const { toggleRecAutoplay } = useStoreActions(actions => actions.Battle);

  const {
    settings: { autoPlayRecs },
  } = useStoreState(state => state.Battle);

  return (
    <div>
      {!isRehydrated ? null : (
        <PlayerContainer>
          <div className="player">
            {play ? (
              <>
                {isWindow && battleStatus !== 'Queued' && (
                  <Recplayer
                    rec={`${config.dlUrl}battlereplay/${BattleIndex}`}
                    lev={`${config.dlUrl}level/${levelIndex}`}
                    autoPlay={autoPlayRecs ? 'if-visible' : 'no'}
                    controls
                  />
                )}
              </>
            ) : (
              <Play type="replay" onClick={() => setPlay(true)} />
            )}
          </div>
          <StyledFormControlLabel
            control={
              <Checkbox
                onChange={() => toggleRecAutoplay()}
                checked={autoPlayRecs}
                color="primary"
                size="small"
              />
            }
            label="Autoplay replays"
          />
        </PlayerContainer>
      )}
    </div>
  );
};

const PlayerContainer = styled.div`
  width: 60%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
  .player {
    background: ${p => p.theme.pageBackground};
    height: 550px;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 1650px) {
      height: 450px;
    }
    @media screen and (max-width: 500px) {
      height: 400px;
    }
  }
  @media screen and (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  span {
    font-size: 14px;
  }
`;

export default RecView;
