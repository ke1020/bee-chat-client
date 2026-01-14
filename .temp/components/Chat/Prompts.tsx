import { Prompts } from "@ant-design/x";
import { useModel } from "@umijs/max";
import { Spin } from "antd";

export default () => {
    const { setCurrentSkill, skills, loading, error } = useModel('skills')

    if (loading) {
        return <Spin />
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return <div>
        <Prompts
            items={skills}
            onItemClick={(info) => {
                setCurrentSkill(info.data.key);
            }}
            styles={{
                item: { padding: '6px 12px' },
            }}
        />
    </div>
}