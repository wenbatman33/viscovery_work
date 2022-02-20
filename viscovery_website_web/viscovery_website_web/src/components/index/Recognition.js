import 'pixi.js/lib';
import { TweenLite } from "gsap";

/*
// 角度轉弧度 radians = degrees * (Math.PI / 180)
// 弧度轉角度 degress = radians * (180 / Math.PI)
// 畫平滑曲線
*/


class Recognition {

  app;
  container;
  effect;
  mEffect;
  w = 1280;
  h = 854;
  mHotSpotScale = { scale:0.5, add: 0.03 };
  man;
  focusPlan = 1;
  allLoaded = false;
  p1;
  p1web = [
    [[22,-67],[16,-32],[29,-24],[50,-18],[60,-26],[70,-11],[48,15],[39,42],[5,62],[-18,68],[-32,62],[-39,35],[-30,24],[-40,18],[-31,-9],[-34,-15],[-49,-24],[-51,-15],[-42,-13],[-46,-10],[-43,-6],[-31,-9],[-42,-13],[-34,-15]],
    [[-40,18],[-33,14],[-31,-9],[-20,-17],[-8,-23],[13,-16],[16,-32],[29,-24],[13,-16],[-11,-15],[5,-10],[50,-18],[-2,33],[39,42]],
    [[50,-18],[48,15]],
    [[5,-10],[-2,33],[-27,42],[-39,35],[-2,33]],
    [[5,-10],[-15,-9],[-11,-15]],
    [[-15,-9],[-21,-5],[-16,17],[-33,14]],
    [[-16,17],[-30,24]],
    [[-20,-17],[-11,-15]]
  ]
  p2;
  p2web = [
    [[-3,-3],[-3,26],[29,17],[39,17],[71,29],[72,-2],[39,7],[29,7],[-3,-3]],
    [[29,7],[29,17]],
    [[39,7],[39,17]]
  ];
  p3;
  p3web = [
    [[51,-4],[64,-1],[85,43],[84,64],[58,73],[47,59],[41,60],[35,82],[8,86],[-3,67],[41,60]],
    [[47,59],[85,43]]
  ];
  p4;
  p4web = [
    [[-2,7],[13,1],[13,8],[-2,14],[-2,7]],
    [[42,16],[45,18],[39,34],[37,31],[42,16]],
    [[15,3],[18,1],[24,2],[30,4],[36,7],[40,11],[42,16],[39,17],[34,16],[27,14],[21,11],[16,7],[15,3]]
  ];
  p5;
  p5web = [
    [[34,26],[43,30],[53,33],[64,37],[138,49],[81,128],[-1,67],[21,49],[34,26]],
    [[21,49],[30,53],[39,57],[50,61],[64,37]],
    [[43,30],[30,53]],
    [[53,33],[39,57]]
  ];
  p6;
  p6web = [];
  focus = 0;
  mode = 'init';
  mousePoint = {x:10000, y:10000};
  recognitionArea = document.getElementById('recognition-area');

