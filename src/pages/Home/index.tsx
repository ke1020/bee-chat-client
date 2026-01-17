import { DeleteOutlined, OpenAIOutlined, SyncOutlined } from '@ant-design/icons';
import {
  Actions,
  Bubble,
  BubbleListProps,
  Conversations,
  Sender,
  SenderProps,
  XProvider,
} from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import {
  DeepSeekChatProvider,
  DefaultMessageInfo,
  SSEFields,
  useXChat,
  useXConversations,
  XModelMessage,
  XModelParams,
  XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Flex, GetRef, message } from 'antd';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';
import { BubbleListRef } from '@ant-design/x/es/bubble';
import { useModel } from '@umijs/max';
import Toolbars from '@/components/Toolbars';

// ==================== Context ====================
const ChatContext = React.createContext<{
  onReload?: ReturnType<typeof useXChat>['onReload'];
}>({});


const App = () => {
  const { locale } = useModel('locales');
  const { styles, themeConfig, markdownThemeClass } = useModel('themes');

  const DEFAULT_CONVERSATIONS_ITEMS = [
    {
      key: 'default-0',
      label: locale.whatIsAntDesignX,
      group: locale.today,
    },
    {
      key: 'default-1',
      label: locale.howToQuicklyInstallAndImportComponents,
      group: locale.today,
    },
    {
      key: 'default-2',
      label: locale.newAgiHybridInterface,
      group: locale.yesterday,
    },
  ];
  const HISTORY_MESSAGES: {
    [key: string]: DefaultMessageInfo<XModelMessage>[];
  } = {
    'default-1': [
      {
        message: { role: 'user', content: locale.howToQuicklyInstallAndImportComponents },
        status: 'success',
      },
      {
        message: {
          role: 'assistant',
          content: locale.aiMessage_2,
        },
        status: 'success',
      },
    ],
    'default-2': [
      { message: { role: 'user', content: locale.newAgiHybridInterface }, status: 'success' },
      {
        message: {
          role: 'assistant',
          content: locale.aiMessage_1,
        },
        status: 'success',
      },
    ],
  };

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
  const historyMessageFactory = (conversationKey: string): DefaultMessageInfo<XModelMessage>[] => {
    return HISTORY_MESSAGES[conversationKey] || [];
  };
  const providerCaches = new Map<string, DeepSeekChatProvider>();
  const providerFactory = (conversationKey: string) => {
    if (!providerCaches.get(conversationKey)) {
      providerCaches.set(
        conversationKey,
        new DeepSeekChatProvider({
          request: XRequest<XModelParams, Partial<Record<SSEFields, XModelResponse>>>(
            'https://api.x.ant.design/api/big_model_glm-4.5-flash',
            {
              manual: true,
              params: {
                stream: true,
                model: 'glm-4.5-flash',
              },
            },
          ),
        }),
      );
    }
    return providerCaches.get(conversationKey);
  };
  const Footer: React.FC<{
    id?: string;
    content: string;
    status?: string;
  }> = ({ id, content, status }) => {
    const context = React.useContext(ChatContext);
    const Items = [
      {
        key: 'retry',
        label: locale.retry,
        icon: <SyncOutlined />,
        onItemClick: () => {
          if (id) {
            context?.onReload?.(id, {
              userAction: 'retry',
            });
          }
        },
      },
      {
        key: 'copy',
        actionRender: <Actions.Copy text={content} />,
      },
    ];
    return status !== 'updating' && status !== 'loading' ? (
      <div style={{ display: 'flex' }}>{id && <Actions items={Items} />}</div>
    ) : null;
  };

  const getRole = (className: string): BubbleListProps['role'] => ({
    assistant: {
      placement: 'start',
      footer: (content, { status, key }) => (
        <Footer content={content} status={status} id={key as string} />
      ),
      contentRender: (content: any, { status }) => {
        const newContent = content.replace(/\n\n/g, '<br/><br/>');
        return (
          <XMarkdown
            paragraphTag="div"
            className={className}
            streaming={{
              hasNextChunk: status === 'updating',
              enableAnimation: true,
            }}
          >
            {newContent}
          </XMarkdown>
        );
      },
    },
    user: { placement: 'end' },
  });

  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const { conversations, addConversation, setConversations } = useXConversations({
    defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
  });
  const [curConversation, setCurConversation] = useState<string>(
    DEFAULT_CONVERSATIONS_ITEMS[0].key,
  );

  const [activeConversation, setActiveConversation] = useState<string>();

  const listRef = useRef<BubbleListRef>(null);

  // ==================== Runtime ====================

  const { onRequest, messages, isRequesting, abort, onReload } = useXChat({
    provider: providerFactory(curConversation), // every conversation has its own provider
    conversationKey: curConversation,
    defaultMessages: historyMessageFactory(curConversation),
    requestPlaceholder: () => {
      return {
        content: locale.noData,
        role: 'assistant',
      };
    },
    requestFallback: (_, { error, errorInfo, messageInfo }) => {
      if (error.name === 'AbortError') {
        return {
          content: messageInfo?.message?.content || locale.requestAborted,
          role: 'assistant',
        };
      }
      return {
        content: errorInfo?.error?.message || locale.requestFailed,
        role: 'assistant',
      };
    },
  });

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
            <Conversations
              creation={{
                onClick: () => {
                  if (messages.length === 0) {
                    messageApi.error(locale.itIsNowANewConversation);
                    return;
                  }
                  const now = dayjs().valueOf().toString();
                  addConversation({
                    key: now,
                    label: `${locale.newConversation} ${conversations.length + 1}`,
                    group: locale.today,
                  });
                  setCurConversation(now);
                },
              }}
              items={conversations
                .map(({ key, label, ...other }) => ({
                  key,
                  label: key === activeConversation ? `[${locale.curConversation}]${label}` : label,
                  ...other,
                }))
                .sort(({ key }) => (key === activeConversation ? -1 : 0))}
              className={styles.conversations}
              activeKey={curConversation}
              onActiveChange={async (val) => {
                setCurConversation(val);
              }}
              groupable
              styles={{ item: { padding: '0 8px' } }}
              menu={(conversation) => ({
                items: [
                  {
                    label: locale.delete,
                    key: 'delete',
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => {
                      const newList = conversations.filter((item) => item.key !== conversation.key);
                      const newKey = newList?.[0]?.key;
                      setConversations(newList);
                      if (conversation.key === curConversation) {
                        setCurConversation(newKey);
                      }
                    },
                  },
                ],
              })}
            />
          </div>
          <div className={styles.chat}>
            <div className={styles.chatList}>
              <Toolbars />
              {messages?.length !== 0 && (
                /* 🌟 消息列表 */
                <Bubble.List
                  ref={listRef}
                  style={{
                    height: 'calc(100% - 160px)',
                  }}
                  items={messages?.map((i) => ({
                    ...i.message,
                    key: i.id,
                    status: i.status,
                    loading: i.status === 'loading',
                    extraInfo: i.message.extraInfo,
                  }))}
                  styles={{
                    root: {
                      marginBlockEnd: 24,
                    },
                    bubble: { maxWidth: 840 },
                  }}
                  role={getRole(markdownThemeClass)}
                />
              )}
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