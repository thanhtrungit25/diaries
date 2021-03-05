import { Entry } from './entry.interface';

export interface Diary {
  id: number;
  title: string;
  entries: Entry[];
  type: 'private' | 'public';
  createdAt: string;
  updatedAt: string;
  userId?: number;
}
