(function(){

	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;
	var FLOOR = -250;
	
	var container, stats;
	
	var camera, scene;
	
	init();
	
	function init() {

		container = document.getElementById( 'container' );

		camera = new THREE.PerspectiveCamera( 30, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
		camera.position.z = 700;

		scene = new THREE.Scene();

		scene.fog = new THREE.Fog( 0xffffff, 2000, 10000 );

		scene.add( camera );

		// GROUND

		var groundMaterial = new THREE.MeshPhongMaterial( { emissive: 0xbbbbbb } );
		var planeGeometry = new THREE.PlaneGeometry( 16000, 16000 );

		var ground = new THREE.Mesh( planeGeometry, groundMaterial );
		ground.position.set( 0, FLOOR, 0 );
		ground.rotation.x = -Math.PI/2;
		scene.add( ground );

		ground.receiveShadow = true;


		// LIGHTS

		var ambient = new THREE.AmbientLight( 0xffffff );
		ambient = new THREE.AmbientLight( 0xff0000 );
		scene.add( ambient );


		var light = new THREE.DirectionalLight( 0xebf3ff, 1.6 );
		light.position.set( 0, 140, 500 ).multiplyScalar( 1.1 );
		scene.add( light );

		light.castShadow = true;

		light.shadowMapWidth = 2048;
		light.shadowMapHeight = 2048;

		var d = 390;

		light.shadowCameraLeft = -d * 2;
		light.shadowCameraRight = d * 2;
		light.shadowCameraTop = d * 1.5;
		light.shadowCameraBottom = -d;

		light.shadowCameraFar = 3500;
		//light.shadowCameraVisible = true;

				//

		var light = new THREE.DirectionalLight( 0x497f13, 1 );
		light.position.set( 0, -1, 0 );
		scene.add( light );

		// RENDERER
				
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
		renderer.domElement.style.position = "relative";

		renderer.setClearColor( scene.fog.color, 1 );

		container.appendChild( renderer.domElement );

		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.physicallyBasedShading = true;

		renderer.shadowMapEnabled = true;


		// STATS

		stats = new Stats();
		container.appendChild( stats.domElement );

		//


		window.addEventListener( 'resize', onWindowResize, false );
		
		function onWindowResize() {

			windowHalfX = window.innerWidth / 2;
			windowHalfY = window.innerHeight / 2;

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}
	}

})()