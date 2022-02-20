var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
var container = document.getElementById( 'waves' );
var camera, scene, renderer, stats;
var particles, particle, count = 0;
var play = true;
var mouseX = 0, mouseY = 0;
var windowHalfX = container.offsetWidth / 2;
var windowHalfY = container.offsetHeight / 2;


export function WavesInit({bgColor, particlesColor}) {

	camera = new THREE.PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 1, 10000 );
	camera.position.x = 200;
	camera.position.y = 250;
	camera.position.z = 1000;

	scene = new THREE.Scene();
	particles = new Array();

	let PI2 = Math.PI * 2;
  let canvas = document.createElement('canvas');
  let size = 128;
  canvas.width = size;
  canvas.height = size;
  let context = canvas.getContext('2d');
  context.fillStyle = Detector.webgl ? '#ffffff' : '#515151';
  context.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
  context.fill();
  let spriteMap = new THREE.CanvasTexture(canvas);
  spriteMap.needsUpdate = true;

	let material = new THREE.SpriteMaterial( {
		color: particlesColor,
    map: spriteMap,
		alphaTest: 0.5
	} );
	material.opacity = 0.5;

	let i = 0;

	for ( let ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( let iy = 0; iy < AMOUNTY; iy ++ ) {
			particle = particles[ i ++ ] = new THREE.Sprite( material );
			particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
			particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
			scene.add( particle );
		}
	}

	renderer =  Detector.webgl ? new THREE.WebGLRenderer({ antialias: true, alpha:true }): new THREE.CanvasRenderer({alpha:true });
	// renderer = new THREE.CanvasRenderer({alpha:true });
	// renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( container.offsetWidth, container.offsetHeight );
  // renderer.setClearColor( bgColor, 1 );
  renderer.setClearColor( 0x000000, 0 );
	container.appendChild( renderer.domElement );

  // stats = new Stats();
  // container.appendChild( stats.dom );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	window.addEventListener( 'resize', onWindowResize, false );
  animate();
	render();
	onWindowResize();
}


function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}


function animate() {
	requestAnimationFrame( animate );
  // stats.begin();
  if(play) render();
  // stats.end();
}

function render() {
	camera.position.x += ( mouseX - camera.position.x ) * .05;
  let _mouseY = mouseY > 240 ? 240 : mouseY < -240 ? -240 : mouseY;
	camera.position.y += ( - (_mouseY - 400) - camera.position.y ) * .05;
	camera.lookAt( scene.position );

	let i = 0;
	for ( let ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( let iy = 0; iy < AMOUNTY; iy ++ ) {
			particle = particles[ i++ ];
			particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) +
				( Math.sin( ( iy + count ) * 0.5 ) * 50 );
			particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 4 +
				( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 4;
		}
	}
	renderer.render( scene, camera );
	count += 0.1;
}


function onWindowResize() {
  let w = container.offsetWidth;
	let h = container.offsetHeight;
	windowHalfX = w / 2;
	windowHalfY = h / 2;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize( w, h );
  if(window.innerWidth < 768) {
    play = false;
  } else {
    play = true;
  }
}

document.getElementById('waves').style.opacity = '1';
