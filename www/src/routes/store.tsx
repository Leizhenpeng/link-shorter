import { component$, createContext, Slot, useContextProvider, useStore, useTask$ } from '@builder.io/qwik';
import { postData } from '~/utils/fetch';
import { NormalizeUrl } from '~/utils/url';


export const LinkContext = createContext('link');
export const AlterContext = createContext('alter');

export interface IAlterContext {
    type: "success" | "error" | "warning" | "info";
    message: string;
    show: boolean;
    time: number;
}

export interface ILinkContext {
    rawUrl: string;
    ifLoading: boolean;
    shortUrl: string;
    ifError: boolean;
    ifShowResult: boolean;
}

export const clearState = (state: ILinkContext) => {
    state.shortUrl = '';
    state.ifError = false;
    state.ifShowResult = false;
}

const baseUrl = import.meta.env.VITE_API_DOMAIN;

const reqShort = (link: string) => {
    return postData(baseUrl + '/short', {
        link
    }).then(data => {
        return data;
    });

};

export const handleShort = async (state: ILinkContext) => {
    state.ifLoading = true;
    const url = NormalizeUrl(state.rawUrl)
    const res = await reqShort(url)
    console.log('res', res)
    state.ifLoading = false;
}


export const showTip = (state: IAlterContext, type: IAlterContext["type"], message: string, time = 1000) => {
    state.type = type;
    state.message = message;
    state.show = true;
    state.time = time;
}



export const InputStore = component$(() => {
    const store = useStore<ILinkContext>({
        rawUrl: '',
        ifLoading: false,
        shortUrl: 'https://short.cn/u/22disd',
        ifError: false,
        ifShowResult: false,
    });
    useTask$(
        async (ctx) => {
            ctx.track(() => store.rawUrl);
        }
    );
    useContextProvider(LinkContext, store);


    const alterStore = useStore<IAlterContext>({
        type: "success",
        message: '',
        show: false,
        time: 1000,
    });
    useContextProvider(AlterContext, alterStore);
    return (
        <>
            <Slot />
        </>
    );
});
