/**
 * @author diode / http://vipin.live/
 */

 // ES6 Class App
class WebGLStarterKit {
  constructor(canvas, vsCode, fsCode) {
    /* Get the canvas */
    this.canvas = document.getElementById(canvas);

    /* Get shader scipts */
    this.vsCode = document.getElementById(vsCode);
    this.fsCode = document.getElementById(fsCode);

    /* Get webgl context */
    this.webGL = this.canvas.getContext('webgl') ||
        this.canvas.getContext('experimental-webgl');
  }

  start() {

    let vertices = [
      // Front face
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      // Back face
      -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
      // Top face
      -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
      // Bottom face
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
      // Right face
      1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
      // Left face
      -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];

    let textureXY = [
      // Front face
      0.0, 0.0, 1.0, 0.0,
      1.0, 1.0, 0.0, 1.0,
      // Back face
      1.0, 0.0, 1.0, 1.0,
      0.0, 1.0, 0.0, 0.0,
      // Top face
      0.0, 1.0, 0.0, 0.0,
      1.0, 0.0, 1.0, 1.0,
      // Bottom face
      1.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 0.0,
      // Right face
      1.0, 0.0, 1.0, 1.0,
      0.0, 1.0, 0.0, 0.0,
      // Left face
      0.0, 0.0, 1.0, 0.0,
      1.0, 1.0, 0.0, 1.0,
    ];

    let indices = [
      0, 1, 2, 0, 2, 3, // Front face
      4, 5, 6, 4, 6, 7, // Back face
      8, 9, 10, 8, 10, 11, // Top face
      12, 13, 14, 12, 14, 15, // Bottom face
      16, 17, 18, 16, 18, 19, // Right face
      20, 21, 22, 20, 22, 23 // Left face
    ];

    this.createShaderProgram(this.vsCode.text, this.fsCode.text,
                              "coordinates", "texture", "sampler",
                              "rotXMatrix", "rotYMatrix", "rotZMatrix",
                              "projMatrix", "viewMatrix"
                          );

    this.cubeVertexSize = 3;
    this.cubeVertexCount = 24;
    this.textureVertexSize = 2;
    this.textureVertexCount = 24;
    this.cubeIndexSize = 1;
    this.cubeIndexCount = 36;
    this.setShaderBuffers(vertices, indices, textureXY);

    this.setTexture("/resources/code/webgl/rotating-cube-texture/logo.png");

    // Rotation parameters
    this.transform = {
      rx: 0,
      ry: 0,
      rz: 0,
      rt: "rx" // current axis
    };

    this.webGL.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.redraw(0);

  }

  // rotate function that is recursevely called
  redraw(count) {

    let webGL = this.webGL;


    this.setStage();
    this.set3D();

    // change axis
    if (count % 100 == 0) {
      let rand = Math.random() * 91;
      if (rand > 30) {
        this.transform.rt = "ry";
      }
      if (rand > 60) {
        this.transform.rt = "rz";
      }
    }
    // update current rotation
    this.transform[this.transform.rt] += Math.PI / 120;
    // update transformation
    this.setTransformations();

    /* DRAW SOMETHING HERE !!! */
    if(this.simpleTexture){ // draw only if texture is loaded
      webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexBuffer);
      webGL.vertexAttribPointer(this.attribs.coords, this.cubeVertexSize,
                                                      webGL.FLOAT, false, 0, 0);

      webGL.bindBuffer(webGL.ARRAY_BUFFER, this.textureBuffer);
      webGL.vertexAttribPointer(this.attribs.texture, this.textureVertexSize,
                                                      webGL.FLOAT, false, 0, 0);

      webGL.activeTexture(webGL.TEXTURE0);
      webGL.bindTexture(webGL.TEXTURE_2D, this.simpleTexture);
      webGL.uniform1i(this.attribs.sampler, 0);

      webGL.bindBuffer(webGL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      webGL.drawElements(webGL.TRIANGLES, this.cubeIndexCount,
                                                      webGL.UNSIGNED_SHORT, 0);
    }

    // invoke `redraw` again after a delay
    window.requestAnimationFrame(() => {
      this.redraw(++count);
    });

  }


  /* Set up 3D projetion and set zoom level */
  set3D() {
    let webGL = this.webGL;
    let shaderProgram = this.shaderProgram;

    let projMatrix = ((angle, a, zMin, zMax) => {
        let ang = Math.tan((angle * .5) * Math.PI / 180); //angle*.5
        return [
            0.5 / ang, 0, 0, 0,
            0, 0.5 * a / ang, 0, 0,
            0, 0, -(zMax + zMin) / (zMax - zMin), -1,
            0, 0, (-1 * zMax * zMin) / (zMax - zMin), 0
        ];
    })(30, this.canvas.width / this.canvas.height, 1, 100);

    let viewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    // zoom
    viewMatrix[14] = viewMatrix[14] - 4;

    webGL.uniformMatrix4fv(this.attribs.projMatrix, false, projMatrix);
    webGL.uniformMatrix4fv(this.attribs.viewMatrix, false, viewMatrix);

  }

