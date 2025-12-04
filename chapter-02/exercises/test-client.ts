// 演習サーバーをテストするためのクライアント
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testServer(serverFile: string) {
    console.log(`🧪 テスト開始: ${serverFile}\n`);

    const client = new Client(
        { name: 'test-client', version: '1.0.0' },
        { capabilities: {} }
    );

    const transport = new StdioClientTransport({
        command: 'npx',
        args: ['tsx', serverFile],
    });

    try {
        await client.connect(transport);
        console.log('✅ サーバーに接続しました\n');

        // リソース一覧を取得
        console.log('📋 利用可能なリソース:');
        const resources = await client.listResources();

        if (resources.resources.length === 0) {
            console.log('   ⚠️  リソースがありません');
        } else {
            resources.resources.forEach((resource, index) => {
                console.log(`   ${index + 1}. ${resource.name}`);
                console.log(`      URI: ${resource.uri}`);
                console.log(`      説明: ${resource.description}`);
            });
        }

        // 各リソースの内容を読み取り
        console.log('\n📖 リソースの内容:');
        for (const resource of resources.resources) {
            try {
                const content = await client.readResource({ uri: resource.uri });
                console.log(`\n   ${resource.name} (${resource.uri}):`);
                console.log(`   ${content.contents[0].text}`);
            } catch (error) {
                console.log(`   ❌ エラー: ${error}`);
            }
        }

        console.log('\n✅ テスト完了');
    } catch (error) {
        console.error('❌ テスト失敗:', error);
    } finally {
        await client.close();
    }
}

// コマンドライン引数からサーバーファイルを取得
const serverFile = process.argv[2];

if (!serverFile) {
    console.log('使い方:');
    console.log('  npx tsx test-client.ts <サーバーファイル>');
    console.log('');
    console.log('例:');
    console.log('  npx tsx test-client.ts exercise-01-template.ts');
    process.exit(1);
}

testServer(serverFile).catch(console.error);
