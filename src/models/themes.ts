import { useCallback, useMemo, useState } from "react";
import { createStyles } from "antd-style";
import { theme as antdTheme, ThemeConfig } from "antd";
import store from "store2";

/**
 * 主题色枚举
 */
export const enum ThemePaletteKey {
    DARK = 'dark',
    LIGHT = 'light'
}
/**
 * 主题模式
 */
type ThemeMode = ThemePaletteKey.LIGHT | ThemePaletteKey.DARK;
/**
 * 主题设置
 */
export type ThemeSetting = ThemeMode | 'auto';
/**
 * 定义主题色板类型
 */
interface ThemePalette {
    algorithm: ThemeConfig['algorithm'];
    colorBgContainer: string;
    colorBgLayout: string;
    colorText: string;
    colorBorderSecondary: string;
}
/**
 * 主题色板配置
 */
const THEME_PALETTE: Record<ThemePaletteKey, ThemePalette> = {
    [ThemePaletteKey.DARK]: {
        algorithm: antdTheme.darkAlgorithm,
        colorBgContainer: 'rgb(20, 20, 20)',
        colorBgLayout: 'rgb(10, 10, 10)',
        colorText: 'rgba(255, 255, 255, 0.85)',
        colorBorderSecondary: '#303030'
    },
    [ThemePaletteKey.LIGHT]: {
        algorithm: antdTheme.defaultAlgorithm,
        colorBgContainer: '#ffffff',
        colorBgLayout: '#f5f5f5',
        colorText: 'rgba(0, 0, 0, 0.88)',
        colorBorderSecondary: '#f0f0f0'
    },
};
/**
 * 样式生成器
 */
const useStyles = createStyles(({ token, css }, props: { themeMode: ThemeMode }) => {
    // 根据 props.themeMode 获取对应的主题色板
    const palette = THEME_PALETTE[props.themeMode] || THEME_PALETTE[ThemePaletteKey.LIGHT];
    return {
        layout: css`
      width: 100%;
      height: 100vh;
      display: flex;
      background: ${palette.colorBgContainer};
      overflow: hidden;
    `,
        side: css`
      background: ${palette.colorBgLayout};
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 12px;
      box-sizing: border-box;
    `,
        logo: css`
      display: flex;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;
      gap: 8px;
      margin: 24px 0;

      span {
        font-weight: bold;
        color: ${palette.colorText};
        font-size: 16px;
      }
    `,
        conversations: css`
      overflow-y: auto;
      margin-top: 12px;
      padding: 0;
      flex: 1;
      .ant-conversations-list {
        padding-inline-start: 0;
      }
    `,
        sideFooter: css`
      border-top: 1px solid ${palette.colorBorderSecondary};
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
        chat: css`
      height: 100%;
      width: calc(100% - 240px);
      overflow: auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-block: ${token.paddingLG}px;
      padding-inline: ${token.paddingLG}px;
      gap: 16px;
      .ant-bubble-content-updating {
        background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
        background-size: 100% 2px;
        background-repeat: no-repeat;
        background-position: bottom;
      }
    `,
        startPage: css`
      display: flex;
      width: 100%;
      max-width: 840px;
      flex-direction: column;
      align-items: center;
      height: 100%;
    `,
        agentName: css`
      margin-block-start: 25%;
      font-size: 32px;
      margin-block-end: 38px;
      font-weight: 600;
      color: ${palette.colorText};
    `,
        chatList: css`
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      flex-direction: column;
      justify-content: space-between;
      color: ${palette.colorText};
    `,
        bubbleList: css`
            .ant-bubble-list-scroll-box {
                align-items: center;
            }
            .ant-bubble-list-scroll-content {
                width: 840px;
            }
        `
    };
});
const THEME_SETTING_KEY = 'theme-setting';
/**
 * 从本地存储获取主题
 * @returns 
 */
const getThemeFromStorage = (): ThemeSetting => {
    if (store.has(THEME_SETTING_KEY)) {
        return store.get(THEME_SETTING_KEY) as ThemeSetting;
    }
    return 'auto';
};

/**
 * 主题设置存储到本地
 * @param theme 
 */
const setThemeToStorage = (theme: ThemeSetting) => {
    store.set(THEME_SETTING_KEY, theme)
}

/**
 * 获取系统主题
 * @returns 
 */
const getSystemTheme = (): ThemeMode => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? ThemePaletteKey.DARK
            : ThemePaletteKey.LIGHT;
    }
    return ThemePaletteKey.LIGHT;
};

/**
 * 主题
 */
interface UseThemeReturn {
    styles: ReturnType<typeof useStyles>['styles'];
    themeConfig: ThemeConfig;
    currentTheme: ThemeMode;
    themeSetting: ThemeSetting;
    changeTheme: (theme: ThemeSetting) => void;
    markdownThemeClass: string;
}

export default (): UseThemeReturn => {

    // 主题设置（auto/light/dark）
    const [themeSetting, setThemeSetting] = useState<ThemeSetting>(getThemeFromStorage());

    // 计算当前实际主题
    const currentTheme = useMemo((): ThemeMode => {
        if (themeSetting === 'auto') {
            return getSystemTheme();
        }
        return themeSetting;
    }, [themeSetting]);

    // 生成 Ant Design 主题配置
    const themeConfig = useMemo((): ThemeConfig => ({
        algorithm: THEME_PALETTE[currentTheme].algorithm
    }), [currentTheme]);

    // markdown 组件主题样式
    const markdownThemeClass = useMemo(() => {
        return currentTheme === ThemePaletteKey.DARK ? 'x-markdown-dark' : 'x-markdown-light';
    }, [currentTheme]);

    // 监听系统主题变化
    useState(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            if (themeSetting === 'auto') {
                // 当设置为 auto 时，系统主题变化会自动更新 currentTheme
                // 这里可以触发一个事件或使用其他方式通知组件
                setThemeSetting(getSystemTheme());
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    });

    // 切换主题
    const changeTheme = useCallback((theme: ThemeSetting) => {
        setThemeSetting(theme);
        // 可以添加持久化存储
        setThemeToStorage(theme)
    }, []);

    const { styles } = useStyles({ themeMode: currentTheme });
    return {
        styles,
        themeConfig,
        currentTheme,
        themeSetting,
        changeTheme,
        markdownThemeClass
    };
}