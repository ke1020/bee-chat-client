import { Attachments } from "@ant-design/x";
import { GetProp } from "antd";
import { useState } from "react";

export default () => {
    const [attachmentsOpen, setAttachmentsOpen] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<GetProp<typeof Attachments, 'items'>>([]);

    return { attachmentsOpen, setAttachmentsOpen, attachedFiles, setAttachedFiles }
}