  /* APPLY TRANSFORMATION */
  setTransformations(rx = this.transform.rx,
    ry = this.transform.ry, rz = this.transform.rz) {
    let webGL = this.webGL;
    let shaderProgram = this.shaderProgram;

    // rotation about X axis
    let rotXMatrix = new Float32Array([
        1, 0, 0, 0,
        0, Math.cos(rx), Math.sin(rx), 0,
        0, -Math.sin(rx), Math.cos(rx), 0,
        0, 0, 0, 1
    ]);

    // rotation about Y axis
    let rotYMatrix = new Float32Array([
        Math.cos(ry), 0, -Math.sin(ry), 0,
        0, 1, 0, 0,
        Math.sin(ry), 0, Math.cos(ry), 0,
        0, 0, 0, 1
    ]);

    // rotation about Z axis
    let rotZMatrix = new Float32Array([
        Math.cos(rz), -Math.sin(rz), 0, 0,
        Math.sin(rz), Math.cos(rz), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

    // apply rotation via shader program
    webGL.uniformMatrix4fv(this.attribs.rotXMatrix, false, rotXMatrix);
    webGL.uniformMatrix4fv(this.attribs.rotYMatrix, false, rotYMatrix);
    webGL.uniformMatrix4fv(this.attribs.rotZMatrix, false, rotZMatrix);

  }



  /***********************************************************/
  /*     Play with start and draw funtions above.            */
  /*     Forget about the code below for the time being.     */
  /*     But do explore when you are ready (Y)               */
  /***********************************************************/


  /* Create and compile Shader programs */
  createShaderProgram(vShaderCode, fShaderCode,
                coordinatesParam, textureParam, samplerParam,
                rotXParam, rotYParam, rotZParam,
                projectionParam, viewParam) {

    let webGL = this.webGL;
    //Create a vertex shader object
    //Attach vertex shader source code
    //Compile the vertex shader
    let vertShader = webGL.createShader(webGL.VERTEX_SHADER);
    webGL.shaderSource(vertShader, vShaderCode);
    webGL.compileShader(vertShader);

    // Create fragment shader object
    // Attach fragment shader source code
    // Compile the fragment shader
    let fragShader = webGL.createShader(webGL.FRAGMENT_SHADER);
    webGL.shaderSource(fragShader, fShaderCode);
    webGL.compileShader(fragShader);

    // Create a shader program object to store combined shader program
    // Attach a vertex shader
    // Attach a fragment shader
    // Link both programs
    // Use the combined shader program object
    let shaderProgram = webGL.createProgram();
    webGL.attachShader(shaderProgram, vertShader);
    webGL.attachShader(shaderProgram, fragShader);
    webGL.linkProgram(shaderProgram);
    webGL.useProgram(shaderProgram);

    this.attribs = {};

    this.attribs.coords = webGL.getAttribLocation(shaderProgram,
                                                          coordinatesParam);
    webGL.enableVertexAttribArray(this.attribs.coords);

    this.attribs.texture = webGL.getAttribLocation(shaderProgram,
                                                              textureParam);
    webGL.enableVertexAttribArray(this.attribs.texture);

    this.attribs.sampler = webGL.getUniformLocation(shaderProgram,
                                                              samplerParam);

    this.attribs.projMatrix = webGL.getUniformLocation(shaderProgram,
                                                           projectionParam);
    this.attribs.viewMatrix = webGL.getUniformLocation(shaderProgram,
                                                                 viewParam);

    this.attribs.rotXMatrix = webGL.getUniformLocation(shaderProgram,
                                                                 rotXParam);
    this.attribs.rotYMatrix = webGL.getUniformLocation(shaderProgram,
                                                                 rotYParam);
    this.attribs.rotZMatrix = webGL.getUniformLocation(shaderProgram,
                                                                 rotZParam);

    this.shaderProgram = shaderProgram;
  }

  /* Associate the shader programs to buffer objects */
  setShaderBuffers(vertices, indices, textureXY) {
    let webGL = this.webGL;
    let shaderProgram = this.shaderProgram;

    this.vertexBuffer = webGL.createBuffer();
    webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexBuffer);
    webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(vertices),
                                                         webGL.STATIC_DRAW);

    this.textureBuffer = webGL.createBuffer();
    webGL.bindBuffer(webGL.ARRAY_BUFFER, this.textureBuffer);
    webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(textureXY),
                                                         webGL.STATIC_DRAW);

    this.indexBuffer = webGL.createBuffer();
    webGL.bindBuffer(webGL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    webGL.bufferData(webGL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),
                                                         webGL.STATIC_DRAW);

  }

  setTexture(imageUrl) {
    let webGL = this.webGL;
    let texture = webGL.createTexture();
    let image = new Image();
    image.onload = () => {
      webGL.bindTexture(webGL.TEXTURE_2D, texture);
      webGL.pixelStorei(webGL.UNPACK_FLIP_Y_WEBGL, true);
      webGL.texImage2D(webGL.TEXTURE_2D, 0, webGL.RGBA, webGL.RGBA,
                                               webGL.UNSIGNED_BYTE, image);
      webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MAG_FILTER,
                                                            webGL.NEAREST);
      webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MIN_FILTER,
                                                            webGL.NEAREST);
      webGL.bindTexture(webGL.TEXTURE_2D, null);
      this.simpleTexture = texture;
    }

    image.src = imageUrl;
  }

  /* Clear stage and set a background color */
  setStage([red, green, blue, alpha] = [1.0, 1.0, 1.0, 1.0]) {
    let webGL = this.webGL;
    // Clear the canvas
    // Enable the depth test
    // Clear the color buffer bit
    // Set the view port
    webGL.enable(webGL.DEPTH_TEST);
    webGL.depthFunc(webGL.LEQUAL);
    webGL.clearColor(red, green, blue, alpha);
    webGL.clearDepth(1.0);
    webGL.clear(webGL.COLOR_BUFFER_BIT | webGL.DEPTH_BUFFER_BIT);

  }
}

// instatiate WebGLStarterKit
var starterKit = new WebGLStarterKit("expCanvas", "vertexShaderCode",
  "fragmentShaderCode");
starterKit.start();
