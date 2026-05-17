import type { AppLanguage } from "../contexts/PreferencesContext";

export function fa(persian: string | undefined, english: string, language: AppLanguage): string {
  return language === "fa" && persian ? persian : english;
}

export function faArr(persian: string[] | undefined, english: string[], language: AppLanguage): string[] {
  return language === "fa" && persian && persian.length > 0 ? persian : english;
}
