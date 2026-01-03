import { useState } from "react";
import local from "@/locales/local";
import zh from "@/locales/zh";
import en from "@/locales/en";

//type Locale = XProviderProps['locale'];

type LocaleType = 'zh' | 'en';

export default () => {

    const [localeType, setLocaleType] = useState<LocaleType>('zh');

    // 如果您的项目使用了antd 那么可以将antd的locale合并传入XProvider
    // If your project uses antd, you need to merge antd's locale into XProvider
    const [locale, setLocal] = useState<any>(local);

    const changeLocale = (t: LocaleType) => {
        setLocaleType(t);
        switch (t) {
            case 'zh': setLocal(zh); break;
            case 'en': setLocal(en); break;
        }
    };

    return { locale, localeType, changeLocale };
}