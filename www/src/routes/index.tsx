import { component$, useStylesScoped$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Alter } from '~/components/alter/alter';
import { UrlInput } from '~/components/url-input/urlInput';
import { InputStore } from './store';
import indexCss from './index.css?inline';


export default component$(() => {
  useStylesScoped$(indexCss)
  return (
    <div class="w-full">
      <p class="slogan">
        缩短网址，让分享更加简单
      </p>
      <InputStore>
        <Alter/>
        <UrlInput />
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
