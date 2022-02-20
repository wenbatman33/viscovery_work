import 'pixi.js/lib';
import { TweenLite } from "gsap";
// import TweenLite from 'gsap/src/uncompressed/TweenLite';
import { addClass, removeClass } from 'utility/IE8ClassList';
import { isTouchDevice } from 'utility/DeviceTest';


// 角度轉弧度 radians = degrees * (Math.PI / 180)
// 弧度轉角度 degress = radians * (180 / Math.PI)
// 畫平滑曲線
function curveTo(ctx, points) {
  ctx.moveTo(points[0].x, points[0].y);
  let i;
  for (i = 1; i < points.length - 2; i ++) {
   let xc = (points[i].x + points[i + 1].x) / 2;
   let yc = (points[i].y + points[i + 1].y) / 2;
   ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }
  // curve through the last two points
  ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);
}

let delayRender = 0;
let focusPlan = 5;
let w = 675, h = 640;
let app = new PIXI.Application(
  w, h,
  {
    transparent : true,
    antialias: true,
    autoResize: true,
    resolution: Math.min(window.devicePixelRatio || 1, 1.3),
    view: document.getElementById('round-plan')
  }
);
// 防止行動裝置上無法捲動頁面
app.renderer.plugins.interaction.autoPreventDefault = false;
// PIXI.AUTO_PREVENT_DEFAULT = false;

// document.getElementById('round-plan').appendChild(app.view);

let container = new PIXI.Container();
container.x = w / 2;
container.y = h / 2;
container.scale.x = container.scale.y = 1.25;
app.stage.addChild(container);


/////////////////// 密線
let denseLine = new PIXI.Graphics();
denseLine.lineStyle(1, 0xffffff, 0.2);
denseLine.drawCircle(0, 0, 222);
for(let degress=0; degress<360; degress+=2) {
  let radians = degress * (Math.PI / 180);
  let length = 222;
  let x = length * Math.cos(radians);
  let y = length * Math.sin(radians);
  denseLine.moveTo(0, 0);
  denseLine.lineTo(x, y);
}
// denseLine.cacheAsBitmap = true;
container.addChild(denseLine);



/////////////////// 中間灰色遮罩
let mask = new PIXI.Graphics();
let lines1 = [];
let lines2 = [];
// 1
for(let degress=0; degress<360; degress+=10) {
  let radians = degress * (Math.PI / 180);
  let length = Math.random() * 30 + 190;
  let x1 = length * Math.cos(radians);
  let y1 = length * Math.sin(radians);
  lines1.push({ x: x1, y: y1, l:length, r:radians, m:Math.floor(Math.random() * 2) });
}
lines1.push(lines1[0]);
mask.beginFill(0x404040, 0.5);
curveTo(mask, lines1);
mask.endFill();
// 2
for(let degress=0; degress<360; degress+=10) {
  let radians = degress * (Math.PI / 180);
  let length = Math.random() * 30 + 170;
  let x1 = length * Math.cos(radians);
  let y1 = length * Math.sin(radians);
  lines2.push({ x: x1, y: y1, l:length, r:radians, m:Math.floor(Math.random() * 2) });
}
lines2.push(lines2[0]);
mask.beginFill(0x404040, 1);
curveTo(mask, lines2);
mask.endFill();

container.addChild(mask);


/////////////////// 疏線
let sparseLine = new PIXI.Graphics();
sparseLine.lineStyle(1, 0xffffff, 0.06);
// 第2外圈
for(let degress=0; degress<360; degress+=4) {
  let radians = degress * (Math.PI / 180);
  let length = 238;
  let x = length * Math.cos(radians);
  let y = length * Math.sin(radians);
  sparseLine.moveTo(0, 0);
  sparseLine.lineTo(x, y);
}
// 最外圈
for(let degress=0; degress<360; degress+=1) {
  let radians = degress * (Math.PI / 180);
  let l1 = 250, l2 = 270;
  let x1 = l1 * Math.cos(radians);
  let y1 = l1 * Math.sin(radians);
  let x2 = l2 * Math.cos(radians);
  let y2 = l2 * Math.sin(radians);
  sparseLine.moveTo(x1, y1);
  sparseLine.lineTo(x2, y2);
}
// 白長
// [50, 146, 200, 296, 350].forEach((degress) => {
//   let radians = degress * (Math.PI / 180);
//   let l1 = 222;
//   let x = l1 * Math.cos(radians);
//   let y = l1 * Math.sin(radians);
//   sparseLine.beginFill(0x000, 0);
//   sparseLine.lineStyle(1, 0x8D8D8D, 1);
//   sparseLine.moveTo(0, 0);
//   sparseLine.lineTo(x, y);
//   sparseLine.lineStyle(1, 0xFFFFFF, 1);
//   sparseLine.drawCircle(x, y, 5);
//   sparseLine.beginFill(0x4DC289, 1);
//   sparseLine.lineStyle(0, 0x4DC289, 0);
//   sparseLine.drawCircle(x, y, 3);
// });
// sparseLine.cacheAsBitmap = true;
container.addChild(sparseLine);



