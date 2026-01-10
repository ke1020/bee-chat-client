import { Affix, Flex } from "antd"
import LanguageSwitch from "./LanguageSwitch"
import ThemeSwitch from "./ThemeSwitch"

export default () => {
    return (<Affix style={{ position: 'absolute', top: 20, right: 40 }}>
        <Flex gap="small" justify="flex-end">
            <LanguageSwitch />
            <ThemeSwitch />
        </Flex>
    </Affix>)
}