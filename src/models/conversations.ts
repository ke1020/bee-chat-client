import { useXConversations } from "@ant-design/x-sdk";
import { useModel } from "@umijs/max";
import { useEffect, useState, useCallback } from "react";
import { UseLocaleReturn } from "./locales";

const getConversations = (locale: UseLocaleReturn['locale']) => [
    {
        key: 'default-0',
        label: locale.whatIsAntDesignX,
        group: locale.today,
    },
    {
        key: 'default-1',
        label: locale.howToQuicklyInstallAndImportComponents,
        group: locale.today,
    },
    {
        key: 'default-2',
        label: locale.newAgiHybridInterface,
        group: locale.yesterday,
    },
];

export default () => {
    const { locale } = useModel('locales') as UseLocaleReturn;

    const { conversations, addConversation, setConversations } = useXConversations({});
    const [curConversation, setCurConversation] = useState<string>();
    const [activeConversation, setActiveConversation] = useState<string>();

    const updateConversations = useCallback(() => {
        if (!locale) return;

        const initialList = getConversations(locale);
        setConversations(initialList);

        if (!curConversation || !initialList.some(item => item.key === curConversation)) {
            setCurConversation(initialList[0]?.key);
        }
    }, [locale, setConversations]);

    // 监听 locale 变化，更新会话列表
    useEffect(() => {
        updateConversations();
    }, [updateConversations]);

    return {
        conversations,
        addConversation,
        setConversations,
        curConversation,
        setCurConversation,
        activeConversation,
        setActiveConversation
    };
}