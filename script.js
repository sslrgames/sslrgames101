// script.js

let scene, camera, renderer, clock;
let planets = [], stars;
let speed = 20;
const maxSpeed = 200;

init();

function init() {
  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
  camera.position.set(0, 0, 100);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl'), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('loading').style.display = 'block';

  clock = new THREE.Clock();

  // Lights
  const ambient = new THREE.AmbientLight(0x404040);
  const directional = new THREE.DirectionalLight(0xffffff, 1.5);
  directional.position.set(100, 100, -100);
  scene.add(ambient, directional);

  // Starfield
  const starGeo = new THREE.BufferGeometry();
  const starCount = 100000;
  const starArray = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    starArray[i] = (Math.random() - 0.5) * 20000;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starArray, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
  stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // Planets
  const textureLoader = new THREE.TextureLoader();
  const planetData = [
    { url: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg', size: 20 },
    { url: 'https://threejs.org/examples/textures/planets/jupiter.jpg', size: 40 },
    { url: 'https://threejs.org/examples/textures/planets/mars_1k_color.jpg', size: 15 },
    { url: 'https://threejs.org/examples/textures/planets/saturn.jpg', size: 35 },
    { url: 'https://threejs.org/examples/textures/planets/uranus.jpg', size: 30 },
    { url: 'https://threejs.org/examples/textures/planets/neptune.jpg', size: 30 },
    { url: 'https://threejs.org/examples/textures/planets/mercury.jpg', size: 10 },
    { url: 'https://threejs.org/examples/textures/planets/venus.jpg', size: 15 },
  ];
  
  planetData.forEach((planet, i) => {
    const mat = new THREE.MeshStandardMaterial({ map: textureLoader.load(planet.url) });
    const geo = new THREE.SphereGeometry(planet.size, 64, 64);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.z = -(i + 1) * 1000;
    scene.add(mesh);
    planets.push(mesh);
  });

  // Audio control
  const bgm = document.getElementById('bgm');
  bgm.volume = 0.1;
  bgm.play();

  // Events
  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKey);

  animate();
  document.getElementById('loading').style.display = 'none';
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKey(e) {
  if (e.code === 'ArrowUp') speed = Math.min(maxSpeed, speed + 10);
  if (e.code === 'ArrowDown') speed = Math.max(10, speed - 10);
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  camera.position.z -= speed * delta;

  // Slight auto rotation
  camera.rotation.y += 0.0005;

  planets.forEach(p => p.rotation.y += 0.001);

  renderer.render(scene, camera);
}
