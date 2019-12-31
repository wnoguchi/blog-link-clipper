CHANGELOG
============

0.11.0 (2019-12-31)
---------------------------------------------------------------------

1. Add HTML A tag format security: rel="noopener"
2. Change URL Shortening service goo.gl to l.pg1x.com powered by Firebase
3. Remove Google Analytics Tracking

0.10.0 (2018-01-21)
---------------------------------------------------------------------

1. Add DokuWiki Format.
2. Redmine Ticket URL Cleanup Feature.

0.9.0 (2016-10-25)
---------------------------------------------------------------------

1. Add reStructuredText Format.

0.8.0 (2015-08-06)
---------------------------------------------------------------------

1. Implement Amazon URL Cleanup feature.
2. Google Analytics Tracking.

0.7.2
---------------------------------------------------------------------

1. Escape JIRA title

0.7.1
-------

1. JIRA support.

0.7.0
-------

1. Save previous selection state.
1. Embrace MIT License.
1. I18N typo fix.
1. Large Refactoring.

0.6.0
-------

1. Markdownに対応しました。
1. Manifest v2に対応しました。

0.5.1
-------

1. 最初のクリップボードコピーまでの時間を 1000ms まで延長（不具合修正）
WebKit 系だと `$(function () { ... });` の記述がうまく動きませんでした。
苦肉の策、、、誰かもっといい方法ありましたらご教授ください。。。

0.5.0
-------

1. ポップアップ表示のタイミングでシンプル形式でコピーする機能を実装

0.4.0
-------

1. "末尾に改行を入れない"チェックボックスをチェックするとリンクタグラジオボタンのオプションチェックボックスが無効となる不具合を修正
1. goo.gl URL 短縮機能追加
1. 国際化(English)

0.3.0
-------

1. リンクタグをリストタグ `<li></li>` ではさめるようになりました
1. 末尾に改行を入れる／入れないが切り替えられるようになりました

0.2.0
-------

1. `target="_blank"` の切り替えに対応しました
1. 各種Wiki記法にも対応しました
  1. はてな記法 `[url:title=]`
  1. MediaWiki `[url title]`
  1. PukiWiki `[[title:url]]`
  1. Redmine `"title":url`

