// 演習4-1のテンプレート
// TODO: 以下のテンプレートを完成させてください

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
    {
        name: 'string-tools-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// TODO: ツール一覧を定義
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            // TODO: to_uppercase ツールを定義
            // TODO: to_lowercase ツールを定義
            // TODO: reverse_text ツールを定義
        ],
    };
});

// TODO: ツールの実行処理を実装
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const { text } = args as { text: string };

    switch (name) {
        // TODO: 各ツールの処理を実装

        default:
            throw new Error(`不明なツール: ${name}`);
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('✅ 文字列操作サーバーが起動しました');
}

main().catch(console.error);
