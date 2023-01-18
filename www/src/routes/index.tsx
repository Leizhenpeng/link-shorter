import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { UrlInput } from '~/components/url-input/urlInput';
import { InputStore } from './store';

export default component$(() => {
  return (
    <div class="w-full">
      <InputStore>
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
