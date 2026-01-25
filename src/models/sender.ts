import { SenderProps } from "@ant-design/x"
import { UseLocaleReturn } from "./locales";
import { useMemo, useState } from "react";
import { useModel } from "@umijs/max";
import { UploadFile } from "antd";

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

    const { locale } = useModel('locales') as UseLocaleReturn;
    const [attachmentsOpen, setAttachmentsOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

    const slotConfig = useMemo(() => getSlotConfig(locale), [locale])

    return {
        slotConfig,
        attachmentsOpen,
        setAttachmentsOpen,
        fileList,
        setFileList
    }
}