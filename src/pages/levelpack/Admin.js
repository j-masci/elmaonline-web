/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import styled from 'styled-components';
import {
  Delete as DeleteIcon,
  PlaylistAdd,
  DragHandle,
} from '@material-ui/icons';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Link from 'components/Link';
import Header from 'components/Header';
import UpdateForm from './UpdateForm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ListCell, ListContainer, ListHeader } from 'components/List';
import { ExpandMore } from '@material-ui/icons';

const Admin = ({ records, LevelPack }) => {
  const [search, setSearch] = useState('');
  const {
    levelsFound,
    adminLoading,
    settings: { showLegacy },
  } = useStoreState(state => state.LevelPack);
  const {
    deleteLevel,
    searchLevel,
    addLevel,
    sortLevel,
    sortPack,
  } = useStoreActions(actions => actions.LevelPack);

  useEffect(() => {
    const emptySort = records.filter(r => r.Sort === '');
    if (emptySort.length > 0) {
      sortPack({
        LevelPackIndex: LevelPack.LevelPackIndex,
        levels: records,
        name: LevelPack.LevelPackName,
        showLegacy,
      });
    }
  }, []);

  const onDragEnd = result => {
    if (
      result.destination &&
      result.destination.index !== result.source.index
    ) {
      sortLevel({
        LevelPackIndex: LevelPack.LevelPackIndex,
        levels: records,
        source: result.source,
        destination: result.destination,
        name: LevelPack.LevelPackName,
        showLegacy,
      });
    }
  };

  const isAlreadyAdded = levelId => {
    const find = records.filter(l => l.LevelIndex === levelId);
    return find.length;
  };

  return (
    <Grid container spacing={3} style={{ padding: '0 8px' }}>
      <Grid item xs={12} md={6}>
        <Header h2 mLeft>
          Current levels
        </Header>
        <ListContainer>
          <ListHeader>
            <ListCell width={70}>Filename</ListCell>
            <ListCell width={300}>Level name</ListCell>
            <ListCell width={180}>Remove</ListCell>
            <ListCell>Sort</ListCell>
          </ListHeader>
        </ListContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="levels">
            {provided => (
              <div
                style={{ position: 'relative' }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <ListContainer chin>
                  {records.map((l, index) => (
                    <Draggable
                      key={l.LevelIndex}
                      draggableId={`${l.LevelIndex}${l.Level.LevelName}`}
                      index={index}
                    >
                      {Dragprovided => (
                        <Row
                          key={`${l.LevelIndex}${l.Level.LevelName}`}
                          ref={Dragprovided.innerRef}
                          {...Dragprovided.draggableProps}
                          {...Dragprovided.dragHandleProps}
                        >
                          <ListCell width={70}>{l.Level.LevelName}</ListCell>
                          <ListCell width={300}>{l.Level.LongName}</ListCell>
                          <ListCell width={180}>
                            <Delete
                              onClick={() =>
                                deleteLevel({
                                  LevelIndex: l.LevelIndex,
                                  LevelPackIndex: LevelPack.LevelPackIndex,
                                  name: LevelPack.LevelPackName,
                                  showLegacy,
                                })
                              }
                            />
                          </ListCell>
                          <ListCell>
                            <DragHandle />
                          </ListCell>
                        </Row>
                      )}
                    </Draggable>
                  ))}
                </ListContainer>
                {adminLoading && <Overlay />}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Grid>
      <Grid item xs={12} md={6}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2">Edit Level Pack Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UpdateForm />
          </AccordionDetails>
        </Accordion>
        <br />
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Header h2 mLeft>
              Search Levels
            </Header>
          </AccordionSummary>
          <AccordionDetails style={{ display: 'block' }}>
            <TextBox>
              <TextField
                id="outlined-name"
                label="Filename"
                value={search}
                onChange={e => setSearch(e.target.value)}
                margin="normal"
                variant="outlined"
                fullWidth
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    if (e.target.value === '') {
                      setSearch('');
                    } else if (search.length > 1) {
                      searchLevel({ q: search, ShowLocked: 0 });
                    }
                  }
                  if (e.key === 'Escape') {
                    setSearch('');
                  }
                }}
              />
            </TextBox>
            <ListContainer>
              <ListHeader>
                <ListCell width={70}>Filename</ListCell>
                <ListCell width={300}>Level name</ListCell>
                <ListCell width={180}>Add</ListCell>
              </ListHeader>
              {levelsFound.map(l => (
                <Row color={isAlreadyAdded(l.LevelIndex)} key={l.LevelIndex}>
                  <ListCell width={70}>
                    <Link to={`/levels/${l.LevelIndex}`}>{l.LevelName}</Link>
                  </ListCell>
                  <ListCell width={300}>{l.LongName}</ListCell>
                  <ListCell width={180}>
                    {!isAlreadyAdded(l.LevelIndex) && (
                      <Add
                        onClick={() =>
                          addLevel({
                            LevelIndex: l.LevelIndex,
                            LevelPackIndex: LevelPack.LevelPackIndex,
                            name: LevelPack.LevelPackName,
                            levels: records.length,
                            last: records[records.length - 1],
                            showLegacy,
                          })
                        }
                      />
                    )}
                  </ListCell>
                </Row>
              ))}
            </ListContainer>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

const Overlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: white;
  z-index: 10;
  opacity: 0.8;
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

const TextBox = styled.div`
  margin: 8px;
`;

const Delete = styled(DeleteIcon)`
  cursor: pointer;
`;

const Add = styled(PlaylistAdd)`
  cursor: pointer;
`;

const Row = styled.div`
  display: table-row;
  background: transparent;
  color: ${p => (p.color ? '#b3b3b3' : 'inherit')};
  :hover {
    background: ${p => p.theme.hoverColor};
  }
`;

export default Admin;
