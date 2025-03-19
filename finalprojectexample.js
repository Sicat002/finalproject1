// Import the THREE.js library for 3D rendering and animations
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// Import OrbitControls to allow interactive camera movement
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// Import post-processing modules for a bloom (glow) effect
import { EffectComposer } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/UnrealBloomPass.js";
import Stats from "https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js";
import { AsciiEffect } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/effects/AsciiEffect.js";
import dat from "https://cdn.jsdelivr.net/npm/dat.gui@0.7.9/+esm";
// You are on page 48 in the book.

function init() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xEEEEEE, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    var axes = new THREE.AxesHelper(20);
    scene.add(axes);

    var planeGeometry = new THREE.PlaneGeometry(60, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    document.body.appendChild(renderer.domElement);

    var stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    // Correct Positioning
    stats.dom.style.position = 'fixed';
    stats.dom.style.left = '400px';
    stats.dom.style.top = '0px';
    stats.dom.style.zIndex = '1000'; // Ensure it's on top

    // Resize Entire Panel (not just canvas)
    stats.dom.style.transform = 'scale(1.5)';
    stats.dom.style.transformOrigin = 'center';

    // Ensure Canvas Resizes
    stats.dom.firstChild.style.width = '120px';
    stats.dom.firstChild.style.height = '80px';

    // Create control object
    var controls = new function() {
        this.rotationSpeed = 0.05;
        this.bouncingSpeed = 0.07;
    };
    // You are on page 48 in the book.

    // Initialize dat.GUI
    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.07);

    // Post-Processing (Composer for Effects)
    var composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    var clock = new THREE.Clock();
     // Create AsciiEffect and ensure it's in the right scope
    var effect = new AsciiEffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);
    effect.domElement.style.color = "white";
    effect.domElement.style.backgroundColor = "black";
     let useAscii = false; // Toggle flag

    // Create a button to toggle renderer
    var button = document.createElement("button");
    button.innerHTML = "Toggle ASCII Effect";
    button.style.position = "absolute";
    button.style.top = "300px";
    button.style.left = "200px";
    button.style.padding = "10px 15px";
    button.style.fontSize = "14px";
    button.style.background = "#000";
    button.style.color = "#fff";
    button.style.border = "4px solid red";
    button.style.cursor = "pointer";
    document.body.appendChild(button);

    button.addEventListener("click", function () {
        useAscii = !useAscii;
        document.body.removeChild(useAscii ? renderer.domElement : effect.domElement);
        document.body.appendChild(useAscii ? effect.domElement : renderer.domElement);
    });
 // you are on page 52

    function animate() {
        stats.begin();

        let delta = clock.getDelta(); // Time elapsed since last frame
        let elapsedTime = clock.getElapsedTime(); // Total time since animation started

        // Ensure smooth rotation
        cube.rotation.x += controls.rotationSpeed * delta * 60;
        cube.rotation.y += controls.rotationSpeed * delta * 60;
        cube.rotation.z += controls.rotationSpeed * delta * 60;

        // Use elapsedTime instead of step for smooth, natural bouncing
        sphere.position.y = 4 + Math.abs(Math.sin(elapsedTime * controls.bouncingSpeed * 20) * 10);
         if (useAscii) {
            effect.render(scene, camera);
        } else {
             composer.render();
        }


        stats.end();
        requestAnimationFrame(animate);
    }
    animate();
    }

window.onload = init;