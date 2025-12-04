# MCP ハンズオン教材

## 概要

この教材では、**Model Context Protocol (MCP)** について実際に手を動かしながら学びます。MCPは、AIアシスタントが外部ツールやデータソースと標準化された方法で対話できるようにするためのプロトコルです。

## 学習目標

このハンズオンを通じて、以下のスキルを習得できます：

- **従来のREST APIとMCPの違いを体感**
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

MCPの基本的な構成要素：
- **サーバー（Server）**: 機能を提供する側
- **クライアント（Client）**: 機能を利用する側
- **リソース（Resources）**: 読み取り専用のデータ
- **ツール（Tools）**: 実行可能な操作
- **プロンプト（Prompts）**: LLM用のテンプレート

## 環境セットアップ

### 必要なツール

```bash
# Node.js (v18以上推奨)
node --version

# npmの確認
npm --version
```

### プロジェクトのセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/MasaoAsano/mcp-handson.git
cd mcp-handson

# 依存パッケージをインストール
npm install
```

これで準備完了です！

## クイックスタート

```bash
# 第1章: 従来のAPIとMCPを比較してみる
npm run ch01:mcp

# 第2章: Hello Worldサーバーを起動
npm run ch02:hello

# 第6章: タスク管理システムを使ってみる
npm run ch06:client
```

---

## ハンズオンの構成

### 第1章: 従来のAPIとMCPの比較 ⭐

**所要時間: 30分**

同じタスク管理機能を、従来のREST APIとMCPの両方で実装し、違いを明確に理解します。

**学習内容:**
- REST APIの実装（Express.js）
- MCPでの同等実装
- 両者の設計思想の違い
- MCPの利点（自己記述性、AI統合）

**含まれるファイル:**
- `traditional-api/server.ts` - REST APIサーバー
- `traditional-api/client.ts` - fetchを使ったクライアント
- `mcp-approach/server.ts` - MCPサーバー
- `mcp-approach/client.ts` - MCPクライアント
- `comparison.md` - 詳細な比較ドキュメント

**実行方法:**
```bash
npm run ch01:traditional  # REST API版
npm run ch01:mcp          # MCP版
```

---

### 第2章: 最初のMCPサーバー

**所要時間: 40分**

MCPサーバーの基本構造を理解し、リソースを提供する方法を学びます。

**2.1 Hello Worldサーバー**

最もシンプルなMCPサーバーを作成します。

**サンプル:** `samples/01-hello-server.ts`
- サーバーの基本構造
- 1つのリソースの提供
- リクエストハンドラーの設定

**演習1:** 自分の名前を返すサーバーを作成
- `exercises/exercise-01.md` - 演習ガイド
- `exercises/exercise-01-template.ts` - テンプレート

**2.2 複数リソースの提供**

動的なURIと複数リソースの扱い方を学びます。

**サンプル:** `samples/02-server-with-resources.ts`
- 複数リソースの定義
- 動的なURI（例: `books://item/{id}`）
- パターンマッチング

**演習2:** 好きな映画/アニメのカタログサーバーを作成
- `exercises/exercise-02.md` - 演習ガイド
- `exercises/exercise-02-template.ts` - テンプレート

**実行方法:**
```bash
npm run ch02:hello      # Hello Worldサーバー
npm run ch02:resources  # 書籍ライブラリサーバー
```

---

### 第3章: ツールの実装

**所要時間: 50分**

状態を変更する操作（ツール）の実装方法を学びます。

**3.1 基本的なツール**

**サンプル:** `samples/calculator-tool.ts`
- 四則演算ツール（add, subtract, multiply, divide）
- 入力スキーマの定義
- パラメータの検証
- エラーハンドリング

**3.2 複数ツールの統合**

**サンプル:** `samples/weather-tool.ts` と `samples/server-with-tools.ts`
- 天気情報取得ツール（モックデータ）
- 複数ツールの統合サーバー
- ツール間の連携

**演習:** 文字列操作ツールを作成
- `exercises/exercise-01.md` - 演習ガイド
- `exercises/exercise-01-template.ts` - テンプレート
- uppercase, lowercase, reverse の3つのツール

**実行方法:**
```bash
npm run ch03:calculator  # 統合ツールサーバー
```

---

