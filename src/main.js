let camera, scene, renderer, controls, canvas;

const orbitData = {value: 200, runOrbit: true, runRotation: true};
let earthOrbit;

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

const moveSatellite = (satellite, planet, satelliteData, time) => {
    movePlanet(satellite, satelliteData, time);
    if (orbitData.runOrbit) {
        satellite.position.x = satellite.position.x + planet.position.x;
        satellite.position.z = satellite.position.z + planet.position.z;
    }
}

const loadTexturedPlanet = (myData, x, y, z, myMaterialType) => {
    let myMaterial;
    let passThisTexture;
    const loader = new THREE.TextureLoader();

    if (myData.texture && myData.texture !== "") {
        passThisTexture = loader.load(myData.texture);
    }
    if (myMaterialType) {
        myMaterial = getMaterial(myMaterialType, "rgb(255, 255, 255 )", passThisTexture);
    } else {
        myMaterial = getMaterial("lambert", "rgb(255, 255, 255 )", passThisTexture);
    }

    myMaterial.receiveShadow = true;
    myMaterial.castShadow = true;
    const myPlanet = getSphere(myMaterial, myData.size, myData.segments);
    myPlanet.receiveShadow = true;
    myPlanet.name = myData.name;
    scene.add(myPlanet);
    myPlanet.position.set(x, y, z);

    return myPlanet;
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
};

const createVisibleOrbits = (earthData) => {
    earthOrbit = getEllipse(
        0,
        0,
        150,
        0x434744,
        "earthOrbit",
        earthData.distanceFromAxis,
    );
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

    canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);


    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 999;

    const path = '../img/cubemap/';
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


    const sun = loadTexturedPlanet(sunData, sunData.distanceFromAxis, 0, 0, "basic");
    const mercury = loadTexturedPlanet(mercuryData, mercuryData.distanceFromAxis, 0, 0);
    const venus = loadTexturedPlanet(venusData, venusData.distanceFromAxis, 0, 0);
    const earth = loadTexturedPlanet(earthData, earthData.distanceFromAxis, 0, 0);
    const moon = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    const mars = loadTexturedPlanet(marsData, marsData.distanceFromAxis, 0, 0);
    const jupiter = loadTexturedPlanet(jupiterData, jupiterData.distanceFromAxis, 0, 0);
    const saturn = loadTexturedPlanet(saturnData, saturnData.distanceFromAxis, 0, 0);
    const uranus = loadTexturedPlanet(uranusData, uranusData.distanceFromAxis, 0, 0);
    const neptune = loadTexturedPlanet(neptuneData, neptuneData.distanceFromAxis, 0, 0);
    const pluto = loadTexturedPlanet(plutoData, plutoData.distanceFromAxis, 0, 0);


    createVisibleOrbits(mercuryData);
    createVisibleOrbits(venusData);
    createVisibleOrbits(earthData);
    createVisibleOrbits(marsData);
    createVisibleOrbits(jupiterData);
    createVisibleOrbits(saturnData);
    createVisibleOrbits(uranusData);
    createVisibleOrbits(neptuneData);
    createVisibleOrbits(plutoData);


    const spriteMaterial = new THREE.SpriteMaterial(
        {
            map: new THREE.TextureLoader().load("../img/planets/glow.png"),
            useScreenCoordinates: false,
            color: 0xED5B0C,
            transparent: false,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(200, 200, 1.0);
    sun.add(sprite);

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
        movePlanet(uranus, uranusData, time);
        movePlanet(neptune, neptuneData, time);
        movePlanet(pluto, plutoData, time);
        moveSatellite(moon, earth, moonData, time);

        controls.update();

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

init();