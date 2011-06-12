// 選択範囲をBase64復号化する
// version0.0.1 20061209 by Alice0775
javascript:(function() {
  var UI = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
        createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
  UI.charset = "UTF-8";
  var query;
  if(_jsaCScript.context.isTextSelected) {
      if ("selection" in _jsaCScript.context) {
      query = _jsaCScript.context.selection;
      } else {
      query = window.getSelection().toString();
      }
  }else if (! _jsaCScript._currentScriptPath.match(/selection/)){
    query = prompt(UI.ConvertToUnicode("復号化する文字列を入力してください"), "");
  }
  if(query != null && query != "") {
    if(query.match(/^data:image/i)){
      query=query.replace(/image\/cursor/,"image\/png");
      //新しいタブでurl開き,フォーカスする。
      var tab = _jsaCScript.addTab(query);
      gBrowser.selectedTab = tab;
    }else{
      query=query.replace(/\r\n/,"");
      try{
        query = fromUTF8Octets(atob(datapart(query)));
      } catch(e) {
        query = e.number + ": " + e.description;
      }
      var viewSourceURL = "chrome://global/content/viewSource.xul";
      var openFlag = "scrollbars,resizable,chrome,dialog=no";
      //window.openDialog(viewSourceURL, "_blank", openFlag, "data:text/html;charset=utf-8,"+query, null, null);
    }
  }
  //
  //Thanks nanto_vi http://nanto.asablo.jp/blog/2006/10/23/572458
  function fromUTF8Octets(octets) {
    return decodeURIComponent(octets.replace(/[%\x80-\xFF]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16);
    }));
  }
  //
  function datapart(str) {
    var n1 = str.indexOf("base64,")
    if(n1<0)return str;
    return str.substring(str.indexOf("base64,")+7,str.length);
  }
})();