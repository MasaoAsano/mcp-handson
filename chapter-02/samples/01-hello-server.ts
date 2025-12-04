// 第2章 サンプル1: 最もシンプルなMCPサーバー
// Hello Worldレベルの基本的なMCPサーバー
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// MCPサーバーの作成
const server = new Server(
    {
        name: 'hello-mcp-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            resources: {},
        },
    }
);

// リソース一覧を提供
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: 'hello://greeting',
                name: 'Hello Greeting',
                description: 'シンプルな挨拶メッセージ',
                mimeType: 'text/plain',
            },
        ],
    };
});

// リソースの内容を提供
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;

    if (uri === 'hello://greeting') {
        return {
            contents: [
                {
                    uri,
                    mimeType: 'text/plain',
                    text: 'Hello, MCP World! 🌍',
                },
            ],
        };
    }

    throw new Error(`不明なリソース: ${uri}`);
});

// サーバーを起動
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('🚀 Hello MCPサーバーが起動しました');
}

main().catch(console.error);
