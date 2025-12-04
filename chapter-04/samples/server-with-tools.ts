// 第4章 サンプル: ツールを統合したサーバー
// 計算機と天気情報の両方を提供するサーバー
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// 天気データ
const weatherData: Record<string, { temp: number; condition: string; humidity: number }> = {
    '東京': { temp: 22, condition: '晴れ', humidity: 55 },
    '大阪': { temp: 24, condition: '曇り', humidity: 60 },
    '札幌': { temp: 15, condition: '雨', humidity: 75 },
};

const server = new Server(
    {
        name: 'multi-tool-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// すべてのツールを一覧で提供
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            // 計算機ツール
            {
                name: 'calculate',
                description: '四則演算を行います',
                inputSchema: {
                    type: 'object',
                    properties: {
                        operation: {
                            type: 'string',
                            enum: ['add', 'subtract', 'multiply', 'divide'],
                            description: '演算の種類',
                        },
                        a: {
                            type: 'number',
                            description: '1つ目の数',
                        },
                        b: {
                            type: 'number',
                            description: '2つ目の数',
                        },
                    },
                    required: ['operation', 'a', 'b'],
                },
            },
            // 天気情報ツール
            {
                name: 'get_weather',
                description: '指定した都市の天気情報を取得します',
                inputSchema: {
                    type: 'object',
                    properties: {
                        city: {
                            type: 'string',
                            description: '都市名',
                        },
                    },
                    required: ['city'],
                },
            },
        ],
    };
});

// ツールの実行
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
        case 'calculate': {
            const { operation, a, b } = args as {
                operation: 'add' | 'subtract' | 'multiply' | 'divide';
                a: number;
                b: number;
            };

            let result: number;
            let symbol: string;

            switch (operation) {
                case 'add':
                    result = a + b;
                    symbol = '+';
                    break;
                case 'subtract':
                    result = a - b;
                    symbol = '-';
                    break;
                case 'multiply':
                    result = a * b;
                    symbol = '×';
                    break;
                case 'divide':
                    if (b === 0) throw new Error('0で割ることはできません');
                    result = a / b;
                    symbol = '÷';
                    break;
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: `🧮 ${a} ${symbol} ${b} = ${result}`,
                    },
                ],
            };
        }

        case 'get_weather': {
            const { city } = args as { city: string };
            const weather = weatherData[city];

            if (!weather) {
                throw new Error(`${city}の天気情報が見つかりません`);
            }

            const icons: Record<string, string> = {
                '晴れ': '☀️',
                '曇り': '☁️',
                '雨': '🌧️',
            };

            return {
                content: [
                    {
                        type: 'text',
                        text: `${icons[weather.condition]} ${city}: ${weather.temp}°C, ${weather.condition}`,
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
    console.error('🚀 マルチツールサーバーが起動しました');
}

main().catch(console.error);
