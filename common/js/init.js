// ========================================
// 変数定義
// ========================================

const SEARCH_API_PATH = "";
const FAV_API_PATH = "";
const SETLIST_API_PATH = "";
const MYSONG_API_PATH = "";

const VIDEO_URL = "https://www.youtube.com/embed/";
const UA = getUA();

// ========================================
// onload
// ========================================

window.addEventListener("load",function(){
  const stools = new Stools();
  stools.init();
});

const Stools = function() {
  let _this = this;
}

// ========================================
// prototype
// ========================================

Stools.prototype = {
  init: function(){
    this.run();
    const _this = this;
    // const _tab = document.querySelectorAll(".main_nav-item");
    // const _panel = document.querySelectorAll(".main_panel");

    // _tab.forEach(function (button) {
    //   button.addEventListener('click',(e) => {
    //     _this.tabHandler(_tab,_panel,e);
    //   });
    // });
  },

  run: function(){
    const _target = document.querySelectorAll(".ev_dialog");
    const _dialog = document.querySelector(".dialog");
    const _dialog_type = document.querySelectorAll('[class^="detail dialog_type"]');

    // _dialog.addEventListener('click',(e) => {
    //   _dialog.style.display = "none";
    //   _dialog_type.forEach(function (t) {
    //     t.style.display = "none";
    //   });
    // });

    _target.forEach(function (button) {
      button.addEventListener('click',(e) => {
        var type_name = e.target.dataset.dialog;
        _dialog_type.forEach(function (t) {
          t.style.display = "none";
        });
        if(type_name == "cancel"){
          _dialog.style.display = "none";
        }else{
          _dialog.style.display = "block";
          document.querySelector(".dialog_type_"+type_name).style.display = "block";
        }
      });
    });
  },

  getApi: function(path) {
    return fetch(path)
    .then((response) => {
      return (response.json());
    })
    .then((json) => {
      return json;
    })
    .catch((error)=>{
      console.log("error");
    })
  },

  get_search:function(){
    this.getApi(API_PATH).then((json) => {
      var lists = [];
      json.setlist.map((obj) => {
        lists.push(obj.acf);
      });
      this.set_search(lists);
    });
  },

  set_search:function(){

  }
}


// ========================================
// アセット
// ========================================

// ゼロパディング
function padZero(v) {
  return (v < 10)? "0"+v:v;
}

// UA判定
function getUA(){
  var ua = navigator.userAgent;
  if (ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
      return "sp";
  } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
      return "tb";
  } else {
      return "pc";
  }
}