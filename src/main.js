let camera, scene, renderer, controls, canvas;

const orbitData = {value: 200, runOrbit: true, runRotation: true};

const resizeRendererToDisplay = renderer => {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

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

const getMaterial = (type, color, myTexture) => {
    const materialOptions = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color,
        map: myTexture === undefined ? null : myTexture
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

const movePlanet = (myPlanet, myData, myTime, stopRotation) => {
    if (orbitData.runRotation && !stopRotation) {
        myPlanet.rotation.y += myData.rotationRate;
    }
    if (orbitData.runOrbit) {
        myPlanet.position.x = Math.cos(myTime * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) * myData.distanceFromAxis;
        myPlanet.position.z = 1.3 * Math.sin(myTime * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) * myData.distanceFromAxis;
    }
}

const moveMoon = (satellite, planet, satelliteData, time) => {
    movePlanet(satellite, satelliteData, time);
    if (orbitData.runOrbit) {
        satellite.position.x = satellite.position.x + planet.position.x;
        satellite.position.z = satellite.position.z + planet.position.z;
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

const loadTexturedPlanet = (data, x, y, z, materialType) => {
    let material;
    let passThisTexture;
    const loader = new THREE.TextureLoader();

    if (data.texture && data.texture !== "") {
        passThisTexture = loader.load(data.texture);
    }
    if (materialType) {
        material = getMaterial(materialType, "rgb(255, 255, 255 )", passThisTexture);
    } else {
        material = getMaterial("lambert", "rgb(255, 255, 255 )", passThisTexture);
    }
    material.receiveShadow = true;
    material.castShadow = true;

    const planet = getSphere(material, data.size, data.segments);
    planet.receiveShadow = true;

    if (data.info){
        console.log(data.info);
        setPlanetInfo(planet, data);
    }


    scene.add(planet);
    planet.position.set(x, y, z);

    return planet;
}

const createRings = (innerRadius, outerRadius, size, texture, name, distanceFromAxis) => {
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

const getSaturnRing = (saturnData) => {
    return createRings(
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

const createVisibleOrbits = (earthData) => {
    return getEllipse(
        0,
        0,
        150,
        0x747474,
        "earthOrbit",
        earthData.distanceFromAxis,
    );
}

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

const getAsteroids = (amount, distanceFromAxis, angel) => {
    const geometry = new THREE.Geometry();
    const material = new THREE.PointsMaterial({
        size: 5,
        map: new THREE.TextureLoader().load("img/planets/meteor.png"),
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

    const path = 'img/cubemap/';
    const format = '.png';
    const urls = [
        path + 'right' + format,
        path + 'left' + format,
        path + 'top' + format,
        path + 'bottom' + format,
        path + 'front' + format,
        path + 'back' + format,
    ];
    const reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;
    scene.background = reflectionCube;

    const pointLight = getPointLight(1.5, "rgb(255, 220, 180)");
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.2);
    scene.add(ambientLight);

    const planets = []
    const sun = loadTexturedPlanet(sunData, sunData.distanceFromAxis, 0, 0, "basic");
    const mercury = loadTexturedPlanet(mercuryData, mercuryData.distanceFromAxis, 0, 0);
    const venus = loadTexturedPlanet(venusData, venusData.distanceFromAxis, 0, 0);
    const earth = loadTexturedPlanet(earthData, earthData.distanceFromAxis, 0, 0);
    const moon = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    const mars = loadTexturedPlanet(marsData, marsData.distanceFromAxis, 0, 0);
    const phobos = loadTexturedPlanet(phobosData, phobosData.distanceFromAxis, 0, 0);
    const deimos = loadTexturedPlanet(deimosData, deimosData.distanceFromAxis, 0, 0);
    const jupiter = loadTexturedPlanet(jupiterData, jupiterData.distanceFromAxis, 0, 0);
    const saturn = loadTexturedPlanet(saturnData, saturnData.distanceFromAxis, 0, 0);
    const saturnRings = getSaturnRing(saturnData);
    const uranus = loadTexturedPlanet(uranusData, uranusData.distanceFromAxis, 0, 0);
    const neptune = loadTexturedPlanet(neptuneData, neptuneData.distanceFromAxis, 0, 0);
    const pluto = loadTexturedPlanet(plutoData, plutoData.distanceFromAxis, 0, 0);

    planets.push(sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto);

    mercury.orbit = createVisibleOrbits(mercuryData);
    venus.orbit = createVisibleOrbits(venusData);
    earth.orbit = createVisibleOrbits(earthData);
    mars.orbit = createVisibleOrbits(marsData);
    jupiter.orbit = createVisibleOrbits(jupiterData);
    saturn.orbit = createVisibleOrbits(saturnData);
    uranus.orbit = createVisibleOrbits(uranusData);
    neptune.orbit = createVisibleOrbits(neptuneData);
    pluto.orbit = createVisibleOrbits(plutoData);
    sun.orbit = createVisibleOrbits(sunData);
    const spriteMaterial = new THREE.SpriteMaterial(
        {
            map: new THREE.TextureLoader().load("img/planets/glow.png"),
            color: 0xED5B0C,
            transparent: false,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(250, 250, 1.0);
    sun.add(sprite);

    getAsteroids(300, 120, 2 * Math.PI);
    getAsteroids(800, 315,  2 * Math.PI);

    {
        var geometry = new THREE.BufferGeometry();
        var vertices = [];
        for ( var i = 0; i < 10000; i ++ ) {
            vertices.push( THREE.MathUtils.randFloatSpread( 3000 ) ); // x
            vertices.push( THREE.MathUtils.randFloatSpread( 3000 ) ); // y
            vertices.push( THREE.MathUtils.randFloatSpread( 3000 ) ); // z
        }
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        var particles = new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0x888888, sizeAttenuation: false, } ) );
        scene.add( particles );
    }

    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

    const showPlanetInfo = planet => {
        document.getElementById("name").innerText = planet.name;
        document.getElementById("mass").innerText = planet.mass;
        document.getElementById("orbitRate").innerText = planet.orbitRate;
        document.getElementById("rotationRate").innerText = planet.rotationRate;
        document.getElementById("radius").innerText = planet.radius;
        document.getElementById("temperature").innerText = planet.temperature;
        document.getElementById("moons").innerText = planet.moons;
    }

    window.onload = function () {
        const a = document.getElementsByClassName('label');
        console.log(a);
        for (let i = 0; i < a.length; i++) {
            a[i].onclick = function() {
                showPlanetInfo(planets[i]);
                return false;
            }
        }
    }

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
                showPlanetInfo(intersectedPlanet);
            }
        } else {
            if ( intersectedPlanet ){
                intersectedPlanet.material.color.setHex( intersectedPlanet.currentHex );
                intersectedPlanet.orbit.material.color.setHex( intersectedPlanet.orbit.currentHex );
            }
            intersectedPlanet = null;
        }
    }


    scene.add(new THREE.AxesHelper(50));
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



