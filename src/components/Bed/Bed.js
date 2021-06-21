import React, { useEffect } from 'react';
import '../Chair/Chair.css';
import * as CONFIG from "../Chair/ChairConfig";
// import JSX from './ChairJSX';
import * as THREE from "three";
// import * as THREEx from "threex";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Interaction } from 'three.interaction';
import BedJSX from './BedJSX';
var theModel;
const MODEL_PATH = CONFIG.BED_MODEL_PATH;
var loaded = false;
const colors = CONFIG.colors;
const BACKGROUND_COLOR = CONFIG.BACKGROUND_COLOR;
var renderer = null;
var activeOption = CONFIG.activeOption;
var scene;
var LOADER;
var TRAY;
var DRAG_NOTICE;
var canvas;
var camera;
var controls;
var slider;
var sliderItems;
var difference;
var options;
var slides;
var raycaster;
var mouse;
var INITIAL_MTL;
var SECOND_MTL;
export const Bed = () => {
    const initEnvironment = () => {
        LOADER = document.getElementById('js-loader');
        TRAY = document.getElementById('js-tray-slide');
        DRAG_NOTICE = document.getElementById('js-drag-notice');
        canvas = document.querySelector('#c');

        scene = new THREE.Scene();
        scene.background = new THREE.Color(BACKGROUND_COLOR);
        // scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);
        scene.updateMatrixWorld(true);
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);

        var cameraFar = 10;

        renderer.setSize(window.innerWidth, window.innerHeight);

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = cameraFar;
        camera.position.x = 0;
    }
    const loadModel = () => {
        // Initial material
        const interaction = new Interaction(renderer, scene, camera);
        INITIAL_MTL = new THREE.MeshPhongMaterial({ color: 0xf1f1f1, shininess: 10 });
        SECOND_MTL = new THREE.MeshPhongMaterial({ color: 0x27AE60, shininess: 10 });

        const INITIAL_MAP = [
            { childID: "bed_base", mtl: SECOND_MTL, },
            { childID: "blanket", mtl: INITIAL_MTL, },
            { childID: "pillow_1", mtl: SECOND_MTL, },
            { childID: "pillow_2", mtl: SECOND_MTL, },
            { childID: "legs", mtl: SECOND_MTL, },
            { childID: "图形03", mtl: SECOND_MTL, },
            { childID: "matress", mtl: SECOND_MTL, },
        ];

        // var loader = new GLTFLoader();
        var loader = new FBXLoader();
        loader.load(MODEL_PATH, function (gltf) {
            theModel = gltf;
            // theModel.scale.set(2, 2, 2);
            theModel.traverse(o => {
                if (o.isMesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                    o.on('click', selectArea, false);

                    o.on('mouseout', prop => {
                        // console.log(prop)
                    }, false);
                    o.on('mouseover', prop => {
                        // console.log(prop)
                    }, false);
                }
            });
            // scene.add(theModel)

            // // Set the models initial scale   
            // theModel.rotation.y = Math.PI;

            // // Offset the y position a bit
            // theModel.position.y = -1;
            camera.position.z = 5;
            // // Set initial textures
            for (let object of INITIAL_MAP) {
                initColor(theModel, object.childID, object.mtl, object.zPosition);
            }
            // // Add the model to the scene
            scene.add(theModel);

            // Remove the loader
            LOADER.remove();

        }, undefined, function (error) {
            console.error(error);
        });
    }
    const addLights = () => {
        // Add lights
        var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
        hemiLight.position.set(0, 50, 0);
        // Add hemisphere light to scene   
        scene.add(hemiLight);

        var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
        dirLight.position.set(-8, 12, 8);
        // dirLight.castShadow = true;
        dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        // Add directional Light to scene    
        scene.add(dirLight);
        // // Floor
        // var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
        // var floorMaterial = new THREE.MeshPhongMaterial({
        //     color: 0xeeeeee,
        //     shininess: 0
        // });


        // var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        // floor.rotation.x = -0.5 * Math.PI;
        // // floor.receiveShadow = true;
        // floor.position.y = -1;
        // scene.add(floor);
        // Add controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.maxPolarAngle = Math.PI / 2;
        controls.minPolarAngle = Math.PI / 3;
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.dampingFactor = 0.1;
        controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
        controls.autoRotateSpeed = 0.2; // 30
    }
    const initColor = (parent, type, mtl, zPosition) => {
        parent.traverse(o => {
            if (o.isMesh) {
                if (o.name.includes(type)) {
                    o.material = mtl;
                    o.nameID = type; // Set a new property to identify this object
                    o.zPosition = zPosition; // Set a new property to identify this object
                }
            }
        });
    };
    const animate = () => {
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
        }
        // rayCasterRenderer();
    };
    const resizeRendererToDisplaySize = (renderer) => {
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
    const buildColors = (colors) => {
        for (let [i, color] of colors.entries()) {
            let swatch = document.createElement('div');
            swatch.classList.add('tray__swatch');

            if (color.texture) {
                swatch.style.backgroundImage = "url(" + color.texture + ")";
            } else {
                swatch.style.background = "#" + color.color;
            }

            swatch.setAttribute('data-key', i);
            TRAY.append(swatch);
        }
    }
    const selectOption = (e) => {
        let option = e.target;
        activeOption = e.target.dataset && e.target.dataset.option ? e.target.dataset.option : e.target;
        for (const otherOption of options) {
            otherOption.classList.remove('--is-active');
        }
        option.classList.add('--is-active');
        // camera.position.x = option.position;
        const part = theModel.children.find(model => model.nameID === activeOption);

        setChildPosition(part)
        // camera.lookAt(position.x, position.y, position.z);
        // controls.target.copy(position);
        // const mesh = new THREE.Mesh(part.geometry, new THREE.LineBasicMaterial({color: 0xffffff}));
        // // mesh.visible   = false
        // scene.add(mesh);

        // var edges = new THREE.EdgesGeometry(part.geometry);
        // var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xff0000 }));
        //console.log(mesh);
        // var outlineMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.BackSide, wireframe: true });
        // var outlineMesh1 = new THREE.Mesh(part.geometry, outlineMaterial1);

        // child = child of my object

        // var outlineMaterial1 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide, wireframe: true });
        // var outlineMesh1 = new THREE.Mesh(part.geometry, outlineMaterial1);
        // outlineMesh1.position.set(part.position);
        // outlineMesh1.scale.multiplyScalar(1.05);
        // scene.add(outlineMesh1);
        // scene.add(outlineMaterial1);
        // var geo = new THREE.EdgesGeometry(part.geometry);
        // var mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 4 });
        // var wireframe = new THREE.LineSegments(geo, mat);
        // wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
        // part.add(wireframe);
        // position.z = part.zPosition;
        // var wireframeGeomtry = new THREE.WireframeGeometry(part.geometry);
        // var wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        // var wireframe = new THREE.LineSegments(wireframeGeomtry, wireframeMaterial);
        // wireframe.name = part.nameID;
        // part.add(wireframe);
        // camera.position.copy(position);
        // camera.lookAt(controls.target);
        // camera.translate(0,0,1);
        // camera.far = cameraFar;
        // camera.Translate(0, 0, 1);
        // var bb = new THREE.Box3()
        // bb.setFromObject(part);
        // bb.center(controls.target);
        // alert(position.x + ',' + position.y + ',' + position.z);
    }
    const setChildPosition = (child) => {

        child.geometry.computeBoundingBox();

        var boundingBox = child.geometry.boundingBox;

        var position = new THREE.Vector3();
        position.subVectors(boundingBox.max, boundingBox.min);
        position.multiplyScalar(0.5);
        position.add(boundingBox.min);

        position.applyMatrix4(child.matrixWorld);
        position.z = child.zPosition;
        camera.position.copy(position);
        camera.lookAt(controls.target);
    }

    const slide = (wrapper, items) => {
        var posX1 = 0,
            posX2 = 0,
            posInitial,
            threshold = 20,
            posFinal
        const dragStart = (e) => {
            e = e || window.event;
            posInitial = items.offsetLeft;
            difference = sliderItems.offsetWidth - slider.offsetWidth;
            difference = difference * -1;

            if (e.type === 'touchstart') {
                posX1 = e.touches[0].clientX;
            } else {
                posX1 = e.clientX;
                document.onmouseup = dragEnd;
                document.onmousemove = dragAction;
            }
        }

        const dragAction = (e) => {
            e = e || window.event;

            if (e.type === 'touchmove') {
                posX2 = posX1 - e.touches[0].clientX;
                posX1 = e.touches[0].clientX;
            } else {
                posX2 = posX1 - e.clientX;
                posX1 = e.clientX;
            }

            if (items.offsetLeft - posX2 <= 0 && items.offsetLeft - posX2 >= difference) {
                items.style.left = items.offsetLeft - posX2 + "px";
            }
        }

        const dragEnd = (e) => {
            posFinal = items.offsetLeft;
            if (posFinal - posInitial < -threshold) {

            } else if (posFinal - posInitial > threshold) {

            } else {
                items.style.left = posInitial + "px";
            }

            document.onmouseup = null;
            document.onmousemove = null;
        }
        // Mouse events
        items.onmousedown = dragStart;
        // Touch events
        items.addEventListener('touchstart', dragStart);
        items.addEventListener('touchend', dragEnd);
        items.addEventListener('touchmove', dragAction);
        // slide(slider, sliderItems);
    }
    const selectSwatch = (e) => {
        let color = colors[parseInt(e.target.dataset.key)];
        let new_mtl;

        if (color.texture) {

            let txt = new THREE.TextureLoader().load(color.texture);

            txt.repeat.set(color.size[0], color.size[1], color.size[2]);
            txt.wrapS = THREE.RepeatWrapping;
            txt.wrapT = THREE.RepeatWrapping;

            new_mtl = new THREE.MeshPhongMaterial({
                map: txt,
                shininess: color.shininess ? color.shininess : 10
            });

        } else {
            new_mtl = new THREE.MeshPhongMaterial({
                color: parseInt('0x' + color.color),
                shininess: color.shininess ? color.shininess : 10
            });


        }

        setMaterial(theModel, activeOption, new_mtl);
    }
    const setMaterial = (parent, type, mtl) => {
        parent.traverse(o => {
            if (o.isMesh && o.nameID != null) {
                if (o.nameID === type) {
                    o.material = mtl;
                }
            }
        });
    }
    // Function - Opening rotate
    let initRotate = 0;

    const initialRotation = () => {
        initRotate++;
        if (initRotate <= 120) {
            theModel.rotation.y += Math.PI / 60;
        } else {
            loaded = true;
        }
    }

    useEffect(() => {
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        window.addEventListener('mousemove', onMouseMove, false);

        window.requestAnimationFrame(rayCasterRenderer);
        initEnvironment();
        loadModel();
        addLights();
        animate();
        buildColors(colors);


        // render();
        slider = document.getElementById('js-tray');
        sliderItems = document.getElementById('js-tray-slide');
        slides = sliderItems.getElementsByClassName('tray__swatch');

        slide(slider, sliderItems);

        // Select Option
        options = document.querySelectorAll(".option");
        for (const option of options) {
            option.addEventListener('click', selectOption);
        }
        // Swatches
        const swatches = document.querySelectorAll(".tray__swatch");
        for (const swatch of swatches) {
            swatch.addEventListener('click', selectSwatch);
        }
    }, []);
    const onMouseMove = (event) => {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        // activeOption = event.intersects[0].object.name;
        // event.intersects[0].object.material.color.set(0xffeeee);
        // rayCasterRenderer();

    }
    const selectArea = (event) => {
        activeOption = event.intersects[0].object.name;

    }
    // const onMouseMoveOut = (event) => {

    //     // calculate mouse position in normalized device coordinates
    //     // (-1 to +1) for both components

    //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //     mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    //     if (event && event.intersects.length > 0) {
    //         for (var i = 0; i < event.intersects.length; i++) {

    //             event.intersects[i].object.material.color.set(0xffeeee);
    //             switch (event.intersects[i].object.name) {
    //                 case 'Outer_Wall': {
    //                     event.intersects[i].object.material.color.set(SECOND_MTL);
    //                     break;
    //                 }
    //                 case 'Inner_Room_Wall': {
    //                     event.intersects[i].object.material.color.set(INITIAL_MTL);
    //                     break;
    //                 }
    //                 case 'Floor': {
    //                     event.intersects[i].object.material.color.set(SECOND_MTL);
    //                     break;
    //                 }
    //                 default: { }
    //             }
    //         }
    //     }

    //     // event.intersects[0].object.material.color.set(0xffeeee);
    //     // rayCasterRenderer();

    // }
    const rayCasterRenderer = (objectList) => {

        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(scene.children);

        for (var i = 0; i < intersects.length; i++) {

            intersects[i].object.material.color.setHex(0x27AE60);

        }

        renderer.render(scene, camera);

    }
    return (
        <BedJSX />
    )
}
export default Bed;