import { Prompts } from "@ant-design/x";
import { useModel } from "@umijs/max";
import { Spin } from "antd";

export default () => {
    const { setCurrentSkill, prompts, loading, error } = useModel('prompts')

    if (loading) {
        return <Spin />
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return <div>
        <Prompts
            items={prompts}
            onItemClick={(info) => {
                setCurrentSkill(info.data.key);
            }}
            styles={{
                item: { padding: '6px 12px' },
            }}
        />
    </div>
}