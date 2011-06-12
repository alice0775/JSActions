// 選択範囲をBase64符号化する
// version0.0.12 20090714 by Alice0775
// version0.0.11 20070102 by Alice0775
javascript:(function() {
  var UI = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
        createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
  UI.charset = "UTF-8";
  var query, message;
  message = UI.ConvertToUnicode("16 x 16px に変換しますか?");
  var imgObj = _jsaCScript.context.target;
  if(/img/i.test(imgObj.localName)){
    query = convertIconDataToBase64Format(imgObj.src,confirm(message));
  }else if(_jsaCScript.context.isTextSelected) {
      if ("selection" in _jsaCScript.context) {
      query = _jsaCScript.context.selection;
      } else {
      query = window.getSelection().toString();
      }
    query = "data:text/html;charset=utf-8;base64,"+btoa(toUTF8Octets(query));
  }else if (! _jsaCScript._currentScriptPath.match(/selection/)){
    query = prompt(UI.ConvertToUnicode("符号化する文字列またはイメージURLを入力してください"), "");
    if(query != null && query != ""){
      if(is_url(query)){
        query = convertIconDataToBase64Format(query,confirm(message));
      }else{
        query = "data:text/html;charset=utf-8;base64,"+btoa(toUTF8Octets(query));
      }
    }
  }
  if(query != null && query != ""){
    //dump(query);
    _jsaCScript.setClipBoardString(query);
    var viewSourceURL = "chrome://global/content/viewSource.xul";
    var openFlag = "scrollbars,resizable,chrome,dialog=no";
    //window.openDialog(viewSourceURL, "_blank", openFlag, "data:text/html;charset=utf-8,"+query, null, null);
  }
  //
  //Thanks Milx https://addons.mozilla.org/firefox/3698/
  function convertIconDataToBase64Format(iconURI,flg){
      var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "html:canvas");
      var image = document.createElementNS("http://www.w3.org/1999/xhtml", "html:img");
      image.src = iconURI;
      if(flg){
        canvas.width = canvas.height = 16;
      }else{
        canvas.width = image.width;
        canvas.height = image.height;
      }
      var ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL();
  }
  //
  //Thanks nanto_vi http://nanto.asablo.jp/blog/2006/10/23/572458
  function toUTF8Octets(string) {
    return encodeURI(string).replace(/%(..)/g, function (s, code) {
      return String.fromCharCode("0x" + code);
    });
  }
  //URL Check (まだまだ不完全)
  function is_url(str) {
    if (str.match(/(http|ftp|file):\/\/[!#-9A-~]+\.+[a-z0-9]+/i)){
      return true;
    } else {
      return false;
    }
  }
})();