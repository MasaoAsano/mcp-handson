# 第1章: 従来のAPIとMCPの比較 - 実践ガイド

## 📋 この章の目的

従来のREST APIとMCPを**同じタスク管理機能**で実装し、両者の違いを体感することで、MCPの特徴と利点を理解します。

## 🚀 クイックスタート

### 準備

```bash
# プロジェクトディレクトリに移動
cd /Users/masaoasano/mcp_test

# 依存パッケージをインストール（初回のみ）
npm install
```

### 1. REST APIを試す

#### サーバーを起動
```bash
npm run ch01:traditional
```

**出力:**
```
🚀 REST APIサーバーが起動しました: http://localhost:3000

利用可能なエンドポイント:
  GET    /tasks      - タスク一覧取得
  GET    /tasks/:id  - タスク詳細取得
  POST   /tasks      - タスク作成
  PUT    /tasks/:id  - タスク更新
  DELETE /tasks/:id  - タスク削除
```

#### 別ターミナルで操作

**タスク一覧を取得:**
```bash
curl http://localhost:3000/tasks
```

**新しいタスクを作成:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "MCPを学ぶ", "description": "Model Context Protocolを理解する"}'
```

**タスクを更新:**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```

**タスクを削除:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

#### クライアントを実行
```bash
npx tsx chapter-01/traditional-api/client.ts
```

**出力例:**
```
🔧 REST APIクライアント デモ

1️⃣ タスク一覧を取得...
   取得したタスク: 3件
   - [todo] MCPを学ぶ
   - [in-progress] APIとの比較

2️⃣ 新しいタスクを作成...
   作成したタスク: 第1章を読む (ID: 4)

3️⃣ タスクを更新...
   更新したタスク: MCPを学ぶ -> done

✅ デモ完了
```

---

### 2. MCPを試す

#### サーバーを起動
```bash
npm run ch01:mcp
```

**出力:**
```
🚀 MCPサーバーが起動しました
```

> **注意**: MCPサーバーはHTTPではなく、標準入出力(stdio)で通信します。そのため、curlやブラウザでは直接アクセスできません。

#### 別ターミナルでクライアントを実行
```bash
npx tsx chapter-01/mcp-approach/client.ts
```

**出力例:**
```
🔧 MCPクライアント デモ

✅ MCPサーバーに接続しました

1️⃣ リソースからタスク一覧を取得...
   利用可能なリソース: 2件
   タスク数: 1件
   - [in-progress] MCPについて学ぶ

2️⃣ ツールで新しいタスクを作成...
   タスクを作成しました: 第1章を読む (ID: 2)

3️⃣ ツールでタスクを更新...
   タスクを更新しました: MCPについて学ぶ

4️⃣ 更新後のタスク一覧を確認...
   - [in-progress] MCPについて学ぶ
   - [todo] 第1章を読む

✅ デモ完了
```

---

## 🔍 詳細比較: REST API vs MCP

### 通信方式の違い

| 項目 | REST API | MCP |
|------|----------|-----|
| **プロトコル** | HTTP/HTTPS | stdio（標準入出力） |
| **ポート** | 3000番（設定可能） | なし（プロセス間通信） |
| **アクセス方法** | URL経由 | プロセス起動 |
| **ブラウザ対応** | ✅ 可能 | ❌ 不可 |
| **curl対応** | ✅ 可能 | ❌ 不可 |
| **専用クライアント** | 不要 | 必要 |

### アーキテクチャの違い

#### REST API: URL中心の設計

```
クライアント → HTTP → サーバー

GET  /tasks           → タスク一覧
GET  /tasks/1         → タスク詳細
POST /tasks           → タスク作成
PUT  /tasks/1         → タスク更新
DELETE /tasks/1       → タスク削除
```

**特徴:**
- エンドポイントを手動で定義
- ドキュメント（API仕様書）が別途必要
- クライアントは事前にURLを知る必要がある

