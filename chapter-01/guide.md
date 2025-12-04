# 第1章: 従来のAPIとMCPの比較 - 実践ガイド

## 🎯 この章で学ぶこと

従来のREST APIとMCPを**同じタスク管理機能**で実装し、実際に動かしながら両者の違いを体感します。

**所要時間: 30分**

---

## 🚀 クイックスタート

### 準備（初回のみ）

```bash
cd /Users/masaoasano/mcp_test
npm install
```

### REST APIを試す（5分）

```bash
# サーバー起動
npm run ch01:traditional
```

別ターミナルで：
```bash
# タスク一覧を取得
curl http://localhost:3000/tasks

# タスクを作成
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "MCPを学ぶ"}'
```

### MCPを試す（5分）

```bash
# サーバー起動
npm run ch01:mcp
```

別ターミナルで：
```bash
# クライアント実行
npx tsx chapter-01/mcp-approach/client.ts
```

---

## 📊 核心: 操作の完全対応表

REST APIの各操作がMCPでどう対応するかを理解することが、この章の最重要ポイントです。

### 対応一覧

| 操作 | REST API | MCP | MCPの種類 |
|------|----------|-----|-----------|
| 📋 **一覧取得** | `GET /tasks` | `readResource('task://list')` | リソース |
| 📖 **詳細取得** | `GET /tasks/:id` | `readResource('task://item/{id}')` | リソース |
| ➕ **作成** | `POST /tasks` | `callTool('create_task')` | ツール |
| ✏️ **更新** | `PUT /tasks/:id` | `callTool('update_task')` | ツール |
| 🗑️ **削除** | `DELETE /tasks/:id` | `callTool('delete_task')` | ツール |

### 重要な違い

**REST API:** HTTPメソッドで操作を区別
- GET = 取得、POST = 作成、PUT = 更新、DELETE = 削除

**MCP:** リソースとツールで明確に分離
- **読み取り専用** → リソース（`readResource`）
- **書き込み・変更** → ツール（`callTool`）

---

## 💻 詳細: 各操作の実装比較

### 1. タスク一覧取得（GET /tasks）

#### REST API
```bash
curl http://localhost:3000/tasks
```

<details>
<summary>実装コード（サーバー側）</summary>

```typescript
app.get('/tasks', (req, res) => {
    res.json({ tasks });
});
```
</details>

**レスポンス:**
```json
{
  "tasks": [
    {
      "id": "1",
      "title": "MCPを学ぶ",
      "status": "todo"
    }
  ]
}
```

#### MCP
```typescript
// リソースを読み取る
const taskList = await client.readResource({
    uri: 'task://list'
});

const tasks = JSON.parse(taskList.contents[0].text);
```

<details>
<summary>実装コード（サーバー側）</summary>

```typescript
// リソース定義
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [{
            uri: 'task://list',
            name: 'タスク一覧',
            description: '全てのタスクのリスト',
            mimeType: 'application/json',
        }],
    };
});

// リソース読み取り
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    if (request.params.uri === 'task://list') {
        return {
            contents: [{
                uri: 'task://list',
                mimeType: 'application/json',
                text: JSON.stringify(tasks, null, 2),
            }],
        };
    }
});
```
</details>

**ポイント:**
- REST: シンプルだがドキュメントが必要
- MCP: サーバー自身が「task://list」を説明

---

### 2. タスク詳細取得（GET /tasks/:id）

#### REST API
```bash
curl http://localhost:3000/tasks/1
```

**レスポンス:**
```json
{
  "task": {
    "id": "1",
    "title": "MCPを学ぶ",
    "description": "基礎を理解する",
    "status": "todo"
  }
}
```

#### MCP
```typescript
// 特定IDのリソースを読み取る
const task = await client.readResource({
    uri: 'task://item/1'  // ← IDを指定
});

const taskData = JSON.parse(task.contents[0].text);
```

**ポイント:** URIが違うだけで、同じ`readResource`を使用

---

### 3. タスク作成（POST /tasks）⭐

#### REST API
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "買い物",
    "description": "牛乳を買う"
  }'
```

<details>
<summary>実装コード（サーバー側）</summary>

```typescript
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'タイトルは必須です' });
    }
    
    const newTask = {
        id: String(tasks.length + 1),
        title,
        description: description || '',
        status: 'todo',
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    res.status(201).json({ task: newTask });
});
```
</details>

#### MCP
```typescript
// ツールを呼び出す
const result = await client.callTool({
    name: 'create_task',
    arguments: {
        title: '買い物',
        description: '牛乳を買う',
    },
});

console.log(result.content[0].text);
// → "タスクを作成しました: 買い物 (ID: 2)"
```

<details>
<summary>実装コード（サーバー側）</summary>

```typescript
// ツール定義
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

