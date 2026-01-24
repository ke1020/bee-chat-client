import { OpenAIOutlined } from "@ant-design/icons";
import { Sender } from "@ant-design/x";
import { useModel } from "@umijs/max";
import { Flex } from "antd";
import { useState } from "react";

interface AiSenderFooterProps {
    actionNode: React.ReactNode;
}

export default (props: AiSenderFooterProps) => {
    const { locale } = useModel('locales');
    const [deepThink, setDeepThink] = useState<boolean>(true);

    return <Flex justify="space-between" align="center">
        <Flex gap="small" align="center">
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
}