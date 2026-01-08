import { AppstoreAddOutlined, FileSearchOutlined, ProductOutlined, ScheduleOutlined } from "@ant-design/icons";
import { Prompts } from "@ant-design/x";
import { useModel } from "@umijs/max";
import { GetProp } from "antd";

export default () => {
    const { locale } = useModel('local');

    const SENDER_PROMPTS: GetProp<typeof Prompts, 'items'> = [
        {
            key: '1',
            description: locale.upgrades,
            icon: <ScheduleOutlined />,
        },
        {
            key: '2',
            description: locale.components,
            icon: <ProductOutlined />,
        },
        {
            key: '3',
            description: locale.richGuide,
            icon: <FileSearchOutlined />,
        },
        {
            key: '4',
            description: locale.installationIntroduction,
            icon: <AppstoreAddOutlined />,
        },
    ];

    return <div>
        <Prompts
            items={SENDER_PROMPTS}
            onItemClick={(info) => {
                //onSubmit(info.data.description as string);
            }}
            styles={{
                item: { padding: '6px 12px' },
            }}
        //className={styles.senderPrompt}
        />
    </div>
}