import { component$, createContext, Slot, useContextProvider, useStore, useTask$ } from '@builder.io/qwik';
import { postData } from '~/utils/fetch';
import { NormalizeUrl } from '~/utils/url';


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

const baseUrl = import.meta.env.VITE_API_DOMAIN;

const reqShort = (link: string) => {
    return postData(baseUrl + '/short', {
       link
    }) .then(data => {
        return data;
    });
    
};

export const handleShort = async(state: IInputContext) => {
    state.ifLoading = true;
    const url = NormalizeUrl(state.rawUrl)
    const res = await reqShort(url)
    console.log('res', res)
    state.ifLoading = false;
}


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
        }
    );
    useContextProvider(InputContext, store);
    return (
        <>
            <Slot />
        </>
    );
});