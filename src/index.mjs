import "./styles.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons";
// import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { gravity } from "./models";
import { GUI } from "lil-gui";
import { normalizeCustomBounds, normalizeMinMax } from "./utils";
import chroma from "chroma-js";
// basic gravity model for earth.
const radius = 6371;

// GUI
const gui = new GUI();
// scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// controls
const controls = new OrbitControls(camera, renderer.domElement);

// light
const light = new THREE.AmbientLight(0x404040, 20);
scene.add(light);

// color geometry
const geometry1 = new THREE.SphereGeometry(100, 40, 40);
// geometry1.scale(1.0, 1, 1);

const count = geometry1.attributes.position.count;
geometry1.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(count * 3), 3)
);

const positions1 = geometry1.attributes.position;

const color = new THREE.Color();
const colors1 = geometry1.attributes.color;

let g_vals = [];
let x = [];
let y = [];
let z = [];
for (let i = 0; i < count; i++) {
  let g_value = gravity(
    positions1.getX(i) * 63.71,
    positions1.getY(i) * 63.71,
    positions1.getZ(i) * 63.71
  );
  x.push(positions1.getX(i) * 63.71);
  y.push(positions1.getY(i) * 63.71);
  z.push(positions1.getZ(i) * 63.71);
  g_vals.push(g_value);
}
console.log(g_vals);

let normalized_g_vals = normalizeMinMax(g_vals);
const colorScale = chroma.scale();
console.log(normalized_g_vals.toString());
for (let i = 0; i < count; i++) {
  const col = colorScale(normalized_g_vals[i]).rgb();
  colors1.setXYZ(i, col[0], col[1], col[2]);
}

const material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  flatShading: true,
  vertexColors: true,
  shininess: 0,
});

const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true,
  transparent: true,
});

let mesh = new THREE.Mesh(geometry1, material);

let wireframe = new THREE.Mesh(
  new THREE.SphereGeometry(100, 20, 20).scale(1.01, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xeeeeee, wireframe: true })
);

// mesh.add(wireframe);

scene.add(mesh);

camera.position.z = 500;

async function animate() {
  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
