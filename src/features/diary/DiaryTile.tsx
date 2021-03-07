import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Diary } from '../../interfaces/diary.interface';
import http from '../../services/api';
import { updateDiary } from './diariesSlice';
import { AppDispatch } from '../../store';
import {
  setCanEdit,
  setCurrentlyEditing,
  setActiveDiaryId,
} from '../entry/editorSlice';

interface Props {
  diary: Diary;
}

const buttonStyle: React.CSSProperties = {
  fontSize: '0.7em',
  margin: '0 0.5em',
};

const DiaryTile: FC<Props> = (props) => {
  const [diary, setDiary] = useState(props.diary);
  const [isEditing, setIsEditing] = useState(false);
  const totalEntries = props.diary?.entryIds?.length;
  console.log(totalEntries);

  const dispatch = useDispatch<AppDispatch>();

  const saveChange = () => {
    console.log('saveChange', diary);
    http
      .put<Diary, Diary>(`/diaries/${diary.id}`, diary)
      .then((diary) => {
        if (diary) {
          dispatch(updateDiary(diary));

          Swal.fire({
            titleText: 'Saved!',
            toast: true,
            timer: 3000,
            position: 'top-end',
          });
        }
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  const addNewEntry = () => {
    dispatch(setCanEdit(true));
    dispatch(setActiveDiaryId(diary.id));
    dispatch(setCurrentlyEditing(null));
  };

  return (
    <div className="diary-tile">
      <h2
        className="title"
        title="Click to edit"
        onClick={() => setIsEditing(true)}
        style={{
          cursor: 'pointer',
        }}
      >
        {isEditing ? (
          <input
            value={diary.title}
            onChange={(e) => {
              setDiary({
                ...diary,
                title: e.target.value,
              });
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                saveChange();
              }
            }}
          />
        ) : (
          <span>{diary.title}</span>
        )}
      </h2>

      <p className="subtitle">{totalEntries ?? '0'} saved entries</p>

      <div style={{ display: 'flex' }}>
        <button style={buttonStyle} onClick={addNewEntry}>
          Add New Entry
        </button>
        <Link to={`diary/${diary.id}`} style={{ width: '100%' }}>
          <button className="secondary" style={buttonStyle}>
            View all &rarr;
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DiaryTile;
