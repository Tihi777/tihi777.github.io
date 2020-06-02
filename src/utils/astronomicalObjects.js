import * as THREE from "three";
import { getEllipse, getRings, getSphere } from "./geometries";
import { randomInteger } from "./utils";
import { getMaterial } from "./materials";
import { scene } from "../main";

const setPlanetInfo = (planet, data) => {
  planet.name = data.name;
  planet.rotationRate = data.info.rotationRate;
  planet.orbitRate = data.info.orbitRate;
  planet.radius = data.info.radius;
  planet.mass = data.info.mass;
  planet.temperature = data.info.temperature;
  planet.moons = data.info.moons;
};

export const getPlanet = (planetData, x, y, z, materialType) => {
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
};

export const getSaturnRings = (saturnData) => {
  const saturnRings = getRings(
    saturnData.rings.innerRadius,
    saturnData.rings.outerRadius,
    saturnData.rings.size,
    "../src/img/planets/saturnRings.png",
    "Saturn rings",
    saturnData.distanceFromAxis
  );
  scene.add(saturnRings);
  return saturnRings;
};

export const getOrbits = (earthData) => {
  const orbit = getEllipse(
    0,
    0,
    150,
    0x747474,
    "earthOrbit",
    earthData.distanceFromAxis
  );
  scene.add(orbit);
  return orbit;
};

export const createAsteroids = (amount, distanceFromAxis, angel) => {
  const geometry = new THREE.Geometry();
  const material = new THREE.PointsMaterial({
    size: 5,
    map: new THREE.TextureLoader().load("../src/img/planets/asteroid.png"),
    depthTest: true,
    transparent: false,
    sizeAttenuation: false,
    alphaTest: 0.9,
  });
  for (let i = 0; i < amount; i++) {
    const t = Math.random() * angel;
    const x = Math.cos(t) * distanceFromAxis + randomInteger(-5, 5);
    const y = 1.3 * Math.sin(t) * distanceFromAxis + randomInteger(-5, 5);
    geometry.vertices.push(new THREE.Vector3(x, y, randomInteger(-5, 5)));
  }
  const asteroids = new THREE.Points(geometry, material);
  asteroids.rotation.x = Math.PI / 2;
  scene.add(asteroids);
};

export const createStars = (amount, range) => {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < amount; i++) {
    vertices.push(THREE.MathUtils.randFloatSpread(range));
    vertices.push(THREE.MathUtils.randFloatSpread(range));
    vertices.push(THREE.MathUtils.randFloatSpread(range));
  }
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  const stars = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ color: 0x888888, sizeAttenuation: false })
  );
  scene.add(stars);
};
