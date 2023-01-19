import { component$, useContext } from "@builder.io/qwik";
import type { IAlterContext, ILinkContext } from "~/routes/store";
import { AlterContext, LinkContext, showTip } from "~/routes/store";
import { PhCopyFill, PhLinkSimpleBold, PhQrCodeBold } from "~/components/icons/action";
import { OpenUrl } from "~/utils/url";
import { CopyToClipboard } from "~/utils/copy";

export interface ResultProps {

}



export const Result = component$(() => {
  const store = useContext(LinkContext) as ILinkContext;
  const alterState = useContext(AlterContext) as IAlterContext;
  return (
    <>
      {store.ifShowResult&&
    <div>
      <div class="w-full flex justify-center">
        <div class="mt-10 text-lg font-bold link link-primary"
          onClick$={() => {
            OpenUrl(store.shortUrl)
          }}
        >{ store.shortUrl }</div>
      </div>
      <div className={ `action flex justify-center mt-4` }>
        <ul className="menu menu-horizontal bg-base-100 rounded-box">
          <li>
            <a
              onClick$={() => {
                CopyToClipboard(store.shortUrl).then(
                  () => {
                    showTip(alterState, 'success', '复制成功')
                  }
                )
              }}
            >
              <PhCopyFill  class='text-xl'/>
            </a>
          </li>
          <li>
            <a
              onClick$={() => {
                OpenUrl(store.shortUrl)
              }}
            >
              <PhLinkSimpleBold class='text-xl'/>
            </a>
          </li>
          <li>
            <a>
              <PhQrCodeBold class='text-xl'/>
            </a>
          </li>
        </ul>
      </div>
    </div>
      }
    </>
  );
});
