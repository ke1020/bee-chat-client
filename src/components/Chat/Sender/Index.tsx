import { Sender, SenderProps } from "@ant-design/x";
import { BubbleListRef } from "@ant-design/x/es/bubble";
import { useModel } from "@umijs/max";
import { GetRef } from "antd";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import Footer from "./Footer";

interface AiSenderProps {
    listRef: React.RefObject<BubbleListRef>;
}

export default (props: AiSenderProps) => {
    const { locale } = useModel('locales');
    const { styles } = useModel('themes');
    const { messages, isRequesting, abort, onRequest } = useModel('messages');
    const { curConversation, setActiveConversation } = useModel('conversations');
    const senderRef = useRef<GetRef<typeof Sender>>(null);

    const slotConfig: SenderProps['slotConfig'] = [
        { type: 'text', value: locale.slotTextStart },
        {
            type: 'select',
            key: 'destination',
            props: {
                defaultValue: 'X SDK',
                options: ['X SDK', 'X Markdown', 'Bubble'],
            },
        },
        { type: 'text', value: locale.slotTextEnd },
    ];

    useEffect(() => {
        senderRef.current!.focus({
            cursor: 'end',
        });
    }, [senderRef.current]);

    return <div
        style={{ width: '100%', maxWidth: 840 }}
        className={clsx({ [styles.startPage]: messages.length === 0 })}
    >
        {messages.length === 0 && (
            <div className={styles.agentName}>{locale.agentName}</div>
        )}
        <Sender
            suffix={false}
            ref={senderRef}
            key={curConversation}
            slotConfig={slotConfig}
            loading={isRequesting}
            onSubmit={(val) => {
                if (!val) return;
                onRequest({
                    messages: [{ role: 'user', content: val }],
                    thinking: {
                        type: 'disabled',
                    },
                });
                props.listRef.current?.scrollTo({ top: 'bottom' });
                setActiveConversation(curConversation);
                senderRef.current?.clear?.();
            }}
            onCancel={() => {
                abort();
            }}
            placeholder={locale.placeholder}
            footer={(actionNode) => <Footer actionNode={actionNode} />}
            autoSize={{ minRows: 2, maxRows: 6 }}
        />
    </div>
}