### 第4章: プロンプトの実装

**所要時間: 35分**

LLM用の再利用可能なプロンプトテンプレートを作成します。

**4.1 動的プロンプト**

**サンプル:** `samples/prompt-templates.ts`
- メール作成プロンプト（tone, recipient, subject対応）
- コードレビュープロンプト（language, focus対応）
- 記事要約プロンプト（length対応）
- 引数を使った動的生成

**4.2 リソース・ツール・プロンプトの統合**

**サンプル:** `samples/server-with-prompts.ts`
- すべての機能を持つサーバー
- 統合的な使用例

**実行方法:**
```bash
npm run ch04:prompts  # プロンプトサーバー
```

---

### 第5章: クライアントの実装

**所要時間: 40分**

MCPサーバーと通信するクライアントを実装します。

**5.1 基本的なクライアント**

**サンプル:** `samples/basic-client.ts`
- クライアントの初期化
- サーバーへの接続
- ツールの呼び出し
- リソースの読み取り

**5.2 高度なクライアント**

**サンプル:** `samples/client-with-tools.ts`
- バッチ処理
- エラーハンドリング
- 複数の操作を連続実行

**実行方法:**
```bash
npm run ch05:client  # クライアントデモ
```

---

### 第6章: 実践プロジェクト - タスク管理システム 🎯

**所要時間: 90分**

これまで学んだすべての要素を統合した、実用的なタスク管理システムを構築します。

**システム構成:**

**データ層:** `samples/task-manager/types.ts` + `storage.ts`
- Task型の定義
- JSONファイルベースのストレージ
- CRUD操作
- 検索機能

**サーバー層:** `samples/task-manager/server.ts`

**リソース:**
- `tasks://all` - 全タスクのリスト
- `tasks://summary` - 統計情報
- `tasks://item/{id}` - 個別タスク

**ツール:**
- `create_task` - タスク作成
- `update_task` - タスク更新  
- `delete_task` - タスク削除
- `search_tasks` - 検索

**プロンプト:**
- `create_task_prompt` - タスク作成支援
- `weekly_report` - 週次レポート生成

**クライアント:** `samples/task-manager/client.ts`
- デモ用クライアント
- 全機能の使用例

**機能:**
- ✅ タスクの作成、更新、削除
- ✅ ステータス管理（todo, in-progress, done）
- ✅ 優先度設定（low, medium, high）
- ✅ タグ機能
- ✅ 検索とフィルタリング
- ✅ 統計情報の表示

**実行方法:**
```bash
npm run ch06:server  # サーバー起動
npm run ch06:client  # クライアントデモ
```

---

### 第7章: テストとデバッグ

**所要時間: 30分**

MCPアプリケーションのテストとデバッグ手法を学びます。

**7.1 ユニットテスト**

**サンプル:** `samples/tools.test.ts`
- Jestを使ったテスト
- ツールのテスト例
- テストの書き方

**実行方法:**
```bash
npm test  # テスト実行
```

**7.2 デバッグのベストプラクティス**

- `console.error`を使ったログ出力
- エラーメッセージの設計
- トラブルシューティング

**発展課題（時間があれば）:**
- セキュリティ: 入力検証の強化
- パフォーマンス: キャッシング戦略
- Claude Desktopとの統合

---

## ディレクトリ構成

