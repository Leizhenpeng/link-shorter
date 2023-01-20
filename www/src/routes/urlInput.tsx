import { component$, useContext } from "@builder.io/qwik";
import type {
  IAlterContext,
  ILinkContext
} from "~/store";
import {
  AlterContext,
  handleShort,
  LinkContext
} from "~/store";
import { clearState } from "../store";

import {
  $translate as t, Speak, SpeakLocale, useSpeakLocale
} from "qwik-speak";

export const handleOnInput = (event: Event, state: ILinkContext) => {
  state.rawUrl = (event.target as HTMLInputElement).value;
};

export const shortUrl = (state: ILinkContext, alterState: IAlterContext, locale: SpeakLocale) => {
  state.ifLoading = true;
  clearState(state);
  handleShort(state, alterState, locale).finally(() => {
    state.ifLoading = false;
  });
};
export const handleEnter = (event: any, state: ILinkContext, stateAlter: IAlterContext, locale: SpeakLocale) => {
  if (event.key.toLowerCase() === "enter" && state.rawUrl.length > 0) {
    shortUrl(state, stateAlter, locale);
  }
};

export const UrlInput = component$(() => {
  const state = useContext(LinkContext) as ILinkContext;
  const alterState = useContext(AlterContext) as IAlterContext;
  const locale = useSpeakLocale();
  return (
    <Speak assets={ ["short", "alter"] }>
      <div class="justify-center items-center flex-row flex mt-[30px]">
        <input
          value={ state.rawUrl }
          onInput$={ (event) => {
            handleOnInput(event, state);
          } }
          onKeyUp$={ (event) => {
            handleEnter(event, state, alterState, locale);
          } }
          type="text"
          placeholder={ t("short.inputPlaceholder@@输入令人讨厌的长链接~") }
          class="input min-w-[500px] text-lg" />

        <button
          onClick$={ () => {
            shortUrl(state, alterState, locale);
          } }
          class={ `ml-2 text-lg min-w-[100px] btn btn-primary text-white ${ state.ifLoading ? "loading" : "" }` }>{ t("short.btnName@@转换") }</button>
      </div>
    </Speak>
  );
});


