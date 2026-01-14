import { OpenAIOutlined, PaperClipOutlined } from "@ant-design/icons";
import { Sender } from "@ant-design/x";
import { useModel } from "@umijs/max";
import { Button, Flex } from "antd";
import { useState } from "react";

interface SendFooterProps {
    actionNode: React.ReactNode;
    attachmentsOpen: boolean;
    setAttachmentsOpen: (open: boolean) => void;
}

export default (props: SendFooterProps) => {
    const { locale } = useModel('locales');
    const [deepThink, setDeepThink] = useState<boolean>(true);

    return (
        <Flex justify="space-between" align="center">
            <Flex gap="small">
                <Button
                    type="text"
                    icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
                    onClick={() => props.setAttachmentsOpen(!props.attachmentsOpen)}
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
            <Flex align="center">{props.actionNode}</Flex>
        </Flex>
    );
}