```
mcp-handson/
├── readme.md                                  # このファイル
├── package.json                               # プロジェクト設定
├── tsconfig.json                              # TypeScript設定
├── jest.config.js                             # Jestテスト設定
├── .gitignore
│
├── chapter-01/                                # 第1章: API比較
│   ├── traditional-api/
│   │   ├── server.ts                      # REST APIサーバー
│   │   └── client.ts                      # REST APIクライアント
│   ├── mcp-approach/
│   │   ├── server.ts                      # MCPサーバー
│   │   └── client.ts                      # MCPクライアント
│   └── comparison.md                      # 比較ドキュメント
│
├── chapter-02/                                # 第2章: 最初のサーバー
│   ├── samples/
│   │   ├── 01-hello-server.ts             # Hello World
│   │   └── 02-server-with-resources.ts    # リソース付き
│   └── exercises/
│       ├── exercise-01.md                 # 演習ガイド
│       ├── exercise-01-template.ts        # テンプレート
│       ├── exercise-02.md
│       └── exercise-02-template.ts
│
├── chapter-03/                                # 第3章: ツール
│   ├── samples/
│   │   ├── calculator-tool.ts             # 計算機
│   │   ├── weather-tool.ts                # 天気情報
│   │   └── server-with-tools.ts           # 統合サーバー
│   └── exercises/
│       ├── exercise-01.md                 # 文字列操作演習
│       └── exercise-01-template.ts
│
├── chapter-04/                                # 第4章: プロンプト
│   └── samples/
│       ├── prompt-templates.ts            # テンプレート集
│       └── server-with-prompts.ts         # 統合サーバー
│
├── chapter-05/                                # 第5章: クライアント
│   └── samples/
│       ├── basic-client.ts                # 基本クライアント
│       └── client-with-tools.ts           # 高度な使用例
│
├── chapter-06/                                # 第6章: 実践プロジェクト
│   └── samples/
│       └── task-manager/
│           ├── types.ts                   # 型定義
│           ├── storage.ts                 # データ永続化
│           ├── server.ts                  # タスク管理サーバー
│           └── client.ts                  # クライアント
│
└── chapter-07/                                # 第7章: テスト
    └── samples/
        └── tools.test.ts                      # テスト例
```

## 各章の実行コマンド

```bash
# 第1章: API比較
npm run ch01:traditional    # 従来のREST API
npm run ch01:mcp            # MCPアプローチ

# 第2章: 最初のサーバー
npm run ch02:hello          # Hello Worldサーバー
npm run ch02:resources      # リソース付きサーバー

# 第3章: ツール
npm run ch03:calculator     # 計算機 & 天気ツール

# 第4章: プロンプト
npm run ch04:prompts        # プロンプトテンプレート

# 第5章: クライアント
npm run ch05:client         # MCPクライアントデモ

# 第6章: 実践プロジェクト
npm run ch06:server         # タスク管理サーバー
npm run ch06:client         # タスク管理クライアント

# 第7章: テスト
npm test                    # 全テスト実行
```

## 学習の進め方

### 推奨学習パス

1. **第1章** - MCPの違いを体感（30分）
2. **第2章** - サーバーの基礎を習得（40分）
3. **第3章** - ツールの実装を学ぶ（50分）
4. **第4章** - プロンプトを理解（35分）
5. **第5章** - クライアントを作成（40分）
6. **第6章** - 実践プロジェクトに挑戦（90分）
7. **第7章** - テストとデバッグ（30分）

**合計所要時間: 約5時間15分**

### 学習のコツ

✅ **必ずサンプルを実行する**: 読むだけでなく、実際に動かしてみましょう
✅ **演習に取り組む**: 手を動かすことで理解が深まります
✅ **段階的に進める**: 焦らず、1章ずつ確実に理解しましょう
✅ **エラーを恐れない**: エラーは学習の機会です

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

## トラブルシューティング

### よくある問題と解決方法

#### 1. パッケージのインストールエラー

```bash
npm install @modelcontextprotocol/sdk
npm install -D @types/node typescript
```

#### 2. サーバーが起動しない

- Node.js のバージョンを確認（v18以上推奨）
- `node --version`

#### 3. TypeScriptのエラー

```bash
npx tsc --noEmit  # 型チェックのみ実行
```

#### 4. クライアントが接続できない

- サーバーが正常に起動しているか確認
- ファイルパスが正しいか確認

## 次のステップ

このハンズオンを完了したら、以下に挑戦してみましょう：

🚀 **より複雑なツールの実装**
- ファイル操作ツール
- データベース連携ツール

🚀 **実際のAIアシスタントとの統合**
- Claude Desktopへの組み込み
- 設定ファイルの作成

🚀 **プロダクション環境へのデプロイ**
- セキュリティの強化
- パフォーマンスの最適化

🚀 **コミュニティへの貢献**
- 自作サーバーの公開
- ドキュメントの改善

## ライセンス

このハンズオン教材は MIT ライセンスの下で提供されています。

## フィードバック

この教材に関するフィードバックや改善提案は、GitHubのIssuesまでお願いします。

---

**それでは、MCPの世界へようこそ！**

第1章から順に進めて、実際に手を動かしながらMCPの理解を深めていきましょう。
