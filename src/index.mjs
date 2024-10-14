import "./styles.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons";

// basic gravity model for earth.
const radius = 6371;
function gravity(x, y, z) {
  const r = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
  const J2 = 1.75553 * Math.pow(10, 10);
  const J3 = -2.61913 * Math.pow(10, 11);
  const mu = 398600.44;

  // Calculate Fx, Fy, and Fz
  let Fx =
    J2 *
      (x / Math.pow(r, 7)) *
      (6 * Math.pow(z, 2) - 1.5 * (Math.pow(x, 2) + Math.pow(y, 2))) +
    (mu * x) / Math.pow(r, 3);
  let Fy =
    J2 *
      (y / Math.pow(r, 7)) *
      (6 * Math.pow(z, 2) - 1.5 * (Math.pow(x, 2) + Math.pow(y, 2))) +
    (mu * y) / Math.pow(r, 3);
  let Fz =
    J2 *
      (z / Math.pow(r, 7)) *
      (3 * Math.pow(z, 2) - 4.5 * (Math.pow(x, 2) + Math.pow(y, 2))) +
    (mu * z) / Math.pow(r, 3);

  // Add the J3 terms
  Fx =
    Fx +
    J3 *
      ((x * z) / Math.pow(r, 9)) *
      (10 * Math.pow(z, 2) - 7.5 * (Math.pow(x, 2) + Math.pow(y, 2)));
  Fy =
    Fy +
    J3 *
      ((y * z) / Math.pow(r, 9)) *
      (10 * Math.pow(z, 2) - 7.5 * (Math.pow(x, 2) + Math.pow(y, 2)));
  Fz =
    Fz +
    J3 *
      (1 / Math.pow(r, 9)) *
      (4 *
        Math.pow(z, 2) *
        (Math.pow(z, 2) - 3 * (Math.pow(x, 2) + Math.pow(y, 2))) +
        1.5 * Math.pow(Math.pow(x, 2) + Math.pow(y, 2), 2));

  // Total gravitational force magnitude
  const F = Math.sqrt(Fx ** 2 + Fy ** 2 + Fz ** 2) * 1000;
  return F;
}
function normalizeMinMax(array) {
  const min = Math.min(...array);
  const max = Math.max(...array);

  return array.map((value) => (value - min) / (max - min));
}

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
const geometry1 = new THREE.IcosahedronGeometry(100, 4);

const count = geometry1.attributes.position.count;
geometry1.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(count * 3), 3)
);

const positions1 = geometry1.attributes.position;

const color = new THREE.Color();
const colors1 = geometry1.attributes.color;

let g_vals = [];
console.log(count);
for (let i = 0; i < count; i++) {
  let g_value = gravity(
    positions1.getX(i) * 63.71,
    positions1.getY(i) * 63.71,
    positions1.getZ(i) * 63.71
  );
  g_vals.push(g_value);
}

let normalized_g_vals = normalizeMinMax(g_vals);
for (let i = 0; i < count; i++) {
  color.setRGB(normalized_g_vals[i], 1, 1);
  colors1.setXYZ(i, color.r, color.g, color.b);
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
  new THREE.SphereGeometry(100, 20, 16),
  new THREE.MeshBasicMaterial({ color: 0xeeeeee, wireframe: true })
);

mesh.add(wireframe);

scene.add(mesh);

camera.position.z = 500;

async function animate() {
  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
