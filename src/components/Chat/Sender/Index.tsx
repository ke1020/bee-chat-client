import { Attachments, Sender } from "@ant-design/x";
import { BubbleListRef } from "@ant-design/x/es/bubble";
import { useModel } from "@umijs/max";
import { GetRef } from "antd";
import clsx from "clsx";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface AiSenderProps {
    listRef: React.RefObject<BubbleListRef>;
}

export default (props: AiSenderProps) => {
    const { locale } = useModel('locales');
    const { styles } = useModel('themes');
    const { messages, isRequesting, abort, onRequest } = useModel('messages');
    const { curConversation, setActiveConversation } = useModel('conversations');
    const {
        slotConfig,
        attachmentsOpen,
        setAttachmentsOpen,
        fileList,
        setFileList
    } = useModel('sender');

    const senderRef = useRef<GetRef<typeof Sender>>(null);
    const attachmentsRef = useRef<GetRef<typeof Attachments>>(null);
    const pendingFilesRef = useRef<File[]>([]);

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

    useEffect(() => {
        senderRef.current!.focus({
            cursor: 'end',
        });
    }, [senderRef.current]);

    return <div
        style={{ width: '100%', maxWidth: 860, flexShrink: 0 }}
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
            onCancel={abort}
            placeholder={locale.placeholder}
            header={<Header attachmentsOpen={attachmentsOpen}
                setAttachmentsOpen={setAttachmentsOpen}
                fileList={fileList}
                setFileList={setFileList}
                ref={attachmentsRef}
            />}
            footer={(actionNode) => <Footer actionNode={actionNode}
                attachmentsOpen={attachmentsOpen}
                setAttachmentsOpen={setAttachmentsOpen}
            />}
            autoSize={{ minRows: 2, maxRows: 6 }}
            onPasteFile={onPasteFile}
        />
    </div>
}