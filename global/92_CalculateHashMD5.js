(function(){

  //ファイルピッカーを使ってファイルを決定
  var fp = Components.classes['@mozilla.org/filepicker;1']
            .createInstance(Components.interfaces.nsIFilePicker);
  fp.init(window, "Open File", fp.modeOpen);
  fp.appendFilters(fp.filterAll);
  var result = fp.show();
  if(result == fp.returnCancel) return;
  if(result != fp.returnOK) return;

  var f = fp.file;

  var istream = Components.classes["@mozilla.org/network/file-input-stream;1"]
                          .createInstance(Components.interfaces.nsIFileInputStream);
  // 読み出すためにストリームを開きます。
  istream.init(f, 0x01, 0444, 0);
  var ch = Components.classes["@mozilla.org/security/hash;1"]
                     .createInstance(Components.interfaces.nsICryptoHash);
  /*  * MD2
      * MD5
      * SHA1
      * SHA512
      * SHA256
      * SHA384
  */
  // SHA1 アルゴリズムを使います。
  ch.init(ch.MD5);
  // これはファイル全体を読む込むことを updateFromStream に指示します。
  const PR_UINT32_MAX = 0xffffffff;
  ch.updateFromStream(istream, PR_UINT32_MAX);
  // ここで false を渡すとバイナリデータが戻ってきます
  // true は base-64 文字列が戻ってきます
  var hash = ch.finish(false);

  // 1 バイトに対して 2 つの 16 進数コードを返す。
  function toHexString(charCode)
  {
    return ("0" + charCode.toString(16)).slice(-2);
  }

  // バイナリのハッシュデータを 16 進数文字列に変換する。
  //var s = [toHexString(hash.charCodeAt(i)) for (i in hash)].join("");
  var s='';
  for(var i=0,len=hash.length;i<len;i++){
    s = s + toHexString(hash.charCodeAt(i));
  }
  // s は今 16 進数でハッシュを保持しています。
  alert(f.path + '\nMD5: ' + s.toUpperCase());
  //クリップボードにコピー
  var clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
                        .getService(Components.interfaces.nsIClipboardHelper);
  clipboardHelper.copyString('MD5:' + s.toLowerCase());

})();