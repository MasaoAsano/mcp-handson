// MCPアプローチのクライアントの例
// MCPクライアントを使ってサーバーと通信
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function demo() {
    console.log('🔧 MCPクライアント デモ\n');

    // MCPクライアントの作成
    const client = new Client(
        {
            name: 'task-manager-client',
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

    await client.connect(transport);
    console.log('✅ MCPサーバーに接続しました\n');

    try {
        // 1. リソース：タスク一覧を取得
        console.log('1️⃣ リソースからタスク一覧を取得...');
        const resources = await client.listResources();
        console.log(`   利用可能なリソース: ${resources.resources.length}件`);

        const taskListResource = await client.readResource({
            uri: 'task://list',
        });

        const tasks = JSON.parse(taskListResource.contents[0].text);
        console.log(`   タスク数: ${tasks.length}件`);
        tasks.forEach((task: any) => {
            console.log(`   - [${task.status}] ${task.title}`);
        });

        // 2. ツール：新しいタスクを作成
        console.log('\n2️⃣ ツールで新しいタスクを作成...');
        const createResult = await client.callTool({
            name: 'create_task',
            arguments: {
                title: '第1章を読む',
                description: 'MCPの基礎概念を理解する',
            },
        });
        console.log(`   ${createResult.content[0].text}`);

        // 3. ツール：タスクを更新
        console.log('\n3️⃣ ツールでタスクを更新...');
        const updateResult = await client.callTool({
            name: 'update_task',
            arguments: {
                id: '2',
                status: 'in-progress',
            },
        });
        console.log(`   ${updateResult.content[0].text}`);

        // 4. 更新後のタスク一覧を確認
        console.log('\n4️⃣ 更新後のタスク一覧を確認...');
        const updatedTaskList = await client.readResource({
            uri: 'task://list',
        });
        const updatedTasks = JSON.parse(updatedTaskList.contents[0].text);
        updatedTasks.forEach((task: any) => {
            console.log(`   - [${task.status}] ${task.title}`);
        });

        console.log('\n✅ デモ完了');
    } catch (error) {
        console.error('❌ エラー:', error);
    } finally {
        await client.close();
    }
}

demo().catch(console.error);
