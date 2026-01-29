import { PromptsItemType } from "@ant-design/x";
import { SkillType } from "@ant-design/x/es/sender/interface";
import { useEffect, useState, useCallback, useRef } from "react";
import icons from "@/assets/icons";
import { useModel } from "@umijs/max";

// 定义技能类型
interface SkillProps {
    name: string;
    description: string;
}

// 模拟数据 - 实际应从服务器获取
const MOCK_SKILLS: SkillProps[] = [
    { name: 'asr', description: '语音识别' },
    { name: 'tts', description: '语音合成' },
    { name: 'ocr', description: '图像识别' },
    { name: 'translate', description: '翻译' },
    { name: 'transcode', description: '音视频转码' },
    { name: 'convert', description: '格式转换' }
];

// 模拟API请求
const getSkills = async (): Promise<Record<string, SkillType>> => {
    return new Promise((resolve, reject) => {
        try {
            const skills = MOCK_SKILLS.reduce((acc, { name, description }) => {
                acc[name] = {
                    title: description,
                    value: name,
                    closable: true,
                };
                return acc;
            }, {} as Record<string, SkillType>);

            resolve(skills);
        } catch (error) {
            reject(new Error('处理技能数据失败'));
        }
    });
};

interface UseSkillsReturn {
    skill: SkillType | undefined;
    setCurrentSkill: (value: string) => void;
    clearSkill: () => void;
    skills: PromptsItemType[];
    loading: boolean;
    error: string | null;
    // skillsMap: Record<string, SkillType> | null;
    refresh: () => Promise<void>;
}

export default (): UseSkillsReturn => {
    // 获取或设置当前技能
    const [skill, setSkill] = useState<SkillType | undefined>();
    // 获取或设置技能列表
    const [skills, setSkills] = useState<PromptsItemType[]>([]);
    // 缓存技能列表，快速查找技能
    const [skillsMap, setSkillsMap] = useState<Record<string, SkillType> | null>(null);
    // 获取或设置载入状态
    const [loading, setLoading] = useState(false);
    // 获取或设置错误信息
    const [error, setError] = useState<string | null>(null);
    // 标记组件是否已挂载
    const isMountedRef = useRef(true);

    // 获取图标的辅助函数
    const getIcon = useCallback((skillKey: string) => {
        return icons[skillKey as keyof typeof icons] || undefined;
    }, []);

    // 设置当前技能
    const setCurrentSkill = useCallback((value: string) => {
        if (!skillsMap || !skillsMap[value]) {
            return;
        }

        setSkill(skillsMap[value]);
    }, [skillsMap]); // 只依赖 skillsMap，不依赖 skill

    // 清空技能
    const clearSkill = useCallback(() => {
        setSkill(undefined);
    }, []);

    /**
     * 获取技能数据
     */
    const getSkillsData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const skills = await getSkills();

            if (!isMountedRef.current) return;

            // 更新技能映射
            setSkillsMap(skills);

            // 转换为提示数据
            const skillsData = Object.values(skills).map((x) => ({
                key: x.value,
                description: x.title,
                icon: getIcon(x.value),
            }));

            setSkills(skillsData);
        } catch (err) {

            if (!isMountedRef.current) return;

            setError(err instanceof Error ? err.message : 'Failed to load skills');

            // 设置空状态，避免 UI 错误
            setSkills([]);
            setSkillsMap(null);
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [getIcon]);

    /**
     * 重新获取数据
     */
    const refresh = useCallback(async () => {
        await getSkillsData();
    }, [getSkillsData]);

    // 初始加载
    useEffect(() => {
        isMountedRef.current = true;

        getSkillsData();

        return () => {
            isMountedRef.current = false;
        };
    }, [getSkillsData]);

    return {
        skill,
        skills,
        setCurrentSkill,
        clearSkill,
        loading,
        error,
        refresh,
    };
}