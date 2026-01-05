import { useCallback, useState } from "react";
import zh from "@/locales/zh";
import en from "@/locales/en";

//type Locale = XProviderProps['locale'];

/**
 * 支持的语言枚举
 */
export const enum LanguageKey {
    Chinese = 'zh-Hans',
    English = 'en'
}
type LocaleType = LanguageKey.Chinese | LanguageKey.English;

export default () => {

    const [currentLocaleType, setLocaleType] = useState<LocaleType>(LanguageKey.Chinese);

    // 如果您的项目使用了antd 那么可以将antd的locale合并传入XProvider
    const [locale, setLocal] = useState(zh);

    const changeLocale = useCallback((localType: LocaleType) => {
        setLocaleType(localType);
        switch (localType) {
            case LanguageKey.Chinese: setLocal(zh); break;
            case LanguageKey.English: setLocal(en); break;
        }
    }, [currentLocaleType]);

    return { locale, currentLocaleType, changeLocale };
}