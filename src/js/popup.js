
/**
 * ポップアップJavaScript
 * @author Wataru Noguchi <wnoguchi@pg1x.com>
 */

var c = chrome;
var ws = c.windows;
var tbs = c.tabs;

// Google URL Shortener API key
var googleAPIKey = 'AIzaSyBNBpB4887rz6Li0hGhWcSYJwxuMtPDmvE';

$(function() {
  manageSelection($('#simpleFormat'));
  setTextAreaUrlAndTitle();
  
  // 設定が変更されたらテキストエリアの内容を変更するイベント
  $('.formatChanger').click(function () {
    manageSelection(this);
    setTextAreaUrlAndTitle();
  });
  
  /** コピーボタンが押されたときのアクションをバインド */
  $('#copyButton').click(copyAction);
});

/**
 * オープン時にシンプル形式でコピーする
 * 現在は popup.html 表示時にシンプルがデフォルトチェックとなっている
 */
$(window).load(function () {
  setTimeout(function() {
    copyAction();
  }, 1000);
});

/** コピーアクション */
function copyAction() {
  $('#text').focus();
  $('#text').select();
  document.execCommand("Copy");
  
  $('#notice').html(chrome.i18n.getMessage("notice"));
  setTimeout(function () {
    $('#notice').html('');
  }, 5000);
}

/** 現在選択されているタブのURLとタイトルを取得してテキストエリアに設定する */
function setTextAreaUrlAndTitle() {
  
  try {
    ws.getCurrent(function (window) {
      /** 選択されているタブをハンドリングする処理 */
      tbs.getSelected(window.id, function (tab) {
        var url = tab.url;
        var title = tab.title;
        var formattedLinkText = '';
        
        // goo.gl でURLを短縮するかどうか
        var shortenUrlEnable = $('#shorten').is(':checked');
        if (shortenUrlEnable) {
          // URL 短縮処理
          $.ajax({
            async: false, // URL 短縮してから文字列を組み立てるため同期処理とする
            type: 'POST',
            url: 'https://www.googleapis.com/urlshortener/v1/url?key=' + googleAPIKey,
            contentType: 'application/json',
            data: "{ \"longUrl\": \"" + url + "\" }",
            success: function (data, dataType) {
              url = data.id;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              alert(XMLHttpRequest.responseText);
            }
          });
        }
        
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
        
        // 末尾に改行を入れるかどうか
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
  if (selectedItemId != 'noNewlineCheckBox'
      && selectedItemId != 'shorten'
      && selectedItemId != 'blogFormat'
      && selectedItemId != 'targetBlankCheckBox'
      && selectedItemId != 'clipWithListTagCheckBox') {
    $('#targetBlankCheckBox').attr('disabled', true);
    $('#clipWithListTagCheckBox').attr('disabled', true);
  } else if (selectedItemId != 'noNewlineCheckBox' && selectedItemId != 'shorten') {
    $('#targetBlankCheckBox').attr('disabled', false);
    $('#clipWithListTagCheckBox').attr('disabled', false);
  }
}

