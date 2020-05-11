let camera, scene, renderer, controls, canvas;
const planets = [];

const getPointLight = (intensity, color) =>  {
    const light = new THREE.PointLight(color, intensity);
    light.castShadow = true;
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    return light;
}

const getSphere = (material, size, segments) => {
    const geometry = new THREE.SphereGeometry(size, segments, segments);
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;

    return sphere ;
}

const getMaterial = (type, color, texture) => {
    const materialOptions = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color,
        map: texture === undefined ? null : texture
    };

    switch (type) {
        case 'basic':
            return new THREE.MeshBasicMaterial(materialOptions);
        case 'lambert':
            return new THREE.MeshLambertMaterial(materialOptions);
        case 'phong':
            return new THREE.MeshPhongMaterial(materialOptions);
        case 'standard':
            return new THREE.MeshStandardMaterial(materialOptions);
        default:
            return new THREE.MeshBasicMaterial(materialOptions);
    }
}

const movePlanet = (planet, planetData, time, stopRotation) => {
    if (orbitData.runRotation && !stopRotation) {
        planet.rotation.y += planetData.rotationRate;
    }
    if (orbitData.runOrbit) {
        planet.position.x = Math.cos(time * (1.0 / (planetData.orbitRate * orbitData.value + 1)) + 10.0) * planetData.distanceFromAxis;
        planet.position.z = 1.3 * Math.sin(time * (1.0 / (planetData.orbitRate * orbitData.value + 1)) + 10.0) * planetData.distanceFromAxis;
    }
}

const moveMoon = (moon, planet, moonData, time) => {
    movePlanet(moon, moonData, time);
    if (orbitData.runOrbit) {
        moon.position.x = moon.position.x + planet.position.x;
        moon.position.z = moon.position.z + planet.position.z;
    }
}

const setPlanetInfo = (planet, data) => {
    planet.name = data.name;
    planet.rotationRate = data.info.rotationRate;
    planet.orbitRate = data.info.orbitRate;
    planet.radius = data.info.radius;
    planet.mass = data.info.mass;
    planet.temperature = data.info.temperature;
    planet.moons = data.info.moons;
}

const getPlanet = (planetData, x, y, z, materialType) => {
    let material;
    let texture;

    if (planetData.texture) {
        texture = new THREE.TextureLoader().load(planetData.texture);
    }
    if (materialType) {
        material = getMaterial(materialType, "rgb(255, 255, 255 )", texture);
    } else {
        material = getMaterial("lambert", "rgb(255, 255, 255 )", texture);
    }
    material.receiveShadow = true;
    material.castShadow = true;

    const planet = getSphere(material, planetData.size, planetData.segments);
    planet.receiveShadow = true;

    if (planetData.info) {
        setPlanetInfo(planet, planetData);
    }

    scene.add(planet);
    planet.position.set(x, y, z);

    return planet;
}

const getRings = (innerRadius, outerRadius, size, texture, name, distanceFromAxis) => {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, size);
    const ringTexture = new THREE.TextureLoader().load(texture);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            texture: { value: ringTexture },
            innerRadius: { value: innerRadius },
            outerRadius: { value: outerRadius }
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side: THREE.DoubleSide,
        transparent: true
    });
    const saturnRings = new THREE.Mesh(geometry, material);
    saturnRings.name = name;
    saturnRings.position.set(distanceFromAxis, 0, 0);
    saturnRings.rotation.x = Math.PI / 2;
    saturnRings.rotation.y = - Math.PI / 8;
    scene.add(saturnRings)
    return saturnRings;
}

const getSaturnRings = (saturnData) => {
    return getRings(
        saturnData.rings.innerRadius,
        saturnData.rings.outerRadius,
        saturnData.rings.size,
        "img/planets/saturnRings.png",
        "Saturn rings",
        saturnData.distanceFromAxis,
    );
}

const getEllipse = (x, y, size, color, name, distanceFromAxis) => {
    const curve = new THREE.EllipseCurve(
        x,  y,
        distanceFromAxis, 1.3 * distanceFromAxis,
        0,  2 * Math.PI,
    );

    const points = curve.getPoints( size );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color : color} );
    const ellipse = new THREE.Line( geometry, material );
    ellipse.rotation.x =  Math.PI / 2;
    scene.add(ellipse);
    return ellipse;
};

const getOrbits = (earthData) => {
    return getEllipse(
        0,
        0,
        150,
        0x747474,
        "earthOrbit",
        earthData.distanceFromAxis,
    );
}

const createAsteroids = (amount, distanceFromAxis, angel) => {
    const geometry = new THREE.Geometry();
    const material = new THREE.PointsMaterial({
        size: 5,
        map: new THREE.TextureLoader().load("img/planets/asteroid.png"),
        depthTest: true,
        transparent: false,
        sizeAttenuation: false,
        alphaTest: 0.9,
    });
    for (let i = 0; i < amount; i++) {
        const t = Math.random() * angel;
        const x = Math.cos(t) * distanceFromAxis  + randomInteger(-5, 5);
        const y = 1.3 * Math.sin(t) * distanceFromAxis  + randomInteger(-5, 5);
        geometry.vertices.push(new THREE.Vector3(x, y, randomInteger(-5, 5)));
    }
    const asteroids = new THREE.Points(geometry, material);
    asteroids.rotation.x = Math.PI / 2;
    scene.add(asteroids);
}

const createStars = (amount, range) => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for ( let i = 0; i < amount; i ++ ) {
        vertices.push( THREE.MathUtils.randFloatSpread( range ) );
        vertices.push( THREE.MathUtils.randFloatSpread( range ) );
        vertices.push( THREE.MathUtils.randFloatSpread( range ) );
    }
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    const stars = new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0x888888, sizeAttenuation: false, } ) );
    scene.add( stars );
}

