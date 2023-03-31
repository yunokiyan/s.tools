// ========================================
// 変数定義
// ========================================

const API_PATH = "";
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
  init(){
    //this.run();
    const _this = this;
    const _tab = document.querySelectorAll(".main_nav-item");
    const _panel = document.querySelectorAll(".main_panel");

    _tab.forEach(function (button) {
      button.addEventListener('click',(e) => {
        _this.tabHandler(_tab,_panel,e);
      });
    });

  },

  run(){
    this.getApi(API_PATH).then((json) => {
      var lists = [];
      json.setlist.map((obj) => {
        lists.push(obj.acf);
      });
      this.create_setlist(lists);
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

  tabHandler:function(_tab,_panel,e){
    Array.from(_tab).map((item) => {item.classList.remove("active");})
    Array.from(_panel).map((item) => {item.classList.remove("active");})

    const _t = e.target;
    _t.classList.add("active");
    document.querySelector("."+_t.dataset.value).classList.add("active");
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