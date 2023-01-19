import { component$, useStylesScoped$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Alter } from '~/components/alter/alter';
import { UrlInput } from '~/routes/urlInput';
import { InputStore } from '../store';
import indexCss from './index.css?inline';
import { Result } from "~/routes/result";
import { SloganHan } from "~/components/icons/slogan.ts";


export default component$(() => {
  useStylesScoped$(indexCss)
  return (
    <div class="w-full">
      <SloganHan class={`flex justify-center w-full mt-[140px] mb-4 opacity-100`}></SloganHan>
      <InputStore>
        <Alter/>
        <UrlInput />
        <Result />
      </InputStore>
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
