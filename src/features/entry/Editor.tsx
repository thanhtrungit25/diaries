import React, { FC, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import Markdown from 'markdown-to-jsx';
import { AppDispatch } from '../../store';
import http from '../../services/api';
import { Diary } from '../../interfaces/diary.interface';
import { Entry } from '../../interfaces/entry.interface';
import { setCurrentlyEditing, setCanEdit } from './editorSlice';
import { updateDiary } from '../diary/diariesSlice';
import { updateEntry } from './entriesSlice';

const Editor: FC = () => {
  const { canEdit, currentlyEditing: entry, activeDiaryId } = useSelector(
    (state: any) => state.editor
  );

  const [editedEntry, updateEditedEntry] = useState(entry);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    updateEditedEntry(entry);
  }, [entry]);

  const saveEntry = async () => {
    if (activeDiaryId === null) {
      return Swal.fire({
        titleText: 'Please select a diary.',
        toast: true,
        icon: 'warning',
        position: 'top-end',
      });
    }

    if (entry === null) {
      // Create new entry
      http
        .post<Entry, { diary: Diary; entry: Entry }>(
          `/diaries/entry/${activeDiaryId}`,
          editedEntry
        )
        .then((data) => {
          if (data !== null) {
            const { diary, entry: _entry } = data;
            dispatch(setCurrentlyEditing(_entry));
            dispatch(updateDiary(diary));
          }
        });
    } else {
      // Or update entry
      http
        .put<Entry, Entry>(`/diaries/entry/${entry.id}`, editedEntry)
        .then((_entry) => {
          dispatch(setCurrentlyEditing(_entry));
          dispatch(updateEntry(_entry));
        });
    }

    dispatch(setCanEdit(false));
  };

  return (
    <div className="editor">
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '0.2em',
          paddingBottom: '0.2em',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        {entry && !canEdit ? (
          <h4>
            {entry.title}
            <a
              href="#edit"
              onClick={(e) => {
                e.preventDefault();
                if (entry != null) {
                  dispatch(setCanEdit(true));
                }
              }}
            >
              (Edit)
            </a>
          </h4>
        ) : (
          <input
            value={editedEntry?.title ?? ''}
            disabled={!canEdit}
            onChange={(e) => {
              if (editedEntry) {
                updateEditedEntry({
                  ...editedEntry,
                  title: e.target.value,
                });
              } else {
                updateEditedEntry({
                  title: e.target.value,
                  content: '',
                });
              }
            }}
          />
        )}
      </header>
      {entry && !canEdit ? (
        <Markdown>{entry.content}</Markdown>
      ) : (
        <>
          <textarea
            placeholder="Supports markdonw!"
            disabled={!canEdit}
            value={editedEntry?.content ?? ''}
            onChange={(e) => {
              if (editedEntry) {
                updateEditedEntry({
                  ...editedEntry,
                  content: e.target.value,
                });
              } else {
                updateEditedEntry({
                  title: '',
                  content: e.target.value,
                });
              }
            }}
          />
          <button onClick={saveEntry} disabled={!canEdit}>
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default Editor;
