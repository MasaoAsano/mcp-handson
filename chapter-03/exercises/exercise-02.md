# 演習3-2: 複数リソースを提供するサーバーを作る

## 🎯 目標

複数のリソースと動的なURIを扱うMCPサーバーを作成します。

## 📝 課題

あなたの好きな映画やアニメのリストを提供するサーバーを作成してください。

### 要件

1. サーバー名は `my-media-library`
2. 少なくとも3つの作品データを用意する
3. 以下のリソースを提供:
   - `media://catalog` - 全作品のリスト（JSON形式）
   - `media://item/{id}` - 個別作品の詳細（JSON形式）

### データ構造の例

```typescript
interface Media {
  id: string;
  title: string;
  creator: string;  // 監督や作者
  year: number;
  genre: string;
}
```

## 💡 ヒント

### 1. データの準備

```typescript
const mediaList: Media[] = [
  {
    id: '1',
    title: 'あなたの好きな作品',
    creator: '監督や作者名',
    year: 2024,
    genre: 'ジャンル',
  },
  // 少なくともあと2つ追加
];
```

### 2. 動的なリソース一覧

```typescript
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'media://catalog',
        name: 'メディアカタログ',
        description: '全作品のリスト',
        mimeType: 'application/json',
      },
      // mapを使って各作品を個別リソースとして追加
      ...mediaList.map(media => ({
        uri: `media://item/${media.id}`,
        name: media.title,
        description: `${media.creator} (${media.year})`,
        mimeType: 'application/json',
      })),
    ],
  };
});
```

### 3. URIパターンのマッチング

```typescript
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  // カタログ全体の場合
  if (uri === 'media://catalog') {
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(mediaList, null, 2),
      }],
    };
  }

  // 個別作品の場合
  const match = uri.match(/^media:\/\/item\/(.+)$/);
  if (match) {
    const mediaId = match[1];
    const media = mediaList.find(m => m.id === mediaId);
    
    if (!media) {
      throw new Error(`作品が見つかりません: ${mediaId}`);
    }

    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(media, null, 2),
      }],
    };
  }

  throw new Error(`不明なリソース: ${uri}`);
});
```

## 🧪 テスト方法

```bash
tsx chapter-03/exercises/exercise-02-template.ts
```

## ✅ 完成の確認

以下ができれば完成です：
- [ ] 少なくとも3つの作品データがある
- [ ] `media://catalog` リソースで全作品が取得できる
- [ ] `media://item/1` などで個別作品が取得できる
- [ ] 存在しないIDの場合、適切なエラーが返る

## 🎓 学習ポイント

- 複数リソースの管理
- 動的なURIの生成とパターンマッチング
- JSONデータの扱い方
- エラーハンドリング

## 🚀 チャレンジ課題（オプション）

余裕があれば以下も試してみましょう：

1. **ジャンル別リソースを追加**
   - `media://genre/{genre}` で特定ジャンルの作品を取得

2. **検索機能**
   - クエリパラメータで作品を検索できるようにする

3. **メタデータリソース**
   - `media://stats` で統計情報（作品数、ジャンル数など）を提供
