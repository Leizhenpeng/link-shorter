import { component$, useContext } from "@builder.io/qwik";
import type { IAlterContext, ILinkContext } from "~/store";
import { AlterContext, LinkContext, showTip } from "~/store";
import {
  PhCopyFill,
  PhLinkSimpleBold,
  PhQrCodeBold,
  PhTwitterLogoFill
} from "~/components/icons/action";
import { OpenUrl } from "~/utils/url";
import { CopyToClipboard } from "~/utils/copy";
import { GenQrcode, ShareTwitter } from "~/utils/share";
import {
  $translate as t, Speak, useSpeakLocale
} from "qwik-speak";
export interface ResultProps {
}


export const Result = component$(() => {
  const store = useContext(LinkContext) as ILinkContext;
  const alterState = useContext(AlterContext) as IAlterContext;
  const locale  = useSpeakLocale()
  const ifCn = locale.lang === "zh-CN";
  return (
    <Speak assets={ ["short", "alter"] }>
      { store.ifShowResult ?
        <div>
          <div class="w-100 flex justify-center">
            <div class="mt-10 text-lg font-bold link link-primary"
                 onClick$={ () => {
                   OpenUrl(store.shortUrl);
                 } }
            >{ store.shortUrl }</div>
          </div>
          <div class={ `action flex justify-center mt-4` }>
            <ul class="menu menu-horizontal bg-base-100 rounded-box">

              <li>
                <a
                  class="tooltip" data-tip={t("short.openTip@@打开")}
                  onClick$={ () => {
                    OpenUrl(store.shortUrl);
                  } }
                >
                  <PhLinkSimpleBold class=" text-xl" />
                </a>
              </li>
              <li>
                <a
                  class=" tooltip" data-tip={t("short.copyTip@@复制")}
                  onClick$={ () => {
                    CopyToClipboard(store.shortUrl).then(
                      () => {
                        showTip(alterState, "success",ifCn?"复制成功":"Copy short link Successfully ~" , 2000);
                      }
                    );
                  } }
                >
                  <PhCopyFill class=" text-xl" />
                </a>
              </li>
              <li>
                <a class=" tooltip" data-tip={t("short.qrcodeTip@@二维码")}
                   onClick$={ () => {
                     CopyToClipboard(store.shortUrl).then(
                       () => {
                         GenQrcode();
                       } ) }}
                >
                  <PhQrCodeBold class=" text-xl" />
                </a>
              </li>
              <li>
                <a
                  class=" tooltip" data-tip={t("short.twitter@@推特")}
                  onClick$={ () => {
                    ShareTwitter(store.shortUrl);
                  } }
                >
                  <PhTwitterLogoFill class=" text-xl" />
                </a>
              </li>
            </ul>
          </div>
        </div> :
        <div w-full/>
      }
    </Speak>
  );
});
