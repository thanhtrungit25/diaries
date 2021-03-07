import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Swal from 'sweetalert2';
import http from '../../services/api';
import { addDiary } from './diariesSlice';
import { Diary } from '../../interfaces/diary.interface';
import { User } from '../../interfaces/user.interface';
import { AppDispatch } from '../../store';
import { setUser } from '../auth/userSlice';
import DiaryTile from './DiaryTile';
import DiaryEntriesList from './DiaryEntriesList';

const Diaries: FC = (props) => {
  const user = useSelector((state: any) => state.user);
  const diaries = useSelector((state: any) => state.diaries);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchDiaries = async () => {
      if (user) {
        http.get<null, Diary[]>(`/diaries/${user.id}`).then((data) => {
          if (data && data.length) {
            dispatch(addDiary(data));
          }
        });
      }
    };
    fetchDiaries();
  }, [user, dispatch]);

  const createDiary = async () => {
    const result: any = await Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2'],
    }).queue([
      {
        input: 'text',
        titleText: 'Diary title',
      },
      {
        input: 'radio',
        titleText: 'Private or public diary?',
        inputOptions: {
          private: 'Private',
          public: 'Public',
        },
        inputValue: 'private',
      },
    ]);
    if (result.value) {
      const [title, type] = result.value;
      const { diary, user: _user } = await http.post<
        Partial<Diary>,
        {
          diary: Diary;
          user: User;
        }
      >('/diaries', {
        title,
        type,
        userId: user.id,
      });
      if (diary && user) {
        dispatch(addDiary([diary] as Diary[]));
        dispatch(addDiary([diary] as Diary[]));
        dispatch(setUser(_user));

        return Swal.fire({
          titleText: 'All done!',
          confirmButtonText: 'OK!',
        });
      }
    }

    Swal.fire({
      titleText: 'Cancelled',
    });
  };

  return (
    <div style={{ padding: '1em 0.4em' }}>
      <Switch>
        <Route path="/diary/:id">
          <DiaryEntriesList />
        </Route>
        <Route path="/">
          <button onClick={createDiary}>Create New</button>
          {diaries.map((diary: Diary, idx: number) => (
            <DiaryTile key={idx} diary={diary} />
          ))}
        </Route>
      </Switch>
    </div>
  );
};

export default Diaries;
