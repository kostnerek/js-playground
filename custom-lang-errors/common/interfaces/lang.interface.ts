/* 

  While adding new language just add it to ExtraLanguages array and to LanguageDto class

*/

type LanguageCodes =
  | 'cz'
  | 'de'
  | 'en'
  | 'es'
  | 'fr'
  | 'it'
  | 'nl'
  | 'pl'
  | 'pt'
  | 'ru';
export const ExtraLanguages: LanguageCodes[] = ['cz', 'de', 'en'];
export const AllLanguages: string[] = ['pl', ...ExtraLanguages];

export type AllLanguagesType = 'pl' | 'cz' | 'de' | 'en';

export type GenericLanguageType<T extends LanguageCodes[]> = {
  pl: string;
} & {
  [key in T[number]]?: string | undefined; // Use indexed access type
};

export const MongooseLanguage = {
  pl: { type: String, required: true },
};
for (const lang of ExtraLanguages) {
  MongooseLanguage[lang] = { type: String, required: false };
}

export class LanguageDto {
  pl: string;

  cz?: string;

  de?: string;

  en?: string;
}
