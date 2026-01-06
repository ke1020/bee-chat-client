import { ThemePaletteKey, ThemeSetting } from "@/models/theme";
import { MoonOutlined, SunOutlined, SyncOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import { Badge, Button, Dropdown, Flex, MenuProps } from "antd"
import { useMemo } from "react";

/*
<Flex gap="small" justify="flex-end">
    <LanguageSwitch />
    <ThemeSwitch />
</Flex>
*/

export default () => {

    const { themeSetting, changeTheme } = useModel('theme');
    const { locale } = useModel('local')

    const items: MenuProps['items'] = useMemo(() => [
        {
            key: 'auto',
            label: locale.themeAuto,
            icon: <SyncOutlined />,
            onClick: (e) => changeTheme(e.key as ThemeSetting),
            extra: themeSetting === 'auto' && <Badge color='blue' />,
        },
        {
            key: ThemePaletteKey.DARK,
            label: locale.themeDark,
            icon: <MoonOutlined />,
            onClick: (e) => changeTheme(e.key as ThemeSetting),
            extra: themeSetting === ThemePaletteKey.DARK && <Badge color='blue' />
        },
        {
            key: ThemePaletteKey.LIGHT,
            label: locale.themeLight,
            icon: <SunOutlined />,
            onClick: (e) => changeTheme(e.key as ThemeSetting),
            extra: themeSetting === ThemePaletteKey.LIGHT && <Badge color='blue' />
        },
    ], [locale, themeSetting]);

    return <Flex>
        <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
            <Button type="text" shape="circle" block>
                <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><title>Theme icon</title><g><g><path d="M7.02 3.635l12.518 12.518a1.863 1.863 0 010 2.635l-1.317 1.318a1.863 1.863 0 01-2.635 0L3.068 7.588A2.795 2.795 0 117.02 3.635zm2.09 14.428a.932.932 0 110 1.864.932.932 0 010-1.864zm-.043-9.747L7.75 9.635l9.154 9.153 1.318-1.317-9.154-9.155zM3.52 12.473c.514 0 .931.417.931.931v.932h.932a.932.932 0 110 1.864h-.932v.931a.932.932 0 01-1.863 0l-.001-.931h-.93a.932.932 0 010-1.864h.93v-.932c0-.514.418-.931.933-.931zm15.374-3.727a1.398 1.398 0 110 2.795 1.398 1.398 0 010-2.795zM4.385 4.953a.932.932 0 000 1.317l2.046 2.047L7.75 7 5.703 4.953a.932.932 0 00-1.318 0zM14.701.36a.932.932 0 01.931.932v.931h.932a.932.932 0 010 1.864h-.933l.001.932a.932.932 0 11-1.863 0l-.001-.932h-.93a.932.932 0 110-1.864h.93v-.931a.932.932 0 01.933-.932z"></path></g></g></svg>
            </Button>
        </Dropdown>
    </Flex>
}