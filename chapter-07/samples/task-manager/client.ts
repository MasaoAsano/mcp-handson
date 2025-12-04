// 第7章: タスク管理システム - クライアント
// タスク管理サーバーを操作するクライアント
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
    console.log('📋 タスク管理クライアント\n');

    const client = new Client(
        {
            name: 'task-manager-client',
            version: '1.0.0',
        },
        {
            capabilities: {},
        }
    );

    const transport = new StdioClientTransport({
        command: 'tsx',
        args: ['chapter-07/samples/task-manager/server.ts'],
    });

    await client.connect(transport);
    console.log('✅ サーバーに接続\n');

    try {
        // 1. タスクを作成
        console.log('【1】タスクを作成');
        await client.callTool({
            name: 'create_task',
            arguments: {
                title: 'MCPハンズオンを完了する',
                description: 'すべての章を学習し、演習を完了する',
                priority: 'high',
                tags: ['学習', 'MCP'],
            },
        });

        await client.callTool({
            name: 'create_task',
            arguments: {
                title: 'サンプルアプリを作成',
                description: 'MCPを使った実用的なアプリを開発する',
                priority: 'medium',
                tags: ['開発', 'MCP'],
            },
        });

        console.log('  ✅ 2つのタスクを作成しました\n');

        // 2. リソースから概要を取得
        console.log('【2】タスク概要を取得');
        const summary = await client.readResource({
            uri: 'tasks://summary',
        });
        console.log(summary.contents[0].text);
        console.log();

        // 3. タスクを検索
        console.log('【3】高優先度のタスクを検索');
        const searchResult = await client.callTool({
            name: 'search_tasks',
            arguments: {
                priority: 'high',
            },
        });
        console.log(searchResult.content[0].text);
        console.log();

        // 4. プロンプトを使用
        console.log('【4】週次レポートプロンプトを取得');
        const prompt = await client.getPrompt({
            name: 'weekly_report',
            arguments: {},
        });
        console.log('プロンプト内容:');
        console.log(prompt.messages[0].content.text);
        console.log();

        console.log('✨ デモ完了！');
    } catch (error) {
        console.error('❌ エラー:', error);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
