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

    // ポップアップのイベント設定
    _target.forEach((button) => {
      button.addEventListener('click',(e) => {
        var type_name = e.target.dataset.dialog;
        _dialog_type.forEach((t) => {
          t.style.display = "none";
        });
        if(type_name == "cancel"){
          _dialog.style.display = "none";
        }else{
          _dialog.style.display = "block";
          document.querySelector(".dialog_type_"+type_name).style.display = "block";
        }
      });
    })

    var dummy_data = [
      {
        title:"「ひとりで生きられそう」って それってねえ、褒めているの？",
        artist:"Juice=Juice",
        youtube_title:"Youtube:【ガイドなし】手紙〜拝啓十五の君へ〜 / アンジェラ・アキ【カラオケ】ガイドなし】",
        youtube_url:"https://www.youtube.com/embed/",
        tags:["カラオケ歌っちゃ王","邦楽"],
      },
      {
        title:"センチメンタル・ジャーニー",
        artist:"松本伊代",
        youtube_title:"Youtube:【ガイドなし】手紙〜拝啓十五の君へ〜 / アンジェラ・アキ【カラオケ】ガイドなし】",
        youtube_url:"https://www.youtube.com/embed/",
        tags:["カラオケ歌っちゃ王","邦楽"],
      },
      {
        title:"GLAMOROUS SKY",
        artist:"NANA starring MIKA NAKASHIMA",
        youtube_title:"Youtube:【ガイドなし】手紙〜拝啓十五の君へ〜 / アンジェラ・アキ【カラオケ】ガイドなし】",
        youtube_url:"https://www.youtube.com/embed/",
        tags:["カラオケ歌っちゃ王","邦楽"],
      }
    ];

    document.querySelector(".detail").innerHTML = "";
    // 検索結果の生成
    let elm_result = document.querySelector("#result");
    if(elm_result != null){
      dummy_data.map((json) => {
        elm_result.appendChild(this.set_search(json));
      });
    };

    // お気に入りの生成
    let elm_fav = document.querySelector("#fav");
    if(elm_fav != null) elm_fav.appendChild(this.set_favorite(dummy_data));

    // マイ・ソングの生成
    let elm_mysong = document.querySelector("#mysong");
    if(elm_mysong != null) elm_mysong.appendChild(this.set_favorite(dummy_data));

    // 過去のセットリストの生成
    let elm_setlist = document.querySelector("#setlist");
    if(elm_setlist != null) elm_setlist.appendChild(this.set_favorite(dummy_data));
    
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

  set_search:function(json){

    let elm_panel = document.createElement("div");
    elm_panel.setAttribute("class","detail_panel");
    let elm_h3 = document.createElement("h3");
    let elm_h4 = document.createElement("h4");

    elm_panel.appendChild(elm_h3).innerText = json.title+" / "+json.artist;
    elm_panel.appendChild(elm_h4).innerText = json.youtube_title;

    let elm_btn = document.createElement("div");
    elm_btn.appendChild(this.return_tags(json.tags));
    elm_btn.appendChild(this.return_actionBtn());
    elm_panel.appendChild(elm_btn);

    console.log(elm_panel);
    return elm_panel;
  },

  set_favorite:function(json){

    const elm_table = document.createElement("table");
    const heads_index = [
      {class:"fixed_th th_title",label:"曲名"},
      {class:"fixed_th th_artist",label:"アーティスト"},
      {class:"fixed_th th_tag",label:"タグ"},
      {class:"fixed",label:""}
    ];

    const elm_thead = document.createElement("thead");
    const elm_thead_tr = document.createElement("tr");
    heads_index.map((obj) => {
      let elm_th = document.createElement("th");
      elm_th.innerText = obj.label;
      elm_th.setAttribute("class",obj.class);
      elm_thead_tr.appendChild(elm_th);
    });
    elm_table.appendChild(elm_thead).appendChild(elm_thead_tr);

    const elm_tbody = document.createElement("tbody");
    json.map((item) => {
      let elm_tbody_tr = document.createElement("tr");

      let elm_tbody_td_01 = document.createElement("td");
      elm_tbody_td_01.innerText = item.title;
      elm_tbody_tr.appendChild(elm_tbody_td_01);

      let elm_tbody_td_02 = document.createElement("td");
      elm_tbody_td_02.innerText = item.artist;
      elm_tbody_tr.appendChild(elm_tbody_td_02);

      let elm_tbody_td_03 = document.createElement("td");
      elm_tbody_td_03.appendChild(this.return_tags(item.tags));
      elm_tbody_tr.appendChild(elm_tbody_td_03);

      let elm_tbody_td_04 = document.createElement("td");
      elm_tbody_td_04.setAttribute("class","fixed");
      elm_tbody_td_04.appendChild(this.return_actionBtn());
      elm_tbody_tr.appendChild(elm_tbody_td_04);

      elm_tbody.appendChild(elm_tbody_tr);
    });

    elm_table.appendChild(elm_tbody);
    return (elm_table);
  },

  return_tags:function(tags){
    let elm_tags = document.createElement("ul");
    elm_tags.setAttribute("class","detail_tag");
    tags.map((v) => {
      let elm_item = document.createElement("li");
      elm_item.appendChild(document.createElement("span")).innerText = v;
      elm_tags.appendChild(elm_item);
    });
    return elm_tags;
  },

  return_actionBtn:function(){
    let action_obj = [
      {class:"play",label:"このまま歌う"},
      {class:"fav",label:"お気に入り登録"},
      {class:"setlist",label:"セットリストへ追加"},
    ];

    let elm_act = document.createElement("ul");
    elm_act.setAttribute("class","detail_btn");
    action_obj.map((item) => {
      let elm_item = document.createElement("li");
      elm_item.setAttribute("class",item.class);
      elm_item.appendChild(document.createElement("span")).innerText = item.label;
      elm_act.appendChild(elm_item);
    });
    return elm_act;
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