import 'pixi.js/lib';
import { TweenLite, EasePack } from "gsap";
// import TweenLite from 'gsap/src/uncompressed/TweenLite';
// import EasePack from 'gsap/src/uncompressed/easing/EasePack';
// import { addClass, removeClass } from 'utility/IE8ClassList';
// console.log(EasePack)

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
let focusPlan = 1;
let firstRender = true;
let w = 500, h = 500;
let app = new PIXI.Application(
  w, h,
  {
    transparent : true,
    antialias: true,
    // autoResize: true,
    resolution: Math.min(window.devicePixelRatio || 1, 1.2),
    view: document.getElementById('circle')
  }
);
// 防止行動裝置上無法捲動頁面
app.renderer.plugins.interaction.autoPreventDefault = false;

let container = new PIXI.Container();
container.x = w / 2;
container.y = h / 2;
app.stage.addChild(container);


/////////////////// 密線
let denseLine = new PIXI.Graphics();
// 白圓
denseLine.beginFill(0xffffff, 1);
denseLine.drawCircle(0, 0, 220);
// 線
denseLine.beginFill(0x000, 0);
denseLine.lineStyle(1, 0x777777, 0.3);
denseLine.drawCircle(0, 0, 178);
for(let degress=0; degress<360; degress+=2) {
  let radians = degress * (Math.PI / 180);
  let length = 178;
  let x = length * Math.cos(radians);
  let y = length * Math.sin(radians);
  denseLine.moveTo(0, 0);
  denseLine.lineTo(x, y);
}
container.addChild(denseLine);



/////////////////// 中間白遮罩
let mask = new PIXI.Graphics();
let lines1 = [];
let lines2 = [];
// 1
for(let degress=0; degress<360; degress+=6) {
  let radians = degress * (Math.PI / 180);
  let length = Math.random() * 40 + 120;
  let x1 = length * Math.cos(radians);
  let y1 = length * Math.sin(radians);
  lines1.push({ x: x1, y: y1, l:length, r:radians, m:Math.floor(Math.random() * 2) });
}
lines1.push(lines1[0]);
mask.beginFill(0xffffff, 1);
curveTo(mask, lines1);
mask.endFill();
// 2
for(let degress=0; degress<360; degress+=5) {
  let radians = degress * (Math.PI / 180);
  let length = Math.random() * 30 + 130;
  let x1 = length * Math.cos(radians);
  let y1 = length * Math.sin(radians);
  lines2.push({ x: x1, y: y1, l:length, r:radians, m:Math.floor(Math.random() * 2) });
}
lines2.push(lines2[0]);
mask.beginFill(0xffffff, 0.5);
curveTo(mask, lines2);
mask.endFill();

container.addChild(mask);


/////////////////// 疏線
let sparseLine = new PIXI.Graphics();
sparseLine.lineStyle(1, 0x777777, 0.3);
// 最外圈
for(let degress=0; degress<360; degress+=1) {
  let radians = degress * (Math.PI / 180);
  let l1 = 220, l2 = 250;
  let x1 = l1 * Math.cos(radians);
  let y1 = l1 * Math.sin(radians);
  let x2 = l2 * Math.cos(radians);
  let y2 = l2 * Math.sin(radians);
  sparseLine.moveTo(x1, y1);
  sparseLine.lineTo(x2, y2);
}
container.addChild(sparseLine);





app.ticker.add(function(delta) {
  // delayRender++;
  // delayRender = delayRender % 2;
  // if(delayRender !== 0) return;
  container.rotation += 0.005;
  // 動態白色遮罩
  mask.clear();
  // 1
  lines1.forEach((point) => {
    if(point.m === 1) {
      point.l += 0.6;
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l >= 155) point.m = 0;
    } else {
      point.l -= 0.6;
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l <= 115) point.m = 1;
    }
  })
  mask.beginFill(0xffffff, 1);
  curveTo(mask, lines1);
  mask.endFill();
  // 2
  lines2.forEach((point) => {
    if(point.m === 1) {
      point.l += 0.8;
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l >= 165) point.m = 0;
    } else {
      point.l -= 0.8;
      point.x = point.l * Math.cos(point.r);
      point.y = point.l * Math.sin(point.r);
      if(point.l <= 145) point.m = 1;
    }
  })
  mask.beginFill(0xffffff, 0.5);
  curveTo(mask, lines2);
  mask.endFill();

  // sectorCircle.rotation += 0.1;
  // console.log(app.ticker.FPS);
  if(firstRender) {
    firstRender = false;
    TweenLite.to(container.scale, 1, {x:1, y:1, delay: 0.3, ease: Power4.easeOut});
    document.getElementById('circle').style.opacity = '1';
    window.addEventListener( "resize", resizeEvent);
    resizeEvent();
  }
});


// Resize
function resizeEvent(event) {
  if(window.innerWidth < 640) {
    if(app.ticker.started) app.ticker.stop();
    if(container.scale.x < 1) {
      TweenLite.killTweensOf(container);
      container.scale.x = 1;
      container.scale.y = 1;
      app.render();
    }
  } else {
    if(!app.ticker.started) app.ticker.start();
  }
}


container.scale.x = container.scale.y = 0;
app.render();