/////////////////// 橘線
let orange = new PIXI.Graphics();
let orangelines1 = [];
let orangelines2 = [];
let orangelines3 = [];
// 1
for(let degress=0; degress<360; degress+=2) {
  let radians = degress * (Math.PI / 180);
  let length = Math.random() * 10 + 195;
  let x1 = length * Math.cos(radians);
  let y1 = length * Math.sin(radians);
  orangelines1.push({ x: x1, y: y1, l:length, r:radians, m:Math.floor(Math.random() * 2) });
}
orangelines1.push(orangelines1[0]);
orange.lineStyle(0.5, 0xFF5B37, 1);
curveTo(orange, orangelines1);
// 2
for(let degress=0; degress<360; degress+=3) {
  let radians = degress * (Math.PI / 180);
  let length = Math.random() * 10 + 195;
  let x1 = length * Math.cos(radians);
  let y1 = length * Math.sin(radians);
  orangelines2.push({ x: x1, y: y1, l:length, r:radians, m:Math.floor(Math.random() * 2) });
}
orangelines2.push(orangelines2[0]);
orange.lineStyle(0.5, 0xFF5B37, 0.5);
curveTo(orange, orangelines2);
// 3
for(let degress=0; degress<360; degress+=3) {
  let radians = degress * (Math.PI / 180);
  let length = Math.random() * 10 + 190;
  let x1 = length * Math.cos(radians);
  let y1 = length * Math.sin(radians);
  orangelines3.push({ x: x1, y: y1, l:length, r:radians, m:Math.floor(Math.random() * 2) });
}
orangelines3.push(orangelines3[0]);
orange.lineStyle(0.5, 0xFF5B37, 0.5);
curveTo(orange, orangelines3);
container.addChild(orange);



/////////////////// 中心大圓
let bigCircle = new PIXI.Graphics();
bigCircle.beginFill(0xFF5B37, 1);
bigCircle.drawCircle(0, 0, 157);
bigCircle.lineStyle(1, 0xE14523, 1);
for(let degress=18; degress<360; degress+=72) {
  let radians = degress * (Math.PI / 180);
  let length = 157;
  let x = length * Math.cos(radians);
  let y = length * Math.sin(radians);
  bigCircle.moveTo(0, 0);
  bigCircle.lineTo(x, y);
}
// bigCircle.cacheAsBitmap = true;
container.addChild(bigCircle);




/////////////////// 扇形
let sectorCircle = new PIXI.Graphics();
sectorCircle.beginFill(0xffffff);
sectorCircle.arc(0, 0, 175, -54 * (Math.PI / 180), 18 * (Math.PI / 180)); // cx, cy, radius, startAngle, endAngle
sectorCircle.lineTo(0,0);
sectorCircle.rotation = 288 * (Math.PI / 180);
// sectorCircle.cacheAsBitmap = true;
container.addChild(sectorCircle);
// TweenLite.to(sectorCircle, 1.5, { rotation: 360 * (Math.PI / 180), onCompleteParams:["{self}"], onComplete:(self) => {
//   self.restart();
// } });




