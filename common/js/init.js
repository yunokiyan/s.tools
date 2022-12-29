var STREAM_JSON;
var target;
var stream_list = [];
var readyflag = false;
var UPDATE = {};


// ========================================
// 変数定義
// ========================================

const API_PATH = "https://v-music.fun/api/?rest_route=/custom/v1/setlist&context=embed";
const SEARCH_API_PATH = "https://v-music.fun/api/?rest_route=/wp/v2/setlist&per_page=100&context=embed&search=";
const VIDEO_URL = "https://www.youtube.com/embed/";
const UA = getUA();

// ========================================
// onload
// ========================================

window.addEventListener("load",function(){
  const vmusic = new Vmusic();
  vmusic.init();
});

const Vmusic = function() {
  let _this = this;
}


// ========================================
// prototype
// ========================================

Vmusic.prototype = {
  init(){
    this.run();
    const _search_btn = document.querySelector(".search_btn");
    const _search_clear = document.querySelector(".search_clear");
    const _search_tab = document.querySelector(".search_tab");
    const _search_form = document.querySelector(".search_form");
    const _btn_close = document.querySelector(".btn_close");

    _search_btn.addEventListener("click",() => {
      this.search(document.querySelector("#id_search").value);
    });

    _search_clear.addEventListener("click",() => {
      this.clear();
    });

    _search_tab.addEventListener("click",() => {
      if(UA != "pc") _search_form.style.display = "block";
    });

    _btn_close.addEventListener("click",() => {
      if(UA != "pc") _search_form.style.display = "none";
    });

  },

  run(){
    this.getApi(API_PATH).then((json) => {
      var lists = [];
      json.setlist.map((obj) => {
        lists.push(obj.acf);
      });
      this.create_setlist(lists);

      const _song_count = document.querySelector(".song_count");
      if(_song_count.innerHTML == ""){
        _song_count.innerHTML = lists.length+"曲";
      }      
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

  create_setlist:function(setlist){
    const element_whole = document.querySelector("#whole");
    element_whole.innerHTML = "";

    setlist.sort((a,b) => {
      if(a.date !== b.date){
        if(a.date > b.date) return -1
        if(a.date < b.date) return 1
      }
      if(a.start_time !== b.start_time){
        return (a.start_time - b.start_time);
      }
      return 0
    });

    const heads_index = [
      {class:"song_title",label:"曲名"},
      {class:"artist",label:"アーティスト"},
      {class:"time",label:"時間"},
      {class:"title",label:"配信名"}
    ]
    const element_table = document.createElement("table");
    const element_thead = document.createElement("thead");
    const element_thead_tr = document.createElement("tr");
    element_table.appendChild(element_thead).appendChild(element_thead_tr);

    heads_index.map((obj) => {
      let element_th = document.createElement("th");
      element_th.innerHTML = obj.label;
      element_th.setAttribute("class",obj.class);

      element_thead_tr.appendChild(element_th);
    });

    const element_tbody = document.createElement("tbody");
    element_table.appendChild(element_tbody);

    setlist.map((obj) => {
      const param = {
        song_title: obj.song_title,
        artist: obj.artist,
        song_url:VIDEO_URL+obj.video_id+"?start="+obj.start_time,
        time_start: obj.start_time,
        time_end: obj.end_time,
        stream_title: obj.stream_title,
        stream_date: dateToFormatString(new Date(obj.date), '%YYYY%年%M%月%D%日'),
        stream_url:VIDEO_URL+obj.video_id,
        stream_id:obj.video_id
      }
      //console.log(param);
      const item = [
        {class:"cont_song_title",label:param.song_title},
        {class:"cont_artist",label:param.artist},
        {class:"cont_time",label:return_hms(param.time_start)},
        {class:"cont_title",label:param.stream_title},
      ]
      const element_tbody_tr = document.createElement("tr");
      element_tbody_tr.setAttribute("data-id",param.stream_id);
      element_tbody_tr.setAttribute("data-title",param.song_title);
      element_tbody_tr.setAttribute("data-role",param.song_url);

      element_tbody_tr.addEventListener("click",this.play);

      item.map((obj) => {
        let element_td = document.createElement("td");
        element_td.innerHTML = obj.label;
        element_td.setAttribute("class",obj.class);
        element_tbody_tr.appendChild(element_td);
      });
      element_tbody.appendChild(element_tbody_tr);
    })
    //console.log(element_table);
    element_whole.appendChild(element_table);

  },

  play:function(e){
    const _target = e.currentTarget;
    const obj = {
      id:_target.dataset.id,
      title:_target.dataset.title,
      url:_target.dataset.role
    }
    playYoutube(obj,500);
  },

  search:function(value){
    const path = SEARCH_API_PATH+value;
    this.getApi(path).then((json) => {
      this.create_setlist(json);
      if(UA != "pc") document.querySelector(".search_form").style.display = "none";
    });
  },

  clear:function(){
    document.querySelector("#id_search").value = "";
    if(UA != "pc") document.querySelector(".search_form").style.display = "none";
    this.run();
  }
}

// ========================================
// 動画の再生
// ========================================

// プレイヤーの生成
function playYoutube(obj,time){
  const element_movie = document.querySelector("#movieIn");
  const element_info = document.querySelector(".playinfo");
  var w,h;
  if(UA=="pc"){
    w = 800,h = 450;
  }else{
    w = "100%",h = 225;
  }
  var tag = '<iframe width="'+w+'" height="'+h+'" src="'+obj.url+'&autoplay=1&playsinline=1&controls=1&enablejsapi=1" id="youtube-player" frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player" ></iframe>';

  element_movie.innerHTML = tag;
  element_info.innerHTML = obj.title;
  element_info.style.display = "inline-block";

  setTimeout(function(){getYoutubePlayer()},time);
}

// プレイヤーの操作
function getYoutubePlayer(){
  const ytiframe= 'youtube-player';
  const targetWindow = document.getElementById(ytiframe).contentWindow;

  const ag2ytControl = function(action,arg=null){
    targetWindow.postMessage('{"event":"command", "func":"'+action+'", "args":'+arg+'}', '*');
  };
  
  ag2ytControl('playVideo');
  document.querySelector(".ytplay").addEventListener("click",() => {ag2ytControl('playVideo')});
  document.querySelector(".ytpause").addEventListener("click",() => {ag2ytControl('pauseVideo')});
}


// ========================================
// アセット
// ========================================

// 秒を時間に変換
function return_hms(sec){
  var hms = "";
	var h = sec / 3600 | 0;
	var m = sec % 3600 / 60 | 0;
  var s = sec % 60;
  hms = h + ":" + padZero(m) + ":" + padZero(s);
	return hms;
}

// 日付フォーマットの設定
function dateToFormatString(date, fmt, locale, pad) {
  // %fmt% を日付時刻表記に。
  // 引数
  //  date:  Dateオブジェクト
  //  fmt:   フォーマット文字列、%YYYY%年%MM%月%DD%日、など。
  //  locale:地域指定。デフォルト（入力なし）の場合はja-JP（日本）。現在他に対応しているのはen-US（英語）のみ。
  //  pad:   パディング（桁数を埋める）文字列。デフォルト（入力なし）の場合は0。
  // 例：2016年03月02日15時24分09秒
  // %YYYY%:4桁年（2016）
  // %YY%:2桁年（16）
  // %MMMM%:月の長い表記、日本語では数字のみ、英語ではMarchなど（3）
  // %MMM%:月の短い表記、日本語では数字のみ、英語ではMar.など（3）
  // %MM%:2桁月（03）
  // %M%:月（3）
  // %DD%:2桁日（02）
  // %D%:日（2）
  // %HH%:2桁で表した24時間表記の時（15）
  // %H%:24時間表記の時（15）
  // %h%:2桁で表した12時間表記の時（03）
  // %h%:12時間表記の時（3）
  // %A%:AM/PM表記（PM）
  // %A%:午前/午後表記（午後）
  // %mm%:2桁分（24）
  // %m%:分（24）
  // %ss%:2桁秒（09）
  // %s%:秒（9）
  // %W%:曜日の長い表記（水曜日）
  // %w%:曜日の短い表記（水）
  var padding = function(n, d, p) {
      p = p || '0';
      return (p.repeat(d) + n).slice(-d);
  };
  var DEFAULT_LOCALE = 'ja-JP';
  var getDataByLocale = function(locale, obj, param) {
      var array = obj[locale] || obj[DEFAULT_LOCALE];
      return array[param];
  };
  var format = {
      'YYYY': function() { return padding(date.getFullYear(), 4, pad); },
      'YY': function() { return padding(date.getFullYear() % 100, 2, pad); },
      'MMMM': function(locale) {
          var month = {
              'ja-JP': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
              'en-US': ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'],
          };
          return getDataByLocale(locale, month, date.getMonth());
      },
      'MMM': function(locale) {
          var month = {
              'ja-JP': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
              'en-US': ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June',
                        'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
          };
          return getDataByLocale(locale, month, date.getMonth());
      },
      'MM': function() { return padding(date.getMonth()+1, 2, pad); },
      'M': function() { return date.getMonth()+1; },
      'DD': function() { return padding(date.getDate(), 2, pad); },
      'D': function() { return date.getDate(); },
      'HH': function() { return padding(date.getHours(), 2, pad); },
      'H': function() { return date.getHours(); },
      'hh': function() { return padding(date.getHours() % 12, 2, pad); },
      'h': function() { return date.getHours() % 12; },
      'mm': function() { return padding(date.getMinutes(), 2, pad); },
      'm': function() { return date.getMinutes(); },
      'ss': function() { return padding(date.getSeconds(), 2, pad); },
      's': function() { return date.getSeconds(); },
      'A': function() {
          return date.getHours() < 12 ? 'AM' : 'PM';
      },
      'a': function(locale) {
          var ampm = {
              'ja-JP': ['午前', '午後'],
              'en-US': ['am', 'pm'],
          };
          return getDataByLocale(locale, ampm, date.getHours() < 12 ? 0 : 1);
      },
      'W': function(locale) {
          var weekday = {
              'ja-JP': ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
              'en-US': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          };
          return getDataByLocale(locale, weekday, date.getDay());
      },
      'w': function(locale) {
          var weekday = {
              'ja-JP': ['日', '月', '火', '水', '木', '金', '土'],
              'en-US':  ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
          };
          return getDataByLocale(locale, weekday, date.getDay());
      },
  };
  var fmtstr = ['']; // %%（%として出力される）用に空文字をセット。
  Object.keys(format).forEach(function(key) {
      fmtstr.push(key); // ['', 'YYYY', 'YY', 'MMMM',... 'W', 'w']のような配列が生成される。
  })
  var re = new RegExp('%(' + fmtstr.join('|') + ')%', 'g');
  // /%(|YYYY|YY|MMMM|...W|w)%/g のような正規表現が生成される。
  var replaceFn = function(match, fmt) {
  // match には%YYYY%などのマッチした文字列が、fmtにはYYYYなどの%を除くフォーマット文字列が入る。
      if(fmt === '') {
          return '%';
      }
      var func = format[fmt];
      // fmtがYYYYなら、format['YYYY']がfuncに代入される。つまり、
      // function() { return padding(date.getFullYear(), 4, pad); }という関数が代入される。
      if(func === undefined) {
          //存在しないフォーマット
          return match;
      }
      return func(locale);
  };
  return fmt.replace(re, replaceFn);
}

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