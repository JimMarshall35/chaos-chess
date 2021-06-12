
function roundedRect(ctx, x, y, width, height, radius, fill = true) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
  if(fill){
  	ctx.fill();
  }
  
}
var pieces_loader = {
	loading_bar_c : null,
	loading_bar_ctx : null,
	loading_bar_border : 10,
	total_models : 6,
	models_loaded : 0,
	models : {
		// unique models to load
		"♔♚" : {url : "models/12926_Wooden_Chess_King_Side_A_v1_l3.obj", geometry : null},
		"♕♛" : {url : "models/12927_Wooden_Chess_Queen_side_A_v1_l3.obj", geometry : null},
		"♗♝" : {url : "models/12929_WoodenChessBishopSideA_v1_l3.obj", geometry : null},
		"♘♞" : {url : "models/12930_WoodenChessKnightSideA_v1_l3.obj", geometry : null},
		"♖♜" : {url : "models/12934_Wooden_Chess_Rook_Side_B_V2_L3.obj", geometry : null},
		"♙♟" : {url : "models/12931_WoodenChessPawnSideA_v1_l3.obj", geometry : null}
	},
	pieces : {
		// references to three.js meshes for each piece
		"a♖" : null,
		"b♘" : null,
		"c♗" : null,
		"♕" : null,
		"♔" : null,
		"f♗" : null,
		"g♘" : null,
		"h♖" : null,

		"a♙" : null,
		"b♙" : null,
		"c♙" : null,
		"d♙" : null,
		"e♙" : null,
		"f♙" : null,
		"g♙" : null,
		"h♙" : null,

		"a♜" : null,
		"b♞" : null,
		"c♝" : null,
		"♛" : null,
		"♚" : null,
		"f♝" : null,
		"g♞" : null,
		"h♜" : null,

		"a♟" : null,
		"b♟" : null,
		"c♟" : null,
		"d♟" : null,
		"e♟" : null,
		"f♟" : null,
		"g♟" : null,
		"h♟" : null
	},
	setupLoadingBar : function(){
		this.loading_bar_c = document.getElementById("loading-bar-canvas");
		this.loading_bar_c.width = window.innerWidth / 2;
		this.loading_bar_c.height = window.innerWidth / 20;
		this.loading_bar_ctx = this.loading_bar_c.getContext("2d");
		this.loading_bar_ctx.fillStyle = '#000000a0';
		this.loading_bar_ctx.lineWidth = 0;
		let title = document.getElementById("title");
		roundedRect(this.loading_bar_ctx,0,0,this.loading_bar_c.width,this.loading_bar_c.height,this.loading_bar_c.height/2);
		this.loading_bar_ctx.lineWidth = 5;
		this.loading_bar_ctx.strokeStyle = 'white';
		roundedRect(this.loading_bar_ctx,0,0,this.loading_bar_c.width,this.loading_bar_c.height,this.loading_bar_c.height/2,false);

	},
	updateLoadingBar : function(){
		let fraction = this.models_loaded / this.total_models;

		this.setupLoadingBar();
		this.loading_bar_ctx.fillStyle = 'white';
		this.loading_bar_ctx.strokeStyle = 'white';
		let o = this.loading_bar_border;
		roundedRect(this.loading_bar_ctx,
					o,
					o,
					this.loading_bar_c.width*fraction - o*2,
					this.loading_bar_c.height - o*2,
					this.loading_bar_c.height/2 - o
		);
	},
	load : function(){
		this.setupLoadingBar();
		this.numfiles = Object.entries(this.models);
		for (const [key, val] of Object.entries(this.models)) {
			const loader = new THREE.OBJLoader();
			loader.load(
				// resource URL
				val.url,
				// called when resource is loaded
				( object ) => {
					let child = object.children[0];
					// set to correct scale  and center on origin
					child.geometry.center();
					child.geometry.computeBoundingSphere();
					let scalefac = (square_dims/2)/child.geometry.boundingSphere.radius;
					child.scale.x *= scalefac;
					child.scale.y *= scalefac;
					child.scale.z *= scalefac;
					child.position.z += square_dims;

					//store loaded model
					pieces_loader.models[key].geometry = child;
					
					//increment models_loaded counter, if loading complete call makeGameObjects
					pieces_loader.models_loaded++;
					this.updateLoadingBar();
					if(pieces_loader.models_loaded >= pieces_loader.total_models){
						pieces_loader.makeGameObjects();
						onReady();
					}


				},
				// called when loading is in progresses
				function ( xhr ) {

					console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

				},
				// called when loading has errors
				function ( error ) {

					console.log( error );

				}
			)
		}
	},
	makeGameObjects : function(){
		// generate a full set of pieces as three.js meshes and store in this.pieces
		let getGeom = function(piecename){
			let piece_character;
			for(let i=0; i<piecename.length; i++){
				if(white_pieces.includes(piecename[i]) || black_pieces.includes(piecename[i])){
					piece_character = piecename[i];
					break;
				}
			}
			for (let [key, val] of Object.entries(pieces_loader.models)) {
				if(key.includes(piece_character)){
					return val.geometry.clone();
				}
			}
		}
		let getMaterial = function(piecename){
			for(let i=0; i<black_pieces.length; i++){
				if(piecename.includes(black_pieces[i])){
					return material1;
				}
			}
			for(let i=0; i<white_pieces.length; i++){
				if(piecename.includes(white_pieces[i])){
					return material2;
				}
			}
		}
		for (let [key, val] of Object.entries(this.pieces)) {
			console.log(key);
			let geom = getGeom(key);
			let material = getMaterial(key);
			geom.material = material;
			geom.frustumCulled = false;
			geom.userData = {
				type : OBJ_TYPE.PIECE
			}
			scene.add(geom);
			//meshes.push(geom);
			this.pieces[key] = geom;
		}
		// set pieces in their initial state
		setPositions(initial_state.pieces);
	}
}




















