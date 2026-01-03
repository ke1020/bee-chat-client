import { useXConversations } from "@ant-design/x-sdk";
import { useState } from "react";

//type Locale = XProviderProps['locale'];

const getConverstations = (locale: any) => [
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
export default () => {
    const { conversations, addConversation, setConversations } = useXConversations({
        defaultConversations: [],
    });

    const [curConversation, setCurConversation] = useState<string>();

    const [activeConversation, setActiveConversation] = useState<string>();

    const initialConversations = (locale: any) => {
        const list = getConverstations(locale)
        setConversations(list)
        setCurConversation(list[0].key)
    };

    return {
        conversations,
        curConversation,
        activeConversation,
        addConversation,
        setConversations,
        setCurConversation,
        setActiveConversation,
        initialConversations
    }
};