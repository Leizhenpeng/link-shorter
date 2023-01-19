/* eslint-disable qwik/single-jsx-root */


import styles from './alter.css?inline';

import { component$, useClientEffect$, useContext, useSignal, useStylesScoped$, useTask$ } from '@builder.io/qwik';
import { AlterContext } from '~/routes/store';
import type { IAlterContext } from '../../routes/store';


export const typeMap = {
    warning: "alert alert-warning shadow-lg",
    error: "alert alert-error shadow-lg",
    info: "alert alert-info shadow-lg",
    success: "alert alert-success shadow-lg",
}



export function closeNow(store: IAlterContext) {
    store.show = false;
}
export const Alter = component$(() => {
    useStylesScoped$(styles);
    const store = useContext(AlterContext) as IAlterContext
    // 3s 后消失
    const initShow = useSignal(false)
    useClientEffect$(() => {
        const timer = setTimeout(() => {
            initShow.value = true
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    })


    useTask$(({ track }) => {
        track(() => store.show);
        const timer = setTimeout(() => {
            store.show = false;
        }, store.time || 1000);
        return () => {
            clearInterval(timer);
        };
    });

    const render = () => {
        switch (store.type) {
            case 'warning':
                return (
                    <div class={typeMap.warning} role="alert">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span>
                                {store.message}
                            </span>
                        </div>
                        <div className="flex-none">
                            <button className="btn btn-sm"
                                onClick$={() => {
                                    closeNow(store)
                                }}
                            >知道啦</button>
                        </div>
                    </div>
                )
            case 'error':
                return (
                    <div class={typeMap.error}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{store.message}</span>
                        </div>
                    </div>
                )
            case 'success':
                return (
                    <div class={typeMap.success}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{store.message}</span>
                        </div>
                    </div>
                )
            case "info":
                return (
                    <div class={typeMap.info}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>{store.message}</span>
                        </div>
                    </div>
                );
        }
    }
    return (<div class={`alter-msg ${store.show ? "visited" : "hide"
        }`}> {initShow.value && render()} </div>)
})
