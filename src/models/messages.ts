import { DeepSeekChatProvider, DefaultMessageInfo, SSEFields, useXChat, XModelMessage, XModelParams, XModelResponse, XRequest } from "@ant-design/x-sdk";
import { useModel } from "@umijs/max";
import { UseLocaleReturn } from "./locales";

const providerCaches = new Map<string, DeepSeekChatProvider>();
const providerFactory = (conversationKey?: string) => {
    if (!conversationKey) {
        return undefined;
    }

    if (!providerCaches.get(conversationKey)) {
        providerCaches.set(
            conversationKey,
            new DeepSeekChatProvider({
                request: XRequest<XModelParams, Partial<Record<SSEFields, XModelResponse>>>(
                    'https://api.x.ant.design/api/big_model_glm-4.5-flash',
                    {
                        manual: true,
                        params: {
                            stream: true,
                            model: 'glm-4.5-flash',
                        },
                    },
                ),
            }),
        );
    }
    return providerCaches.get(conversationKey);
};

const getMessages = (locale: UseLocaleReturn['locale']): {
    [key: string]: DefaultMessageInfo<XModelMessage>[];
} => {
    return {
        'default-1': [
            {
                message: { role: 'user', content: locale.howToQuicklyInstallAndImportComponents },
                status: 'success',
            },
            {
                message: {
                    role: 'assistant',
                    content: locale.aiMessage_2,
                },
                status: 'success',
            },
        ],
        'default-2': [
            { message: { role: 'user', content: locale.newAgiHybridInterface }, status: 'success' },
            {
                message: {
                    role: 'assistant',
                    content: locale.aiMessage_1,
                },
                status: 'success',
            },
        ],
    }
};

const historyMessageFactory = (locale: UseLocaleReturn['locale'], conversationKey?: string): DefaultMessageInfo<XModelMessage>[] => {
    if (!conversationKey) {
        return [];
    }

    const list = getMessages(locale);
    return list[conversationKey] || [];
};

export default () => {
    const { locale } = useModel('locales') as UseLocaleReturn;
    const { curConversation } = useModel('conversations') as { curConversation: string };

    const { onRequest, messages, isRequesting, abort, onReload } = useXChat({
        provider: providerFactory(curConversation), // every conversation has its own provider
        conversationKey: curConversation,
        defaultMessages: historyMessageFactory(locale, curConversation),
        requestPlaceholder: () => {
            return {
                content: locale.noData,
                role: 'assistant',
            };
        },
        requestFallback: (_, { error, errorInfo, messageInfo }) => {
            if (error.name === 'AbortError') {
                return {
                    content: messageInfo?.message?.content || locale.requestAborted,
                    role: 'assistant',
                };
            }
            return {
                content: errorInfo?.error?.message || locale.requestFailed,
                role: 'assistant',
            };
        },
    });

    return { messages, onRequest, isRequesting, abort, onReload }
}