import { component$, useContext } from "@builder.io/qwik";
import {
  AlterContext,
  handleShort,
  IAlterContext,
  ILinkContext,
  LinkContext,
  showTip
} from "~/routes/store";
import { clearState } from "../../routes/store";


export const handleOnInput = (event: Event, state: ILinkContext) => {
  state.rawUrl = (event.target as HTMLInputElement).value
}

export const handleEnter = (event: any, state: ILinkContext) => {
  if (event.key.toLowerCase() === 'enter' && state.rawUrl.length > 0) {
    clearState(state)
    handleShort(state)
  }
}

export const UrlInput = component$(() => {
  const state = useContext(LinkContext) as ILinkContext;
  return (
    <div class="justify-center items-center flex-row flex mt-[30px]">
      <input
        value={state.rawUrl}
        onInput$={(event) => {
          handleOnInput(event, state);
        }}
        onKeyUp$={(event) => {
          handleEnter(event, state)
        }}
        type="text"
        placeholder="输入令人讨厌的长链接~"
        class="input min-w-[500px] text-lg" />
      <Btn />
    </div>
  );
});


export const Btn = component$(() => {
  const state = useContext(LinkContext) as ILinkContext;
  const alterState = useContext(AlterContext) as IAlterContext;
  return <div> <button
    onClick$={() => {
      showTip(alterState, 'success', '成功',)
    }}
    class={`ml-2 text-lg min-w-[100px] btn btn-primary text-white ${state.ifLoading ? 'loading' : ''}`}>转换</button></div>
});
