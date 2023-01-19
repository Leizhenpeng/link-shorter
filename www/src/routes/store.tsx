import { component$, createContext, Slot, useContextProvider, useStore, useTask$ } from '@builder.io/qwik';
import { postData } from '~/utils/fetch';
import { NormalizeUrl, ValidateUrl } from "~/utils/url";


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

export  const composeShortUrl = (shortKey: string) => {
    return baseUrl + '/u/' + shortKey;
}
export const handleShort = async (state: ILinkContext,alterState:IAlterContext) => {
    state.ifLoading = true;
    const pass = ValidateUrl(state.rawUrl);
    if(!pass) {
        state.ifError = true;
        state.ifLoading = false;
        showTip(alterState, 'warning', '不要胡闹, 请输入正确的链接',5000);
        return;
    }

    const url = NormalizeUrl(state.rawUrl)
    const res = await reqShort(url)
    if (res.code !== 200) {
        state.ifError = true;
        state.ifLoading = false;
        showTip(alterState, 'warning', '你很调皮, 这个链接不支持',5000);
        return;
    }

    console.log('res', res)
    state.ifLoading = false;
    state.ifShowResult = true;
    state.shortUrl = composeShortUrl(res.data);
    showTip(alterState, 'success', '很开心, 转换成功啦',3000);
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
