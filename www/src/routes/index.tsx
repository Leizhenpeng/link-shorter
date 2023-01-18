import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="w-full">
      <div class="justify-center items-center flex-row flex mt-[60px]">
        <input type="text" placeholder="输入讨人厌的长链接~" class="input min-w-[500px] text-lg " />
        <button className="ml-2 text-lg btn loading btn-secondary" >转换</button>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: '短链',
  meta: [
    {
      name: 'description',
      content: '缩短网址，让分享更加简单',
    },
  ],
};
