// 第2章 サンプル2: リソースを提供するサーバー
// 複数のリソースと動的なURIを扱う
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// サンプルデータ：書籍リスト
interface Book {
    id: string;
    title: string;
    author: string;
    year: number;
    description: string;
}

const books: Book[] = [
    {
        id: '1',
        title: 'MCPプログラミング入門',
        author: '山田太郎',
        year: 2024,
        description: 'Model Context Protocolの基礎から応用まで',
    },
    {
        id: '2',
        title: 'AIエージェント開発実践',
        author: '佐藤花子',
        year: 2024,
        description: 'AIエージェントの設計と実装のベストプラクティス',
    },
    {
        id: '3',
        title: 'プロトコル設計の原則',
        author: '鈴木一郎',
        year: 2023,
        description: '効果的な通信プロトコルの設計方法',
    },
];

// MCPサーバーの作成
const server = new Server(
    {
        name: 'book-library-server',
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
                uri: 'books://catalog',
                name: '書籍カタログ',
                description: '全ての書籍のリスト',
                mimeType: 'application/json',
            },
            // 各書籍を個別のリソースとして提供
            ...books.map(book => ({
                uri: `books://item/${book.id}`,
                name: book.title,
                description: `著者: ${book.author} (${book.year}年)`,
                mimeType: 'application/json',
            })),
        ],
    };
});

// リソースの内容を読み取る
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;

    // カタログ全体を返す
    if (uri === 'books://catalog') {
        return {
            contents: [
                {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify(books, null, 2),
                },
            ],
        };
    }

    // 個別の書籍を返す
    const match = uri.match(/^books:\/\/item\/(.+)$/);
    if (match) {
        const bookId = match[1];
        const book = books.find(b => b.id === bookId);

        if (!book) {
            throw new Error(`書籍が見つかりません: ${bookId}`);
        }

        return {
            contents: [
                {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify(book, null, 2),
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
    console.error('🚀 書籍ライブラリサーバーが起動しました');
    console.error(`📚 ${books.length}冊の書籍を提供しています`);
}

main().catch(console.error);