/////////////////// 感應區事件
function mouseOver(target) {
  for(let i=1; i<=5; i++) {
    removeClass(document.getElementsByClassName(`round-plan__plan-text--position-${i}`)[0], 'active');
    removeClass(document.getElementsByClassName(`round-plan__tip--position-${i}`)[0], 'round-plan__tip--show');
    removeClass(document.getElementsByClassName(`tip-${i}`)[0], 'round-plan__mobile-tip--show');
    removeClass(document.getElementsByClassName(`round-plan__dots`)[i-1], 'round-plan__dots--active');
  }
  TweenLite.killTweensOf(sectorCircle);
  switch(target) {
    case 1:
      if(focusPlan === 5) sectorCircle.rotation = -72 * (Math.PI / 180);
      if(focusPlan === 4) sectorCircle.rotation = -144 * (Math.PI / 180);
      TweenLite.to(sectorCircle, 0.2, { rotation: 0 * (Math.PI / 180)});
      addClass(document.getElementsByClassName('round-plan__plan-text--position-1')[0], 'active');
      addClass(document.getElementsByClassName('round-plan__tip--position-1')[0], 'round-plan__tip--show');
      addClass(document.getElementsByClassName('tip-1')[0], 'round-plan__mobile-tip--show');
      addClass(document.getElementsByClassName('round-plan__dots')[1], 'round-plan__dots--active');
      break;
    case 2:
      TweenLite.to(sectorCircle, 0.2, { rotation: 72 * (Math.PI / 180)});
      addClass(document.getElementsByClassName('round-plan__plan-text--position-2')[0], 'active');
      addClass(document.getElementsByClassName('round-plan__tip--position-2')[0], 'round-plan__tip--show');
      addClass(document.getElementsByClassName('tip-2')[0], 'round-plan__mobile-tip--show');
      addClass(document.getElementsByClassName('round-plan__dots')[2], 'round-plan__dots--active');
      break;
    case 3:
      TweenLite.to(sectorCircle, 0.2, { rotation: 144 * (Math.PI / 180)});
      addClass(document.getElementsByClassName('round-plan__plan-text--position-3')[0], 'active');
      addClass(document.getElementsByClassName('round-plan__tip--position-3')[0], 'round-plan__tip--show');
      addClass(document.getElementsByClassName('tip-3')[0], 'round-plan__mobile-tip--show');
      addClass(document.getElementsByClassName('round-plan__dots')[3], 'round-plan__dots--active');
      break;
    case 4:
      TweenLite.to(sectorCircle, 0.2, { rotation: 216 * (Math.PI / 180)});
      addClass(document.getElementsByClassName('round-plan__plan-text--position-4')[0], 'active');
      addClass(document.getElementsByClassName('round-plan__tip--position-4')[0], 'round-plan__tip--show');
      addClass(document.getElementsByClassName('tip-4')[0], 'round-plan__mobile-tip--show');
      addClass(document.getElementsByClassName('round-plan__dots')[4], 'round-plan__dots--active');
      break;
    case 5:
      if(focusPlan === 1) sectorCircle.rotation = 360 * (Math.PI / 180);
      TweenLite.to(sectorCircle, 0.2, { rotation: 288 * (Math.PI / 180)});
      addClass(document.getElementsByClassName('round-plan__plan-text--position-5')[0], 'active');
      addClass(document.getElementsByClassName('round-plan__tip--position-5')[0], 'round-plan__tip--show');
      addClass(document.getElementsByClassName('tip-5')[0], 'round-plan__mobile-tip--show');
      addClass(document.getElementsByClassName('round-plan__dots')[0], 'round-plan__dots--active');
      break;
  }
  focusPlan = target;
}

/////////////////// 感應區一
let btn1 = new PIXI.Graphics();
btn1.beginFill(0xffffff, 0);
btn1.arc(0, 0, 157, -54 * (Math.PI / 180), 18 * (Math.PI / 180)); // cx, cy, radius, startAngle, endAngle
btn1.lineTo(0,0);
container.addChild(btn1);
btn1.interactive = true;
btn1.buttonMode = true;
// btn1.cacheAsBitmap = true;
btn1.on('touchend', mouseOver.bind(this, 1));
btn1.on('pointerover', mouseOver.bind(this, 1));

/////////////////// 感應區二
let btn2 = new PIXI.Graphics();
btn2.beginFill(0xffffff, 0);
btn2.arc(0, 0, 157, 18 * (Math.PI / 180), 90 * (Math.PI / 180)); // cx, cy, radius, startAngle, endAngle
btn2.lineTo(0,0);
container.addChild(btn2);
btn2.interactive = true;
btn2.buttonMode = true;
// btn2.cacheAsBitmap = true;
btn2.on('touchend', mouseOver.bind(this, 2));
btn2.on('pointerover', mouseOver.bind(this, 2));

