# 第0章: 従来のAPIとMCPの比較

## 目的

この章では、従来のREST APIとModel Context Protocol (MCP)の違いを理解します。同じタスク管理システムを両方のアプローチで実装し、それぞれの特徴を比較します。

## 🔧 従来のREST APIアプローチ

### 特徴

- **HTTPベース**: エンドポイントごとにHTTPメソッド（GET, POST, PUT, DELETE）を使用
- **ステートレス**: 各リクエストは独立しており、サーバーはクライアントの状態を保持しない
- **リソース指向**: URLでリソースを表現（例: `/tasks`, `/tasks/1`）
- **固定スキーマ**: APIの仕様をOpenAPIなどで別途定義する必要がある

### コード構造

**サーバー (`traditional-api/server.ts`)**
```typescript
app.get('/tasks', (req, res) => { ... })      // タスク一覧取得
app.post('/tasks', (req, res) => { ... })     // タスク作成
app.put('/tasks/:id', (req, res) => { ... })  // タスク更新
app.delete('/tasks/:id', (req, res) => { ... }) // タスク削除
```

**クライアント (`traditional-api/client.ts`)**
```typescript
const response = await fetch('http://localhost:3000/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title, description })
});
```

### 実行方法

```bash
# サーバーを起動
npm run ch00:traditional

# 別のターミナルでクライアントを実行
tsx chapter-00/traditional-api/client.ts
```

---

## 🚀 MCPアプローチ

### 特徴

- **プロトコルベース**: 標準化されたMCPプロトコルで通信
- **自己記述的**: サーバーがリソースとツールの仕様を提供
- **リソース + ツール**: データ（リソース）と操作（ツール）を明確に分離
- **AI統合を前提**: LLMが直接理解・実行できるように設計

### コード構造

**サーバー (`mcp-approach/server.ts`)**
```typescript
// リソース: データの提供
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return { resources: [...] };
});

// ツール: 操作機能の提供
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [...] };
});
```

**クライアント (`mcp-approach/client.ts`)**
```typescript
// リソースを読み取る
const taskList = await client.readResource({ uri: 'task://list' });

// ツールを呼び出す
await client.callTool({
  name: 'create_task',
  arguments: { title: '...', description: '...' }
});
```

### 実行方法

```bash
# MCPクライアント（サーバーも自動起動）
npm run ch00:mcp
```

---

## 📊 主な違いの比較表

| 項目 | REST API | MCP |
|------|----------|-----|
| **通信方式** | HTTP/HTTPS | stdio, HTTP, WebSocket等 |
| **データ取得** | GET リクエスト | リソース読み取り |
| **データ操作** | POST/PUT/DELETE | ツール呼び出し |
| **スキーマ定義** | OpenAPI等で別途定義 | プロトコルに組み込み済み |
| **発見可能性** | ドキュメントを参照 | サーバーが自己記述 |
| **AI統合** | プロンプトで説明が必要 | ネイティブにサポート |
| **エラーハンドリング** | HTTPステータスコード | 構造化されたエラー |

## 🎯 MCPの利点

### 1. **自己記述的**
MCPサーバーは自身が提供する機能を動的に説明できます。クライアント（やAI）は実行時に利用可能な機能を発見できます。

```typescript
// MCPでは利用可能なツールを動的に取得
const tools = await client.listTools();
tools.tools.forEach(tool => {
  console.log(`${tool.name}: ${tool.description}`);
  console.log(`入力スキーマ:`, tool.inputSchema);
});
```

### 2. **リソースとツールの分離**
- **リソース**: 読み取り専用のデータ（タスク一覧、設定など）
- **ツール**: 状態を変更する操作（タスク作成、更新など）

この分離により、AIアシスタントが「情報を取得する」と「操作を実行する」を明確に区別できます。

### 3. **AI統合を前提とした設計**
MCPは最初からLLMとの統合を考慮して設計されています：
- ツールの説明がLLMに最適化
- 入力スキーマがJSON Schemaで明確
- 実行結果がLLMに理解しやすい形式

### 4. **柔軟な通信方式**
MCPは複数の通信方式をサポート：
- **stdio**: ローカルプロセス間通信（最も一般的）
- **HTTP/SSE**: リモートサーバーとの通信
- **WebSocket**: 双方向通信

## 🤔 REST APIの利点

MCPが優れている点が多いですが、REST APIにも利点があります：

1. **広く普及している**: ほとんどの開発者が理解している
2. **ツールが豊富**: Postman、Swaggerなどのツールエコシステムが充実
3. **ブラウザから直接利用可能**: fetchやaxiosで簡単に呼び出せる
4. **キャッシングが容易**: HTTPキャッシュの仕組みを活用できる

## 🎓 学習のポイント

1. **両方のコードを比較**: `traditional-api/` と `mcp-approach/` のコードを見比べる
2. **実行して体感**: 両方を実際に動かして、使用感の違いを確認
3. **次章以降**: MCPの各機能（リソース、ツール、プロンプト）を詳しく学ぶ

## 💡 まとめ

- **REST API**: 汎用的なWebサービスに適している
- **MCP**: AIエージェントとの統合に最適化されており、自己記述的で柔軟

次の章からは、MCPの各機能を段階的に学んでいきます！
