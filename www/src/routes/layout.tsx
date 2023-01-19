import { component$, Slot } from '@builder.io/qwik';
import { Alter } from '~/components/alter/alter';
import Header from '../components/header/header';

export default component$(() => {
  return (
    <>
      <main>
        <Header />
        <section style={{
          minHeight: '800px',
        }}>
          <Slot />
        </section>
      </main>
      <footer>
        <a href="https://github.com/Leizhenpeng" target="_blank">
          Made By LeiZhenpeng
        </a>
      </footer>
    </>
  );
});
