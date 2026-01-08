import { OpenAIOutlined, PaperClipOutlined } from "@ant-design/icons";
import { Sender, Suggestion } from "@ant-design/x";
import { useModel } from "@umijs/max";
import { clsx } from 'clsx';
import { Button, Flex } from "antd";
import { useState } from "react";
import { SenderRef } from "@ant-design/x/es/sender";
import { BubbleListRef } from "@ant-design/x/es/bubble";
import Uploader from "./Uploader";
import Prompts from "./Prompts";

interface SenderProps {
    senderRef: React.RefObject<SenderRef>;
    listRef: React.RefObject<BubbleListRef>;
}

export default (props: SenderProps) => {

    const { curConversation, setActiveConversation } = useModel('converstation');
    const { messages, onRequest, isRequesting, abort } = useModel('chat');
    const { suggestions } = useModel('suggestions')
    const { styles } = useModel('theme');
    const { locale } = useModel('local');
    const { attachmentsOpen, setAttachmentsOpen } = useModel('files');
    const [deepThink, setDeepThink] = useState<boolean>(true);
    const [suggestion, setSuggestion] = useState<string>('')

    const senderHeader = (
        <Sender.Header
            title={locale.uploadFile}
            open={attachmentsOpen}
            onOpenChange={setAttachmentsOpen}
            styles={{ content: { padding: 10 } }}
        >
            <Uploader maxCount={50} />
        </Sender.Header>
    );

    // flexShrink: 0 表示自动高度 （父元素需 { display: 'flex', flexDirection: 'column', height: '100vh' }）
    return <div
        style={{ width: '100%', maxWidth: 860, flexShrink: 0 }}
        className={clsx({ [styles.startPage]: messages.length === 0 })}
    >
        {messages.length === 0 && (
            <div className={styles.agentName}>{locale.agentName}</div>
        )}
        <div style={{ marginBottom: 10 }}>
            <Prompts />
        </div>
        <Suggestion
            items={suggestions}
            onSelect={(itemVal) => {
                setSuggestion(`[${itemVal}]:`);
            }}
            styles={{ content: { width: '100%' } }}
        >
            {({ onTrigger, onKeyDown }) => {
                return (<Sender
                    styles={{
                        footer: {
                            paddingBlockEnd: 10
                        }
                    }}
                    suffix={false}
                    ref={props.senderRef}
                    key={curConversation}
                    //slotConfig={slotConfig}
                    header={senderHeader}
                    value={suggestion}
                    loading={isRequesting}
                    onKeyDown={onKeyDown}
                    onChange={(nextVal) => {

                        if (nextVal === '/') {
                            onTrigger();
                        } else if (!nextVal) {
                            onTrigger(false);
                        }
                        setSuggestion(nextVal);
                    }}
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
                        props.senderRef.current?.clear?.();
                    }}
                    onCancel={() => {
                        abort();
                    }}
                    placeholder={locale.placeholder}
                    footer={(actionNode) => {
                        return (
                            <Flex justify="space-between" align="center">
                                <Flex gap="small">
                                    <Button
                                        type="text"
                                        icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
                                        onClick={() => setAttachmentsOpen(!attachmentsOpen)}
                                    />
                                    <Sender.Switch
                                        value={deepThink}
                                        onChange={(checked: boolean) => {
                                            setDeepThink(checked);
                                        }}
                                        icon={<OpenAIOutlined />}
                                    >
                                        {locale.deepThink}
                                    </Sender.Switch>
                                </Flex>
                                <Flex align="center">{actionNode}</Flex>
                            </Flex>
                        );
                    }}
                    autoSize={{ minRows: 2, maxRows: 5 }}
                />)
            }}
        </Suggestion>
    </div>
}