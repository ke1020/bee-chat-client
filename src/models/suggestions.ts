import { Suggestion } from "@ant-design/x";
import { GetProp } from "antd";
import { useState } from "react";

type SuggestionItems = Exclude<GetProp<typeof Suggestion, 'items'>, () => void>;

const suggestions: SuggestionItems = [
    { label: '语音识别', value: 'asr' },
    { label: 'Write a report', value: 'report' },
    { label: 'Draw a picture', value: 'draw' },
    {
        label: 'Check some knowledge',
        value: 'knowledge',
        //icon: <OpenAIFilled />,
        children: [
            {
                label: 'About React',
                value: 'react',
            },
            {
                label: 'About Ant Design',
                value: 'antd',
            },
        ],
    },
];

export default () => {

    const [suggestion, setSuggestion] = useState<string>('')

    return { suggestion, suggestions, setSuggestion }
}