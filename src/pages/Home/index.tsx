import { OpenAIOutlined } from '@ant-design/icons';
import {
  Sender,
  SenderProps,
  XProvider,
} from '@ant-design/x';
import {
  useXChat,
} from '@ant-design/x-sdk';
import { Flex, GetRef, message } from 'antd';
import { clsx } from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';
import { BubbleListRef } from '@ant-design/x/es/bubble';
import { useModel } from '@umijs/max';
import Toolbars from '@/components/Toolbars';
import Conversations from '@/components/Chat/Conversations'
import Messages from '@/components/Chat/Messages';

// ==================== Context ====================
const ChatContext = React.createContext<{
  onReload?: ReturnType<typeof useXChat>['onReload'];
}>({});

const App = () => {
  const { locale } = useModel('locales');
  const { styles, themeConfig } = useModel('themes');
  const { curConversation, setActiveConversation } = useModel('conversations');
  const { messages, isRequesting, abort, onReload, onRequest } = useModel('messages');

  const slotConfig: SenderProps['slotConfig'] = [
    { type: 'text', value: locale.slotTextStart },
    {
      type: 'select',
      key: 'destination',
      props: {
        defaultValue: 'X SDK',
        options: ['X SDK', 'X Markdown', 'Bubble'],
      },
    },
    { type: 'text', value: locale.slotTextEnd },
  ];

  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const listRef = useRef<BubbleListRef>(null);



  const [messageApi, contextHolder] = message.useMessage();
  const [deepThink, setDeepThink] = useState<boolean>(true);

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
              <div
                style={{ width: '100%', maxWidth: 840 }}
                className={clsx({ [styles.startPage]: messages.length === 0 })}
              >
                {messages.length === 0 && (
                  <div className={styles.agentName}>{locale.agentName}</div>
                )}
                <Sender
                  suffix={false}
                  ref={senderRef}
                  key={curConversation}
                  slotConfig={slotConfig}
                  loading={isRequesting}
                  onSubmit={(val) => {
                    if (!val) return;
                    onRequest({
                      messages: [{ role: 'user', content: val }],
                      thinking: {
                        type: 'disabled',
                      },
                    });
                    listRef.current?.scrollTo({ top: 'bottom' });
                    setActiveConversation(curConversation);
                    senderRef.current?.clear?.();
                  }}
                  onCancel={() => {
                    abort();
                  }}
                  placeholder={locale.placeholder}
                  footer={(actionNode) => {
                    return (
                      <Flex justify="space-between" align="center">
                        <Flex gap="small" align="center">
                          <Sender.Switch
                            value={deepThink}
                            onChange={(checked: boolean) => {
                              setDeepThink(checked);
                            }}
                            icon={<OpenAIOutlined />}
                          >
                            {locale.deepThink}
                          </Sender.Switch>
                        </Flex>
                        <Flex align="center">{actionNode}</Flex>
                      </Flex>
                    );
                  }}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </div>
            </div>
          </div>
        </div>
      </ChatContext.Provider>
    </XProvider>
  );
};

export default App;