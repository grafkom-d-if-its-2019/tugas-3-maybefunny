(function() {
	glUtils.SL.init({ callback: function() { main(); }});
	function main() {
		var canvas = document.getElementById("glcanvas");
		var gl = glUtils.checkWebGL(canvas);
		var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
		var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
		var program = glUtils.createProgram(gl, vertexShader, fragmentShader);
		gl.useProgram(program);
		
		var matrixLocation = gl.getUniformLocation(program, "vMatrix");
		
		// Generic format
		function drawA(type, vertices) {
			var n = initBuffers(vertices);
			if (n < 0) {
				console.log('Failed to set the positions of the vertices');
				return;
			}
			gl.drawArrays(type, 0, n);
		}
		
		function initBuffers(vertices){
			var n = vertices.length / 5;
			// Membuat vertex buffer object (CPU Memory <==> GPU Memory)
			var vertexBufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
			// Membuat sambungan untuk attribute
			var vPosition = gl.getAttribLocation(program, 'vPosition');
			var vColor = gl.getAttribLocation(program, 'vColor');
			gl.vertexAttribPointer(
				vPosition,    // variabel yang memegang posisi attribute di shader
				2,            // jumlah elemen per atribut
				gl.FLOAT,     // tipe data atribut
				gl.FALSE, 
				5 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks (overall) 
				0                                   // offset dari posisi elemen di array
				);
			gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE,
				5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
			gl.enableVertexAttribArray(vPosition);
			gl.enableVertexAttribArray(vColor);
			return n;
		}
				
		// Mendefinisikan verteks-verteks
		var Outline = [
			// x, y       r, g, b
			-0.2, -0.55,		1.0, 1.0, 0.0,  // kuning
			-0.2, 0.55,		0.0, 1.0, 1.0,  // cyan
			0.1, 0.55,		1.0, 0.0, 1.0,   // magenta
			0.2, 0.4,		1.0, 0.0, 1.0,   // magenta
			0.2, -0.4,		0.0, 1.0, 1.0,  // cyan
			0.1, -0.55,		1.0, 1.0, 0.0,  // kuning
		];
		var Black = [
			// x, y       r, g, b
			-0.2, -0.55,	0.0, 0.0, 0.0,	// black
			-0.2, 0.55,		0.0, 0.0, 0.0,	// black
			0.1, 0.55,		0.0, 0.0, 0.0,	// black
			0.2, 0.4,		0.0, 0.0, 0.0,	// black
			0.2, -0.4,		0.0, 0.0, 0.0,	// black
			0.1, -0.55,		0.0, 0.0, 0.0,	// black
		];

		var flag = 1;
		var theta = 0; // rotation angle in radian
		var scaleX = 1;
		var scaleY = 1;

		function render(){
			theta -= 0.0063;
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT);

			// Draw the outline version
			var matrix = m3.identity();
			matrix = m3.translate(matrix, -0.5, 0);
			matrix = m3.rotate(matrix, theta);
			matrix = m3.scale(matrix, 0.8, 0.6);
			gl.uniformMatrix3fv(matrixLocation, false, matrix);
			drawA(gl.LINE_LOOP, Outline);

			matrix = m3.scale(matrix, 0.3, 0.5);
			gl.uniformMatrix3fv(matrixLocation, false, matrix);
			drawA(gl.LINE_LOOP, Outline)

			if(!flag){
				scaleX += 0.0063;
			}else{
				scaleX -= 0.0063;
			}
			if(scaleX>=1){
				flag = 1;
			}else if(scaleX <= -1){
				flag = 0;
			}

			// Draw the filled version
			matrix = m3.identity();
			matrix = m3.translate(matrix, 0.5, 0);
			matrix = m3.scale(matrix, scaleX, scaleY);
			matrix = m3.scale(matrix, 0.8, 0.6);
			gl.uniformMatrix3fv(matrixLocation, false, matrix);
			drawA(gl.TRIANGLE_FAN, Outline);

			matrix = m3.scale(matrix, 0.3, 0.5);
			gl.uniformMatrix3fv(matrixLocation, false, matrix);
			drawA(gl.TRIANGLE_FAN, Black)

			// drawA(gl.TRIANGLES, vertices1);
			requestAnimationFrame(render)
		}
		
		render()
	}
	var m3 = {
		projection: function(width, height) {
			// Note: This matrix flips the Y axis so that 0 is at the top.
			return [
				2 / width, 0, 0,
				0, -2 / height, 0,
				-1, 1, 1
			];
		},
		
		identity: function() {
			return [
				1, 0, 0,
				0, 1, 0,
				0, 0, 1,
			];
		},
		
		translation: function(tx, ty) {
			return [
				1, 0, 0,
				0, 1, 0,
				tx, ty, 1,
			];
		},
		
		rotation: function(angleInRadians) {
			var c = Math.cos(angleInRadians);
			var s = Math.sin(angleInRadians);
			return [
				c,-s, 0,
				s, c, 0,
				0, 0, 1,
			];
		},
		
		scaling: function(sx, sy) {
			return [
				sx, 0, 0,
				0, sy, 0,
				0, 0, 1,
			];
		},
		
		multiply: function(a, b) {
			var a00 = a[0 * 3 + 0];
			var a01 = a[0 * 3 + 1];
			var a02 = a[0 * 3 + 2];
			var a10 = a[1 * 3 + 0];
			var a11 = a[1 * 3 + 1];
			var a12 = a[1 * 3 + 2];
			var a20 = a[2 * 3 + 0];
			var a21 = a[2 * 3 + 1];
			var a22 = a[2 * 3 + 2];
			var b00 = b[0 * 3 + 0];
			var b01 = b[0 * 3 + 1];
			var b02 = b[0 * 3 + 2];
			var b10 = b[1 * 3 + 0];
			var b11 = b[1 * 3 + 1];
			var b12 = b[1 * 3 + 2];
			var b20 = b[2 * 3 + 0];
			var b21 = b[2 * 3 + 1];
			var b22 = b[2 * 3 + 2];
			return [
				b00 * a00 + b01 * a10 + b02 * a20,
				b00 * a01 + b01 * a11 + b02 * a21,
				b00 * a02 + b01 * a12 + b02 * a22,
				b10 * a00 + b11 * a10 + b12 * a20,
				b10 * a01 + b11 * a11 + b12 * a21,
				b10 * a02 + b11 * a12 + b12 * a22,
				b20 * a00 + b21 * a10 + b22 * a20,
				b20 * a01 + b21 * a11 + b22 * a21,
				b20 * a02 + b21 * a12 + b22 * a22,
			];
		},
		
		translate: function(m, tx, ty) {
			return m3.multiply(m, m3.translation(tx, ty));
		},
		
		rotate: function(m, angleInRadians) {
			return m3.multiply(m, m3.rotation(angleInRadians));
		},
		
		scale: function(m, sx, sy) {
			return m3.multiply(m, m3.scaling(sx, sy));
		},
	};
})();