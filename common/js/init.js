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
  const stools = new STOOLS();
  stools.init();
});

const STOOLS = function() {
  let _this = this;
}

// ========================================
// prototype
// ========================================

STOOLS.prototype = {
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

    // ポップアップのイベント設定
    _target.forEach((button) => {
      button.addEventListener('click',this.handler_dialog);
    });

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
    this.set_search(dummy_data);
    this.set_favarite(dummy_data);
    this.set_mysong(dummy_data);
    this.set_setlist(dummy_data);
    this.set_mypage(dummy_data);
    this.set_ranking(dummy_data);

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
    // 検索結果の生成
    let elm_result = document.querySelector("#result");
    if(elm_result != null){
      json.map((obj) => {
        elm_result.appendChild(this.return_searchPanel(obj));
      });
    };
  },

  set_favarite:function(json){
    // お気に入りの生成
    let elm_fav = document.querySelector("#fav");
    if(elm_fav != null){
      elm_fav.setAttribute("class","detail type_add");
      json.map((obj) => {
        elm_fav.appendChild(this.return_searchPanel(obj));
      });
    };
  },

  set_mysong:function(json){
    // マイ・ソングの生成
    let elm_mysong = document.querySelector("#mysong");
    if(elm_mysong != null){
      elm_mysong.setAttribute("class","detail type_add");
      json.map((obj) => {
        elm_mysong.appendChild(this.return_searchPanel(obj));
      });
    };
  },

  set_setlist:function(json){
    // 過去のセットリストの生成
    let elm_setlist = document.querySelector("#setlist");
    if(elm_setlist != null){
      elm_setlist.setAttribute("class","detail type_add");
      json.map((obj) => {
        elm_setlist.appendChild(this.return_searchPanel(obj));
      });
    };
  },

  set_mypage:function(json){
    //お気に入り管理
    let elm_mypage = document.querySelector("#mypage");
    if(elm_mypage != null){
      json.map((obj) => {
        elm_mypage.appendChild(this.return_mypagePanel(obj));
      });
    };
  },

  set_ranking:function(json){
    //ランキング管理
    let i = 1;
    let elm_ranking = document.querySelector("#ranking");
    if(elm_ranking != null){
      json.map((obj) => {
        elm_ranking.appendChild(this.return_rankingPanel(obj,i));
        i++;
      });
    };
  },

  add_setlist:function(json){
    let panel_setlist = document.querySelector(".panel_setlist");
    panel_setlist.appendChild(this.return_setlistPanel(json));
  },

  //検索用のパネル構造を返却
  return_searchPanel:function(json){

    let elm_panel = document.createElement("div");
    elm_panel.setAttribute("class","detail_panel");

    let elm_h3 = document.createElement("h3");
    let elm_h4 = document.createElement("h4");
    elm_panel.appendChild(elm_h3).innerText = json.title+" / "+json.artist;
    elm_panel.appendChild(elm_h4).innerText = json.youtube_title;

    let elm_btn = document.createElement("div");
    elm_btn.appendChild(this.return_tags(json.tags));
    elm_btn.appendChild(this.return_actionBtn(json));
    elm_panel.appendChild(elm_btn);

    return elm_panel;
  },

  //マイページ用のパネル構造を返却
  return_mypagePanel:function(json){

    let elm_panel = document.createElement("div");
    elm_panel.setAttribute("class","detail_panel");

    let elm_checkbox = '<label class="detail_checkboxInput"><input class="detail_checkboxInput-Input" type="checkbox"><span class="detail_checkboxInput-DummyInput"></span>';
    elm_panel.innerHTML = elm_checkbox;

    let elm_h3 = document.createElement("h3");
    elm_panel.appendChild(elm_h3).innerText = json.title+" / "+json.artist;

    let elm_btn = document.createElement("div");
    elm_btn.appendChild(this.return_tags(json.tags));
    elm_btn.appendChild(this.return_deleteBtn(json));

    elm_panel.appendChild(elm_btn);
    return elm_panel;
  },

  //ランキング用のパネル構造を返却
  return_rankingPanel:function(json,i){

    let elm_panel = document.createElement("div");
    elm_panel.setAttribute("class","detail_panel");

    let elm_rank_num = document.createElement("span");
    elm_rank_num.setAttribute("class","rank");
    elm_panel.appendChild(elm_rank_num).innerText = i;

    let elm_h3 = document.createElement("h3");
    let elm_h4 = document.createElement("h4");
    elm_panel.appendChild(elm_h3).innerText = json.title+" / "+json.artist;
    elm_panel.appendChild(elm_h4).innerText = json.youtube_title;

    let elm_btn = document.createElement("div");
    elm_btn.appendChild(this.return_tags(json.tags));
    elm_btn.appendChild(this.return_actionBtn(json));
    elm_panel.appendChild(elm_btn);

    return elm_panel;
  },

  //タグ要素を返却
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

  //アクション関連のボタンを返却
  return_actionBtn:function(json){
    let action_obj = [
      {class:"play",label:"このまま歌う",func:this.handler_set_and_play},
      {class:"fav",label:"お気に入り登録",func:this.handler_add_favarite},
      {class:"setlist",label:"セットリストへ追加",func:this.handler_add_setlist},
    ];

    let elm_act = document.createElement("ul");
    elm_act.setAttribute("class","detail_btn");
    action_obj.map((item) => {
      let elm_item = document.createElement("li");
      elm_item.setAttribute("class",item.class);
      elm_item.addEventListener("click",{data: json, handleEvent: item.func});
      elm_item.appendChild(document.createElement("span")).innerText = item.label;
      elm_act.appendChild(elm_item);
    });
    return elm_act;
  },

  //削除関連のボタンを返却
  return_deleteBtn:function(){
    let action_obj = [
      {class:"play",label:"Youtube",dialog:""},
      {class:"delete ev_dialog",label:"削除する",dialog:"delete"}
    ];
    let elm_act = document.createElement("ul");
    elm_act.setAttribute("class","detail_btn");
    action_obj.map((item) => {
      let elm_item = document.createElement("li");
      elm_item.setAttribute("class",item.class);
      elm_item.setAttribute("data-dialog",item.dialog);

      elm_item.appendChild(document.createElement("span")).innerText = item.label;
      elm_act.appendChild(elm_item);
    });
    return elm_act;
  },

  return_setlistPanel:function(json){
    
    let elm_dl = document.createElement("dl");
    let elm_dt = document.createElement("dt");
    elm_dl.appendChild(elm_dt).innerText = json.title;

    let elm_dd = document.createElement("dd");
    let elm_dd_span = document.createElement("span");
    elm_dd_span.setAttribute("class","btn_close ev_dialog");
    elm_dd_span.setAttribute("data-dialog","delete");
    elm_dd_span.addEventListener("click",this.handler_remove_setlist)
    elm_dd.appendChild(elm_dd_span).innerText = "✕";

    let elm_ul = document.createElement("ul");
    let elm_li_01 = document.createElement("li");
    elm_li_01.setAttribute("class","panel_artist");
    elm_ul.appendChild(elm_li_01).innerText = json.artist;

    let elm_li_02 = document.createElement("li");
    elm_li_02.setAttribute("class","panel_btn");

    let elm_li_span =document.createElement("span");
    elm_li_span.setAttribute("class","panel_add_play");
    elm_li_span.addEventListener("click",this.handler_do_play);
    elm_ul.appendChild(elm_li_02).appendChild(elm_li_span).innerText = "再生";;
    elm_dl.appendChild(elm_dd).appendChild(elm_ul);

    return elm_dl;
  },

  handler_do_play:function(e){
    console.log(this.data);
    alert("handler_do_play");
  },

  handler_set_and_play:function(e){
    console.log(this.data);
    alert("handler_set_and_play");
  },

  handler_add_setlist:function(e){
    STOOLS.prototype.add_setlist(this.data);
  },

  handler_remove_setlist:function(e){
    let elm_parent = e.target.closest("dl");
    elm_parent.remove();
  },

  handler_add_favarite:function(e){
    console.log(this.data);
    alert("handler_add_favarite");
  },

  handler_dialog:function(e){
    const _dialog = document.querySelector(".dialog");
    const _dialog_type = document.querySelectorAll('[class^="detail dialog_type"]');
    let type_name = e.target.dataset.dialog;
    _dialog_type.forEach((t) => {
      t.style.display = "none";
    });
    if(type_name == "cancel"){
      _dialog.style.display = "none";
    }else{
      _dialog.style.display = "block";
      document.querySelector(".dialog_type_"+type_name).style.display = "block";
    }
  },

  return_table:function(json){

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