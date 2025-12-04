// MCPアプローチのサーバーの例
// 同じタスク管理システムをMCPで実装
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListResourcesRequestSchema,
    ListToolsRequestSchema,
    ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// インメモリストレージ
interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    createdAt: string;
}

let tasks: Task[] = [
    {
        id: '1',
        title: 'MCPについて学ぶ',
        description: 'Model Context Protocolの基礎を理解する',
        status: 'in-progress',
        createdAt: new Date().toISOString()
    }
];

// MCPサーバーの作成
const server = new Server(
    {
        name: 'task-manager-mcp',
        version: '1.0.0',
    },
    {
        capabilities: {
            resources: {},
            tools: {},
        },
    }
);

// リソース：タスク一覧と個別タスクを提供
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: 'task://list',
                name: 'タスク一覧',
                description: '全てのタスクのリスト',
                mimeType: 'application/json',
            },
            ...tasks.map(task => ({
                uri: `task://item/${task.id}`,
                name: task.title,
                description: `タスク: ${task.title}`,
                mimeType: 'application/json',
            })),
        ],
    };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;

    if (uri === 'task://list') {
        return {
            contents: [
                {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify(tasks, null, 2),
                },
            ],
        };
    }

    const match = uri.match(/^task:\/\/item\/(.+)$/);
    if (match) {
        const taskId = match[1];
        const task = tasks.find(t => t.id === taskId);

        if (!task) {
            throw new Error('タスクが見つかりません');
        }

        return {
            contents: [
                {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify(task, null, 2),
                },
            ],
        };
    }

    throw new Error('不明なリソース');
});

// ツール：タスクの操作機能を提供
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'create_task',
                description: '新しいタスクを作成する',
                inputSchema: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'タスクのタイトル',
                        },
                        description: {
                            type: 'string',
                            description: 'タスクの説明',
                        },
                    },
                    required: ['title'],
                },
            },
            {
                name: 'update_task',
                description: 'タスクを更新する',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'タスクID',
                        },
                        title: {
                            type: 'string',
                            description: '新しいタイトル',
                        },
                        description: {
                            type: 'string',
                            description: '新しい説明',
                        },
                        status: {
                            type: 'string',
                            enum: ['todo', 'in-progress', 'done'],
                            description: '新しいステータス',
                        },
                    },
                    required: ['id'],
                },
            },
            {
                name: 'delete_task',
                description: 'タスクを削除する',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'タスクID',
                        },
                    },
                    required: ['id'],
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
        case 'create_task': {
            const { title, description = '' } = args as { title: string; description?: string };

            const newTask: Task = {
                id: String(tasks.length + 1),
                title,
                description,
                status: 'todo',
                createdAt: new Date().toISOString()
            };

            tasks.push(newTask);

            return {
                content: [
                    {
                        type: 'text',
                        text: `タスクを作成しました: ${newTask.title} (ID: ${newTask.id})`,
                    },
                ],
            };
        }

        case 'update_task': {
            const { id, title, description, status } = args as {
                id: string;
                title?: string;
                description?: string;
                status?: 'todo' | 'in-progress' | 'done';
            };

            const taskIndex = tasks.findIndex(t => t.id === id);
            if (taskIndex === -1) {
                throw new Error('タスクが見つかりません');
            }

            tasks[taskIndex] = {
                ...tasks[taskIndex],
                ...(title && { title }),
                ...(description && { description }),
                ...(status && { status })
            };

            return {
                content: [
                    {
                        type: 'text',
                        text: `タスクを更新しました: ${tasks[taskIndex].title}`,
                    },
                ],
            };
        }

        case 'delete_task': {
            const { id } = args as { id: string };
            const taskIndex = tasks.findIndex(t => t.id === id);

            if (taskIndex === -1) {
                throw new Error('タスクが見つかりません');
            }

            const deletedTask = tasks[taskIndex];
            tasks.splice(taskIndex, 1);

            return {
                content: [
                    {
                        type: 'text',
                        text: `タスクを削除しました: ${deletedTask.title}`,
                    },
                ],
            };
        }

        default:
            throw new Error(`不明なツール: ${name}`);
    }
});

// サーバーを起動
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('🚀 MCPサーバーが起動しました');
}

main().catch(console.error);
