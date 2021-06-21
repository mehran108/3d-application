import React, { useEffect } from 'react';
import './Sophie.css';
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var renderer = null;
export const Sophie = () => {
  useEffect(() => {
    // Update the document title using the browser API
    const LOADER = document.getElementById('js-loader');
    const TRAY = document.getElementById('js-tray-slide');
    const DRAG_NOTICE = document.getElementById('js-drag-notice');

    var theModel;
    const MODEL_PATH = "/fbx/rp_sophia_animated_003_idling.fbx";

    var loaded = false;

    const BACKGROUND_COLOR = 0xf1f1f1;
    const canvas = document.querySelector('#c');
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(BACKGROUND_COLOR);
    scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);

    var cameraFar = 3;

    renderer.setSize(window.innerWidth, window.innerHeight);
    // this.mount.appendChild(renderer.domElement);

    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = cameraFar;
    camera.position.x = 0;

    // var loader = new GLTFLoader();
    var loader = new FBXLoader();
    loader.load(MODEL_PATH, function (object) {
      theModel = object;
      object.traverse(function (child) {
        if (child.material) {
          // child.material.wireframe = true;
        }
        console.log(child);
      });

      // Set the models initial scale   
      theModel.scale.set(0.01, 0.01, 0.01);
      theModel.rotation.set(0, 0, 0);

      // Offset the y position a bit
      theModel.position.y = -1;
      // Add the model to the scene
      scene.add(theModel);

      // Remove the loader
      LOADER.remove();

    }, undefined, function (error) {
      console.error(error);
    });
    // Add lights
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene   
    scene.add(hemiLight);

    var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 0, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    // Add directional Light to scene    
    scene.add(dirLight);
    var pointLight = new THREE.PointLight(0xffffff, 0.9);
    pointLight.position.set(-5, -1, 5);
    scene.add(pointLight);



    // Floor
    var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    var floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xeeeeee,
      shininess: 0
    });


    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -1;
    scene.add(floor);
    // Add controls
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 3;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.1;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2; // 30
    var animate = function () {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      if (theModel != null && loaded === false) {
        initialRotation();
        DRAG_NOTICE.classList.add('start');
      }
    };

    animate();
    // Function - New resizing method
    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      var width = window.innerWidth;
      var height = window.innerHeight;
      var canvasPixelWidth = canvas.width / window.devicePixelRatio;
      var canvasPixelHeight = canvas.height / window.devicePixelRatio;

      const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
      if (needResize) {

        renderer.setSize(width, height, false);
      }
      return needResize;
    }
    // Function - Opening rotate
    let initRotate = 0;

    function initialRotation() {
      initRotate++;
      if (initRotate <= 120) {
        theModel.rotation.y += Math.PI / 60;
      } else {
        loaded = true;
      }
    }
  });
  return (
    <div>
      < div className="loading" id="js-loader" >
        <div className="loader"></div>
      </div >
      <span className="drag-notice" id="js-drag-notice">Drag to rotate 360&#176;</span>
      <div className="options">

      </div>
      <canvas id="c"></canvas>
      <div className="controls">
        <div className="info">
          <div className="info__message">
            <p><strong>&nbsp;Grab&nbsp;</strong> to rotate. <strong>&nbsp;Scroll&nbsp;</strong> to zoom. <strong>&nbsp;Drag&nbsp;</strong> swatches to view more.</p>
          </div>
        </div>
        <div id="js-tray" className="tray">
          <div id="js-tray-slide" className="tray__slide"></div>
        </div>
      </div>
    </div>)
}

export default Sophie;