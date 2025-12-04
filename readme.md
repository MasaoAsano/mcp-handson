# MCP ハンズオン教材

## 概要

この教材では、**Model Context Protocol (MCP)** について実際に手を動かしながら学びます。MCPは、AIアシスタントが外部ツールやデータソースと標準化された方法で対話できるようにするためのプロトコルです。

## 学習目標

このハンズオンを通じて、以下のスキルを習得できます：

- MCPの基本概念とアーキテクチャの理解
- MCPサーバーの実装方法
- MCPクライアントとの接続方法
- リソース、ツール、プロンプトの実装
- 実践的なMCPアプリケーションの開発

## 前提知識

- **JavaScript/TypeScript** の基本的な知識
- **Node.js** の基本的な使い方
- **コマンドライン** の基本操作
- **JSON** の基本的な理解

## ハンズオンの構成

### 第1章: MCPの基礎知識

**所要時間: 20分**

- MCPとは何か
- MCPのアーキテクチャ
- MCPの主要コンポーネント
  - サーバー（Server）
  - クライアント（Client）
  - リソース（Resources）
  - ツール（Tools）
  - プロンプト（Prompts）

### 第2章: 環境セットアップ

**所要時間: 15分**

#### 2.1 必要なツールのインストール

```bash
# Node.js (v18以上推奨)
node --version

# npm または yarn
npm --version
```

#### 2.2 プロジェクトの初期化

```bash
mkdir mcp-handson
cd mcp-handson
npm init -y
npm install @modelcontextprotocol/sdk
```

#### 2.3 TypeScript環境のセットアップ

```bash
npm install -D typescript @types/node
npx tsc --init
```

### 第3章: 最初のMCPサーバーを作成する

**所要時間: 30分**

#### 3.1 シンプルなサーバーの実装

**演習1: Hello World サーバー**

- MCPサーバーの基本構造を理解
- サーバーの起動と停止
- ログの確認

**成果物:**
- `src/server-hello.ts` - 基本的なMCPサーバー

#### 3.2 リソースの追加

**演習2: 静的データを提供するリソース**

- リソースの定義方法
- リソース一覧の提供
- リソースの読み取り実装

**成果物:**
- `src/server-with-resources.ts` - リソース機能を持つサーバー

### 第4章: ツールの実装

**所要時間: 45分**

#### 4.1 基本的なツールの作成

**演習3: 計算機ツール**

- ツールの定義（スキーマ設計）
- 入力パラメータの検証
- ツールの実行ロジック

**成果物:**
- `src/tools/calculator.ts` - 四則演算を行うツール

#### 4.2 外部APIを利用するツール

**演習4: 天気情報取得ツール**

- 外部APIとの連携
- エラーハンドリング
- レスポンスの整形

**成果物:**
- `src/tools/weather.ts` - 天気情報を取得するツール

### 第5章: プロンプトの実装

**所要時間: 30分**

#### 5.1 動的プロンプトの作成

**演習5: テンプレートプロンプト**

- プロンプトの定義
- 引数の受け取り
- 動的なプロンプト生成

**成果物:**
- `src/prompts/templates.ts` - 再利用可能なプロンプトテンプレート

### 第6章: MCPクライアントの実装

**所要時間: 40分**

#### 6.1 クライアントの基本実装

**演習6: サーバーに接続するクライアント**

- クライアントの初期化
- サーバーへの接続
- リソースの取得

**成果物:**
- `src/client.ts` - MCPクライアント

#### 6.2 ツールの呼び出し

**演習7: クライアントからツールを実行**

- ツールの検索
- ツールの実行
- 結果の処理

### 第7章: 実践プロジェクト

**所要時間: 90分**

#### 実践演習: タスク管理システムの構築

MCPを使用して、以下の機能を持つタスク管理システムを構築します：

**機能要件:**
1. **リソース**
   - タスク一覧の提供
   - 個別タスクの詳細情報

2. **ツール**
   - タスクの追加
   - タスクの更新
   - タスクの削除
   - タスクの検索

3. **プロンプト**
   - タスク作成用テンプレート
   - レポート生成用テンプレート

**成果物:**
- `src/task-manager/server.ts` - タスク管理サーバー
- `src/task-manager/client.ts` - タスク管理クライアント
- `src/task-manager/storage.ts` - データ永続化層

