///// p5.js /////
let mask, p1, p2;

function preload(){
  mask = 
    'https://cdn.glitch.me/74d65185-560d-4616-846c-3fed0aa91728%2Fparticle_texture.jpg?v=1633514017973'
  ;
  p1 = 
    'https://cdn.glitch.me/74d65185-560d-4616-846c-3fed0aa91728%2FScreen%20Shot%202021-10-05%20at%203.30.11%20PM.png?v=1633516133601'
  ;
}

function setup() {
  let canvas = createCanvas(1, 1);
  canvas.parent("container-p5");
  canvas.hide();
  new Particle();
}

function draw() {

}
///// three.js /////

class Particle{
  constructor(){
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor("#fffffc");
    document.getElementById("container-three").appendChild( this.renderer.domElement);
    
    this.camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.1, 3000);
    this.camera.position.z = 1000;
    this.scene = new THREE.Scene();
    // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.textures = [
      new THREE.TextureLoader().load(p1)
    ];
    this.mask = new THREE.TextureLoader().load(mask);
    this.time = 0;
    this.move = 0;
    this.mouseEffects();
    this.addMesh();
    this.render();
    this.onWindowResize();
  }
  
  
  mouseEffects(){
    document.addEventListener('mousewheel', (e)=>{
      // console.log(e.wheelDeltaY);
      this.move += e.wheelDeltaY/1500;
    })
  }
    
  addMesh(){
    this.material = new THREE.ShaderMaterial( {
      fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
      vertexShader: document.getElementById( 'vertexshader' ).textContent,
      uniforms: {
        progress: {type: "f", value: 0},
        p1: {type: "t", value: this.textures[0]},
        mask: {type: "t", value: this.mask},
        move: {type: "f", value: 0},
        time: {type: "f", value: 0}
      },
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: true
    } );
    
    let number = 600*500;
    
    this.geometry = new THREE.BufferGeometry( );
    this.positions = new THREE.BufferAttribute(new Float32Array(number*3), 3);
    this.coordinates = new THREE.BufferAttribute(new Float32Array(number*3), 3);
    this.speed = new THREE.BufferAttribute(new Float32Array(number), 1);
    this.offset= new THREE.BufferAttribute(new Float32Array(number), 1);
    
    function rand(a, b){
      return a + (b-a)*Math.random();
    }
    
    let index = 0;
    
    for (let i = 0; i < 512; i++){
      let posX = i - 256;
      for (let j = 0; j < 512; j++){
        this.positions.setXYZ(index, posX*2, (j-256)*2, 0)
        this.coordinates.setXYZ(index, i, j, 0);
        this.offset.setX(index, rand(-1000, 1000));
        this.speed.setX(index, rand(-1000, 1000));
        index++;
      }
    }

    this.geometry.setAttribute('position', this.positions);
    this.geometry.setAttribute('aCoordinates', this.coordinates);
    this.geometry.setAttribute('aOffset', this.offset);
    this.geometry.setAttribute('aSpeed', this.speed);
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add( this.mesh );
  }
  
  render(){
    this.time++;
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.move.value = this.move;
    this.renderer.render( this.scene, this.camera );
    window.requestAnimationFrame( this.render.bind(this) );
  }
  
  onWindowResize() {
    console.log('resize')
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

}

console.log("hi");


/* global
require THREE p5 ml5 Stats dat alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase 2D Primitives arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex plane box sphere cylinder cone ellipsoid torus loadModel model HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS print frameCount deltaTime focused cursor frameRate noCursor displayWidth displayHeight windowWidth windowHeight windowResized width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams remove disableFriendlyErrors noLoop loop isLooping push pop redraw select selectAll removeElements changed input createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement createCanvas resizeCanvas noCanvas createGraphics blendMode drawingContext setAttributes boolean string number applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate storeItem getItem clearStorage removeItem createStringDict createNumberDict append arrayCopy concat reverse shorten shuffle sort splice subset float int str byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ turnAxis setMoveThreshold setShakeThreshold deviceMoved deviceTurned deviceShaken keyIsPressed key keyCode keyPressed keyReleased keyTyped keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseWheel mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveFrames image tint noTint imageMode pixels blend copy filter THRESHOLD GRAY OPAQUE INVERT POSTERIZE BLUR ERODE DILATE get loadPixels set updatePixels loadImage loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo Output createWriter save saveJSON saveStrings saveTable day hour minute millis month second year abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess camera perspective ortho frustum createCamera setCamera ADD CENTER CORNER CORNERS POINTS WEBGL RGB ARGB HSB LINES CLOSE BACKSPACE DELETE ENTER RETURN TAB ESCAPE SHIFT CONTROL OPTION ALT UP_ARROW DOWN_ARROW LEFT_ARROW RIGHT_ARROW sampleRate freqToMidi midiToFreq soundFormats getAudioContext userStartAudio loadSound createConvolver setBPM saveSound getMasterVolume masterVolume soundOut chain drywet biquadFilter process freq res gain toggle setType pan phase triggerAttack triggerRelease setADSR attack decay sustain release dispose notes polyvalue AudioVoice noteADSR noteAttack noteRelease isLoaded playMode set isPlaying isPaused setVolume getPan rate duration currentTime jump channels frames getPeaks reverseBuffer onended setPath setBuffer processPeaks addCue removeCue clearCues getBlob getLevel toggleNormalize waveform analyze getEnergy getCentroid linAverages logAverages getOctaveBands fade attackTime attackLevel decayTime decayLevel releaseTime releaseLevel setRange setExp width output stream mediaStream currentSource enabled amplitude getSources setSource bands panner positionX positionY positionZ orient orientX orientY orientZ setFalloff maxDist rollof leftDelay rightDelay delayTime feedback convolverNode impulses addImpulse resetImpulse toggleImpulse sequence getBPM addPhrase removePhrase getPhrase replaceSequence onStep musicalTimeMode maxIterations synced bpm timeSignature interval iterations compressor knee ratio threshold reduction record isDetected update onPeak WaveShaperNode getAmount getOversample amp setInput connect disconnect play pause stop start add mult
*/