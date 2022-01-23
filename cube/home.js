// const containerDoc = document.getElementById('container')
const cube_nav = document.querySelector(".cube_nav")
const time_nav = document.getElementById('time_nav')
const switch_img = document.getElementById('switch_img')
const sun = document.querySelector(".sun")
const moon = document.querySelector(".moon")
const clude = document.querySelector(".clude_nav")
const bat = document.querySelector("#bat_icon")
const day_pl = () => document.querySelector("#day_ad").pause()
const night_pl = () => document.querySelector("#night_ad").pause()

function sunRise() {
  sun.className.baseVal = 'sky_icon sun sunRise'
}
function sunDown() {
  sun.className.baseVal = 'sky_icon sun sunDown'
}
function moonRise() {
  moon.className.baseVal = 'sky_icon moon moonRise'
}
function moonDown() {
  moon.className.baseVal = 'sky_icon moon moonDown'
}
function cludeCome() {
  clude.style.left = "-10px"
}
function cludeLeave() {
  clude.style.left = "-500px"
}
sunRise()


function day_or_night_init() {
  const d = Number(localStorage.getItem("day_or_night")) || 0
  d == 0 ? day_() : night_()
}
day_or_night_init()
// 圣诞树
function christmas_foo() {
  const d = new Date();
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const btn = document.querySelector(".christmas_tree");
  if (month == 12 && (day == 24 || day == 25)) {
    btn.style.display = '';
  }
}
christmas_foo();

// 摸鱼计时
function read_time() {
  const time = document.getElementById('time');
  const txt_context = document.getElementById('txt_context');
  let hour = 0; // 时
  let min = 0;  // 分
  let sec = 0;  // 秒
  setInterval(() => {
    sec += 1
    if (sec >= 60) {
      sec = 0
      min += 1;
    }
    if (min >= 60) {
      min = 0;
      hour += 1;
    }
    const hourContext = `${hour == 0 ? '' : hour + '<span style="font-size: medium;font-weight: normal;"> h</span>'}`
    const minContext = `${min == 0 ? '' : min + '<span style="font-size: medium;font-weight: normal;"> m</span>'}`
    time.innerHTML = `${hourContext} ${minContext} ${sec} `;
  }, 1000);
}
read_time()

// 请求数据
function get_data() {
  const url = "https://service-59m9jmx2-1304316567.gz.apigw.tencentcs.com/release/jitang";
  axios({ url }).then(res => {
    const { data } = res
    if (data && typeof data == "string") {
      txt_context.innerHTML = data;
    } else {
      txt_context.innerHTML = '你太笨了，没请求到数据！';
    }
  }).catch(err => {
    txt_context.innerHTML = '你太笨了，没请求到数据！';
  })
}
// get_data()

function batCome() {
  bat.style.top = '30px'
  bat.style.right = '30px'
  bat.className = 'batCome'
  // setTimeout(() => {
  //   bat.className = 'bat_po_Come'
  // }, 2800);
}
function batLeave() {
  bat.style.top = '-150px'
  bat.style.right = '-150px'
  // bat.className = 'batLeave'
  // setTimeout(() => {
  //   bat.className = 'bat_po_Leave'
  // }, 2800);
}

// 日夜切换
function night_() {
  cube_nav.style.backgroundColor = '#000'
  time_nav.style.color = '#fff'
  txt.style.color = "#fff"
  // 日落 月出 云来 蝙蝠来
  sunDown()
  moonRise()
  localStorage.setItem("day_or_night", 1)
  day_pl()
  night_ad()
  cludeCome()
  batCome()
}
function day_() {
  cube_nav.style.backgroundColor = '#fff'
  time_nav.style.color = '#000'
  txt.style.color = "#000"
  // 月落 日出 云离
  cludeLeave()
  moonDown()
  sunRise()
  localStorage.setItem("day_or_night", 0)
  night_pl()
  day_ad()
  setTimeout(() => {
    batLeave()
  }, 800);
}
// 夜间、白天切换
function switchBtn() {  // 夜晚
  const d = Number(localStorage.getItem("day_or_night")) || 0
  d == 0 ? night_() : day_()
}
// 取消滑动
let startY = 0;
const scrollBox = document.querySelector('#container');

document.body.addEventListener('touchstart', (e) => {
  startY = e.touches[0].pageY;
}, { passive: false });

document.body.addEventListener('touchmove', (e) => {
  const moveY = e.touches[0].pageY;
  const top = scrollBox.scrollTop;
  const ch = scrollBox.clientHeight;
  const sh = scrollBox.scrollHeight;
  if (!isChildTarget(e.target, scrollBox)) {
    e.preventDefault();
  } else if ((top === 0 && moveY > startY) || (top + ch === sh && moveY < startY)) {
    e.preventDefault();
  }
}, { passive: false });
function isChildTarget(child, parent, justChild = false) {
  // justChild为true则只判断是否为子元素，若为false则判断是否为本身或者子元素 默认为false
  let parentNode;
  if (justChild) {
    parentNode = child.parentNode;
  } else {
    parentNode = child;
  }

  if (child && parent) {
    while (parentNode) {
      if (parent === parentNode) {
        return true;
      }
      parentNode = parentNode.parentNode;
    }
  }
  return false;
}


// 切换背景
// const bg = document.querySelector("#container");
// const img_num_anim = Number(localStorage.getItem("img_num_anim")) || 1;
// bg.style.backgroundImage = `url("assets/imgs/cat${img_num_anim}.png")`

// function switch_back() {
//   const img_num_anim = Number(localStorage.getItem("img_num_anim")) || 1;
//   const newNum = img_num_anim + 1;
//   if (newNum <= 5) {
//     bg.style.backgroundImage = `url("assets/imgs/cat${newNum}.png")`
//     localStorage.setItem("img_num_anim", newNum)
//   } else {
//     bg.style.backgroundImage = `url("assets/imgs/cat1.png")`
//     localStorage.setItem("img_num_anim", 0)
//   }
// }

// 日夜音效
function day_ad() {
  const day_ad = document.querySelector("#day_ad")
  if (day_ad.paused) {
    day_ad.paused = false
    day_ad.play()
    setTimeout(() => {
      day_ad.pause()
      day_ad.currentTime = 0
    }, 3000);
  }
}
function night_ad() {
  const night_ad = document.querySelector("#night_ad")
  if (night_ad.paused) {
    night_ad.paused = false
    night_ad.play()
    setTimeout(() => {
      night_ad.pause()
      night_ad.currentTime = 0
    }, 3000);
  }
}
function batman_ad() {
  const batman_ad = document.querySelector("#batman_ad")
  if (batman_ad.paused) {
    batman_ad.paused = false
    batman_ad.play()
  }
  setTimeout(() => {
    batman_ad.pause()
    batman_ad.currentTime = 0
  }, 2400);
}

// 圣诞跳转
function jumpChristmas() {
  window.location.href = "christmas/index.html";
}
