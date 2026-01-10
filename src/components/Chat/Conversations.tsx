import { DeleteOutlined } from "@ant-design/icons";
import { Conversations } from "@ant-design/x";
import { useModel } from "@umijs/max";
import { MessageInstance } from "antd/lib/message/interface";
import dayjs from 'dayjs';
import { useEffect } from "react";

interface ConversationsProps {
    messageApi: MessageInstance;
}

export default (props: ConversationsProps) => {
    const { styles } = useModel('themes');
    const { locale } = useModel('locales');
    const { messages } = useModel('messages');
    const {
        conversations,
        curConversation,
        activeConversation,
        addConversation,
        setCurConversation,
        setConversations,
        initialConversations
    } = useModel('converstations');

    useEffect(() => {
        initialConversations(locale)
    }, [locale])

    return <Conversations
        creation={{
            onClick: () => {
                if (messages.length === 0) {
                    props.messageApi.error(locale.itIsNowANewConversation);
                    return;
                }
                const now = dayjs().valueOf().toString();
                addConversation({
                    key: now,
                    label: `${locale.newConversation} ${conversations.length + 1}`,
                    group: locale.today,
                });
                setCurConversation(now);
            },
        }}
        items={conversations
            .map(({ key, label, ...other }) => ({
                key,
                label: key === activeConversation ? `[${locale.curConversation}]${label}` : label,
                ...other,
            }))
            .sort(({ key }) => (key === activeConversation ? -1 : 0))}
        className={styles.conversations}
        activeKey={curConversation}
        onActiveChange={async (val) => {
            setCurConversation(val);
        }}
        groupable
        styles={{ item: { padding: '0 8px' } }}
        menu={(conversation) => ({
            items: [
                {
                    label: locale.delete,
                    key: 'delete',
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => {
                        const newList = conversations.filter((item) => item.key !== conversation.key);
                        const newKey = newList?.[0]?.key;
                        setConversations(newList);
                        if (conversation.key === curConversation) {
                            setCurConversation(newKey);
                        }
                    },
                },
            ],
        })}
    />
}