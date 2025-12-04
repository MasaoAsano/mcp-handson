// コマンドラインからタスクを作成するスクリプト
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function createTask(title: string, description: string = '') {
    console.log('🔧 MCPタスク作成ツール\n');

    // MCPクライアントの作成
    const client = new Client(
        {
            name: 'task-creator',
            version: '1.0.0',
        },
        {
            capabilities: {},
        }
    );

    // サーバーに接続
    const transport = new StdioClientTransport({
        command: 'tsx',
        args: ['chapter-01/mcp-approach/server.ts'],
    });

    try {
        await client.connect(transport);
        console.log('✅ MCPサーバーに接続しました\n');

        // タスクを作成
        console.log(`📝 新しいタスクを作成中...`);
        console.log(`   タイトル: ${title}`);
        console.log(`   説明: ${description || '(なし)'}\n`);

        const result = await client.callTool({
            name: 'create_task',
            arguments: {
                title,
                description,
            },
        });

        console.log(`✅ ${result.content[0].text}`);

        // 現在のタスク一覧を表示
        console.log('\n📋 現在のタスク一覧:');
        const taskList = await client.readResource({
            uri: 'task://list',
        });
        const tasks = JSON.parse(taskList.contents[0].text);
        tasks.forEach((task: any, index: number) => {
            console.log(`   ${index + 1}. [${task.status}] ${task.title}`);
        });

    } catch (error) {
        console.error('❌ エラー:', error);
    } finally {
        await client.close();
    }
}

// コマンドライン引数を取得
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('使い方:');
    console.log('  npx tsx create-task.ts "タスクタイトル" "タスクの説明"');
    console.log('');
    console.log('例:');
    console.log('  npx tsx create-task.ts "買い物" "牛乳と卵を買う"');
    console.log('  npx tsx create-task.ts "MCPを学ぶ"');
    process.exit(1);
}

const title = args[0];
const description = args[1] || '';

createTask(title, description).catch(console.error);
