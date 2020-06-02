import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./styles/index.scss";

import {
  createAsteroids,
  createStars,
  getOrbits,
  getPlanet,
  getSaturnRings,
} from "./utils/astronomicalObjects";
import { getPointLight } from "./utils/ligt";
import { moveMoon, movePlanet } from "./utils/objectMoving";
import { resizeRendererToDisplay } from "./utils/utils";

import { PLANETS } from "./data/planetData";
import { MOONS } from "./data/moonData";

export const scene = new THREE.Scene();
const {
  sunData,
  mercuryData,
  venusData,
  earthData,
  marsData,
  jupiterData,
  saturnData,
  uranusData,
  neptuneData,
  plutoData,
} = PLANETS;
const { moonData, phobosData, deimosData } = MOONS;
export const planets = [];
const rayCaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersectedPlanet;

function initialization() {
  const fov = 45;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 1;
  const far = 1500;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(50, 50, 100);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.antialias = true;

  const canvas = document.getElementById("canvas");
  canvas.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 60;
  controls.maxDistance = 999;

  const urls = [
    "./src/img/cubemap/right.png",
    "./src/img/cubemap/left.png",
    "./src/img/cubemap/top.png",
    "./src/img/cubemap/bottom.png",
    "./src/img/cubemap/front.png",
    "./src/img/cubemap/back.png",
  ];
  const cubeMap = new THREE.CubeTextureLoader().load(urls);
  cubeMap.format = THREE.RGBFormat;
  scene.background = cubeMap;

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

  planets.push(
    sun,
    mercury,
    venus,
    earth,
    mars,
    jupiter,
    saturn,
    uranus,
    neptune,
    pluto
  );

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

  const spriteMaterial = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("./src/img/planets/glow.png"),
    color: 0xed5b0c,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(350, 350, 1.0);
  sun.add(sprite);

  createAsteroids(300, 120, 2 * Math.PI);
  createAsteroids(800, 315, 2 * Math.PI);
  createStars(10000, 3000);

  const showPlanetInfo = (planet) => {
    document.getElementById("name").innerText = planet.name;
    document.getElementById("mass").innerText = planet.mass;
    document.getElementById("orbitRate").innerText = planet.orbitRate;
    document.getElementById("rotationRate").innerText = planet.rotationRate;
    document.getElementById("radius").innerText = planet.radius;
    document.getElementById("temperature").innerText = planet.temperature;
    document.getElementById("moons").innerText = planet.moons;
  };

  window.onload = () => {
    const labels = document.getElementsByClassName("label");
    Array.from(labels).forEach((label, index) => {
      label.onclick = () => {
        showPlanetInfo(planets[index]);
        return false;
      };
    });
  };

  document.addEventListener("mousedown", onDocumentMouseDown, false);

  function onDocumentMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    rayCaster.setFromCamera(mouse, camera);

    const intersectPlanets = rayCaster.intersectObjects(planets);

    if (intersectPlanets.length > 0 && intersectPlanets[0].object.orbit) {
      if (intersectedPlanet !== intersectPlanets[0].object) {
        if (intersectedPlanet) {
          intersectedPlanet.material.color.setHex(intersectedPlanet.currentHex);
          intersectedPlanet.orbit.material.color.setHex(
            intersectedPlanet.orbit.currentHex
          );
        }

        intersectedPlanet = intersectPlanets[0].object;
        intersectedPlanet.currentHex = intersectedPlanet.material.color.getHex();
        intersectedPlanet.orbit.currentHex = intersectedPlanet.orbit.material.color.getHex();

        intersectedPlanet.material.color.setHex(0xaaaaaa);
        intersectedPlanet.orbit.material.color.setHex(0xaaaaaa);
        showPlanetInfo(intersectedPlanet);
      }
    } else {
      if (intersectedPlanet) {
        intersectedPlanet.material.color.setHex(intersectedPlanet.currentHex);
        intersectedPlanet.orbit.material.color.setHex(
          intersectedPlanet.orbit.currentHex
        );
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

initialization();
