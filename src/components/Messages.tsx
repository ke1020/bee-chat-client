import { useModel } from "@umijs/max";
import { useMarkdownTheme } from "./x-markdown/utils";
import { Actions, Bubble, BubbleListProps } from "@ant-design/x";
import XMarkdown from "@ant-design/x-markdown";
import { SyncOutlined } from "@ant-design/icons";
import React from "react";
import { BubbleListRef } from "@ant-design/x/es/bubble";
import { MessageInfo, useXChat, XModelMessage } from "@ant-design/x-sdk";
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';
import { SenderRef } from "@ant-design/x/es/sender";

const Footer: React.FC<{
    id?: string;
    content: string;
    status?: string;
    chatContext: React.Context<{
        onReload?: ReturnType<typeof useXChat>["onReload"];
    }>;
    locale: any;
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

const getRole = (className: string, chatContext: React.Context<{
    onReload?: ReturnType<typeof useXChat>["onReload"];
}>, locale: any): BubbleListProps['role'] => ({
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

interface MessagesProps {
    listRef: React.RefObject<BubbleListRef>;
    senderRef: React.RefObject<SenderRef>;
    chatContext: React.Context<{
        onReload?: ReturnType<typeof useXChat>["onReload"];
    }>;
}

export default (props: MessagesProps) => {

    const [className] = useMarkdownTheme();
    const { messages } = useModel('chat');
    const { locale } = useModel('local');

    return messages?.length !== 0 && (
        /* 🌟 消息列表 */
        <Bubble.List
            ref={props.listRef}
            style={{
                //height: `calc(100% - 160px)`,
                // flex: 1 表示占据剩余空间 （父元素需 { display: 'flex', flexDirection: 'column', height: '100vh' }）
                flex: 1,
                overflow: 'auto'
            }}
            items={messages?.map((i: MessageInfo<XModelMessage>) => ({
                ...i.message,
                key: i.id,
                status: i.status,
                loading: i.status === 'loading',
                extraInfo: i.message.extraInfo,
            }))}
            styles={{
                root: {
                    marginBlockEnd: 12,
                },
                bubble: { maxWidth: 840 },
            }}
            role={getRole(className, props.chatContext, locale)}
        />
    )
}