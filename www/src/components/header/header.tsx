import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { QwikLogo } from '../icons/qwik';
import styles from './header.css?inline';

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <header>
      <div class="logo">
        <a href="https://qwik.builder.io/" target="_blank" title="qwik">
          <QwikLogo className="origin-left scale-75"/>
        </a>
      </div>
      <p class="slogan">
        缩短网址，让分享更加简单
      </p>
    </header>
  );
});