// ツール実行
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === 'create_task') {
        const { title, description = '' } = request.params.arguments;
        
        const newTask = {
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
```
</details>

**ポイント:**
- REST: パラメータの仕様は外部ドキュメント
- MCP: `inputSchema`でパラメータを自己説明

---

### 4. タスク更新（PUT /tasks/:id）

#### REST API
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress"
  }'
```

#### MCP
```typescript
const result = await client.callTool({
    name: 'update_task',
    arguments: {
        id: '1',
        status: 'in-progress',
    },
});
```

---

### 5. タスク削除（DELETE /tasks/:id）

#### REST API
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

#### MCP
```typescript
const result = await client.callTool({
    name: 'delete_task',
    arguments: {
        id: '1',
    },
});
```

---

## 🎓 実践演習

### 演習1: REST APIで操作

サーバーを起動：
```bash
npm run ch01:traditional
```

以下を順番に試してください：

```bash
# 1. 現在のタスクを確認
curl http://localhost:3000/tasks

# 2. 新しいタスクを3つ作成
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "第1章を読む"}'

curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "演習問題を解く"}'

curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "理解度チェック"}'

# 3. 再度確認
curl http://localhost:3000/tasks

# 4. タスクを更新（2番目のタスクを進行中に）
curl -X PUT http://localhost:3000/tasks/2 \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'

# 5. 最初のタスクを削除
curl -X DELETE http://localhost:3000/tasks/1

# 6. 最終確認
curl http://localhost:3000/tasks
```

### 演習2: MCPで同じ操作

サーバーを起動：
```bash
npm run ch01:mcp
```

`client.ts`を編集して同じ操作を実行してみましょう。

---

## 🔍 MCPの主な利点

### 1. 自己記述性（Self-Describing）

**REST APIの問題:**
```
開発者: このAPIは何ができる？
→ ドキュメントを読んでください（外部情報が必要）
```

**MCPの解決:**
```typescript
// サーバーに接続
await client.connect(transport);

// サーバーに聞く
const resources = await client.listResources();
// → サーバーが「task://list」などを説明付きで返す

const tools = await client.listTools();
// → サーバーが「create_task」などをスキーマ付きで返す
```

サーバー自身が「何ができるか」を動的に教えてくれる！

### 2. AI（LLM）との統合が容易

**REST APIの場合:**
1. AIに各エンドポイントを教える必要がある
2. パラメータの形式を説明する必要がある
3. APIドキュメントを解析させる追加ステップが必要

**MCPの場合:**
```typescript
// 1. サーバーに接続
await client.connect(transport);

// 2. 利用可能なツールを取得（自動）
const { tools } = await client.listTools();
// [{
//   name: "create_task",
//   description: "新しいタスクを作成する",
//   inputSchema: { ... }  ← AIはこれを読んで理解できる
// }]

// 3. AIが適切なツールを選んで実行
```

**AIは接続するだけで、サーバーの全機能を理解し、適切に使用できる！**

### 3. 型安全性とバリデーション

MCPは入力スキーマを含むため、実行前にパラメータを検証できます。

```typescript
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

## 📝 学習のまとめ

### 覚えるべきポイント

#### REST API
```
GET    → 取得
POST   → 作成
PUT    → 更新
DELETE → 削除
```
すべてHTTPリクエスト

#### MCP
```
readResource → 取得（読み取り専用）
callTool     → 作成・更新・削除（書き込み）
```
**シンプルに:** 見るだけ→リソース、変更する→ツール

### この章で習得したこと

✅ REST APIとMCPの基本的な違い  
✅ 通信方式の違い（HTTP vs stdio）  
✅ 各CRUD操作の対応関係  
✅ 自己記述性の重要性  
✅ リソースとツールの概念  
✅ AIとの統合における優位性  

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

## 🛠️ 便利な追加ツール

### コマンドラインからタスク作成

`create-task.ts` を使うと、コマンドラインから簡単にタスクを作成できます：

```bash
# MCPサーバーが起動していることを確認
npm run ch01:mcp

# 別ターミナルで
npx tsx chapter-01/mcp-approach/create-task.ts "買い物" "牛乳と卵を買う"
```

**出力:**
```
🔧 MCPタスク作成ツール

✅ MCPサーバーに接続しました

📝 新しいタスクを作成中...
   タイトル: 買い物
   説明: 牛乳と卵を買う

✅ タスクを作成しました: 買い物 (ID: 2)

📋 現在のタスク一覧:
   1. [in-progress] MCPについて学ぶ
   2. [todo] 買い物
```

---

## 💡 トラブルシューティング

### `tsx: command not found`

**原因:** 依存パッケージがインストールされていない

**解決方法:**
```bash
npm install
```

### `npx` と `tsx` を直接実行の違い

```bash
# ❌ エラー
tsx chapter-01/mcp-approach/client.ts

# ✅ 正しい
npx tsx chapter-01/mcp-approach/client.ts
```

**理由:** `tsx`はプロジェクトローカルにインストールされているため、`npx`経由で実行する必要があります。

### MCPクライアントがエラー

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../chapter-00/...'
```

**原因:** client.tsのパス指定が古い

**解決方法:** すでに修正済みです。最新のコードを使用してください。

### サーバーが起動しない

**確認事項:**
1. 別のターミナルで同じサーバーが起動していないか
2. ポート3000が他のプログラムで使用されていないか（REST APIの場合）

**解決方法:**
```bash
# 既存のプロセスを停止
Ctrl + C

# 再起動
npm run ch01:traditional  # または ch01:mcp
```

---

## 🔗 関連ファイル

- [`traditional-api/server.ts`](./traditional-api/server.ts) - REST APIサーバー実装（102行）
- [`traditional-api/client.ts`](./traditional-api/client.ts) - REST APIクライアント実装（84行）
- [`mcp-approach/server.ts`](./mcp-approach/server.ts) - MCPサーバー実装（261行）
- [`mcp-approach/client.ts`](./mcp-approach/client.ts) - MCPクライアント実装（86行）
- [`mcp-approach/create-task.ts`](./mcp-approach/create-task.ts) - コマンドライン用タスク作成ツール
- [`comparison.md`](./comparison.md) - より詳細な技術比較

---

## 📚 次のステップ

この章の理解度チェック：
- [ ] REST APIとMCPの通信方式の違いを説明できる
- [ ] `GET /tasks`がMCPの何に対応するか分かる
- [ ] リソースとツールの違いを理解している
- [ ] 自己記述性の利点を説明できる

すべてチェックできたら、次の章へ進みましょう！

**次へ:** [第2章: 最初のMCPサーバー](../chapter-02/) - MCPサーバーの基本構造を深く学びます

---

**🎉 お疲れさまでした！この章で、MCPの基礎を実践的に学びました。**
