// 第6章 サンプル: ツールを呼び出すクライアント
// より高度なクライアント実装例
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function runInteractiveDemo() {
    const client = new Client(
        {
            name: 'interactive-client',
            version: '1.0.0',
        },
        {
            capabilities: {},
        }
    );

    const transport = new StdioClientTransport({
        command: 'tsx',
        args: ['chapter-04/samples/server-with-tools.ts'],
    });

    await client.connect(transport);

    try {
        console.log('🎮 インタラクティブMCPクライアント\n');

        // 一連の計算を実行
        const calculations = [
            { op: 'add', a: 5, b: 3, expected: 8 },
            { op: 'multiply', a: 4, b: 7, expected: 28 },
            { op: 'subtract', a: 10, b: 4, expected: 6 },
        ];

        console.log('📊 計算シーケンスを実行:');
        for (const calc of calculations) {
            const result = await client.callTool({
                name: 'calculate',
                arguments: calc,
            });
            console.log(`  ${result.content[0].text}`);
        }

        // 複数の都市の天気を取得
        const cities = ['東京', '大阪', '札幌'];

        console.log('\n🌏 複数都市の天気を取得:');
        for (const city of cities) {
            const result = await client.callTool({
                name: 'get_weather',
                arguments: { city },
            });
            console.log(`  ${result.content[0].text}`);
        }

        console.log('\n✅ すべての操作が完了しました');
    } catch (error) {
        console.error('❌ エラー:', error);
    } finally {
        await client.close();
    }
}

runInteractiveDemo().catch(console.error);
