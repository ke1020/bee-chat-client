import { CloudUploadOutlined } from "@ant-design/icons";
import { Attachments, Sender } from "@ant-design/x";
import { useModel } from "@umijs/max";
import { GetRef, UploadFile } from "antd";
import { forwardRef } from "react";

interface SenderHeaderProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fileList: UploadFile[];
    onFileListChange: (fileList: UploadFile[]) => void;
}

export default forwardRef<GetRef<typeof Attachments>, SenderHeaderProps>((props, ref) => {
    const { locale } = useModel('locales')
    return (
        <Sender.Header
            title={locale.uploadFile}
            open={props.open}
            onOpenChange={props.onOpenChange}
            styles={{ content: { padding: 5 } }}
        >
            <Attachments
                ref={ref}
                action="/api/upload"
                beforeUpload={() => true}
                items={props.fileList}
                onChange={(info) => props.onFileListChange(info.fileList)}
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
            />
        </Sender.Header>
    );
});