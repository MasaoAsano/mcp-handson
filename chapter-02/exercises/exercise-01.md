# 演習2-1: Hello Worldサーバーを作る

## 🎯 目標

最もシンプルなMCPサーバーを作成し、MCPサーバーの基本構造を理解します。

## 📝 課題

自分の名前を返すMCPサーバーを作成してください。

### 要件

1. サーバー名は `my-first-server`
2. リソースを1つ提供する:
   - URI: `profile://name`
   - 名前: "My Name"
   - 説明: "自分の名前"
   - 内容: あなたの名前（例: "田中太郎"）

## 💡 ヒント

### 基本構造

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// 1. サーバーを作成
const server = new Server(
  {
    name: 'サーバー名',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {}, // リソース機能を有効化
    },
  }
);

// 2. リソース一覧を返すハンドラーを設定
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'リソースのURI',
        name: 'リソースの名前',
        description: 'リソースの説明',
        mimeType: 'text/plain',
      },
    ],
  };
});

// 3. リソースの内容を返すハンドラーを設定
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === 'あなたのリソースのURI') {
    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: 'ここに名前を書く',
        },
      ],
    };
  }

  throw new Error(`不明なリソース: ${uri}`);
});

// 4. サーバーを起動
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('✅ サーバーが起動しました');
}

main().catch(console.error);
```

## 🧪 動作確認の方法

### ステップ1: サーバーを実装

`exercise-01-template.ts` を編集して、課題の要件を実装します。

### ステップ2: テストクライアントで確認

テストクライアントを使って動作確認します：

```bash
# chapter-02/exercises ディレクトリで実行
cd chapter-02/exercises
npx tsx test-client.ts exercise-01-template.ts
```

### 期待される出力

```
🧪 テスト開始: exercise-01-template.ts

✅ サーバーに接続しました

📋 利用可能なリソース:
   1. My Name
      URI: profile://name
      説明: 自分の名前

📖 リソースの内容:

   My Name (profile://name):
   あなたの名前

✅ テスト完了
```

## ✅ 完成の確認

以下がすべて表示されれば完成です：
- [ ] サーバーに正常に接続できる
- [ ] `profile://name` リソースが一覧に表示される
- [ ] リソースの内容として自分の名前が表示される
- [ ] エラーなくテストが完了する

## 🎓 学習ポイント

- MCPサーバーの基本構造（Server、Transport、RequestHandler）
- リソースの概念（URI、mimeType、contents）
- リクエストハンドラーの設定方法
- クライアントからの接続とリソース読み取り
