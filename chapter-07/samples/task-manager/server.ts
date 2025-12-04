// 第7章: タスク管理システム - 完全なサーバー実装
// リソース、ツール、プロンプトを統合したタスク管理サーバー
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
import { TaskStorage } from './storage.js';
import { TaskCreateInput, TaskUpdateInput, TaskFilter } from './types.js';

const storage = new TaskStorage();

const server = new Server(
    {
        name: 'task-manager-server',
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

// === リソース ===
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const tasks = await storage.getAll();

    return {
        resources: [
            {
                uri: 'tasks://all',
                name: 'すべてのタスク',
                description: 'タスク一覧（JSON形式）',
                mimeType: 'application/json',
            },
            {
                uri: 'tasks://summary',
                name: 'タスク概要',
                description: 'タスクの統計情報',
                mimeType: 'text/plain',
            },
            ...tasks.map(task => ({
                uri: `tasks://item/${task.id}`,
                name: task.title,
                description: `[${task.status}] ${task.title}`,
                mimeType: 'application/json',
            })),
        ],
    };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;

    if (uri === 'tasks://all') {
        const tasks = await storage.getAll();
        return {
            contents: [{
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(tasks, null, 2),
            }],
        };
    }

    if (uri === 'tasks://summary') {
        const tasks = await storage.getAll();
        const summary = {
            total: tasks.length,
            todo: tasks.filter(t => t.status === 'todo').length,
            inProgress: tasks.filter(t => t.status === 'in-progress').length,
            done: tasks.filter(t => t.status === 'done').length,
            highPriority: tasks.filter(t => t.priority === 'high').length,
        };

        const text = `📊 タスク管理システム 概要\n\n` +
            `総タスク数: ${summary.total}\n` +
            `  📝 未着手: ${summary.todo}\n` +
            `  🔄 進行中: ${summary.inProgress}\n` +
            `  ✅ 完了: ${summary.done}\n` +
            `  🔥 高優先度: ${summary.highPriority}`;

        return {
            contents: [{
                uri,
                mimeType: 'text/plain',
                text,
            }],
        };
    }

    const match = uri.match(/^tasks:\/\/item\/(.+)$/);
    if (match) {
        const task = await storage.getById(match[1]);
        if (!task) throw new Error('タスクが見つかりません');

        return {
            contents: [{
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(task, null, 2),
            }],
        };
    }

    throw new Error('不明なリソース');
});

// === ツール ===
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'create_task',
                description: '新しいタスクを作成',
                inputSchema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', description: 'タスクのタイトル' },
                        description: { type: 'string', description: 'タスクの説明' },
                        priority: { type: 'string', enum: ['low', 'medium', 'high'], description: '優先度' },
                        dueDate: { type: 'string', description: '期限（ISO形式）' },
                        tags: { type: 'array', items: { type: 'string' }, description: 'タグのリスト' },
                    },
                    required: ['title'],
                },
            },
            {
                name: 'update_task',
                description: 'タスクを更新',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'タスクID' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
                        priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                    },
                    required: ['id'],
                },
            },
            {
                name: 'delete_task',
                description: 'タスクを削除',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'タスクID' },
                    },
                    required: ['id'],
                },
            },
            {
                name: 'search_tasks',
                description: 'タスクを検索',
                inputSchema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
                        priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                        tag: { type: 'string' },
                        searchText: { type: 'string', description: '検索テキスト' },
                    },
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
        case 'create_task': {
            const input = args as TaskCreateInput;
            const task = await storage.create(input);
            return {
                content: [{
                    type: 'text',
                    text: `✅ タスクを作成しました\nID: ${task.id}\nタイトル: ${task.title}`,
                }],
            };
        }

        case 'update_task': {
            const input = args as TaskUpdateInput;
            const task = await storage.update(input);
            return {
                content: [{
                    type: 'text',
                    text: `✅ タスクを更新しました\n${task.title} [${task.status}]`,
                }],
            };
        }

        case 'delete_task': {
            const { id } = args as { id: string };
            await storage.delete(id);
            return {
                content: [{
                    type: 'text',
                    text: `🗑️ タスクを削除しました (ID: ${id})`,
                }],
            };
        }

        case 'search_tasks': {
            const filter = args as TaskFilter;
            const tasks = await storage.search(filter);
            const text = tasks.length === 0
                ? '検索結果がありません'
                : `🔍 ${tasks.length}件のタスクが見つかりました:\n\n` +
                tasks.map(t => `- [${t.status}] ${t.title} (優先度: ${t.priority})`).join('\n');

            return {
                content: [{ type: 'text', text }],
            };
        }

        default:
            throw new Error(`不明なツール: ${name}`);
    }
});

// === プロンプト ===
server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
        prompts: [
            {
                name: 'create_task_prompt',
                description: 'タスク作成を支援するプロンプト',
                arguments: [
                    { name: 'topic', description: 'タスクのトピック', required: true },
                ],
            },
            {
                name: 'weekly_report',
                description: '週次レポート作成プロンプト',
                arguments: [],
            },
        ],
    };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === 'create_task_prompt') {
        const topic = args?.topic as string || 'プロジェクト';
        return {
            messages: [{
                role: 'user',
                content: {
                    type: 'text',
                    text: `「${topic}」に関連するタスクを作成してください。\n\n` +
                        `以下の情報を含めてください:\n` +
                        `1. 明確なタイトル\n` +
                        `2. 具体的な説明\n` +
                        `3. 適切な優先度\n` +
                        `4. 関連するタグ`,
                },
            }],
        };
    }

    if (name === 'weekly_report') {
        const tasks = await storage.getAll();
        const done = tasks.filter(t => t.status === 'done').length;
        const total = tasks.length;

        return {
            messages: [{
                role: 'user',
                content: {
                    type: 'text',
                    text: `今週のタスク管理レポートを作成してください。\n\n` +
                        `現在の状況:\n` +
                        `- 総タスク数: ${total}\n` +
                        `- 完了タスク: ${done}\n` +
                        `- 進捗率: ${((done / total) * 100).toFixed(1)}%\n\n` +
                        `レポートには以下を含めてください:\n` +
                        `1. 今週の成果\n` +
                        `2. 未完了タスクの状況\n` +
                        `3. 来週の計画`,
                },
            }],
        };
    }

    throw new Error('不明なプロンプト');
});

// サーバー起動
async function main() {
    await storage.load();

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error('🚀 タスク管理サーバーが起動しました');
    const tasks = await storage.getAll();
    console.error(`📝 現在のタスク数: ${tasks.length}`);
}

main().catch(console.error);
