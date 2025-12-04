// 第5章 サンプル: 基本的なMCPクライアント
// MCPサーバーに接続してリソースとツールを使用する
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
    console.log('🔌 MCPクライアント起動\n');

    // クライアントの作成
    const client = new Client(
        {
            name: 'tutorial-client',
            version: '1.0.0',
        },
        {
            capabilities: {},
        }
    );

    // サーバーへの接続
    const transport = new StdioClientTransport({
        command: 'tsx',
        args: ['chapter-04/samples/server-with-tools.ts'],
    });

    await client.connect(transport);
    console.log('✅ サーバーに接続しました\n');

    try {
        // 1. 利用可能なツールを確認
        console.log('【ステップ1】利用可能なツールを取得');
        const tools = await client.listTools();
        console.log(`見つかったツール: ${tools.tools.length}個`);
        tools.tools.forEach(tool => {
            console.log(`  - ${tool.name}: ${tool.description}`);
        });

        // 2. 計算ツールを実行
        console.log('\n【ステップ2】計算ツールを実行');
        const calcResult = await client.callTool({
            name: 'calculate',
            arguments: {
                operation: 'add',
                a: 10,
                b: 20,
            },
        });
        console.log(`  ${calcResult.content[0].text}`);

        // 3. 天気ツールを実行
        console.log('\n【ステップ3】天気情報を取得');
        const weatherResult = await client.callTool({
            name: 'get_weather',
            arguments: {
                city: '東京',
            },
        });
        console.log(`  ${weatherResult.content[0].text}`);

        console.log('\n✨ デモ完了！');
    } catch (error) {
        console.error('❌ エラー:', error);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
