const isDev = process.env.NODE_ENV === 'development';

/**
 * 调试输出
 * @param args 
 */
export const log = (...args: any[]) => {
    if (!isDev) {
        return;
    }

    console.log('[DEBUG]', ...args);
}

/**
 * 带标记的调试输出
 * @param tag 标记
 * @param args 
 * @returns 
 */
export const logT = (tag: string, ...args: any[]) => {
    if (!isDev) {
        return;
    }

    console.log(`[DEBUG][${tag}]`, ...args);
}