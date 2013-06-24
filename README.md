# BlogLinkClipper

## これは何？

現在表示中のページの URL とタイトルを様々な形式でクリップボードにコピーする Google Chrome 拡張機能です。
Twitter や、ブログ記事作成のお供にどうぞ。

This extension copies to clipboard URL, and Title for various formats. For Twitter or writing your Blog.

シンプルにタイトルとURLをコピーする機能のほか、
HTMLドキュメントやブログを書く人向けにリンクタグとしてフォーマットする機能があります。

## ChangeLog 
### 0.6.0 での変更点
* Markdownに対応しました。
* Manifest v2に対応しました。

### 0.5.1 での変更点
最初のクリップボードコピーまでの時間を 1000ms まで延長（不具合修正）
WebKit 系だと `$(function () { ... });` の記述がうまく動きませんでした。
苦肉の策、、、誰かもっといい方法ありましたらご教授ください。。。

### 0.5.0 での変更点
* ポップアップ表示のタイミングでシンプル形式でコピーする機能を実装

### 0.4.0 での変更点
* "末尾に改行を入れない"チェックボックスをチェックするとリンクタグラジオボタンのオプションチェックボックスが無効となる不具合を修正
* goo.gl URL 短縮機能追加
* 国際化(English)

### 0.3.0 での変更点
* リンクタグをリストタグ `<li></li>` ではさめるようになりました
* 末尾に改行を入れる／入れないが切り替えられるようになりました

### 0.2.0 での変更点
* `target="_blank"` の切り替えに対応しました
* 各種Wiki記法にも対応しました
  - はてな記法 `[url:title=]`
  - MediaWiki `[url title]`
  - PukiWiki `[[title:url]]`
  - Redmine `"title":url`

