import { Attachments, Sender, Suggestion } from "@ant-design/x";
import { useModel } from "@umijs/max";
import { clsx } from 'clsx';
import { GetRef, UploadFile } from "antd";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SenderRef } from "@ant-design/x/es/sender";
import { BubbleListRef } from "@ant-design/x/es/bubble";
import Prompts from "./Prompts";
import SenderHeader from "./SenderHeader";
import SenderFooter from "./SenderFooter";

interface SenderProps {
    senderRef: React.RefObject<SenderRef>;
    listRef: React.RefObject<BubbleListRef>;
}

export default (props: SenderProps) => {
    const { curConversation, setActiveConversation } = useModel('converstations');
    const { messages, onRequest, isRequesting, abort } = useModel('messages');
    const { suggestions } = useModel('suggestions');
    const { styles } = useModel('themes');
    const { locale } = useModel('locales');
    const { attachmentsOpen, setAttachmentsOpen } = useModel('files');
    const { skill, setCurrentSkill, clearSkill } = useModel('prompts');

    const [suggestion, setSuggestion] = useState<string>('');
    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

    const attachmentsRef = useRef<GetRef<typeof Attachments>>(null);
    const pendingFilesRef = useRef<File[]>([]);

    // 技能变更之后设置发送框焦点
    useEffect(() => {
        props.senderRef.current?.focus();
    }, [skill]);

    // 附件窗口打开之后，处理文件粘贴（在所有的 DOM 变更之后同步执行）
    useLayoutEffect(() => {
        if (attachmentsOpen && pendingFilesRef.current.length > 0) {
            const uploadFiles = () => {
                if (attachmentsRef.current) {
                    pendingFilesRef.current.forEach(file => {
                        attachmentsRef.current?.upload(file);
                    });
                    pendingFilesRef.current = [];
                }
            };

            const rafId = requestAnimationFrame(uploadFiles);
            return () => cancelAnimationFrame(rafId);
        }
    }, [attachmentsOpen]);

    // 监听文件粘贴事件
    const onPasteFile = useCallback((files: FileList) => {
        const fileArray = Array.from(files);

        // 如果附件面板已打开，则上传文件
        if (attachmentsOpen && attachmentsRef.current) {
            fileArray.forEach(file => {
                attachmentsRef.current?.upload(file);
            });
        } else {
            pendingFilesRef.current = [...pendingFilesRef.current, ...fileArray];
            // 触发显示附件面板
            setAttachmentsOpen(true);
        }
    }, [attachmentsOpen, setAttachmentsOpen]);

    // 发送框提交事件
    const onSenderSubmit = useCallback((val: string) => {
        if (!val) return;

        onRequest({
            messages: [{ role: 'user', content: val }],
            thinking: { type: 'disabled' },
        });

        props.listRef.current?.scrollTo({ top: 'bottom' });
        setActiveConversation(curConversation);
        props.senderRef.current?.clear?.();
    }, [onRequest, props.listRef, setActiveConversation, curConversation, props.senderRef]);

    const containerClassName = clsx(
        styles.startPage && messages.length === 0
    );

    const AgentName = () => messages.length === 0 ? (
        <div className={styles.agentName} style={{ textAlign: 'center' }}>{locale.agentName}</div>
    ) : null;

    return (
        <div style={{ width: '100%', maxWidth: 860, flexShrink: 0 }} className={containerClassName}>
            <AgentName />

            <div style={{ marginBottom: 10 }}>
                <Prompts />
            </div>

            <Suggestion
                items={suggestions}
                onSelect={setCurrentSkill}
                styles={{ content: { width: '100%' } }}
            >
                {({ onTrigger, onKeyDown }) => (
                    <Sender
                        styles={{ footer: { paddingBlockEnd: 10 } }}
                        suffix={false}
                        allowSpeech={true}
                        ref={props.senderRef}
                        key={curConversation}
                        skill={skill}
                        header={
                            <SenderHeader
                                ref={attachmentsRef}
                                fileList={fileList}
                                open={attachmentsOpen}
                                onOpenChange={setAttachmentsOpen}
                                onFileListChange={setFileList}
                            />
                        }
                        value={suggestion}
                        loading={isRequesting}
                        onKeyDown={onKeyDown}
                        onChange={(nextVal, e, s, skill) => {
                            if (skill) {
                                setSuggestion(nextVal);
                                return;
                            }
                            clearSkill();

                            if (nextVal === '/') {
                                onTrigger();
                            } else if (!nextVal) {
                                onTrigger(false);
                            }
                            setSuggestion(nextVal);
                        }}
                        onSubmit={onSenderSubmit}
                        onPasteFile={onPasteFile}
                        onCancel={abort}
                        placeholder={locale.placeholder}
                        footer={(node) => <SenderFooter
                            actionNode={node}
                            attachmentsOpen={attachmentsOpen}
                            setAttachmentsOpen={setAttachmentsOpen}
                        />}
                        autoSize={{ minRows: 2, maxRows: 5 }}
                    />
                )}
            </Suggestion>
        </div>
    );
};