// 第4章 サンプル: 天気情報ツール
// 天気情報を取得するツール（モック版）
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// モックデータ
const weatherData: Record<string, { temp: number; condition: string; humidity: number }> = {
    '東京': { temp: 22, condition: '晴れ', humidity: 55 },
    '大阪': { temp: 24, condition: '曇り', humidity: 60 },
    '札幌': { temp: 15, condition: '雨', humidity: 75 },
    '福岡': { temp: 26, condition: '晴れ', humidity: 50 },
    '沖縄': { temp: 29, condition: '晴れ', humidity: 70 },
};

const server = new Server(
    {
        name: 'weather-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'get_weather',
                description: '指定した都市の天気情報を取得します',
                inputSchema: {
                    type: 'object',
                    properties: {
                        city: {
                            type: 'string',
                            description: '都市名（例: 東京、大阪、札幌）',
                        },
                    },
                    required: ['city'],
                },
            },
            {
                name: 'list_cities',
                description: '天気情報が利用可能な都市の一覧を取得します',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
        case 'get_weather': {
            const { city } = args as { city: string };

            if (!city) {
                throw new Error('都市名を指定してください');
            }

            const weather = weatherData[city];

            if (!weather) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `❌ ${city}の天気情報が見つかりません。利用可能な都市: ${Object.keys(weatherData).join('、')}`,
                        },
                    ],
                };
            }

            // 天気アイコンを追加
            const icons: Record<string, string> = {
                '晴れ': '☀️',
                '曇り': '☁️',
                '雨': '🌧️',
                '雪': '❄️',
            };

            const icon = icons[weather.condition] || '🌈';

            return {
                content: [
                    {
                        type: 'text',
                        text: `${icon} **${city}の天気情報**\n\n` +
                            `気温: ${weather.temp}°C\n` +
                            `天気: ${weather.condition}\n` +
                            `湿度: ${weather.humidity}%`,
                    },
                ],
            };
        }

        case 'list_cities': {
            const cities = Object.keys(weatherData);
            return {
                content: [
                    {
                        type: 'text',
                        text: `📍 **利用可能な都市** (${cities.length}都市)\n\n` +
                            cities.map(city => `- ${city}`).join('\n'),
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
    console.error('🌤️  天気情報サーバーが起動しました');
}

main().catch(console.error);
