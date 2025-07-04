// A self-invoking function to encapsulate the entire script and avoid global scope pollution
(function() {
    // --- DOM ELEMENT REFERENCES ---
    const canvas = document.getElementById('bg-canvas');
    const welcomeText = document.getElementById('welcome-text');
    const subtitleText = document.getElementById('subtitle-text');
    const contactInfo = document.getElementById('contact-info');
    const locationInfo = document.getElementById('location-info');
    const copyrightInfo = document.getElementById('copyright-info');
    const langEnBtn = document.getElementById('lang-en');
    const langBnBtn = document.getElementById('lang-bn');

    // --- TRANSLATION DATA ---
    const translations = {
        en: {
            welcome: "Welcome",
            subtitle: "The journey begins.",
            contact: "Contact: bdha20099@gmail.com",
            location: "Darshana, Rangpur Division, Bangladesh",
            copyright: "© 2025 SSLR Games. All rights reserved."
        },
        bn: {
            welcome: "স্বাগতম",
            subtitle: "যাত্রা শুরু হলো।",
            contact: "যোগাযোগ: bdha20099@gmail.com",
            location: "দর্শনা, রংপুর বিভাগ, বাংলাদেশ",
            copyright: "© ২০২৫ SSLR গেমস। সর্বস্বত্ব সংরক্ষিত।"
        }
    };

    // --- 3D SCENE SETUP ---
    let scene, camera, renderer, starField, composer;
    let planets = [];
    let blackHoleEffectActive = false;
    let blackHolePass;

    // Mouse tracking for camera rotation
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    // --- INITIALIZATION ---
    function init() {
        // Scene
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.0007);

        // Camera
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 50000);
        camera.position.z = 1000; // Start in front of the home planet

        // Renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        // --- OBJECT CREATION ---
        createStarfield();
        createHomePlanet();
        createDistantPlanets();
        createDistantObjects(); // For galaxies, etc.

        // --- LIGHTING ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);
        const sunLight = new THREE.PointLight(0xfff5e6, 1.5, 20000);
        sunLight.position.set(-2000, 500, -2000);
        scene.add(sunLight);

        // --- POST-PROCESSING FOR BLACK HOLE EFFECT ---
        composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));

        const blackHoleShader = {
            uniforms: {
                "tDiffuse": { value: null },
                "center": { value: new THREE.Vector2(0.5, 0.5) },
                "strength": { value: 0.0 },
                "radius": { value: 0.25 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec2 center;
                uniform float strength;
                uniform float radius;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    float dist = distance(uv, center);
                    if (dist < radius) {
                        float percent = dist / radius;
                        float theta = (1.0 - percent) * (1.0 - percent) * strength * 8.0;
                        vec2 dir = normalize(uv - center);
                        uv -= dir * theta * 0.05; // 0.05 is distortion factor
                    }
                    gl_FragColor = texture2D(tDiffuse, uv);
                }
            `
        };
        blackHolePass = new THREE.ShaderPass(blackHoleShader);
        blackHolePass.enabled = false;
        composer.addPass(blackHolePass);

        // --- EVENT LISTENERS ---
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('click', onMouseClick, false);
        langEnBtn.addEventListener('click', () => switchLanguage('en'));
        langBnBtn.addEventListener('click', () => switchLanguage('bn'));
    }

    // --- OBJECT CREATION FUNCTIONS ---

    function createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for (let i = 0; i < 20000; i++) {
            const x = THREE.MathUtils.randFloatSpread(40000);
            const y = THREE.MathUtils.randFloatSpread(40000);
            const z = THREE.MathUtils.randFloatSpread(40000);
            starVertices.push(x, y, z);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.5,
            transparent: true,
            opacity: 0.8
        });
        starField = new THREE.Points(starGeometry, starMaterial);
        scene.add(starField);
    }

    function createHomePlanet() {
        // Planet Body
        const planetGeo = new THREE.SphereGeometry(350, 64, 64);
        const planetMat = new THREE.MeshStandardMaterial({
            color: 0x4682B4, // Blue for water
            roughness: 0.8
        });
        // Simple procedural texture for landmasses
        const canvasTexture = document.createElement('canvas');
        const context = canvasTexture.getContext('2d');
        canvasTexture.width = 1024;
        canvasTexture.height = 512;
        context.fillStyle = '#2E8B57'; // Green for land
        for (let i = 0; i < 50; i++) {
            context.fillRect(Math.random() * 1024, Math.random() * 512, Math.random() * 150, Math.random() * 100);
        }
        const texture = new THREE.CanvasTexture(canvasTexture);
        planetMat.map = texture;

        const planet = new THREE.Mesh(planetGeo, planetMat);
        scene.add(planet);
        planets.push({ mesh: planet, speed: 0.0005 });

        // Clouds
        const cloudGeo = new THREE.SphereGeometry(360, 64, 64);
        const cloudMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.25
        });
        const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        scene.add(cloudMesh);
        planets.push({ mesh: cloudMesh, speed: 0.0008 });
    }

    function createDistantPlanets() {
        const planetData = [
            { color: 0xc1440e, size: 150, z: -5000, speed: 0.0004 }, // Mars-like
            { color: 0xd2b48c, size: 400, z: -12000, speed: 0.0002 }, // Jupiter-like
            { color: 0xf0e68c, size: 350, z: -20000, speed: 0.00015, hasRing: true }, // Saturn-like
            { color: 0x00008b, size: 200, z: -30000, speed: 0.0001 } // Neptune-like
        ];

        planetData.forEach(data => {
            const planetGeo = new THREE.SphereGeometry(data.size, 32, 32);
            const planetMat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7 });
            const planet = new THREE.Mesh(planetGeo, planetMat);
            planet.position.set(Math.random() * 4000 - 2000, Math.random() * 2000 - 1000, data.z);
            scene.add(planet);
            planets.push({ mesh: planet, speed: data.speed });

            if (data.hasRing) {
                const ringGeo = new THREE.RingGeometry(data.size * 1.4, data.size * 2, 64);
                const ringMat = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.position.copy(planet.position);
                ring.rotation.x = Math.PI / 2.5;
                scene.add(ring);
                planets.push({ mesh: ring, speed: data.speed });
            }
        });
    }
    
    function createDistantObjects() {
        // A very distant, large sphere to simulate a galaxy or nebula background
        const nebulaGeo = new THREE.SphereGeometry(45000, 64, 64);
        const nebulaMat = new THREE.MeshBasicMaterial({
            color: 0x530087, // Deep purple
            side: THREE.BackSide, // Render on the inside
            fog: false
        });
        const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
        scene.add(nebula);
    }


    // --- EVENT HANDLERS ---

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * 0.5;
        mouseY = (event.clientY - windowHalfY) * 0.5;

        if (blackHoleEffectActive) {
            blackHolePass.uniforms.center.value.x = event.clientX / window.innerWidth;
            blackHolePass.uniforms.center.value.y = 1.0 - (event.clientY / window.innerHeight);
        }
    }

    function onMouseClick() {
        blackHoleEffectActive = !blackHoleEffectActive;
        blackHolePass.enabled = blackHoleEffectActive;
        
        if (blackHoleEffectActive) {
            // Animate the effect appearing
            let strength = 0;
            const interval = setInterval(() => {
                strength += 0.05;
                blackHolePass.uniforms.strength.value = strength;
                if (strength >= 1.0) clearInterval(interval);
            }, 20);
        } else {
            // Animate the effect disappearing
            let strength = 1.0;
            const interval = setInterval(() => {
                strength -= 0.05;
                blackHolePass.uniforms.strength.value = strength;
                if (strength <= 0) {
                    clearInterval(interval);
                    blackHolePass.uniforms.strength.value = 0;
                }
            }, 20);
        }
    }

    // --- LANGUAGE SWITCHER LOGIC ---
    function switchLanguage(lang) {
        const data = translations[lang];
        welcomeText.innerText = data.welcome;
        subtitleText.innerText = data.subtitle;
        contactInfo.innerText = data.contact;
        locationInfo.innerText = data.location;
        copyrightInfo.innerText = data.copyright;

        if (lang === 'en') {
            langEnBtn.classList.add('active');
            langBnBtn.classList.remove('active');
        } else {
            langEnBtn.classList.remove('active');
            langBnBtn.classList.add('active');
        }
    }

    // --- ANIMATION LOOP ---
    function animate() {
        requestAnimationFrame(animate);

        // Continuous forward motion
        camera.position.z -= 15;

        // Camera rotation based on mouse
        camera.rotation.y += (-(mouseX / windowHalfX) * Math.PI / 8 - camera.rotation.y) * 0.02;
        camera.rotation.x += (-(mouseY / windowHalfY) * Math.PI / 8 - camera.rotation.x) * 0.02;
        
        // Keep camera rotation within reasonable bounds to avoid upside-down view
        camera.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, camera.rotation.x));


        // Rotate planets and stars
        starField.rotation.y += 0.0001;
        planets.forEach(p => {
            p.mesh.rotation.y += p.speed;
        });

        // Render the scene
        if (blackHoleEffectActive) {
            composer.render();
        } else {
            renderer.render(scene, camera);
        }
    }

    // --- START THE EXPERIENCE ---
    init();
    animate();

})();
