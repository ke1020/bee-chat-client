import { XProvider } from '@ant-design/x';
import { useXChat } from '@ant-design/x-sdk';
import { message } from 'antd';
import React, { useRef } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';
import { BubbleListRef } from '@ant-design/x/es/bubble';
import { useModel } from '@umijs/max';
import Toolbars from '@/components/Toolbars';
import Conversations from '@/components/Chat/Conversations'
import Messages from '@/components/Chat/Messages';
import Sender from '@/components/Chat/Sender/Index'

// ==================== Context ====================
const ChatContext = React.createContext<{
  onReload?: ReturnType<typeof useXChat>['onReload'];
}>({});

const App = () => {
  const { locale } = useModel('locales');
  const { styles, themeConfig } = useModel('themes');
  const { onReload } = useModel('messages');

  const listRef = useRef<BubbleListRef>(null);

  const [messageApi, contextHolder] = message.useMessage();

  return (
    <XProvider locale={locale} theme={themeConfig}>
      {contextHolder}
      <ChatContext.Provider value={{ onReload }}>
        <div className={styles.layout}>
          <div className={styles.side}>
            <div className={styles.logo}>
              <img
                src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
                draggable={false}
                alt="logo"
                width={24}
                height={24}
              />
              <span>Ant Design X</span>
            </div>
            <Conversations messageApi={messageApi} />
          </div>
          <div className={styles.chat}>
            <div className={styles.chatList}>
              <Toolbars />
              <Messages listRef={listRef} chatContext={ChatContext} />
              <Sender listRef={listRef} />
            </div>
          </div>
        </div>
      </ChatContext.Provider>
    </XProvider>
  );
};

export default App;