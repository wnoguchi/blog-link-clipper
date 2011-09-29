
/**
 * ポップアップJavaScript
 * @author Wataru Noguchi <wnoguchi.0727@gmail.com>
 */

var c = chrome;
var ws = c.windows;
var tbs = c.tabs;

$(function() {
  manageSelection($('#simpleFormat'));
  setTextAreaUrlAndTitle();
  
  // 設定が変更されたらテキストエリアの内容を変更するイベント
  $('.formatChanger').click(function () {
    manageSelection(this);
    setTextAreaUrlAndTitle();
  });
  
  /** コピーボタンが押されたときのアクションをバインド */
  $('#copyButton').click(function () {
    $('#text').focus();
    $('#text').select();
    document.execCommand("Copy");
    
    $('#notice').html('クリップボードにコピーしました！');
    setTimeout(function () {
      $('#notice').html('');
    }, 5000);
  });
});

/** 現在選択されているタブのURLとタイトルを取得してテキストエリアに設定する */
function setTextAreaUrlAndTitle() {
  
  try {
    ws.getCurrent(function (window) {
      /** 選択されているタブをハンドリングする処理 */
      tbs.getSelected(window.id, function (tab) {
        var url = tab.url;
        var title = tab.title;
        var formattedLinkText = '';
        
        // フォーマット判別
        selectedFormat = $('input[type=radio][name=format]:checked').val();
        switch (selectedFormat) {
          // シンプル
          case 'simple':
            formattedLinkText = title + "\n" + url;
            break;
          // リンクタグ
          case 'blog':
            var targetBlankStr = '';
            var liStart = '';
            var liEnd = '';
            
            // target="_blank" チェック
            var targetBlank = $('#targetBlankCheckBox').is(':checked');
            if (targetBlank) {
              targetBlankStr = ' target="_blank"';
            }
            
            // <li></li>で挟むかどうか判別
            var clipWithListTag = $('#clipWithListTagCheckBox').is(':checked');
            if (clipWithListTag) {
              liStart = '<li>';
              liEnd = '</li>';
            }
            
            formattedLinkText = liStart + '<a href="' + url + '"' + targetBlankStr + '>' + title +'</a>' + liEnd;
            break;
          // はてな記法
          case 'hatena':
            formattedLinkText = '[' + url + ':title]';
            break;
          // MediaWiki
          case 'media':
            formattedLinkText = '[' + url + ' ' + title + ']';
            break;
          // PukiWiki
          case 'puki':
            formattedLinkText = '[[' + title + ':' + url + ']]';
            break;
          // Redmine
          case 'redmine':
            formattedLinkText = '"' + title + '":' + url;
            break;
        }
        
        var newline = "\n";
        var noNewline = $('#noNewlineCheckBox').is(':checked');
        if (noNewline) {
          newline = '';
        }

        
        // テキスト設定
        $('#text').attr('value', formattedLinkText + newline);
      });
    });
  } catch (e) {
    alert(e);
  }
}

/** 各コントロールの選択状態をマネージする関数 */
function manageSelection(selectedObject) {
  selectedItemId = $(selectedObject).attr('id');
  if (selectedItemId != 'blogFormat' && selectedItemId != 'targetBlankCheckBox' && selectedItemId != 'clipWithListTagCheckBox') {
    $('#targetBlankCheckBox').attr('disabled', true);
    $('#clipWithListTagCheckBox').attr('disabled', true);
  } else {
    $('#targetBlankCheckBox').attr('disabled', false);
    $('#clipWithListTagCheckBox').attr('disabled', false);
  }
}