  constructor() {
    this.render = this.render.bind(this);
    this.resizeEvent = this.resizeEvent.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    // this.touchend = this.touchend.bind(this);

    // 處理point array增加位移資料
    this.makePoint(this.p1web);
    this.makePoint(this.p2web);
    this.makePoint(this.p3web);
    this.makePoint(this.p4web);
    this.makePoint(this.p5web);
    this.makePoint(this.p6web);

    this.app = new PIXI.Application(
      this.w, this.h,
      {
        transparent : true,
        antialias: true,
        autoResize: true,
        resolution: Math.min(window.devicePixelRatio || 1, 1.2),
        view: document.getElementById('recognition')
      }
    );
    // 防止行動裝置上無法捲動頁面
    this.app.renderer.plugins.interaction.autoPreventDefault = false;
    // 主容器
    this.container = new PIXI.Container();
    this.container.x = this.w / 2;
    this.container.y = this.h / 2;
    this.app.stage.addChild(this.container);
    // 互動層
    this.effect = new PIXI.Container();
    // 手機圓點層
    this.mEffect = new PIXI.Container();
    // this.container.addChild(this.effect);
    // 人物圖
    this.man = PIXI.Sprite.fromImage('imgs/material/man.png');
    this.man.anchor.set(0.5);
    this.container.addChild(this.man);
    // 手機人物線
    this.man_mobile = PIXI.Sprite.fromImage('imgs/material/man_mobile.png');
    this.man_mobile.anchor.set(0.5);
    this.man_mobile.scale.x = this.man_mobile.scale.y = 0.68;
    this.man_mobile.position.x = 75;
    this.man_mobile.position.y = -30;
    // this.container.addChild(this.man_mobile);

    // 頭
    this.drawPoint1();
    // 領帶
    this.drawPoint2();
    // 眼鏡
    this.drawPoint3();
    // 手錶
    this.drawPoint4();
    // 鞋子
    this.drawPoint5();
    // 手肘
    this.drawPoint6();

    // render
    this.app.ticker.add(this.render);
    this.app.render();

    window.addEventListener( "resize", this.resizeEvent);
    this.resizeEvent();
  }

  // 處理point array
  makePoint(list) {
    for(let i=0, j=list.length; i<j; i++) {
      let lineList = list[i];
      for(let i2=0, j2=lineList.length; i2<j2; i2++) {
        lineList[i2][2] = lineList[i2][0];
        lineList[i2][3] = lineList[i2][1];
      }
    }
  }

  // 頭
  drawPoint1() {
    this.p1 = new PIXI.Container();
    // 圓
    let circle =  this.drawCircle(130, 0, 8, 12, 3, 3, this.p1);
    circle.alpha = 0;
    circle.scale.x = circle.scale.y = 0.1;
    this.p1.circle = circle;
    this.p1.addChild(circle);

    // mobile hot spot
    let mHotSpot = PIXI.Sprite.fromImage('imgs/material/HotSpot.png');
    mHotSpot.anchor.set(0.5);
    mHotSpot.scale.x = mHotSpot.scale.y = 0.5;
    mHotSpot.position = {x:-70, y:-250};
    this.p1.mHotSpot = mHotSpot;
    this.mEffect.addChild(mHotSpot);

    // 網線
    let web = new PIXI.Graphics();
    web.lineStyle(1.3, 0xffffff, 0.6);
    for(let i=0, j=this.p1web.length; i<j; i++) {
      let lineList = this.p1web[i];
      for(let i2=0, j2=lineList.length; i2<j2; i2++) {
        if(i2 === 0) web.moveTo(lineList[i2][0], lineList[i2][1]);
        else web.lineTo(lineList[i2][0], lineList[i2][1]);
      }
    }
    web.alpha = 0;
    web.scale.x = web.scale.y = 1.23;
    web.position.x = -12;
    web.position.y = 16;
    this.p1.web = web;
    this.p1.addChild(this.p1.web);
    // text
    let text = PIXI.Sprite.fromImage('imgs/material/Clark.png');
    text.scale.x = text.scale.y = 0.7;
    text.position.x = -410;
    text.position.y = -34;
    text.alpha = 0;
    this.p1.text = text;
    this.p1.addChild(this.p1.text);

    this.p1.position.x = -70;
    this.p1.position.y = -250;
    this.effect.addChild(this.p1);

    this.p1Text = PIXI.Sprite.fromImage('imgs/material/Clark-m.png');
    this.p1Text.scale.x = this.p1Text.scale.y = 1;
    this.p1Text.position.x = 80;
    this.p1Text.position.y = -330;
    this.p1Text.alpha = 0;
    this.container.addChild(this.p1Text);

  }