### 第8章: デバッグとテスト

**所要時間: 30分**

#### 8.1 デバッグ手法

- ログの活用
- MCP Inspector の使用
- エラートラブルシューティング

#### 8.2 テストの書き方

**演習8: ユニットテストの作成**

```bash
npm install -D jest @types/jest ts-jest
```

**成果物:**
- `tests/tools.test.ts` - ツールのテスト
- `tests/server.test.ts` - サーバーのテスト

### 第9章: 高度なトピック

**所要時間: 45分**

#### 9.1 セキュリティのベストプラクティス

- 入力検証
- 認証と認可
- レート制限

#### 9.2 パフォーマンス最適化

- キャッシング戦略
- 並列処理
- リソース管理

#### 9.3 実際のAIアシスタントとの統合

- Claude Desktop との統合設定
- 設定ファイルの作成
- 動作確認

**演習9: Claude Desktop へのMCPサーバー追加**

設定ファイルの例:
```json
{
  "mcpServers": {
    "task-manager": {
      "command": "node",
      "args": ["path/to/your/server.js"]
    }
  }
}
```

### 第10章: まとめと次のステップ

**所要時間: 15分**

#### 学習の振り返り

- MCPの主要概念の復習
- 実装したコンポーネントの確認
- ベストプラクティスのまとめ

#### 次のステップ

- より複雑なツールの実装
- 複数のMCPサーバーの連携
- プロダクション環境へのデプロイ
- コミュニティへの貢献

## 参考リソース

### 公式ドキュメント

- [MCP 公式ドキュメント](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP 仕様](https://spec.modelcontextprotocol.io/)

### サンプルコード

- [公式サンプルサーバー集](https://github.com/modelcontextprotocol/servers)
- このハンズオンのサンプルコード（各章ごとに提供）

### コミュニティ

- [MCP Discord サーバー](https://discord.gg/mcp)
- [GitHub Discussions](https://github.com/modelcontextprotocol/specification/discussions)

## ディレクトリ構成

このハンズオンを完了すると、以下のようなディレクトリ構成になります：

```
mcp-handson/
├── readme.md                          # このファイル
├── package.json
├── tsconfig.json
├── src/
│   ├── chapter-03/
│   │   ├── server-hello.ts           # 第3章: Hello Worldサーバー
│   │   └── server-with-resources.ts  # 第3章: リソース付きサーバー
│   ├── chapter-04/
│   │   └── tools/
│   │       ├── calculator.ts         # 第4章: 計算機ツール
│   │       └── weather.ts            # 第4章: 天気ツール
│   ├── chapter-05/
│   │   └── prompts/
│   │       └── templates.ts          # 第5章: プロンプトテンプレート
│   ├── chapter-06/
│   │   └── client.ts                 # 第6章: MCPクライアント
│   └── chapter-07/
│       └── task-manager/
│           ├── server.ts             # 第7章: タスク管理サーバー
│           ├── client.ts             # 第7章: タスク管理クライアント
│           └── storage.ts            # 第7章: データ永続化
├── tests/
│   ├── tools.test.ts                 # 第8章: ツールのテスト
│   └── server.test.ts                # 第8章: サーバーのテスト
└── docs/
    ├── chapter-01.md                 # 各章の詳細ガイド
    ├── chapter-02.md
    └── ...
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. サーバーが起動しない

```bash
# ポートが既に使用されている場合
Error: listen EADDRINUSE: address already in use
```

**解決策:** 別のポートを使用するか、既存のプロセスを終了する

#### 2. 型エラーが発生する

```bash
# TypeScriptの型定義が見つからない
Cannot find module '@modelcontextprotocol/sdk'
```

**解決策:**
```bash
npm install @modelcontextprotocol/sdk
npm install -D @types/node
```

#### 3. クライアントがサーバーに接続できない

**解決策:**
- サーバーが正常に起動しているか確認
- 接続設定（ホスト、ポート）が正しいか確認
- ファイアウォール設定を確認

## ライセンス

このハンズオン教材は MIT ライセンスの下で提供されています。

## フィードバック

この教材に関するフィードバックや改善提案は、GitHubのIssuesまでお願いします。

---

**それでは、MCPの世界へようこそ！**

第1章から順に進めて、実際に手を動かしながらMCPの理解を深めていきましょう。
