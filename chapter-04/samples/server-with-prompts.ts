// 第4章 サンプル: プロンプトを統合したサーバー
// リソース、ツール、プロンプトの全てを提供するサーバー
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    GetPromptRequestSchema,
    ListPromptsRequestSchema,
    ListResourcesRequestSchema,
    ListToolsRequestSchema,
    ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
    {
        name: 'full-featured-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            resources: {},
            tools: {},
            prompts: {},
        },
    }
);

// リソース
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: 'info://server',
                name: 'サーバー情報',
                description: 'このサーバーの機能説明',
                mimeType: 'text/plain',
            },
        ],
    };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    if (request.params.uri === 'info://server') {
        return {
            contents: [
                {
                    uri: 'info://server',
                    mimeType: 'text/plain',
                    text: 'Full-Featured MCP Server\n\nこのサーバーは以下を提供します:\n- リソース: サーバー情報\n- ツール: 計算機\n- プロンプト: メール作成テンプレート',
                },
            ],
        };
    }
    throw new Error('不明なリソース');
});

// ツール
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'calculate',
                description: '簡単な計算を実行',
                inputSchema: {
                    type: 'object',
                    properties: {
                        a: { type: 'number' },
                        b: { type: 'number' },
                        op: { type: 'string', enum: ['add', 'multiply'] },
                    },
                    required: ['a', 'b', 'op'],
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { a, b, op } = request.params.arguments as { a: number; b: number; op: string };
    const result = op === 'add' ? a + b : a * b;

    return {
        content: [{ type: 'text', text: `結果: ${result}` }],
    };
});

// プロンプト
server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
        prompts: [
            {
                name: 'greeting',
                description: '挨拶プロンプト',
                arguments: [
                    {
                        name: 'name',
                        description: '名前',
                        required: true,
                    },
                ],
            },
        ],
    };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const name = request.params.arguments?.name as string || 'ゲスト';

    return {
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `${name}さんに適切な挨拶をしてください。`,
                },
            },
        ],
    };
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('🚀 フル機能サーバーが起動しました');
}

main().catch(console.error);
