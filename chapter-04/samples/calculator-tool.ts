// 第4章 サンプル: 計算機ツール
// 四則演算を行うMCPツール
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
    {
        name: 'calculator-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// ツール一覧を提供
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'add',
                description: '2つの数を足し算します',
                inputSchema: {
                    type: 'object',
                    properties: {
                        a: {
                            type: 'number',
                            description: '1つ目の数',
                        },
                        b: {
                            type: 'number',
                            description: '2つ目の数',
                        },
                    },
                    required: ['a', 'b'],
                },
            },
            {
                name: 'subtract',
                description: '2つの数を引き算します (a - b)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        a: {
                            type: 'number',
                            description: '引かれる数',
                        },
                        b: {
                            type: 'number',
                            description: '引く数',
                        },
                    },
                    required: ['a', 'b'],
                },
            },
            {
                name: 'multiply',
                description: '2つの数を掛け算します',
                inputSchema: {
                    type: 'object',
                    properties: {
                        a: {
                            type: 'number',
                            description: '1つ目の数',
                        },
                        b: {
                            type: 'number',
                            description: '2つ目の数',
                        },
                    },
                    required: ['a', 'b'],
                },
            },
            {
                name: 'divide',
                description: '2つの数を割り算します (a ÷ b)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        a: {
                            type: 'number',
                            description: '割られる数',
                        },
                        b: {
                            type: 'number',
                            description: '割る数（0は不可）',
                        },
                    },
                    required: ['a', 'b'],
                },
            },
        ],
    };
});

// ツールの実行
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    // 引数の型チェック
    const { a, b } = args as { a: number; b: number };

    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('引数は数値である必要があります');
    }

    switch (name) {
        case 'add': {
            const result = a + b;
            return {
                content: [
                    {
                        type: 'text',
                        text: `${a} + ${b} = ${result}`,
                    },
                ],
            };
        }

        case 'subtract': {
            const result = a - b;
            return {
                content: [
                    {
                        type: 'text',
                        text: `${a} - ${b} = ${result}`,
                    },
                ],
            };
        }

        case 'multiply': {
            const result = a * b;
            return {
                content: [
                    {
                        type: 'text',
                        text: `${a} × ${b} = ${result}`,
                    },
                ],
            };
        }

        case 'divide': {
            if (b === 0) {
                throw new Error('0で割ることはできません');
            }
            const result = a / b;
            return {
                content: [
                    {
                        type: 'text',
                        text: `${a} ÷ ${b} = ${result}`,
                    },
                ],
            };
        }

        default:
            throw new Error(`不明なツール: ${name}`);
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('🧮 計算機サーバーが起動しました');
}

main().catch(console.error);
