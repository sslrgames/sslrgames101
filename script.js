// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);

// Renderer on our canvas
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Loading manager for assets
const loadingDiv = document.getElementById('loading');
const manager = new THREE.LoadingManager();
manager.onLoad = () => {
  // Hide loading text when done
  loadingDiv.style.display = 'none';
};
const loader = new THREE.TextureLoader(manager);

// Earth (green planet) at origin
const earthTex = loader.load('https://example.com/nasa_earth_texture.jpg'); // placeholder NASA Earth texture
const earthGeo = new THREE.SphereGeometry(10, 32, 32);
const earthMat = new THREE.MeshStandardMaterial({ map: earthTex });
const earth = new THREE.Mesh(earthGeo, earthMat);
scene.add(earth);

// Random planets (additional spheres with placeholder NASA textures)
const planetInfos = [
  { radius: 3, texture: 'mars.jpg', position: {x: 30, y: -5, z: -100} },
  { radius: 4, texture: 'jupiter.jpg', position: {x: -20, y: 10, z: -200} },
  { radius: 2, texture: 'mercury.jpg', position: {x: 15, y: 5, z: -150} },
  // Add more planets as desired
];
planetInfos.forEach(info => {
  const tex = loader.load(`https://example.com/${info.texture}`); // placeholder NASA textures
  const mat = new THREE.MeshStandardMaterial({ map: tex });
  const geo = new THREE.SphereGeometry(info.radius, 32, 32);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(info.position.x, info.position.y, info.position.z);
  scene.add(mesh);
});

// Starfield (points)
const starGeom = new THREE.BufferGeometry();
const starCount = 10000;
const starVerts = [];
for (let i = 0; i < starCount; i++) {
  const x = (Math.random()*2-1) * 1000;
  const y = (Math.random()*2-1) * 1000;
  const z = (Math.random()*2-1) * 1000;
  starVerts.push(x, y, z);
}
starGeom.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
const stars = new THREE.Points(starGeom, starMat);
scene.add(stars);

// Black hole (simple black sphere far ahead)
const blackHoleGeo = new THREE.SphereGeometry(6, 32, 32);
const blackHoleMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
const blackHole = new THREE.Mesh(blackHoleGeo, blackHoleMat);
blackHole.position.set(0, 0, -500);
scene.add(blackHole);

// Lighting for depth realism
const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

// Camera start position (near Earth, looking forward into space)
camera.position.set(0, 0, 50);
camera.lookAt(0, 0, 0);

// Movement controls
let speed = 20; // default speed (units per second)
const maxSpeed = 100;
window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp') speed = Math.min(speed + 5, maxSpeed);
  if (e.code === 'ArrowDown') speed = Math.max(speed - 5, 0);
});

// Mouse moves adjust yaw (±π rad)
window.addEventListener('mousemove', (e) => {
  const yaw = (e.clientX / window.innerWidth - 0.5) * Math.PI * 2;
  camera.rotation.y = yaw;
});

// Magnifier lens toggle
const lens = document.createElement('div');
lens.id = 'lens';
document.body.appendChild(lens);
let lensActive = false;
window.addEventListener('click', () => {
  lensActive = !lensActive;
  lens.style.display = lensActive ? 'block' : 'none';
});
window.addEventListener('mousemove', (e) => {
  if (lensActive) {
    lens.style.left = (e.clientX - 50) + 'px';
    lens.style.top = (e.clientY - 50) + 'px';
  }
});

// Audio volume default low
const audio = document.getElementById('spaceAudio');
audio.volume = 0.1; // subtle ambient sound

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  // Move camera forward (along -Z direction)
  camera.position.z -= speed * delta;
  renderer.render(scene, camera);
}
animate();
