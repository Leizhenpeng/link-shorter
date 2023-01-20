import { component$, useClientEffect$ } from "@builder.io/qwik";
import type { SpeakLocale } from "qwik-speak";
import { changeLocale, useSpeakContext } from "qwik-speak";
import { config } from "~/speak-config";

interface ILanguageChoose {
  language: string;
  svg: string;
}


export function LangChoose(props: ILanguageChoose) {
  return <li>
    <button class="flex">
      <img
        loading="lazy"
        width="20"
        height="20"
        alt={ props.language }
        src={ props.svg }
        { ...props }
      />
      <span class="flex flex-1 justify-between"> { props.language } </span>
    </button>
    { " " }
  </li>;
}


export const setLocale = (locale: SpeakLocale) => {
  localStorage.setItem("locale", JSON.stringify(locale));
};

export const getLocale = () => {
  return JSON.parse(localStorage.getItem("locale") || "null") || config.defaultLocale;
};

export const I18nSwitch = component$(() => {
  const ctx = useSpeakContext();

  useClientEffect$(async () => {
    const locale = getLocale() as SpeakLocale;
    changeLocale(locale, ctx).then(
      () => {
        setLocale(locale);
      }
    );
  });

  return <div class="dropdown dropdown-end">
    <div tabIndex={ 0 } class="btn btn-ghost gap-1 normal-case">
      <svg
        class="inline-block h-6 fill-current"
        height="20"
        viewBox="0 0 512 512"
      >
        <path
          d="M363,176,246,464h47.24l24.49-58h90.54l24.49,58H480ZM336.31,362,363,279.85,389.69,362Z"></path>
        <path
          d="M272,320c-.25-.19-20.59-15.77-45.42-42.67,39.58-53.64,62-114.61,71.15-143.33H352V90H214V48H170V90H32v44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-32.68-43.44-47.14-75.88-47.33-76.22L143,152l-38,22,6.87,13.86c.89,1.56,17.19,37.9,54.71,86.57.92,1.21,1.85,2.39,2.78,3.57-49.72,56.86-89.15,79.09-89.66,79.47L64,368l23,36,19.3-11.47c2.2-1.67,41.33-24,92-80.78,24.52,26.28,43.22,40.83,44.3,41.67L255,362Z"></path>
      </svg>
      <svg
        width="12px"
        height="12px"
        class="ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2048 2048"
      >
        <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
      </svg>
    </div>
    <ul class="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-40 mt-1"
        tabIndex={ 0 }>
      {
        ctx.config.supportedLocales.map((locale) => {
          return (
            <div onClick$={ () => {
              changeLocale(locale, ctx).then(() => {
                setLocale(locale)
              });
            } }>
              <LangChoose
                language={ locale.units?.name as string }
                svg={ locale.units?.svg as string } />
            </div>
          );
        }) }
    </ul>
  </div>;
});
