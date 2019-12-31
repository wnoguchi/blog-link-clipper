
/**
 * Popup JavaScript
 * @author Wataru Noguchi <wnoguchi.0727@gmail.com>
 */

// utilize
var c = chrome;
var ws = c.windows;
var tbs = c.tabs;

// Google URL Shortener API key
var googleAPIKey = 'AIzaSyBNBpB4887rz6Li0hGhWcSYJwxuMtPDmvE';

/**
 * Bootstrap code.
 */
$(function() {
  console.log("Bootstrapping BlogLinkClipper...");

  var jsonStore = getJsonStore();

  var selectedItemId = jsonStore.format;
  if (selectedItemId == undefined) {
    // If no previous information exists, set simple format as default.
    console.log("No format selected. Select `simple`.");
    manageSelection();
  }
  else
  {
    // restore previous selected state.
    console.log("Previous selection:");
    console.log(selectedItemId);
  }

  restoreSelection();

  setTextAreaUrlAndTitle();

  // 設定が変更されたらテキストエリアの内容を変更するイベント
  $('.formatChanger').click(function (e) {
    console.log("format change event fired.");
    manageSelection();
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

  $('#notice').html(chrome.i18n.getMessage("success_message"));
  setTimeout(function () {
    $('#notice').html('');
  }, 5000);
}

/**
 * restore previous selection state.
 */
function restoreSelection() {

  var jsonStore = getJsonStore();

  var format = jsonStore.format;

  switch (format)
  {
    // currentry supported formats
    case 'simple':
    case 'blog':
    case 'markdown':
    case 'hatena':
    case 'media':
    case 'puki':
    case 'redmine':
    case 'jira':
    case 'rest':
    case 'dokuwiki':
      console.log("Restore target found:");
      console.log(format);

      selectFormat(format);

      // restore target blank checkbox state
      changeCheckboxState('#targetBlankCheckBox', jsonStore.options.targetBlankCheckBox);
      // restore list style checkbox state
      changeCheckboxState('#clipWithListTagCheckBox', jsonStore.options.clipWithListTagCheckBox);
      // restore no new line checkbox state
      changeCheckboxState('#noNewlineCheckBox', jsonStore.options.noNewlineCheckBox);
      // restore goo.gl shorten feature checkbox state
      changeCheckboxState('#shorten', jsonStore.options.shorten);

      // update view state
      manageViewConsistency(format);

      break;
    default:
      // oops.
      console.log("Restore target not found...");
      break;
  }

}

/**
 * get current selected tab url and title.
 * format this.
 * set to textarea.
 */
function setTextAreaUrlAndTitle() {

  try {
    ws.getCurrent(function (window) {
      /** 選択されているタブをハンドリングする処理 */
      tbs.getSelected(window.id, function (tab) {
        var url = tab.url;
        var title = tab.title;
        var formattedLinkText = '';

        var trackingId = "bloglinkclipper-22";

        // if amazon site product url shorten and affiliatize
        // /dp/[ASIN]
        var reg1 = /(https?:\/\/[0-9a-z.-]*amazon[0-9a-z.-]*)\/.*\/?dp\/([a-zA-Z0-9]+)\/?.*/;
        // /gp/product/[ASIN]/
        var reg2 = /(https?:\/\/[0-9a-z.-]*amazon[0-9a-z.-]*)\/.*\/?gp\/product\/([a-zA-Z0-9]+)\/?.*/;
        // /exec/obidos/ASIN/
        var reg3 = /(https?:\/\/[0-9a-z.-]*amazon[0-9a-z.-]*)\/.*\/?exec\/obidos\/ASIN\/([a-zA-Z0-9]+)\/?.*/;
        // if redmine ugly detected. strip this
        // /issues/123456?issue_count=3&issue_position=2&next_issue_id=12056&prev_issue_id=12345
        var reg4 = /(https?:\/\/[0-9a-z.-].+)\/issues\/([0-9]+)\?(&?((issue_count|issue_position|next_issue_id|prev_issue_id)=[0-9]+))+/;
        
        if (reg1.test(url)) {
          url = url.replace(reg1, "$1/dp/$2");
        } else if (reg2.test(url)) {
          url = url.replace(reg2, "$1/dp/$2");
        } else if (reg3.test(url)) {
          url = url.replace(reg3, "$1/dp/$2");
        } else if (reg4.test(url)) {
          url = url.replace(reg4, "$1/issues/$2");
        }

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

        // format check
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

            // check target="_blank"
            var targetBlank = $('#targetBlankCheckBox').is(':checked');
            if (targetBlank) {
              targetBlankStr = ' target="_blank" rel="noopener"';
            }

            // if <li></li>
            var clipWithListTag = $('#clipWithListTagCheckBox').is(':checked');
            if (clipWithListTag) {
              liStart = '<li>';
              liEnd = '</li>';
            }

            formattedLinkText = liStart + '<a href="' + url + '"' + targetBlankStr + '>' + title +'</a>' + liEnd;
            break;
          // Markdown
          case 'markdown':
            formattedLinkText = '[' + title + '](' + url + ')';
            break;
          // Hatena
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
          // JIRA, Confluence
          case 'jira':
            title = title.replace(/\|/g, "&#124;");
            title = title.replace(/\[/g, "\\[");
            title = title.replace(/\]/g, "\\]");
            formattedLinkText = '[' + title + '|' + url + "]";
            break;
          // reStructuredText(reST): Sphinx
          case 'rest':
            formattedLinkText = '`' + title + ' <' + url + ">`_";
            break;
          // DokuWiki
          case 'dokuwiki':
            formattedLinkText = '[[' + url + '|' + title + "]]";
            break;
        }

        // whether if ends of new line character
        var newline = "\n";
        var noNewline = $('#noNewlineCheckBox').is(':checked');
        if (noNewline) {
          newline = '';
        }

        // set text
        $('#text').attr('value', formattedLinkText + newline);
      });
    });
  } catch (e) {
    console.log(e);
  }
}

/**
 * manage each control selection state.
 */
function manageSelection() {

  // save current selection state.
  var jsonStore = getJsonStore();

  var selectedFormat = $('input[type=radio][name=format]:checked').val();
  switch (selectedFormat)
  {
    case 'simple':
    case 'blog':
    case 'markdown':
    case 'hatena':
    case 'media':
    case 'puki':
    case 'redmine':
    case 'jira':
    case 'rest':
    case 'dokuwiki':
      jsonStore.options = getOptions();
      jsonStore.format = selectedFormat;
      break;
    default:
      break;
  }

  // update view state
  manageViewConsistency(selectedFormat);

  // save current view state
  setJsonStore(jsonStore);
}

/**
 * view controls consistency management.
 */
function manageViewConsistency(format) {
  // enable sub controls if blog format is enabled
  // - _target=blank
  // - list style
  if (format == 'blog') {
    $('#targetBlankCheckBox').attr('disabled', false);
    $('#clipWithListTagCheckBox').attr('disabled', false);
  } else {
    $('#targetBlankCheckBox').attr('disabled', true);
    $('#clipWithListTagCheckBox').attr('disabled', true);
  }
}



//------------------------------
// this project utilitiy functions:
//------------------------------

/**
 * check selected format radio button.
 */
function selectFormat(format) {
  $('input[type=radio][name=format][value=' + format + ']').attr('checked', 'checked');
}

/**
 * change checkbox state
 *
 * @param element CSS3 selector
 * @param checkState selected element state flag. if this set true: checked.
 */
function changeCheckboxState(element, checkState) {
  if (checkState == true) {
    $(element).attr('checked', 'checked');
  } else {
    $(element).removeAttr('checked');
  }
}

/**
 * get current view options from read current popup controls check states.
 */
function getOptions() {
  var options = {
    clipWithListTagCheckBox: $('#clipWithListTagCheckBox').is(':checked'),
    targetBlankCheckBox: $('#targetBlankCheckBox').is(':checked'),
    noNewlineCheckBox: $('#noNewlineCheckBox').is(':checked'),
    shorten: $('#shorten').is(':checked'),
  };
  return options;
}



//------------------------------
// localStorage Utilities
//------------------------------

/**
 * get json storage.
 * this storage is localStorage abstraction layer.
 */
function getJsonStore() {
  var jsonStore = localStorage.getItem('jsonStore');
  if (jsonStore === null) {
    console.log("JSON storage is empty. Create Now.");
    jsonStore = {};
    setJsonStore(jsonStore);
  } else {
    jsonStore = JSON.parse(jsonStore);
  }

  console.log("JSON store data:");
  console.log(jsonStore);
  return jsonStore;
}

/**
 * save object literal to localStorage.
 */
function setJsonStore(jsonStore) {
  var jsonData = JSON.stringify(jsonStore);
  console.log("Retrieve JSON store data.");
  console.log("JSON store data:");
  console.log(jsonData);

  localStorage.setItem('jsonStore', jsonData);
}
