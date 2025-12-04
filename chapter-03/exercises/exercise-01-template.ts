// 演習3-1のテンプレート
// TODO: 以下のテンプレートを完成させてください

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// TODO: サーバーを作成（name: 'my-first-server'）
const server = new Server(
    {
        name: '', // TODO: サーバー名を設定
        version: '1.0.0',
    },
    {
        capabilities: {
            // TODO: リソース機能を有効化
        },
    }
);

// TODO: リソース一覧を返すハンドラーを設定
// ヒント: server.setRequestHandler(ListResourcesRequestSchema, ...)

// TODO: リソースの内容を返すハンドラーを設定
// ヒント: server.setRequestHandler(ReadResourceRequestSchema, ...)

// サーバーを起動
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('✅ サーバーが起動しました');
}

main().catch(console.error);
