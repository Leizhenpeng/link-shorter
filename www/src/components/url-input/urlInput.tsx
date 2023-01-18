import { component$, useContext, useResource$, useTask$ } from '@builder.io/qwik';
import type { IInputContext } from '~/routes/store';
import { InputContext } from '~/routes/store';


export const handleOnInput = (event: Event, state: IInputContext) => {
  state.rawUrl = (event.target as HTMLInputElement).value
}

export const UrlInput = component$(() => {
  const state = useContext(InputContext) as IInputContext;
  return (
    <div class="justify-center items-center flex-row flex mt-[60px]">
      <input
        value={state.rawUrl}
        onInput$={(event) => {
          handleOnInput(event,state);
        }}
        type="text"
        placeholder="输入令人讨厌的长链接~"
        class="input min-w-[500px] text-lg" />
      <Btn />
    </div>
  );
});


export const Btn = component$(() => {
  return <div> <button class="ml-2 text-lg btn loading btn-secondary" >转换</button></div>
});