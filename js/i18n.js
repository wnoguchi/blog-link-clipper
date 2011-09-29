
/**
 * Internationalization
 * @author Wataru Noguchi <wnoguchi@pg1x.com>
 */

$(function() {
  $('#generic').html(chrome.i18n.getMessage("generic"));
  $('#simple').html(chrome.i18n.getMessage("simple"));
  $('#link_tag').html(chrome.i18n.getMessage("link_tag"));
  $('#lili').html(chrome.i18n.getMessage("lili"));
  $('#wiki').html(chrome.i18n.getMessage("wiki"));
  $('#hatena').html(chrome.i18n.getMessage("hatena"));
  $('#mediawiki').html(chrome.i18n.getMessage("mediawiki"));
  $('#pukiwiki').html(chrome.i18n.getMessage("pukiwiki"));
  $('#redmine').html(chrome.i18n.getMessage("redmine"));
  $('#not_insert_newline').html(chrome.i18n.getMessage("not_insert_newline"));
  $('#url_shorten').html(chrome.i18n.getMessage("url_shorten"));
  $('#copyButton').val(chrome.i18n.getMessage("copy_button"));
});

