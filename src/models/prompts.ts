import { PromptsItemType } from "@ant-design/x";
import { SkillType } from "@ant-design/x/es/sender/interface";
import { useEffect, useState, useCallback, useRef } from "react";
import icons from "@/utils/icons";
import { useModel } from "@umijs/max";

// 定义技能类型
interface SkillProps {
    skill: string;
    name: string;
}

// 模拟数据 - 实际应从服务器获取
const MOCK_SKILLS: SkillProps[] = [
    { skill: 'asr', name: '语音识别' },
    { skill: 'tts', name: '语音合成' },
    { skill: 'ocr', name: '图像识别' },
    { skill: 'translate', name: '翻译' },
    { skill: 'transcode', name: '音视频转码' }
];

// 模拟API请求
const fetchSkills = async (): Promise<Record<string, SkillType>> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const skills = MOCK_SKILLS.reduce((acc, { skill, name }) => {
                    acc[skill] = {
                        title: name,
                        value: skill,
                        closable: true,
                    };
                    return acc;
                }, {} as Record<string, SkillType>);

                resolve(skills);
            } catch (error) {
                reject(new Error('处理技能数据失败'));
            }
        }, 1000);
    });
};

interface UseSkillsReturn {
    skill: SkillType | undefined;
    setCurrentSkill: (value: string) => void;
    clearSkill: () => void;
    prompts: PromptsItemType[];
    loading: boolean;
    error: string | null;
    // skillsMap: Record<string, SkillType> | null;
    refetch: () => Promise<void>;
}

export default (): UseSkillsReturn => {
    const { locale } = useModel('locales');
    // 获取或设置当前技能
    const [skill, setSkill] = useState<SkillType | undefined>();
    // 获取或设置提示词（从技能转换提示词）
    const [prompts, setPrompts] = useState<PromptsItemType[]>([]);
    // 缓存技能列表，快速查找技能
    const [skillsMap, setSkillsMap] = useState<Record<string, SkillType> | null>(null);
    // 获取或设置载入状态
    const [loading, setLoading] = useState(false);
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
    const fetchSkillsData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const skills = await fetchSkills();

            if (!isMountedRef.current) return;

            // 更新技能映射
            setSkillsMap(skills);

            // 转换为提示数据
            const promptsData = Object.values(skills).map((x) => ({
                key: x.value,
                description: x.title,
                icon: getIcon(x.value),
            }));

            setPrompts(promptsData);
        } catch (err) {
            console.error(locale.fetchSkillsFailed, err);

            if (!isMountedRef.current) return;

            setError(err instanceof Error ? err.message : 'Failed to load skills');

            // 设置空状态，避免 UI 错误
            setPrompts([]);
            setSkillsMap(null);
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [getIcon]); // ← 移除了 skill 依赖

    /**
     * 重新获取数据
     */
    const refetch = useCallback(async () => {
        await fetchSkillsData();
    }, [fetchSkillsData]);

    // 初始加载
    useEffect(() => {
        isMountedRef.current = true;

        fetchSkillsData();

        return () => {
            isMountedRef.current = false;
        };
    }, [fetchSkillsData]);

    return {
        skill,
        setCurrentSkill,
        clearSkill,
        prompts,
        loading,
        error,
        refetch,
    };
}