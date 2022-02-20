import 'pixi.js/lib';
import TweenLite from 'gsap/src/uncompressed/TweenLite';


let delayRender = 0;
let focusPlan = 1;
let w = 550, h = 550;
let p_w = 295, p_h = 322;
let allLoaded = false;
let app = new PIXI.Application(
  w, h,
  {
    transparent : true,
    antialias: true,
    // autoResize: true,
    // resolution: window.devicePixelRatio || 1,
    view: document.getElementById('platforms')
  }
);
// 防止行動裝置上無法捲動頁面
app.renderer.plugins.interaction.autoPreventDefault = false;

let container = new PIXI.Container();
container.x = w / 2;
container.y = h / 2;
app.stage.addChild(container);

let svg1 = new PIXI.Sprite.fromImage('imgs/material/core-svg-1.svg');
let svg2 = new PIXI.Sprite.fromImage('imgs/material/core-svg-2.svg');
let svg3 = new PIXI.Sprite.fromImage('imgs/material/core-svg-3.svg');
svg1.position.x = svg2.position.x = svg3.position.x = -p_w / 2;
svg1.position.y = svg2.position.y = svg3.position.y = -p_h / 2;

let platform1 = new PIXI.Container();
platform1.addChild(svg1);
platform1.position = {x:-100, y:60};
let platform2 = new PIXI.Container();
platform2.addChild(svg2);
let platform3 = new PIXI.Container();
platform3.addChild(svg3);
platform3.position = {x:100, y:-60};
platform1.alpha = 1;
platform2.alpha = 0.8;
platform3.alpha = 0.5;
container.addChild(platform3);
container.addChild(platform2);
container.addChild(platform1);


function movePlatform() {
  let p1 = container.getChildAt(0);
  let p2 = container.getChildAt(1);
  let p3 = container.getChildAt(2);
  TweenLite.to(p3, 0.5, {alpha:0, y:-60, onComplete:() => {
    container.setChildIndex(p3, 0);
    p3.position = {x:100, y:-120};
    TweenLite.to(p3, 0.5, {alpha:0.5, y:-60});
  }});
  TweenLite.to(p2, 1, {alpha:1, x:-100, y:60, delay:0});
  TweenLite.to(p1, 1, {alpha:0.8, x:0, y:0, delay:0});
  setTimeout(movePlatform, 1000 * 2);
}


app.ticker.add(function(delta) {
  if (!allLoaded && svg1.texture.baseTexture.hasLoaded && svg2.texture.baseTexture.hasLoaded && svg3.texture.baseTexture.hasLoaded) {
    allLoaded = true;
    document.getElementById('platforms').style.opacity = '1';
    setTimeout(movePlatform, 1000 * 2);
  }
});
// app.render();



// Resize
function resizeEvent(event) {
  if(window.innerWidth < 768) {
    if(app.ticker.started) app.ticker.stop();
  } else {
    if(!app.ticker.started) app.ticker.start();
  }
}

window.addEventListener( "resize", resizeEvent);
resizeEvent();