/////////////////// 感應區三
let btn3 = new PIXI.Graphics();
btn3.beginFill(0xffffff, 0);
btn3.arc(0, 0, 157, 90 * (Math.PI / 180), 162 * (Math.PI / 180)); // cx, cy, radius, startAngle, endAngle
btn3.lineTo(0,0);
container.addChild(btn3);
btn3.interactive = true;
btn3.buttonMode = true;
// btn3.cacheAsBitmap = true;
btn3.on('touchend', mouseOver.bind(this, 3));
btn3.on('pointerover', mouseOver.bind(this, 3));

/////////////////// 感應區四
let btn4 = new PIXI.Graphics();
btn4.beginFill(0xffffff, 0);
btn4.arc(0, 0, 157, 162 * (Math.PI / 180), 234 * (Math.PI / 180)); // cx, cy, radius, startAngle, endAngle
btn4.lineTo(0,0);
container.addChild(btn4);
btn4.interactive = true;
btn4.buttonMode = true;
// btn4.cacheAsBitmap = true;
btn4.on('touchend', mouseOver.bind(this, 4));
btn4.on('pointerover', mouseOver.bind(this, 4));

/////////////////// 感應區五
let btn5 = new PIXI.Graphics();
btn5.beginFill(0xffffff, 0);
btn5.arc(0, 0, 157, 234 * (Math.PI / 180), 306 * (Math.PI / 180)); // cx, cy, radius, startAngle, endAngle
btn5.lineTo(0,0);
container.addChild(btn5);
btn5.interactive = true;
btn5.buttonMode = true;
// btn5.cacheAsBitmap = true;
btn5.on('touchend', mouseOver.bind(this, 5));
btn5.on('pointerover', mouseOver.bind(this, 5));





/////////////////// 中心小圓
let smallCircle = new PIXI.Graphics();
smallCircle.beginFill(0xFF5B37, 1);
smallCircle.lineStyle(2, 0xE14523, 1);
smallCircle.drawCircle(0, 0, 72);
smallCircle.lineStyle(1, 0xE14523, 1);
for(let degress=18; degress<360 + 18; degress+=10) {
  let radians = degress * (Math.PI / 180);
  let length = 72;
  let x = length * Math.cos(radians);
  let y = length * Math.sin(radians);
  smallCircle.moveTo(0, 0);
  smallCircle.lineTo(x, y);
}
smallCircle.beginFill(0xFFFFFF, 1);
smallCircle.lineStyle(0, 0xFFFFFF, 0);
smallCircle.drawCircle(0, 0, 61);
smallCircle.interactive = true;
// smallCircle.cacheAsBitmap = true;
container.addChild(smallCircle);



/////////////////// Logo VDS
let logo = PIXI.Sprite.fromImage('imgs/round-plan/vds-fitamos.png');
logo.anchor.set(0.5);
logo.x = 0;
logo.y = 0;
logo.scale.x = logo.scale.y = 0.4;
container.addChild(logo);



app.ticker.add(function(delta) {
  // delayRender++;
  // delayRender = delayRender % 2;
  // if(delayRender !== 0) return;
  // 動態灰色遮罩
  mask.clear();
  // 1
  lines1.forEach((point) => {
    if(point.m === 1) {
      point.l += 0.6;
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l >= 220) point.m = 0;
    } else {
      point.l -= 0.6;
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l <= 190) point.m = 1;
    }
  })
  mask.beginFill(0x404040, 0.5);
  curveTo(mask, lines1);
  mask.endFill();
  // 2
  lines2.forEach((point) => {
    if(point.m === 1) {
      point.l += 0.6;
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l >= 200) point.m = 0;
    } else {
      point.l -= 0.6;
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l <= 170) point.m = 1;
    }
  })
  mask.beginFill(0x404040, 1);
  curveTo(mask, lines2);
  mask.endFill();

  // 橘線動態
  orange.clear();
  // 1
  orangelines1.forEach((point) => {
    if(point.m === 1) {
      point.l += (1 + Math.random() * 2);
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l >= 205) point.m = 0;
    } else {
      point.l -= (1 + Math.random() * 2);
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l <= 195) point.m = 1;
    }
  })
  orange.lineStyle(0.5, 0xFF5B37, 1);
  curveTo(orange, orangelines1);
  // 2
  orangelines2.forEach((point) => {
    if(point.m === 1) {
      point.l += 1.2;
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l >= 205) point.m = 0;
    } else {
      point.l -= 1.2;
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l <= 195) point.m = 1;
    }
  })
  orange.lineStyle(0.5, 0xFF5B37, 0.5);
  curveTo(orange, orangelines2);
  // 3
  orangelines3.forEach((point) => {
    if(point.m === 1) {
      point.l += 1;
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l >= 200) point.m = 0;
    } else {
      point.l -= 1;
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l <= 190) point.m = 1;
    }
  })
  orange.lineStyle(0.5, 0xFF5B37, 0.5);
  curveTo(orange, orangelines3);

  // sectorCircle.rotation += 0.1;
  // console.log(app.ticker.FPS);
});
app.render();


