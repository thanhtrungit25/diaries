import React, { FC, useState } from 'react';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import http from '../../services/api';
import { Diary } from '../../interfaces/diary.interface';
import { Entry } from '../../interfaces/entry.interface';
import { setCurrentlyEditing } from './editorSlice';
import { updateDiary } from '../diary/diariesSlice';
import { updateEntry } from './entriesSlice';

const Editor: FC = () => {
  const { canEdit, currentlyEditing: entry, activeDiaryId } = useSelector(
    (state: any) => state.editor
  );

  const [editedEntry, updateEditedEntry] = useState(entry);
  const dispatch = useDispatch<AppDispatch>();

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

    updateEditedEntry({
      ...editedEntry,
      title: '',
      content: '',
    });
  };

  return (
    <div className="editor">
      <header>
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
      </header>
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
    </div>
  );
};

export default Editor;
