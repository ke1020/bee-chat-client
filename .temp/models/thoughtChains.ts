import { ThoughtChainItemType } from "@ant-design/x";
import { useEffect, useState } from "react"

interface TaskItem {
    key: string;
    taskType: 'transcode' | 'asr' | 'tts' | 'ocr' | 'translate' | 'convert',
    description?: string;
    percent?: number;
}

export default () => {
    const [chains, setChains] = useState<ThoughtChainItemType[]>([{
        key: 'transcode',
        title: '文件转码',
        description: '文件转码通过转换格式与参数，解决媒体文件的兼容性问题，并优化其体积与质量，从而提升处理效率，为后续的识别、分析等环节提供高质量的标准化输入。',
        status: 'success',
        collapsible: true
    }, {
        key: 'asr',
        title: '语音转写',
        description: '将音频内容转换为文本，方便后续的文本分析与处理。',
        status: 'loading',
        collapsible: true
    }]);
    const [tasks, setTasks] = useState<TaskItem[]>([]);

    useEffect(() => {
        setTasks([{
            key: 'a',
            taskType: 'transcode',
            description: '正在对【温润青年.mp3】进行转码...',
            percent: 50.5,
        }, {
            key: 'b',
            taskType: 'transcode',
            description: '正在对【温润青年温润青年.mp3】进行转码...',
            percent: 80.7
        }]);
    }, []);

    return { chains, tasks };
}