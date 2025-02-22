/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  TextField,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Chip,
} from '@material-ui/core';
import Dropzone from 'components/Dropzone';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Alert from 'components/Alert';
import Link from 'components/Link';
import config from 'config';
import { authToken } from 'utils/nick';
import { xor } from 'lodash';

const Upload = ({ onUpload, filetype }) => {
  const {
    insertReplay,
    updateReplay,
    setError,
    getKuskiByName,
    getTagOptions,
    cleanup,
  } = useStoreActions(actions => actions.Upload);
  const { inserted, updated, error, kuskiInfo, tagOptions } = useStoreState(
    state => state.Upload,
  );
  const { loggedIn, username, userid } = useStoreState(state => state.Login);
  const [files, setFiles] = useState([]);
  const [fileInfo, setFileInfo] = useState({});
  const [duplicate, setDuplicate] = useState(false);
  const [duplicateText, setDuplicateText] = useState('');
  const [duplicateOptions, setDuplicateOptions] = useState(['okay']);
  const [duplicateReplayIndex, setDuplicateReplayIndex] = useState(0);
  const [uploaded, setUploaded] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [update, setUpdate] = useState(0);

  const onDrop = newFiles => {
    const newFileInfo = {};
    newFiles.forEach((file, index) => {
      newFileInfo[file.name] = {
        name: file.name,
        unlisted: false,
        tas: false,
        bug: false,
        nitro: false,
        drivenBy: '',
        error: 'Kuski not found',
        index,
        kuskiIndex: 0,
        comment: '',
        tags: [],
      };
      if (loggedIn) {
        newFileInfo[file.name].drivenBy = username;
        newFileInfo[file.name].error = '';
        newFileInfo[file.name].kuskiIndex = userid;
      }
    });
    setFileInfo(newFileInfo);
    setFiles(newFiles);
    setDuplicate(false);
    setDuplicateReplayIndex(0);
    setUploaded([]);
  };

  useEffect(() => {
    getTagOptions();
    return () => {
      setUploaded([]);
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (inserted) {
      if (inserted.RecFileName) {
        if (fileInfo[inserted.RecFileName]) {
          if (fileInfo[inserted.RecFileName].index > -1) {
            const newFiles = files.slice();
            newFiles.splice(fileInfo[inserted.RecFileName].index, 1);
            setFiles(newFiles);
          }
          const newUploaded = uploaded.slice();
          const fullUrl = `${location.protocol}//${location.hostname}${
            location.port ? `:${location.port}` : ''
          }/r/${inserted.UUID}`;
          newUploaded.push({
            RecFileName: inserted.RecFileName,
            UUID: inserted.UUID,
            url: fullUrl,
          });
          setUploaded(newUploaded);
          if (onUpload) {
            onUpload();
          }
        }
      }
    }
  }, [inserted]);

  const handleUnlisted = (name, event) => {
    const newFileInfo = fileInfo;
    newFileInfo[name].unlisted = event.target.checked;
    setFileInfo(newFileInfo);
    setUpdate(Math.random());
  };

  const handleComment = (name, event) => {
    const newFileInfo = fileInfo;
    newFileInfo[name].comment = event.target.value;
    setFileInfo(newFileInfo);
    setUpdate(Math.random());
  };

  const handleTags = (name, value) => {
    const newFileInfo = fileInfo;
    newFileInfo[name].tags = xor(newFileInfo[name].tags, [value]);
    setFileInfo(newFileInfo);
    setUpdate(Math.random());
  };

  useEffect(() => {
    const newFileInfo = fileInfo;
    if (kuskiInfo) {
      if (kuskiInfo.KuskiIndex && kuskiInfo.RecFileName) {
        newFileInfo[kuskiInfo.RecFileName].kuskiIndex = kuskiInfo.KuskiIndex;
        newFileInfo[kuskiInfo.RecFileName].error = '';
      } else if (kuskiInfo.RecFileName) {
        newFileInfo[kuskiInfo.RecFileName].kuskiIndex = 0;
        newFileInfo[kuskiInfo.RecFileName].error = 'Kuski not found';
      }
    }
    setFileInfo(newFileInfo);
    setUpdate(Math.random());
  }, [kuskiInfo]);

  const handleDrivenBy = (name, event) => {
    const newFileInfo = fileInfo;
    newFileInfo[name].drivenBy = event.target.value;
    setFileInfo(newFileInfo);
    getKuskiByName({ Kuski: event.target.value, RecFileName: name });
    setUpdate(Math.random());
  };

  useEffect(() => {
    if (updated) {
      if (updated.ReplayIndex) {
        if (onUpload) {
          onUpload();
        }
      }
    }
  }, [updated]);

  const handleAlert = i => {
    setFiles([]);
    setError('');
    setDuplicate(false);
    setDuplicateReplayIndex(0);
    if (i === 1) {
      updateReplay(duplicateReplayIndex);
    }
  };

  const upload = () => {
    files.forEach(file => {
      const data = new FormData();
      data.append('file', file);
      data.append('filename', file.name);
      fetch(`${config.url}upload/replay`, {
        method: 'POST',
        body: data,
        headers: {
          Authorization: authToken(),
        },
      }).then(response => {
        response.json().then(body => {
          if (body.error) {
            if (body.error === 'Duplicate') {
              setError(body.error);
              setDuplicate(true);
              const oldUnlisted = body.replayInfo[0].Unlisted;
              const newUnlisted = +fileInfo[body.file].unlisted;
              if (oldUnlisted === newUnlisted) {
                setDuplicateText(
                  'Replay already in the database. Upload failed.',
                );
                setDuplicateOptions(['okay']);
              } else if (oldUnlisted === 0 && newUnlisted === 1) {
                setDuplicateText(
                  'Replay already public in database. Upload failed.',
                );
                setDuplicateOptions(['okay']);
              } else if (oldUnlisted === 1 && newUnlisted === 0) {
                setDuplicateText(
                  'Replay already in database, but currently Unlisted. Would you like to make it public?',
                );
                setDuplicateOptions(['Cancel upload', 'Yes']);
                setDuplicateReplayIndex(body.replayInfo[0].ReplayIndex);
              }
            } else if (body.error && body.error.code) {
              if (body.error.code === 'ENOENT' && body.error.errno === -2) {
                setError('Filename too long.');
              }
            } else {
              setError(body.error.toString());
            }
          } else {
            insertReplay({
              UploadedBy: 0,
              UUID: body.uuid,
              RecFileName: body.file,
              Uploaded: Math.floor(Date.now() / 1000),
              ReplayTime: body.time,
              Finished: body.finished,
              LevelIndex: body.LevelIndex,
              Unlisted:
                body.uuid.substring(0, 5) === 'local'
                  ? 1
                  : +fileInfo[body.file].unlisted,
              DrivenBy: fileInfo[body.file].kuskiIndex,
              TAS: +fileInfo[body.file].tas,
              Bug: +fileInfo[body.file].bug,
              Nitro: +fileInfo[body.file].nitro,
              Comment: fileInfo[body.file].comment,
              MD5: body.MD5,
              DrivenByText: fileInfo[body.file].drivenBy,
              Tags: fileInfo[body.file].tags,
            });
          }
        });
      });
    });
  };

  return (
    <>
      <section>
        <div className="dropzone">
          <Dropzone filetype={filetype} error={error} onDrop={e => onDrop(e)} />
        </div>
        {uploaded &&
          uploaded.map(u => (
            <UploadCard key={u.RecFileName}>
              <CardContent>
                {u.RecFileName}
                <Link to={`/r/${u.UUID}`}>
                  <div>{u.url}</div>
                </Link>
              </CardContent>
            </UploadCard>
          ))}
        {!files
          ? '<div>None..</div>'
          : files.map(rec => (
              <React.Fragment key={rec.name}>
                {fileInfo[rec.name] && (
                  <UploadCard key={rec.name}>
                    <CardContent>
                      {rec.name}
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <div>
                            <TextField
                              id="DrivenBy"
                              label="Driven by"
                              value={fileInfo[rec.name].drivenBy}
                              onChange={e => handleDrivenBy(rec.name, e)}
                              margin="normal"
                              helperText={fileInfo[rec.name].error}
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <div>
                            <TextField
                              id="Comment"
                              multiline
                              label="Comment"
                              value={fileInfo[rec.name].comment}
                              onChange={e => handleComment(rec.name, e)}
                              margin="normal"
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography color="textSecondary">Tags</Typography>
                          {tagOptions.map(option => {
                            if (fileInfo[rec.name].tags.includes(option)) {
                              return (
                                <Chip
                                  label={option.Name}
                                  onDelete={() => handleTags(rec.name, option)}
                                  color="primary"
                                  style={{ margin: 4 }}
                                />
                              );
                            } else {
                              return (
                                <Chip
                                  label={option.Name}
                                  onClick={() => handleTags(rec.name, option)}
                                  style={{ margin: 4 }}
                                />
                              );
                            }
                          })}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <div>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={fileInfo[rec.name].unlisted}
                                  onChange={e => handleUnlisted(rec.name, e)}
                                  value="unlisted"
                                  color="primary"
                                />
                              }
                              label="Unlisted"
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </UploadCard>
                )}
              </React.Fragment>
            ))}
        <UploadButtonContainer container>
          <Grid item xs={12}>
            {files.length > 0 && (
              <>
                <Button
                  onClick={() => {
                    upload();
                  }}
                  style={{ float: 'right' }}
                  variant="contained"
                  color="primary"
                >
                  Upload
                </Button>
                <Button
                  onClick={() => {
                    setFiles([]);
                    setError('');
                    setDuplicate(false);
                    setDuplicateReplayIndex(0);
                  }}
                  style={{ float: 'right', marginRight: '8px' }}
                  variant="contained"
                >
                  Cancel
                </Button>
              </>
            )}
          </Grid>
        </UploadButtonContainer>
      </section>
      <Alert
        title="Duplicate replay file"
        open={duplicate}
        text={duplicateText}
        options={duplicateOptions}
        onClose={i => handleAlert(i)}
      />
    </>
  );
};

const UploadCard = styled(Card)`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const UploadButtonContainer = styled(Grid)`
  margin-top: 8px;
`;

Upload.propTypes = {
  onUpload: PropTypes.func,
  filetype: PropTypes.string.isRequired,
};

Upload.defaultProps = {
  onUpload: null,
};

export default Upload;