// Resize
function resizeEvent(event) {
  let scale = 1;
  let add = 0;
  if(window.innerWidth < 400) {
    scale = 0.8;
    add = 0;
  }
  let left = (window.innerWidth - w) / 2 + add;
  left = left > 0 ? 0 : left;
  document.getElementsByClassName('round-plan__container')[0].style.marginLeft = `${left}px`;
  document.getElementsByClassName('round-plan__container')[0].style.transform = `scale(${scale})`;
  if(window.innerWidth < 992) {
    container.scale.x = container.scale.y = 1;
    // app.screen.width = app.screen.height = 540;
    // if(app.ticker.started) app.ticker.stop();
  } else {
    container.scale.x = container.scale.y = 1.25;
    // app.screen.width = 675;
    // app.screen.height = 640;
    // if(!app.ticker.started) app.ticker.start();
  }
}

window.addEventListener( "resize", resizeEvent);
resizeEvent();

addClass( document.getElementsByClassName('round-plan__container')[0], 'round-plan__container--fadein');

mouseOver(5);


//////////////////////////////////////////
// Mobile
//////////////////////////////////////////

class TouchSwip {
  touchDevice = isTouchDevice();
  touchArea = document.getElementsByClassName('round-plan')[0];
  touchPoint = {x:0, y:0};
  touchDirection = ''; // vertical, horizontal
  isGoing = false;

  constructor() {
    this.swipComplete = this.swipComplete.bind(this);
    this.touchHandler = this.touchHandler.bind(this);

    if(this.touchDevice) {
      // document.getElementById('round-plan').style.pointerEvents = 'none';
      this.touchArea.addEventListener("touchstart", this.touchHandler);
    }
  }

  touchHandler(event) {
    let move;
    let screenX = event.screenX !== undefined ? event.screenX : event.changedTouches[0] ? event.changedTouches[0].screenX : 0;
    let screenY = event.screenY !== undefined ? event.screenY : event.changedTouches[0] ? event.changedTouches[0].screenY : 0;
    switch(event.type) {
      case "touchstart":
        this.touchPoint = { x:screenX, y:screenY };
        this.touchDirection = '';
        this.touchArea.addEventListener("touchmove", this.touchHandler);
        this.touchArea.addEventListener("touchend", this.touchHandler);
        this.isGoing = false;
        break;
      case "touchmove":
        if(this.touchDirection === 'horizontal') {
          event.preventDefault();
          move = this.touchPoint.x - screenX;
          if(Math.abs(move) >= 100) {
            if(move > 0) {
              this.swipComplete('left');
            } else {
              this.swipComplete('right');
            }
          }
        } else if(this.touchDirection === '') {
          if(Math.max(Math.abs(this.touchPoint.x - screenX), Math.abs(this.touchPoint.y - screenY)) > 10) {
            if(Math.abs(this.touchPoint.x - screenX) > Math.abs(this.touchPoint.y - screenY)) {
              this.touchDirection = 'horizontal';
            } else {
              this.touchDirection = 'vertical';
            }
          }
        }
        break;
      case "touchend":
        if(this.touchDirection === 'horizontal') {
          move = this.touchPoint.x - screenX;
          if(Math.abs(move) >= 50) {
            if(move > 0) {
              this.swipComplete('left');
            } else {
              this.swipComplete('right');
            }
          }
        }
        this.touchArea.removeEventListener("touchmove", this.touchHandler);
        this.touchArea.removeEventListener("touchend", this.touchHandler);
        break;
    }
  }

  swipComplete(direction) {
    if(this.isGoing === false) {
      let focus;
      this.isGoing = true;
      switch(direction) {
        case 'left':
          focus = focusPlan + 1 > 5 ? 1 : focusPlan + 1;
          mouseOver(focus);
          break;
        case 'right':
          focus = focusPlan - 1 < 1 ? 5 : focusPlan - 1;
          mouseOver(focus);
      }
    }
  }
}

new TouchSwip();
