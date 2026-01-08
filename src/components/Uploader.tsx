import { useState } from 'react';
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useModel } from '@umijs/max';

const { Dragger } = Upload;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

interface UploaderProps extends UploadProps {
    setFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
}

export default (props: UploaderProps) => {

    const action = "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload";
    const maxCount = props.maxCount || 1;
    const { locale } = useModel('local')
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const fileList = props.fileList || [];

    const onPreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        props.setFileList(newFileList);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{locale.uploadFile}</div>
        </button>
    );

    // 当 fileList 为空时，显示 Dragger
    if (fileList.length === 0) {
        return (
            <Dragger
                action={action}
                fileList={fileList}
                onChange={onChange}
                maxCount={maxCount}
                multiple={maxCount > 1}
                showUploadList={false}
                style={{ background: 'transparent', border: 'none' }}
            >
                <p className="ant-upload-drag-icon">
                    <CloudUploadOutlined />
                </p>
                <p className="ant-upload-text">{locale.clickOrDragFilesToUpload}</p>
                <p className="ant-upload-hint">
                    {locale.clickOrDragFilesToThisAreaToUpload}
                </p>
            </Dragger>
        );
    }

    // 当 fileList 不为空时，显示原来的 picture-card 上传列表
    return (
        <>
            <Upload
                action={action}
                listType="picture-card"
                fileList={fileList}
                onPreview={onPreview}
                onChange={onChange}
                maxCount={maxCount}
                multiple={maxCount > 1}
            >
                {fileList.length >= maxCount ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    styles={{ root: { display: 'none' } }}
                    preview={{
                        open: previewOpen,
                        //onOpenChange: (visible) => setPreviewOpen(visible),
                        //afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};