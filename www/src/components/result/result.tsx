import { component$, useContext } from "@builder.io/qwik";
import type { ILinkContext } from "~/routes/store";
import { LinkContext } from "~/routes/store";
import { PhCopyFill, PhLinkSimpleBold, PhQrCodeBold } from "~/components/icons/action";

export interface ResultProps {

}

export const Result = component$(() => {
  const store = useContext(LinkContext) as ILinkContext;
  return (
    <>
      {store.ifShowResult&&
    <div>
      <div class="w-full flex justify-center">
        <div class="mt-10 text-lg font-bold link link-primary">{ store.shortUrl }</div>
      </div>
      <div className={ `action flex justify-center mt-4` }>
        <ul className="menu menu-horizontal bg-base-100 rounded-box">
          <li>
            <a>
              <PhCopyFill  class='text-xl'/>
            </a>
          </li>
          <li>
            <a>
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
