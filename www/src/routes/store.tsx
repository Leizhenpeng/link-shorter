import { component$, createContext, Slot, useContextProvider, useStore, useTask$ } from '@builder.io/qwik';


export const InputContext = createContext('input');
export interface IInputContext {
    rawUrl: string;
    ifLoading: boolean;
    shortUrl: string;
    ifError: boolean;
    ifShowResult: boolean;
}

export const clearState = (state: IInputContext) => {
    state.shortUrl = '';
    state.ifError = false;
    state.ifShowResult = false;
}

export 

export const InputStore = component$(() => {
    const store = useStore<IInputContext>({
        rawUrl: '',
        ifLoading: false,
        shortUrl: '',
        ifError: false,
        ifShowResult: false,
    });
    useTask$(
        async (ctx) => {
            ctx.track(() => store.rawUrl);
            console.log('store.rawUrl',store.rawUrl)
        }
    );
    useContextProvider(InputContext, store);
    return (
        <>
            <Slot />
        </>
    );
});