  // 領帶
  drawPoint2() {
    this.p2 = new PIXI.Container();
    // 圓
    let circle =  this.drawCircle(70, -20, 6, 8, 4, 3, this.p2, {x:27, y:2});
    circle.alpha = 0;
    circle.scale.x = circle.scale.y = 0.1;
    this.p2.circle = circle;
    this.p2.addChild(circle);

    // mobile hot spot
    let mHotSpot = PIXI.Sprite.fromImage('imgs/material/HotSpot.png');
    mHotSpot.anchor.set(0.5);
    mHotSpot.scale.x = mHotSpot.scale.y = 0.5;
    mHotSpot.position = {x:27-50, y:2-130};
    this.p2.mHotSpot = mHotSpot;
    this.mEffect.addChild(mHotSpot);

    // 網線
    let web = new PIXI.Graphics();
    web.lineStyle(1.3, 0xffffff, 0.6);
    for(let i=0, j=this.p2web.length; i<j; i++) {
      let lineList = this.p2web[i];
      for(let i2=0, j2=lineList.length; i2<j2; i2++) {
        if(i2 === 0) web.moveTo(lineList[i2][0], lineList[i2][1]);
        else web.lineTo(lineList[i2][0], lineList[i2][1]);
      }
    }
    web.alpha = 0;
    web.scale.x = web.scale.y = 1.23;
    web.position.x = -45;
    web.position.y = -12;
    this.p2.web = web;
    this.p2.addChild(this.p2.web);
    // text
    let text = PIXI.Sprite.fromImage('imgs/material/Bow.png');
    text.scale.x = text.scale.y = 0.7;
    text.position.x = 80;
    text.position.y = -187;
    text.alpha = 0;
    this.p2.text = text;
    this.p2.addChild(this.p2.text);

    this.p2.position.x = -50;
    this.p2.position.y = -130;
    this.effect.addChild(this.p2);

    this.p2Text = PIXI.Sprite.fromImage('imgs/material/Bow-m.png');
    this.p2Text.scale.x = this.p2Text.scale.y = 1;
    this.p2Text.position.x = 80;
    this.p2Text.position.y = -330;
    this.p2Text.alpha = 0;
    this.container.addChild(this.p2Text);
  }

  // 眼鏡
  drawPoint3() {
    this.p3 = new PIXI.Container();
    // 圓
    let circle =  this.drawCircle(90, 20, 6, 8, 4, 3, this.p3, {x:45, y:24});
    circle.alpha = 0;
    circle.scale.x = circle.scale.y = 0.1;
    this.p3.circle = circle;
    this.p3.addChild(circle);

    // mobile hot spot
    let mHotSpot = PIXI.Sprite.fromImage('imgs/material/HotSpot.png');
    mHotSpot.anchor.set(0.5);
    mHotSpot.scale.x = mHotSpot.scale.y = 0.5;
    mHotSpot.position = {x:45+80, y:24-80};
    this.p3.mHotSpot = mHotSpot;
    this.mEffect.addChild(mHotSpot);

    // 網線
    let web = new PIXI.Graphics();
    web.lineStyle(1.3, 0xffffff, 0.6);
    for(let i=0, j=this.p3web.length; i<j; i++) {
      let lineList = this.p3web[i];
      for(let i2=0, j2=lineList.length; i2<j2; i2++) {
        if(i2 === 0) web.moveTo(lineList[i2][0], lineList[i2][1]);
        else web.lineTo(lineList[i2][0], lineList[i2][1]);
      }
    }
    web.alpha = 0;
    web.scale.x = web.scale.y = 1.23;
    web.position.x = -38;
    web.position.y = -50;
    this.p3.web = web;
    this.p3.addChild(this.p3.web);
    // text
    let text = PIXI.Sprite.fromImage('imgs/material/SunGlasses.png');
    text.scale.x = text.scale.y = 0.7;
    text.position.x = 98;
    text.position.y = -17;
    text.alpha = 0;
    this.p3.text = text;
    this.p3.addChild(this.p3.text);

    this.p3.position.x = 80;
    this.p3.position.y = -80;
    this.effect.addChild(this.p3);

    this.p3Text = PIXI.Sprite.fromImage('imgs/material/SunGlasses-m.png');
    this.p3Text.scale.x = this.p3Text.scale.y = 1;
    this.p3Text.position.x = 80;
    this.p3Text.position.y = -330;
    this.p3Text.alpha = 0;
    this.container.addChild(this.p3Text);
  }