#### MCP: 自己記述的な設計

```
クライアント → stdio → サーバー

リソース:
  task://list        → タスク一覧（読み取り専用）
  task://item/1      → タスク詳細（読み取り専用）

ツール:
  create_task        → タスク作成（実行可能）
  update_task        → タスク更新（実行可能）
  delete_task        → タスク削除（実行可能）
```

**特徴:**
- サーバー自身が機能を説明（自己記述性）
- パラメータのスキーマも含む
- クライアントは動的に機能を発見できる

---

## 💻 実装の比較

### ファイル構造

```
chapter-01/
├── traditional-api/           # REST API実装
│   ├── server.ts             # 102行
│   └── client.ts             # 84行
└── mcp-approach/             # MCP実装
    ├── server.ts             # 261行
    └── client.ts             # 86行
```

### コード行数の違い

| ファイル | REST API | MCP | 差分 |
|---------|----------|-----|------|
| server.ts | 102行 | 261行 | +159行 |
| client.ts | 84行 | 86行 | +2行 |

**なぜMCPの方が長い？**
- 自己記述的な定義（スキーマ、説明文）が含まれる
- リソースとツールの明示的な分離
- より詳細な型定義

---

## 📊 機能別の実装比較

### 1. タスク一覧の取得

#### REST API
```typescript
// サーバー側
app.get('/tasks', (req, res) => {
    res.json({ tasks });
});

// クライアント側
const response = await fetch('http://localhost:3000/tasks');
const data = await response.json();
```

#### MCP
```typescript
// サーバー側: リソース定義
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [{
            uri: 'task://list',
            name: 'タスク一覧',
            description: '全てのタスクのリスト',  // ← 自己説明
            mimeType: 'application/json',
        }],
    };
});

// サーバー側: リソース読み取り
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    if (uri === 'task://list') {
        return {
            contents: [{
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(tasks, null, 2),
            }],
        };
    }
});

// クライアント側
const taskListResource = await client.readResource({
    uri: 'task://list',
});
const tasks = JSON.parse(taskListResource.contents[0].text);
```

**違い:**
- REST: シンプルだがドキュメントが必要
- MCP: 詳細だが自己説明的

---

### 2. タスクの作成

#### REST API
```typescript
// サーバー側
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'タイトルは必須です' });
    }
    
    const newTask: Task = {
        id: String(tasks.length + 1),
        title,
        description: description || '',
        status: 'todo',
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    res.status(201).json({ task: newTask });
});

// クライアント側
const response = await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: '新しいタスク',
        description: '説明',
    }),
});
```

#### MCP
```typescript
// サーバー側: ツール定義
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [{
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
                required: ['title'],  // ← 必須項目を明示
            },
        }],
    };
});

// サーバー側: ツール実行
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    if (name === 'create_task') {
        const { title, description = '' } = args;
        
        const newTask: Task = {
            id: String(tasks.length + 1),
            title,
            description,
            status: 'todo',
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        
        return {
            content: [{
                type: 'text',
                text: `タスクを作成しました: ${newTask.title} (ID: ${newTask.id})`,
            }],
        };
    }
});

// クライアント側
const result = await client.callTool({
    name: 'create_task',
    arguments: {
        title: '新しいタスク',
        description: '説明',
    },
});
```

**違い:**
- REST: パラメータの仕様は外部ドキュメント
- MCP: `inputSchema`でパラメータの仕様を含む

---

## 🎯 MCPの主な利点

### 1. 自己記述性（Self-Describing）

**REST APIの場合:**
```
クライアント: どんなエンドポイントがあるの？
→ ドキュメントを読んで！（外部情報）
```

**MCPの場合:**
```typescript
const resources = await client.listResources();
// → サーバーが「task://list」などを説明付きで返す

const tools = await client.listTools();
// → サーバーが「create_task」などをスキーマ付きで返す
```

サーバー自身が「何ができるか」を動的に教えてくれる！

