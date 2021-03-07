import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { AppDispatch } from '../../store';
import http from '../../services/api';
import { Entry } from '../../interfaces/entry.interface';
import { setEntries } from '../entry/entriesSlice';
import { setCurrentlyEditing, setCanEdit } from '../entry/editorSlice';

const DiaryEntriesList: FC = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { entries } = useSelector((state: any) => state);
  const params: any = useParams();

  useEffect(() => {
    const fetchEntries = async () => {
      if (params && params.id) {
        http
          .get<null, { entries: Entry[] }>(`/diaries/entries/${params.id}`)
          .then(({ entries: _entries }) => {
            dispatch(setEntries(_entries));
          });
      }
    };
    fetchEntries();
  }, [params, dispatch]);

  return (
    <div className="entries">
      <header>
        <Link to="/">
          <h3>← Go Back</h3>
        </Link>
      </header>
      <ul>
        {entries.map((entry: Entry) => (
          <li
            key={entry.id}
            onClick={() => {
              dispatch(setCurrentlyEditing(entry));
              dispatch(setCanEdit(true));
            }}
          >
            {entry.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiaryEntriesList;
