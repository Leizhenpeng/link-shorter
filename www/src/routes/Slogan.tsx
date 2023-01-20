import { component$ } from "@builder.io/qwik";
import { useSpeakLocale } from "qwik-speak";
import { SloganHan,  SloganEng } from "~/components/icons/slogan";


export const Slogan = component$((props: any) => {
  const locale = useSpeakLocale();
  return (
    <>
      {
        locale.lang === "zh-CN" ?
          <SloganHan  { ...props }></SloganHan> :
          <SloganEng  { ...props }></SloganEng>
      }
    </>
  );
});
