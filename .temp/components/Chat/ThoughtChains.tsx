import { ThoughtChain } from '@ant-design/x';
import { Flex, Progress, ProgressProps } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';

const twoColors: ProgressProps['strokeColor'] = {
    '0%': '#108ee9',
    '100%': '#87d068',
};

const App: React.FC = () => {
    const { chains, tasks } = useModel('thoughtChains');

    return (
        <ThoughtChain defaultExpandedKeys={['transcode']}
            items={chains.map(x => ({
                ...x, content: <Flex gap="small" vertical>
                    {tasks.map(task => (<ThoughtChain.Item
                        key={task.key}
                        variant="solid"
                        icon={<span className="anticon"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill="currentColor" d="M367.12 481.6h-136a140.16 140.16 0 0 0-140 140v136a140.16 140.16 0 0 0 140 140h136a140.24 140.24 0 0 0 140-140v-136a140.24 140.24 0 0 0-140-140z m84 276a84.16 84.16 0 0 1-84 84h-136a84.08 84.08 0 0 1-84-84v-136a84.08 84.08 0 0 1 84-84h136a84.16 84.16 0 0 1 84 84zM792.88 542.4a140.16 140.16 0 0 0 140-140v-136a140.16 140.16 0 0 0-140-140h-136a140.24 140.24 0 0 0-140 140v136a140.24 140.24 0 0 0 140 140z m-220-140v-136a84.08 84.08 0 0 1 84-84h136a84.08 84.08 0 0 1 84 84v136a84.08 84.08 0 0 1-84 84h-136a84.08 84.08 0 0 1-84-84zM924.64 724.16l-63.04-63.12a28.8 28.8 0 0 0-4.16-3.44l-2.16-1.12a27.76 27.76 0 0 0-2.64-1.44l-2.72-0.8a17.76 17.76 0 0 0-2.48-0.8 27.76 27.76 0 0 0-5.12-0.48h-0.8a26.88 26.88 0 0 0-5.04 0.48 12.8 12.8 0 0 0-2.48 0.8l-2.8 0.8c-0.88 0-1.76 0.96-2.64 1.44l-2.16 1.12a28.8 28.8 0 0 0-4.16 3.44l-63.12 63.12a28 28 0 0 0 40 40l15.28-15.36v2.48a90.8 90.8 0 0 1-91.36 90.32H620.72a28 28 0 0 0 0 56h102.32a146.88 146.88 0 0 0 146.72-146.72v-2.48l15.28 15.36a28 28 0 0 0 40-40zM162.4 362.96a24.96 24.96 0 0 0 4.24 3.44 7.28 7.28 0 0 0 1.36 0.72 28.96 28.96 0 0 0 3.44 1.92l1.84 0.56c1.12 0 2.24 0.8 3.44 1.04a27.52 27.52 0 0 0 11.04 0 23.36 23.36 0 0 0 3.36-1.04l1.92-0.56a33.84 33.84 0 0 0 3.28-1.84l1.52-0.8a31.12 31.12 0 0 0 4-3.28l63.12-63.12a28 28 0 1 0-39.6-39.6l-15.28 15.36v-2.48A90.8 90.8 0 0 1 300.96 182.4h102.32a28 28 0 0 0 0-56H300.96a146.88 146.88 0 0 0-146.72 146.72v2.48l-15.28-15.36a28 28 0 1 0-40 39.6z"></path></svg></span>}
                        //title="转码"
                        description={<>{task.description}<Progress percent={task.percent} strokeColor={twoColors} size={{ width: 200, height: 6 }} /></>}
                        blink={true}
                        style={{
                            //width: 360,
                            //maxWidth: 420,
                            alignItems: 'flex-start'
                        }}
                    />))}
                </Flex>
            }))} />
    );
};

export default App;