import React from 'react';
import { useStoreState } from 'easy-peasy';
import Loading from 'components/Loading';
import Header from 'components/Header';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';

const Kinglist = ({ highlight, highlightWeeks }) => {
  const { kinglist, recordsLoading } = useStoreState(state => state.LevelPack);

  if (recordsLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header h2 mLeft>
        Kinglist
      </Header>
      <ListContainer>
        <ListHeader>
          <ListCell width={70}>#</ListCell>
          <ListCell width={320}>Player</ListCell>
          <ListCell width={200}>Points</ListCell>
          <ListCell />
        </ListHeader>
        {kinglist.length > 0 && (
          <>
            {kinglist
              .sort((a, b) => b.points - a.points)
              .map((r, no) => (
                <ListRow key={r.KuskiIndex}>
                  <ListCell width={70}>{no + 1}</ListCell>
                  <ListCell width={320}>{r.KuskiData.Kuski}</ListCell>
                  <ListCell
                    width={180}
                    highlight={r.TimeIndex >= highlight[highlightWeeks]}
                  >
                    {r.points}
                  </ListCell>
                  <ListCell />
                </ListRow>
              ))}
          </>
        )}
      </ListContainer>
    </>
  );
};

export default Kinglist;
