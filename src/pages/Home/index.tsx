import { Sender, XProvider } from '@ant-design/x';
import { GetRef, message } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useXChat } from '@ant-design/x-sdk';
import { BubbleListRef } from '@ant-design/x/es/bubble';
import { useModel } from '@umijs/max';
import Sender1 from '@/components/Chat/Sender';
import Conversations from '@/components/Chat/Conversations';
import Messages from '@/components/Chat/Messages';
import Toolbar from '@/components/Toolbars/Index';


// ==================== Context ====================
const ChatContext = React.createContext<{
  onReload?: ReturnType<typeof useXChat>['onReload'];
}>({});

const App = () => {
  const listRef = useRef<BubbleListRef>(null);
  const senderRef = useRef<GetRef<typeof Sender>>(null);

  const { locale } = useModel('locales');
  const { onReload } = useModel('messages');
  const { styles, themeConfig } = useModel('themes');

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    senderRef.current!.focus({
      cursor: 'end',
    });
  }, [senderRef.current]);


  return (
    <XProvider locale={locale} theme={themeConfig}>
      {contextHolder}
      <ChatContext.Provider value={{ onReload }}>
        <div className={styles.layout}>
          <Toolbar />
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
              <Messages listRef={listRef} senderRef={senderRef} chatContext={ChatContext} />
              <Sender1 listRef={listRef} senderRef={senderRef} />
            </div>
          </div>
        </div>
      </ChatContext.Provider>
    </XProvider>
  );
};

export default App;