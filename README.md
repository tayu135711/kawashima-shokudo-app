# 川島食堂（仮）

新潟の港から、旬のカニを届けるフードデリバリーアプリ（Uber Eats風）のフロントエンド実装。

## 現在の状態

- `index.html` … ログイン/新規登録画面（ロール選択: customer / store / courier / admin）
- `screens/` … ログイン後の各ロール向け画面（現在は仮実装、次のステップで実データと接続予定）
- 認証は現状すべてモック（`sessionStorage`にダミーのユーザー情報を保存）。バックエンド（Spring Boot）のAPIが完成し次第、`js/app.js`のTODO部分を`fetch`に差し替える想定。

## ファイル構成

```
komedaku-app/
├── index.html              ログイン/新規登録画面
├── css/
│   ├── style.css           ログイン画面のスタイル（デザイントークンもここで定義）
│   └── screens.css         ログイン後の各画面共通スタイル
├── js/
│   ├── app.js               ログイン画面のロジック（ロール切替・モック認証）
│   └── session.js           ログイン後の画面で使う共通処理（セッション確認・ログアウト）
└── screens/
    ├── store-list.html          customer用（店舗一覧・仮）
    ├── store-management.html    store用（店舗管理・仮）
    ├── courier-available.html   courier用（配達可能一覧・仮）
    └── admin-dashboard.html     admin用（管理者ダッシュボード・仮）
```

## ローカルでの確認方法

`index.html` をブラウザで直接開くか、VSCodeの Live Server 拡張などで開いてください。
（`fetch`によるAPI連携を始めたら、CORSの都合でローカルサーバー経由での起動が必須になります）

## GitHubへの公開手順（例）

```bash
git init
git add .
git commit -m "feat: ログイン画面と各ロール遷移先の仮画面を実装"
git branch -M main
git remote add origin <あなたのリポジトリURL>
git push -u origin main
```

## 次にやること

- [ ] バックエンド（Spring Boot）の `POST /api/auth/login` `POST /api/auth/register` と接続
- [ ] `store-list.html` を実データ（店舗一覧API）と接続
- [ ] 店舗詳細・カート画面の実装
