import { tr } from './tr';
import { en } from './en';

export const translations = {
  tr,
  en,
};

export type Language = keyof typeof translations; 