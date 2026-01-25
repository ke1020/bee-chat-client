import { Attachments, Sender, SenderProps } from "@ant-design/x";
import { GetRef, UploadFile } from "antd";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { UseLocaleReturn } from "./locales";
import { useModel } from "@umijs/max";

const getSlotConfig = (locale: UseLocaleReturn['locale']): SenderProps['slotConfig'] => [
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

export default () => {

    const { locale } = useModel('locales');
    const [slotConfig, setSlotConfig] = useState<SenderProps['slotConfig']>([]);
    const [attachmentsOpen, setAttachmentsOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
    
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
        senderRef.current?.focus({
            cursor: 'end',
        });
    }, [senderRef.current]);

    useEffect(() => {
        setSlotConfig(getSlotConfig(locale));
    }, [locale]);

    return {
        slotConfig,
        attachmentsOpen,
        setAttachmentsOpen,
        fileList,
        setFileList,
        attachmentsRef,
        pendingFilesRef,
        senderRef,
        onPasteFile
    }
}