### 2. AI（LLM）との統合が容易

**REST APIの問題:**
- AIは各エンドポイントを事前に知る必要がある
- パラメータの形式を学習する必要がある
- APIドキュメントを解析する追加ステップが必要

**MCPの利点:**
```typescript
// 1. サーバーに接続
await client.connect(transport);

// 2. 利用可能なツールを取得
const { tools } = await client.listTools();
// [{
//   name: "create_task",
//   description: "新しいタスクを作成する",
//   inputSchema: { ... }  ← AIはこれを読んで理解できる
// }]

// 3. AIが適切なツールを選んで実行
const result = await client.callTool({
    name: 'create_task',
    arguments: { ... }
});
```

AIは接続するだけで、サーバーの全機能を理解し、適切に使用できる！

### 3. 型安全性

MCPは入力スキーマを含むため、クライアントは実行前にパラメータを検証できます。

```typescript
// MCPのツール定義
inputSchema: {
    type: 'object',
    properties: {
        title: { type: 'string' },
        status: { 
            type: 'string',
            enum: ['todo', 'in-progress', 'done']  // ← 値を制限
        },
    },
    required: ['title'],  // ← 必須項目
}
```

### 4. リソースとツールの明確な分離

**リソース（Resources）**: 読み取り専用データ
- `task://list` - タスク一覧
- `task://item/1` - 個別タスク

**ツール（Tools）**: 実行可能な操作
- `create_task` - タスク作成
- `update_task` - タスク更新
- `delete_task` - タスク削除

この分離により、AIは「情報取得」と「操作実行」を明確に区別できます。

---

## 🤔 どちらを使うべきか？

### REST APIが適している場合

✅ Webアプリケーション（ブラウザからアクセス）
✅ 公開API（外部から広くアクセス）
✅ シンプルなCRUD操作
✅ HTTPの標準機能（キャッシュ、認証など）が必要

### MCPが適している場合

✅ **AIとの統合**（LLMがツールとして使用）
✅ プロセス間通信
✅ 自己記述的なAPI（動的な機能発見が必要）
✅ エージェントシステム
✅ コンテキスト共有が重要な場合

---

## 📝 学習のまとめ

### この章で学んだこと

1. ✅ REST APIとMCPの基本的な違い
2. ✅ 通信方式の違い（HTTP vs stdio）
3. ✅ 自己記述性の重要性
4. ✅ リソースとツールの概念
5. ✅ AIとの統合における優位性

### 次のステップ

- **第2章**: MCPサーバーの基本構造を深く学ぶ
- **第3章**: ツールの実装パターン
- **第4章**: プロンプトの活用
- **第5章**: クライアントの高度な使い方
- **第6章**: 実践的なタスク管理システムの構築

---

## 🔗 関連ファイル

- [`traditional-api/server.ts`](./traditional-api/server.ts) - REST APIサーバー実装
- [`traditional-api/client.ts`](./traditional-api/client.ts) - REST APIクライアント実装
- [`mcp-approach/server.ts`](./mcp-approach/server.ts) - MCPサーバー実装
- [`mcp-approach/client.ts`](./mcp-approach/client.ts) - MCPクライアント実装
- [`comparison.md`](./comparison.md) - より詳細な技術比較

## 💡 トラブルシューティング

### `tsx: command not found`

**原因**: 依存パッケージがインストールされていない

**解決方法**:
```bash
npm install
```

### サーバーが起動しない

**確認事項**:
1. 別のターミナルで同じサーバーが起動していないか
2. ポート3000が他のプログラムで使用されていないか（REST APIの場合）

### MCPクライアントがサーバーに接続できない

**確認事項**:
1. MCPサーバーが起動しているか
2. `client.ts`のパス指定が正しいか（`chapter-01/mcp-approach/server.ts`）

---

**次へ**: [第2章: 最初のMCPサーバー](../chapter-02/)
