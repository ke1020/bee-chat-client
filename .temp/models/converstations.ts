import { AiLocale } from "@/locales/typings";
import { ConversationData, useXConversations } from "@ant-design/x-sdk";
import { useCallback, useState, useEffect } from "react";


const getConversations = (locale: AiLocale): ConversationData[] => [
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

/**
 * 会话管理 model
 */
const useAiConversations = (locale: AiLocale) => {

    const { conversations, addConversation, setConversations } = useXConversations({});

    const [curConversation, setCurConversation] = useState<string>();
    const [activeConversation, setActiveConversation] = useState<string>();

    // 避免循环更新
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
        curConversation,
        activeConversation,
        addConversation,
        setConversations,
        setCurConversation,
        setActiveConversation
    }
};

export default useAiConversations;