import { UseLocaleReturn } from "@/models/locales";
import { SyncOutlined } from "@ant-design/icons";
import { Actions, Bubble } from "@ant-design/x"
import XMarkdown from "@ant-design/x-markdown";
import { useXChat } from "@ant-design/x-sdk";
import { BubbleListProps, BubbleListRef } from "@ant-design/x/es/bubble";
import { useModel } from "@umijs/max"
import React from "react";

interface MessagesProps {
    listRef: React.RefObject<BubbleListRef>;
    chatContext: React.Context<{ onReload?: ReturnType<typeof useXChat>["onReload"]; }>;
}
const Footer: React.FC<{
    id?: string;
    content: string;
    status?: string;
    chatContext: React.Context<{
        onReload?: ReturnType<typeof useXChat>["onReload"];
    }>;
    locale: UseLocaleReturn['locale'];
}> = ({ id, content, status, chatContext, locale }) => {
    const context = React.useContext(chatContext);
    const Items = [
        {
            key: 'retry',
            label: locale.retry,
            icon: <SyncOutlined />,
            onItemClick: () => {
                if (id) {
                    context?.onReload?.(id, {
                        userAction: 'retry',
                    });
                }
            },
        },
        {
            key: 'copy',
            actionRender: <Actions.Copy text={content} />,
        },
    ];
    return status !== 'updating' && status !== 'loading' ? (
        <div style={{ display: 'flex' }}>{id && <Actions items={Items} />}</div>
    ) : null;
};

const getRole = (className: string,
    chatContext: React.Context<{
        onReload?: ReturnType<typeof useXChat>["onReload"];
    }>,
    locale: UseLocaleReturn['locale']
): BubbleListProps['role'] => ({
    assistant: {
        placement: 'start',
        footer: (content, { status, key }) => (
            <Footer content={content} status={status} id={key as string} chatContext={chatContext} locale={locale} />
        ),
        contentRender: (content: any, { status }) => {
            const newContent = content.replace(/\n\n/g, '<br/><br/>');
            return (
                <XMarkdown
                    paragraphTag="div"
                    className={className}
                    streaming={{
                        hasNextChunk: status === 'updating',
                        enableAnimation: true,
                    }}
                >
                    {newContent}
                </XMarkdown>
            );
        },
    },
    user: { placement: 'end' },
});

export default (props: MessagesProps) => {
    const { markdownThemeClass } = useModel('themes');
    const { messages } = useModel('messages');
    const { locale } = useModel('locales')

    return messages?.length !== 0 && (
        /* 🌟 消息列表 */
        <Bubble.List
            ref={props.listRef}
            style={{
                //height: 'calc(100% - 160px)',
                flex: 1,
                overflow: 'auto'
            }}
            items={messages?.map((i) => ({
                ...i.message,
                key: i.id,
                status: i.status,
                loading: i.status === 'loading',
                extraInfo: i.message.extraInfo,
            }))}
            styles={{
                root: {
                    marginBlockEnd: 24,
                },
                bubble: { maxWidth: 840 },
            }}
            role={getRole(markdownThemeClass, props.chatContext, locale)}
        />
    )
}