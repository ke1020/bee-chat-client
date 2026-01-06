import { AiChatLocale } from "@/locales/typings";
import { EmptyObject } from "antd/lib/_util/type";
import { useCallback, useEffect, useRef, useState } from "react";
import store from "store2";


/**
 * 支持的语言枚举
 */
export const enum LanguageType {
    Chinese = 'zh-Hans',
    English = 'en'
}
const Languages = [LanguageType.Chinese, LanguageType.English];
/**
 * 语言设置 key
 */
const LANGUAGE_SETTING_KEY = 'language';
/**
 * 语言配置接口
 */
interface LanguageConfig {
    key: LanguageType;
    label: string;
    loader: () => Promise<{ default: AiChatLocale }>;
}
/**
 * 语言配置
 */
const LANGUAGE_CONFIGS: Record<LanguageType, LanguageConfig> = {
    [LanguageType.Chinese]: {
        key: LanguageType.Chinese,
        label: '简体中文',
        loader: () => import("@/locales/zh")
    },
    [LanguageType.English]: {
        key: LanguageType.English,
        label: 'English',
        loader: () => import("@/locales/en")
    }
};
/**
 * 默认语言
 */
const DEFAULT_LANGUAGE = LanguageType.Chinese;
/**
 * 获取浏览器首选语言
 */
const getBrowserLanguage = (): LanguageType => {
    const browserLang = navigator.language;

    if (browserLang.startsWith('zh')) {
        return LanguageType.Chinese;
    }

    if (browserLang.startsWith('en')) {
        return LanguageType.English;
    }

    return DEFAULT_LANGUAGE;
};

/**
 * 从本地存储获取语言设置
 */
const getStoredLanguage = (): LanguageType => {
    try {
        const stored = store.get(LANGUAGE_SETTING_KEY);

        if (stored && Languages.includes(stored as LanguageType)) {
            return stored as LanguageType;
        }

        // 如果没有存储的语言设置，使用浏览器语言
        const browserLang = getBrowserLanguage();
        store.set(LANGUAGE_SETTING_KEY, browserLang);
        return browserLang;
    } catch (error) {
        console.error('读取语言设置失败:', error);
        return DEFAULT_LANGUAGE;
    }
};

/**
 * 保存语言设置到本地存储
 */
const storeLanguage = (language: LanguageType): void => {
    try {
        store.set(LANGUAGE_SETTING_KEY, language);
    } catch (error) {
        console.error('保存语言设置失败:', error);
    }
};
/**
 * 语言缓存
 */
const localeCache = new Map<LanguageType, AiChatLocale | EmptyObject>();
/**
 * 空对象 (避免初始化语言包之前访问报错)
 */
const EMPTY_LOCALE: AiChatLocale | EmptyObject = {};
/**
 * 载入语言
 * @param language 
 * @returns 
 */
const loadLocale = async (language: LanguageType): Promise<AiChatLocale | EmptyObject> => {
    if (localeCache.has(language)) {
        return localeCache.get(language)!;
    }

    const config = LANGUAGE_CONFIGS[language];

    if (!config) {
        console.warn(`不支持的语言: ${language}`);
        return EMPTY_LOCALE;
    }

    try {
        const module = await config.loader();
        // 确保数据不为空
        const data = module.default || module || EMPTY_LOCALE;
        localeCache.set(language, data);
        return data;
    } catch (error) {
        console.error(`加载语言包 ${language} 失败:`, error);
        return EMPTY_LOCALE;
    }
};

interface UseLocaleReturn {
    locale: AiChatLocale;
    currentLanguage: LanguageType;
    isLoading: boolean;
    isReady: boolean; // 添加就绪状态
    changeLocale: (language: LanguageType) => Promise<void>;
    languageConfigs: typeof LANGUAGE_CONFIGS;
}

export default (): UseLocaleReturn => {

    const [currentLanguage, setCurrentLanguage] = useState<LanguageType>(getStoredLanguage());
    const [locale, setLocale] = useState<AiChatLocale | EmptyObject>(EMPTY_LOCALE); // 初始化为 EMPTY_LOCALE
    const [isLoading, setIsLoading] = useState(true);
    const [isReady, setIsReady] = useState(false); // 添加就绪状态
    const isLoadingRef = useRef(false);

    const changeLocale = useCallback(async (language: LanguageType) => {
        if (isLoadingRef.current || language === currentLanguage) {
            return;
        }

        try {
            isLoadingRef.current = true;
            setIsLoading(true);
            setIsReady(false);

            const localeData = await loadLocale(language);

            setLocale(localeData);
            setCurrentLanguage(language);
            storeLanguage(language);
            setIsReady(true); // 标记为就绪

        } catch (error) {
            console.error('切换语言失败:', error);
            setLocale(EMPTY_LOCALE);
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [currentLanguage]);

    useEffect(() => {
        const initLocale = async () => {
            try {
                setIsLoading(true);
                const localeData = await loadLocale(currentLanguage);
                setLocale(localeData);
                setIsReady(true); // 初始化完成后标记为就绪
            } catch (error) {
                console.error('初始化语言失败:', error);
                setLocale(EMPTY_LOCALE);
            } finally {
                setIsLoading(false);
            }
        };

        initLocale();
    }, []);

    return {
        locale: locale as AiChatLocale, // 永远不会返回 null
        currentLanguage,
        isLoading,
        isReady, // 返回就绪状态
        changeLocale,
        languageConfigs: LANGUAGE_CONFIGS
    };
}