  // 手錶
  drawPoint4() {
    this.p4 = new PIXI.Container();
    // 圓
    let circle =  this.drawCircle(60, 55, 4, 5, 4, 3, this.p4, {x:3, y:-4});
    circle.alpha = 0;
    circle.scale.x = circle.scale.y = 0.1;
    this.p4.circle = circle;
    this.p4.addChild(circle);

    // mobile hot spot
    let mHotSpot = PIXI.Sprite.fromImage('imgs/material/HotSpot.png');
    mHotSpot.anchor.set(0.5);
    mHotSpot.scale.x = mHotSpot.scale.y = 0.5;
    mHotSpot.position = {x:3+220, y:-4+130};
    this.p4.mHotSpot = mHotSpot;
    this.mEffect.addChild(mHotSpot);

    // 網線
    let web = new PIXI.Graphics();
    web.lineStyle(1.3, 0xffffff, 0.6);
    for(let i=0, j=this.p4web.length; i<j; i++) {
      let lineList = this.p4web[i];
      for(let i2=0, j2=lineList.length; i2<j2; i2++) {
        if(i2 === 0) web.moveTo(lineList[i2][0], lineList[i2][1]);
        else web.lineTo(lineList[i2][0], lineList[i2][1]);
      }
    }
    web.alpha = 0;
    web.scale.x = web.scale.y = 1.23;
    web.position.x = -31;
    web.position.y = -15;
    this.p4.web = web;
    this.p4.addChild(this.p4.web);
    // text
    let text = PIXI.Sprite.fromImage('imgs/material/Watch.png');
    text.scale.x = text.scale.y = 0.7;
    text.position.x = 62;
    text.position.y = -67;
    text.alpha = 0;
    this.p4.text = text;
    this.p4.addChild(this.p4.text);

    this.p4.position.x = 220;
    this.p4.position.y = 130;
    this.effect.addChild(this.p4);

    this.p4Text = PIXI.Sprite.fromImage('imgs/material/Watch-m.png');
    this.p4Text.scale.x = this.p4Text.scale.y = 1;
    this.p4Text.position.x = 80;
    this.p4Text.position.y = -330;
    this.p4Text.alpha = 0;
    this.container.addChild(this.p4Text);
  }

  // 鞋子
  drawPoint5() {
    this.p5 = new PIXI.Container();
    // 圓
    let circle =  this.drawCircle(120, 55, 8, 10, 3, 3, this.p5, {x:10, y:-10});
    circle.alpha = 0;
    circle.scale.x = circle.scale.y = 0.1;
    this.p5.circle = circle;
    this.p5.addChild(circle);

    // mobile hot spot
    let mHotSpot = PIXI.Sprite.fromImage('imgs/material/HotSpot.png');
    mHotSpot.anchor.set(0.5);
    mHotSpot.scale.x = mHotSpot.scale.y = 0.5;
    mHotSpot.position = {x:10+320, y:-10+240};
    this.p5.mHotSpot = mHotSpot;
    this.mEffect.addChild(mHotSpot);

    // 網線
    let web = new PIXI.Graphics();
    web.lineStyle(1.3, 0xffffff, 0.6);
    for(let i=0, j=this.p5web.length; i<j; i++) {
      let lineList = this.p5web[i];
      for(let i2=0, j2=lineList.length; i2<j2; i2++) {
        if(i2 === 0) web.moveTo(lineList[i2][0], lineList[i2][1]);
        else web.lineTo(lineList[i2][0], lineList[i2][1]);
      }
    }
    web.alpha = 0;
    web.scale.x = web.scale.y = 1.23;
    web.position.x = -85;
    web.position.y = -86;
    this.p5.web = web;
    this.p5.addChild(this.p5.web);
    // text
    let text = PIXI.Sprite.fromImage('imgs/material/Shoes.png');
    text.scale.x = text.scale.y = 0.7;
    text.position.x = -370;
    text.position.y = 48;
    text.alpha = 0;
    this.p5.text = text;
    this.p5.addChild(this.p5.text);

    this.p5.position.x = 320;
    this.p5.position.y = 240;
    this.effect.addChild(this.p5);

    this.p5Text = PIXI.Sprite.fromImage('imgs/material/Shoes-m.png');
    this.p5Text.scale.x = this.p5Text.scale.y = 1;
    this.p5Text.position.x = 80;
    this.p5Text.position.y = -330;
    this.p5Text.alpha = 0;
    this.container.addChild(this.p5Text);
  }

