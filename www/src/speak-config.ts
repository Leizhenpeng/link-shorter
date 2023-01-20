import { $ } from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import type { LoadTranslationFn, SpeakConfig, TranslationFn } from "qwik-speak";

const AllLocale = [
  { lang: "zh-CN", currency: "CNY", timeZone: "Asia/Shanghai" ,
    units: {
      svg: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/svg/1f1ec-1f1e7.svg",
      name:'简体中文',
    }},
  { lang: "en-US", currency: "USD", timeZone: "America/Los_Angeles" ,
    units: {
      svg: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/svg/1f1e8-1f1f3.svg",
      name:'English',
    }},
];
export const config: SpeakConfig = {
  defaultLocale: AllLocale.find((locale) => locale.lang === "zh-CN")!,
  supportedLocales: AllLocale,
  assets: ["app"],
};

export const loadTranslation$: LoadTranslationFn = $(
  async (lang: string, asset: string, origin?: string) => {
    let url = "";
    // Absolute urls on server
    if (isServer && origin) {
      url = origin;
    }
    url += `/i18n/${lang}/${asset}.json`;
    const data = await fetch(url);
    return data.json();
  }
);

export const translationFn: TranslationFn = {
  loadTranslation$: loadTranslation$,
};
