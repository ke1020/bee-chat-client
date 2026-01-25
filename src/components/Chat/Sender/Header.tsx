import { CloudUploadOutlined } from "@ant-design/icons"
import { Attachments, Sender } from "@ant-design/x"
import { useModel } from "@umijs/max"
import { GetRef, UploadFile } from "antd";
import { forwardRef } from "react";

interface AiSenderHeaderProps {
    attachmentsOpen: boolean;
    setAttachmentsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fileList: UploadFile<any>[];
    setFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
}

/**
 * 输入框头部
 * forwardRef 主要是为了父组件将 Attachments 组件的 ref 传
 * 进来，父组件文件粘贴事件需要直接操作 Attachments 组件
 */
export default forwardRef<GetRef<typeof Attachments>, AiSenderHeaderProps>((props, ref) => {
    const { locale } = useModel('locales');

    return <Sender.Header
        title={locale.uploadFile}
        open={props.attachmentsOpen}
        onOpenChange={props.setAttachmentsOpen}
        styles={{ content: { padding: 5 } }}
    >
        <Attachments
            ref={ref}
            action="https://localhost:44300/api/upload"
            beforeUpload={() => true}
            items={props.fileList}
            onChange={(info) => props.setFileList(info.fileList)}
            placeholder={(type) =>
                type === 'drop'
                    ? { title: locale.dropFileHere }
                    : {
                        icon: <CloudUploadOutlined />,
                        title: locale.uploadFiles,
                        description: locale.clickOrDragFilesToUpload,
                    }
            }
            multiple={true}
            progress={{
                format: (percent) => percent && `${Number.parseFloat(percent.toFixed(2))}%`
            }}
        />
    </Sender.Header>
});