  // 手肘
  drawPoint6() {
    this.p6 = new PIXI.Container();
    // 圓
    let circle =  this.drawCircle(80, 30, 6, 8, 4, 3, this.p6, {x:-20, y:10});
    circle.alpha = 0;
    circle.scale.x = circle.scale.y = 0.1;
    this.p6.circle = circle;
    this.p6.addChild(circle);

    // mobile hot spot
    let mHotSpot = PIXI.Sprite.fromImage('imgs/material/HotSpot.png');
    mHotSpot.anchor.set(0.5);
    mHotSpot.scale.x = mHotSpot.scale.y = 0.5;
    mHotSpot.position = {x:-20-200, y:10+90};
    this.p6.mHotSpot = mHotSpot;
    this.mEffect.addChild(mHotSpot);

    // 網線
    let web = new PIXI.Graphics();
    web.lineStyle(1.3, 0xffffff, 0.6);
    for(let i=0, j=this.p6web.length; i<j; i++) {
      let lineList = this.p6web[i];
      for(let i2=0, j2=lineList.length; i2<j2; i2++) {
        if(i2 === 0) web.moveTo(lineList[i2][0], lineList[i2][1]);
        else web.lineTo(lineList[i2][0], lineList[i2][1]);
      }
    }
    web.alpha = 0;
    web.scale.x = web.scale.y = 1.23;
    web.position.x = -85;
    web.position.y = -86;
    this.p6.web = web;
    this.p6.addChild(this.p6.web);
    // text
    let text = PIXI.Sprite.fromImage('imgs/material/Suits.png');
    text.scale.x = text.scale.y = 0.7;
    text.position.x = -198;
    text.position.y = 40;
    text.alpha = 0;
    this.p6.text = text;
    this.p6.addChild(this.p6.text);

    this.p6.position.x = -200;
    this.p6.position.y = 90;
    this.effect.addChild(this.p6);

    this.p6Text = PIXI.Sprite.fromImage('imgs/material/Suits-m.png');
    this.p6Text.scale.x = this.p6Text.scale.y = 1;
    this.p6Text.position.x = 80;
    this.p6Text.position.y = -330;
    this.p6Text.alpha = 0;
    this.container.addChild(this.p6Text);
  }