const showPlanetInfo = planet => {
    document.getElementById("name").innerText = planet.name;
    document.getElementById("mass").innerText = planet.mass;
    document.getElementById("orbitRate").innerText = planet.orbitRate;
    document.getElementById("rotationRate").innerText = planet.rotationRate;
    document.getElementById("radius").innerText = planet.radius;
    document.getElementById("temperature").innerText = planet.temperature;
    document.getElementById("moons").innerText = planet.moons;
}

function init() {
    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1;
    const far = 1500;
    camera = new THREE.PerspectiveCamera( fov, aspect, near, far);
    camera.position.set(50, 50, 100);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.antialias = true;

    canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 60;
    controls.maxDistance = 999;

    const urls = [
       'img/cubemap/right.png',
       'img/cubemap/left.png',
       'img/cubemap/top.png',
       'img/cubemap/bottom.png',
       'img/cubemap/front.png',
       'img/cubemap/back.png',
    ]
    const reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;
    scene.background = reflectionCube;

    const pointLight = getPointLight(1.5, "rgb(255, 220, 180)");
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.2);
    scene.add(ambientLight);

    const sun = getPlanet(sunData, sunData.distanceFromAxis, 0, 0, "basic");
    const mercury = getPlanet(mercuryData, mercuryData.distanceFromAxis, 0, 0);
    const venus = getPlanet(venusData, venusData.distanceFromAxis, 0, 0);
    const earth = getPlanet(earthData, earthData.distanceFromAxis, 0, 0);
    const moon = getPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    const mars = getPlanet(marsData, marsData.distanceFromAxis, 0, 0);
    const phobos = getPlanet(phobosData, phobosData.distanceFromAxis, 0, 0);
    const deimos = getPlanet(deimosData, deimosData.distanceFromAxis, 0, 0);
    const jupiter = getPlanet(jupiterData, jupiterData.distanceFromAxis, 0, 0);
    const saturn = getPlanet(saturnData, saturnData.distanceFromAxis, 0, 0);
    const saturnRings = getSaturnRings(saturnData);
    const uranus = getPlanet(uranusData, uranusData.distanceFromAxis, 0, 0);
    const neptune = getPlanet(neptuneData, neptuneData.distanceFromAxis, 0, 0);
    const pluto = getPlanet(plutoData, plutoData.distanceFromAxis, 0, 0);

    planets.push(sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto);

    mercury.orbit = getOrbits(mercuryData);
    venus.orbit = getOrbits(venusData);
    earth.orbit = getOrbits(earthData);
    mars.orbit = getOrbits(marsData);
    jupiter.orbit = getOrbits(jupiterData);
    saturn.orbit = getOrbits(saturnData);
    uranus.orbit = getOrbits(uranusData);
    neptune.orbit = getOrbits(neptuneData);
    pluto.orbit = getOrbits(plutoData);
    sun.orbit = getOrbits(sunData);

    const spriteMaterial = new THREE.SpriteMaterial(
        {
            map: new THREE.TextureLoader().load("img/planets/glow.png"),
            color: 0xED5B0C,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(350, 350, 1.0);
    sun.add(sprite);

    createAsteroids(300, 120, 2 * Math.PI);
    createAsteroids(800, 315,  2 * Math.PI);
    createStars(10000, 3000);

    window.onload = function () {
        const a = document.getElementsByClassName('label');
        for (let i = 0; i < a.length; i++) {
            a[i].onclick = function() {
                showPlanetInfo(planets[i]);
                return false;
            }
        }
    }

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersectedPlanet;

    function onDocumentMouseDown( event ) {
        event.preventDefault();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        rayCaster.setFromCamera( mouse, camera );

        const intersectPlanets = rayCaster.intersectObjects(planets);

        if ( intersectPlanets.length > 0 && intersectPlanets[0].object.orbit) {
            if ( intersectedPlanet !== intersectPlanets[0].object ) {
                if ( intersectedPlanet ) {
                    intersectedPlanet.material.color.setHex( intersectedPlanet.currentHex );
                    intersectedPlanet.orbit.material.color.setHex( intersectedPlanet.orbit.currentHex );
                }

                intersectedPlanet = intersectPlanets[0].object;
                intersectedPlanet.currentHex = intersectedPlanet.material.color.getHex();
                intersectedPlanet.orbit.currentHex = intersectedPlanet.orbit.material.color.getHex();

                intersectedPlanet.material.color.setHex( 0xaaaaaa );
                intersectedPlanet.orbit.material.color.setHex( 0xaaaaaa);
                showPlanetInfo( intersectedPlanet );
            }
        } else {
            if ( intersectedPlanet ){
                intersectedPlanet.material.color.setHex( intersectedPlanet.currentHex );
                intersectedPlanet.orbit.material.color.setHex( intersectedPlanet.orbit.currentHex );
            }
            intersectedPlanet = null;
        }
    }

    function render(time) {

        if (resizeRendererToDisplay(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        movePlanet(sun, sunData, time);
        movePlanet(mercury, mercuryData, time);
        movePlanet(venus, venusData, time);
        movePlanet(earth, earthData, time);
        movePlanet(mars, marsData, time);
        movePlanet(jupiter, jupiterData, time);
        movePlanet(saturn, saturnData, time);
        movePlanet(saturnRings, saturnData, time, true);
        movePlanet(uranus, uranusData, time);
        movePlanet(neptune, neptuneData, time);
        movePlanet(pluto, plutoData, time);
        moveMoon(moon, earth, moonData, time);
        moveMoon(phobos, mars, phobosData, time);
        moveMoon(deimos, mars, deimosData, time);

        controls.update();

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

 init();



