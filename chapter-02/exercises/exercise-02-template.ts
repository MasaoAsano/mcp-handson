// 演習3-2のテンプレート
// TODO: 以下のテンプレートを完成させてください

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// TODO: データ構造を定義
interface Media {
    id: string;
    title: string;
    creator: string;
    year: number;
    genre: string;
}

// TODO: 少なくとも3つの作品データを追加
const mediaList: Media[] = [
    // ここに作品を追加
];

// TODO: サーバーを作成
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
// ヒント: カタログリソースと各作品リソースを返す

// TODO: リソースの内容を返すハンドラーを設定
// ヒント: 
// - uri === 'media://catalog' の場合
// - uri.match(/^media:\/\/item\/(.+)$/) の場合

// サーバーを起動
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`✅ サーバーが起動しました`);
    console.error(`📺 ${mediaList.length}作品を提供しています`);
}

main().catch(console.error);