  drawCircle(radius, rotation, gap, length, degressGap, smallCircle, target, hotSpotPoint={x:0, y:0}) {
    let circle = new PIXI.Graphics();
    circle.beginFill(0xffffff, 0);
    circle.lineStyle(1.5, 0xffffff, 0.4);
    circle.drawCircle(0, 0, radius);
    let l1 = radius - gap - length;
    let l2 = radius - gap;
    for(let degress=0; degress<360; degress+=degressGap) {
      let radians = degress * (Math.PI / 180);
      let x1 = l1 * Math.cos(radians);
      let y1 = l1 * Math.sin(radians);
      let x2 = l2 * Math.cos(radians);
      let y2 = l2 * Math.sin(radians);
      circle.moveTo(x1, y1);
      circle.lineTo(x2, y2);
    }
    circle.beginFill(0xffffff, 0.4);
    circle.lineStyle(0, 0xffffff, 0);
    let smallRadius = radius + 10;
    for(let degress=0; degress<360; degress+=90) {
      let radians = degress * (Math.PI / 180);
      let x1 = smallRadius * Math.cos(radians);
      let y1 = smallRadius * Math.sin(radians);
      circle.drawCircle(x1, y1, smallCircle);
    }
    circle.rotation = rotation * (Math.PI / 180);

    // 3/4圓
    let halfCircle = new PIXI.Graphics();
    halfCircle.lineStyle(1.5, 0xffffff, 1);
    halfCircle.arc(0, 0, radius, 0 * (Math.PI / 180), 270 * (Math.PI / 180)); // cx, cy, radius, startAngle, endAngle
    target.halfCircle = halfCircle;
    circle.addChild(halfCircle);

    // hot spot
    let hotSpot = PIXI.Sprite.fromImage('imgs/material/HotSpot.png');
    hotSpot.anchor.set(0.5);
    hotSpot.scale.x = hotSpot.scale.y = 0.5;
    hotSpot.position = hotSpotPoint;
    target.hotSpot = hotSpot;
    target.addChild(hotSpot);

    return circle;
  }

  // Resize
  resizeEvent(event) {
    // var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    // var iw = (iOS) ? screen.width : window.innerWidth;
    let iw = window.innerWidth;
    let ih = this.recognitionArea.clientHeight || this.recognitionArea.offsetHeight;
    this.container.scale.x = this.container.scale.y = ih / this.h;
    this.container.x = Math.min(iw / 2 - 10, this.w / 2);
    this.container.y = ih / 2;

    if(iw < 768) {
      // alert((iw - 768) / 2 -40)
      // document.getElementById('recognition').style.marginLeft = `${(iw - 768) / 2 -40}px`;
    } else {
      // document.getElementById('recognition').style.marginLeft = null;
    }
    if(iw < 768 && this.mode !== 'mobile') {
      this.mode = 'mobile';
      this.container.addChild(this.man_mobile);
      this.container.addChild(this.mEffect);
      this.container.removeChild(this.effect);
      this.container.interactive = true;
      this.container.pointermove = null;
      this.container.touchend = this.mouseMove;

    } else if(iw >= 768 && this.mode !== 'desktop'){
      this.mode = 'desktop';
      this.container.removeChild(this.man_mobile);
      this.container.removeChild(this.mEffect);
      this.container.addChild(this.effect);
      this.container.interactive = true;
      this.container.pointermove = this.mouseMove;
      this.container.touchend = null;
      for(let i=1, j=6; i<=j; i++) {
        let text = this[`p${i}Text`];
        text.alpha = 0;
      }
      // this.container.on('pointermove', this.mouseMove);
    }
  }

  setFocus(focus) {
    if(this.focus !== focus) {
      this.focus = focus;
      let t = 0.4;
      TweenMax.killAll();
      for(let i=1, j=6; i<=j; i++) {
        let fadeTarget = this['p'+i];
        if(fadeTarget) {
          if(this.focus === i) {
            // 進場
            TweenMax.to(fadeTarget.halfCircle, 1, {startAt: {rotation:0}, rotation: 360 * (Math.PI / 180), repeat:-1});
            TweenMax.to(fadeTarget.web, t, {delay: 0.5 ,alpha: 1});
            TweenMax.to(fadeTarget.text, t, {delay: 0.5 ,alpha: 1});
            TweenMax.to(fadeTarget.circle, t, {alpha: 1});
            TweenMax.to(fadeTarget.hotSpot, t, {alpha: 0});
            TweenMax.to(fadeTarget.circle.scale, t, {x: 1, y:1, ease: Back.easeOut.config(1.7)});
          } else {
            // 退場
            TweenMax.to(fadeTarget.web, t, {alpha: 0});
            TweenMax.to(fadeTarget.text, t, {alpha: 0});
            TweenMax.to(fadeTarget.circle, t, {delay: 0.5 ,alpha: 0});
            TweenMax.to(fadeTarget.circle.scale, t, {x: 0, y:0, ease: Back.easeIn.config(1.7)});
            TweenMax.to(fadeTarget.hotSpot, t, {alpha: 1});
            TweenMax.to(fadeTarget.hotSpot.scale, t, {startAt: {x:0.4,y:0.4}, x:0.6, y:0.6, yoyo:true, repeat:-1});
          }
        }
      }
    }
  }

