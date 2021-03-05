import { Request, Response } from 'miragejs';
import { handleErrors } from '../server';
import { Diary } from '../../../interfaces/diary.interface';
import { Entry } from '../../../interfaces/entry.interface';
import dayjs from 'dayjs';
import { User } from '../../../interfaces/user.interface';

export const create = (
  schema: any,
  req: Request
): { user: User; diary: Diary } | Response => {
  try {
    const { title, type, userId } = JSON.parse(
      req.requestBody
    ) as Partial<Diary>;

    const exUser = schema.users.findBy({ id: userId });
    if (!exUser) {
      return handleErrors(null, 'No such user exists.');
    }

    const now = dayjs().format();
    const diary = exUser.createDiary({
      title,
      type,
      createdAt: now,
      updatedAt: now,
    });

    return {
      user: {
        ...exUser.attrs,
      },
      diary: diary.attrs,
    };
  } catch (error) {
    return handleErrors(error, 'Failed to create Diary');
  }
};

export const addEntry = (
  schema: any,
  req: Request
): { diary: Diary; entry: Entry } | Response => {
  try {
    const diary = schema.diaries.find(parseInt(req.params.id));
    const { title, content } = JSON.parse(req.requestBody) as Partial<Entry>;

    const now = dayjs().format();
    const entry = diary.createEntry({
      title,
      content,
      createdAt: now,
      updatedAt: now,
    });

    diary.update({
      ...diary.attrs,
      updateAt: now,
    });

    return {
      diary: diary.attrs,
      entry: entry.attrs,
    };
  } catch (error) {
    return handleErrors(error, 'Failed to create entry.');
  }
};

export const getDiaries = (schema: any, req: Request): Diary[] | Response => {
  try {
    const user = schema.users.find(parseInt(req.params.id));
    return user.diary as Diary[];
  } catch (error) {
    return handleErrors(error, 'Count not get user diaries.');
  }
};

export const getEntries = (schema: any, req: Request): Entry[] | Response => {
  try {
    const diary = schema.diaries.find(parseInt(req.params.id));
    return diary.entry as Entry[];
  } catch (error) {
    return handleErrors(error, 'Count not get diary entries.');
  }
};

export const updateDiary = (schema: any, req: Request): Diary | Response => {
  try {
    const diary = schema.diaries.find(parseInt(req.params.id));
    const data = JSON.parse(req.requestBody) as Partial<Diary>;
    const now = dayjs().format();

    diary.update({
      ...data,
      updatedAt: now,
    });

    return diary.attrs as Diary;
  } catch (error) {
    return handleErrors(error, 'Failed to update diary');
  }
};

export const updateEntry = (schema: any, req: Request): Entry | Response => {
  try {
    const entry = schema.entries.find(parseInt(req.params.id));
    const data = JSON.parse(req.requestBody) as Partial<Entry>;
    const now = dayjs().format();

    entry.update({
      ...data,
      updatedAt: now,
    });

    return entry.attrs as Entry;
  } catch (error) {
    return handleErrors(error, 'Failed to update entry');
  }
};
