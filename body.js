var m_arr;
(function(){

	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;
	var FLOOR = -250;
	
	var container, stats;
	
	var camera, scene;
	var renderer;
	var morph, materials_arr = m_arr = [];
	var mesh_arr = [];
	
	var mesh;
	
	var mouseX = 0, mouseY = 0;
	
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	
	var clock = new THREE.Clock();
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
	function onDocumentMouseMove( event ) {

		mouseX = ( event.clientX - windowHalfX );
		mouseY = ( event.clientY - windowHalfY );

	}
	
	init();
	
	animate();
	
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

		var loader = new THREE.JSONLoader();
		//loader.load( "./three.js webgl - skinning + morphing [knight]_files/knight.js", function ( geometry, materials ) { createScene( geometry, materials, 0, FLOOR, -300, 60 ) } );
				
		//easy
		//loader.load( "./three.js webgl - skinning + morphing [knight]_files/wholeman.js", function ( geometry, materials ) { createScene( geometry, materials, 0, FLOOR, -300, 60 ) } );
				
		//wholeman_onlyBody
		loader.load( "./javascripts/wholeman_skeletal_5231.js", function ( geometry, materials ) { createScene( geometry, materials, 0, FLOOR, -300, 60 ) } );
		loader.load( "./javascripts/wholeman_muscular_5231.js", function ( geometry, materials ) { createScene( geometry, materials, 0, FLOOR, -300, 60 , addController) } );
		
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
	
	function setMaterialsOpacity( materials, opacity){
		for( var i = 0, len = materials.length; i < len; i++){	
			var material = materials[ i ];
			if( opacity === 0){
				//material.visible = false;
			}
			else{
				material.visible = true;
				material.opacity = opacity;
			}
		}
	}
	
	function createScene( geometry, materials, x, y, z, s , callback) {
				
		var muscular_materials = [], other_materials = [];
		for( var i = 0, len = materials.length; i < len; i++){
			if( materials[ i].name.indexOf( "Muscular") !== -1){
			//if( materials[ i].name.indexOf( "Skeletal_Skeleton") == -1){
				muscular_materials.push( materials[ i]);
			}
			else{
				other_materials.push( materials[ i]);
			}
		}
		if( muscular_materials.length){
			materials_arr.push( muscular_materials);
		}
		
		var material = materials[ 0 ];
		/*
		material.morphTargets = true;
		material.color.setHex( 0xffaaaa );
		material.ambient.setHex( 0x222222 );
		*/
		for( var i = 0, len = materials.length; i < len; i++){	
			material = materials[ i ];
			material.morphTargets = true;
			material.transparent = true;
			material.color.setHex( 0xffaaaa );
			material.ambient.setHex( 0x222222 );
			material.fog = false;
			//material.alphaTest = 0.9;
			//material.depthWrite = false;
		}
		console.log( materials[1]);
				
		//material.needsUpdate = true;
		geometry.buffersNeedUpdate = true;
		geometry.uvsNeedUpdate = true;
				
				
		var faceMaterial = new THREE.MeshFaceMaterial( materials );

		//morph = new THREE.MorphAnimMesh( geometry, faceMaterial );
		morph = new THREE.Mesh( geometry, faceMaterial );
		
		//morph.computeTangents();
		// one second duration

		morph.duration = 1000;

		// random animation offset

		morph.time = 1000 * Math.random();

		morph.scale.set( s, s, s );

		//morph.position.set( x, 0, z );
		morph.position.set( x, -249.5544394, z);
		//morph.rotation.y = THREE.Math.randFloat( -0.25, 0.25 );

		//morph.matrixAutoUpdate = false;
		morph.updateMatrix();
		//morph.castShadow = true;
		morph.receiveShadow = true;
		
		scene.add( morph );
		console.log( scene);
		morph.morphTargetInfluences[ 0] = 1;
		console.log( morph.morphTargetInfluences);
		
		mesh_arr.push( morph);
		/*
		var cubeGeometry = new THREE.CubeGeometry(150, 150, 150); 
		var cubeMaterials = [ 
                     new THREE.MeshBasicMaterial({color:0xFF0000}), 
                     new THREE.MeshBasicMaterial({color:0x00FF00}), 
                     new THREE.MeshBasicMaterial({color:0x0000FF}), 
                     new THREE.MeshBasicMaterial({color:0xFFFF00}), 
                     new THREE.MeshBasicMaterial({color:0x00FFFF}), 
                     new THREE.MeshBasicMaterial({color:0xFFFFFF}) 
                 ]; 
  
                 // Create a MeshFaceMaterial, which allows the cube to have different materials on 
                 // each face 
                 var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials); 
  
                 // Create a mesh and insert the geometry and the material. Translate the whole mesh 
                 // by 1.5 on the x axis and by 4 on the z axis and add the mesh to the scene. 
                 cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial); 
                 cubeMesh.position.set( x, -100, z); 
                 scene.add(cubeMesh); 
		*/
		
		if( callback) callback();
	}
	
	function animate() {

		requestAnimationFrame( animate );

		render();
		stats.update();

	}
	
	function render() {

		var delta = 0.75 * clock.getDelta();
		//camera.position.x += ( mouseX - camera.position.x ) * .05;
		//camera.position.y = THREE.Math.clamp( camera.position.y + ( - mouseY - camera.position.y ) * .05, 0, 1000 );
		//camera.position.z += 1;
		//camera.position.x += 1;
		
		//camera.lookAt( scene.position );

				// update skinning

		THREE.AnimationHandler.update( delta );

				// update morphs

		if ( morph ) {

			var time = Date.now() * 0.001;
			
			//morph.updateAnimation( 500 * delta );

		}

		renderer.render( scene, camera );

	}
	
	function changeMeshArrPosition( index, value){
		for( var i = 0, len = mesh_arr.length; i < len; i++){
			mesh_arr[ i].position[ index] += value;
		}
	}
	function changeMeshArrRotation( index, value){
		for( var i = 0, len = mesh_arr.length; i < len; i++){
			mesh_arr[ i].rotation[ index] += value;
		}
	}
	function setMeshArrTargetInfluences( index, value){
		for( var i = 0, len = mesh_arr.length; i < len; i++){
			mesh_arr[ i].morphTargetInfluences[ index] = value;
		}
	}
	
	function addController(){
		var loading = document.getElementById("loading");
		loading.parentNode.removeChild( loading);
		//操纵按钮
		var btns = document.getElementById("controller").getElementsByTagName("span");
		btns[ 0].addEventListener( "click", function(){
			//morph.position.y += 50;
			//camera.position.y -= 50;
			changeMeshArrPosition( 'y', 50);
		}, false);
		btns[ 1].addEventListener( "click", function(){
			//morph.rotation.y -= 0.1;
			changeMeshArrRotation( 'y', -0.1);
		}, false);
		btns[ 3].addEventListener( "click", function(){
			//morph.rotation.y += 0.1;
			changeMeshArrRotation( 'y', 0.1);
		}, false);
		btns[ 4].addEventListener( "click", function(){
			//morph.position.y -= 50;
			changeMeshArrPosition( 'y', -50);
		}, false);
		btns[ 5].addEventListener( "click", function(){
			camera.position.z -= 50;
		}, false);
		btns[ 6].addEventListener( "click", function(){
			camera.position.z += 50;
		}, false);
		
		//鼠标拖拽
		var mousedown = false;
		var startX, startY;
		container.addEventListener( "mousedown", function( event){
			mousedown = true;
			startX = event.clientX;
			startY = event.clientY;
		}, false);
		container.addEventListener( "mousemove", function( event){
			if( mousedown){
				//morph.rotation.y -= ( startX - event.clientX)*0.05;
				//morph.position.y += ( startY - event.clientY);
				changeMeshArrRotation( 'y', -( startX - event.clientX)*0.05);
				changeMeshArrPosition( 'y', startY - event.clientY);
				startX = event.clientX;
				startY = event.clientY;
			}
		}, false);
		container.addEventListener( "mouseup", function( event){
			mousedown = false;
		}, false);
		
		//滚动放大缩小
		var wheelHandler = function( event){
			var delta = 0;  
			if (!event) /* For IE. */  
		 
			event = window.event;  
			if (event.wheelDelta) { /* IE/Opera. */  
				delta = event.wheelDelta / 120;  
			} else if (event.detail) {  
				delta = -event.detail / 3;  
			}  
			if( delta > 0){
				camera.position.z -= 40;
			}
			else if( delta < 0){
				camera.position.z += 40;
			}
			if (event.preventDefault)  
				event.preventDefault();  
			event.returnValue = false;  
		}
		container.addEventListener('DOMMouseScroll', wheelHandler, false);
		container.onmousewheel = wheelHandler;
		
		//拖动调节透明度
		var layer_btn = document.getElementById( "layer_btn");
		var layer_btn_drag = false;
		var layer_btn_startY;
		layer_btn.addEventListener( "mousedown", function( event){
			layer_btn_drag = true;
			layer_btn_startY = event.clientY;
		}, false);
		document.addEventListener( "mousemove", function( event){
			if( layer_btn_drag){
				var top = parseInt( layer_btn.style.top);
				if( !top) top = 0;
				top += event.clientY - layer_btn_startY;
				if( top >= 0 && top <= 180){
					layer_btn.style.top = top + "px";
					setMaterialsOpacity( materials_arr[0], ( 180 - top) / 180);
				}
				layer_btn_startY = event.clientY;
			}
		}, false);
		document.addEventListener( "mouseup", function(){
			layer_btn_drag = false;
		}, false);
		document.addEventListener( "mouseleave", function(){
			layer_btn_drag = false;
		}, false);
		
		//拖动调节动画
		var animation_btn = document.getElementById( "animation_btn");
		var animation_btn_drag = false;
		var animation_btn_startY;
		var lastKeyframe = 0;
		animation_btn.addEventListener( "mousedown", function( event){
			animation_btn_drag = true;
			animation_btn_startY = event.clientY;
		}, false);
		document.addEventListener( "mousemove", function( event){
			if( animation_btn_drag){
				var top = parseInt( animation_btn.style.top);
				if( !top) top = 0;
				top += event.clientY - animation_btn_startY;
				if( top >= 0 && top <= 80){
					animation_btn.style.top = top + "px";
					var keyframes = morph.morphTargetInfluences.length - 1;// total number of animation frames
					//morph.morphTargetInfluences[ lastKeyframe] = 0;
					setMeshArrTargetInfluences( lastKeyframe, 0);
					lastKeyframe = parseInt( keyframes * ( top / 80));
					//morph.morphTargetInfluences[ lastKeyframe] = 1;
					setMeshArrTargetInfluences( lastKeyframe, 1);
				}
				animation_btn_startY = event.clientY;
				//morph.morphTargetInfluences[ 12] = 1;
				//console.log( lastKeyframe+','+keyframes);
			}
		}, false);
		document.addEventListener( "mouseup", function(){
			animation_btn_drag = false;
		}, false);
		document.addEventListener( "mouseleave", function(){
			animation_btn_drag = false;
		}, false);
	}
})()