  mouseMove(event) {
    this.mousePoint = event.data.global;
    let local = this.container.toLocal(this.mousePoint);
    let overTarget = [
      {x: -50, y: -130, radius:70, focus: 2},
      {x: -70, y: -250, radius:130, focus: 1},
      {x: 80, y: -80, radius:90, focus: 3},
      {x: 220, y: 130, radius:60, focus: 4},
      {x: 320, y: 240, radius:120, focus: 5},
      {x: -200, y: 90, radius:80, focus: 6}
    ];
    for(let i=0, j=overTarget.length; i<j; i++) {
      if(Math.sqrt( Math.pow(local.x - overTarget[i].x, 2) + Math.pow(local.y - overTarget[i].y, 2)) <= overTarget[i].radius) {
        this.setFocus(overTarget[i].focus);
        break;
      }
    }
  }

  touchend(event) {
    // console.log(event)
  }

  render(delta) {
    if (!this.allLoaded && this.man.texture.baseTexture.hasLoaded) {
      this.allLoaded = true;
      document.getElementById('recognition').style.opacity = '1';
      this.setFocus(1);
    }
    if(this.mode === 'desktop') {
      if(this.focus > 0) {
        let web = this['p'+this.focus].web;
        let localPoint = web.toLocal(this.mousePoint);
        let webData = this['p'+this.focus+'web'];
        web.clear();
        web.lineStyle(1.3, 0xffffff, 0.6);
        for(let i=0, j=webData.length; i<j; i++) {
          let lineList = webData[i];
          for(let i2=0, j2=lineList.length; i2<j2; i2++) {
            let dx = lineList[i2][0] - localPoint.x;
            let dy = lineList[i2][1] - localPoint.y;
            let angle = Math.atan2( dy, dx );
            let dist = 40 / Math.sqrt( dx * dx + dy * dy );
            let ox = lineList[i2][2];
            let oy = lineList[i2][3];
            lineList[i2][0] += Math.cos( angle ) * dist;
            lineList[i2][1] += Math.sin( angle ) * dist;
            lineList[i2][0] += (ox - lineList[i2][0])*.1;
            lineList[i2][1] += (oy - lineList[i2][1])*.1
            if(i2 === 0) web.moveTo(lineList[i2][0], lineList[i2][1]);
            else web.lineTo(lineList[i2][0], lineList[i2][1]);
          }
        }
      }
    } else if(this.mode === 'mobile') {
      if(this.focus > 0) {
        for(let i=1, j=6; i<=j; i++) {
          let text = this[`p${i}Text`];
          if(this.focus === i) {
            text.alpha = 1;
          } else {
            text.alpha = 0;
          }
        }
      }

      this.mHotSpotScale.scale += this.mHotSpotScale.add;
      for(let i=1, j=6; i<=j; i++) {
        let mHotSpot = this['p'+i].mHotSpot;
        if(mHotSpot) {
          mHotSpot.scale.x = mHotSpot.scale.y = this.mHotSpotScale.scale;
        }
      }
      if(this.mHotSpotScale.scale >= 0.8) {
        this.mHotSpotScale.add = -0.03;
      } else if(this.mHotSpotScale.scale <= 0.5) {
        this.mHotSpotScale.add = 0.03;
      }

    }
  }

}

new Recognition();
