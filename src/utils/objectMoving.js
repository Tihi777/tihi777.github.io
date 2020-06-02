import { orbitData } from "./gui";

export const movePlanet = (planet, planetData, time, stopRotation) => {
  if (orbitData.runRotation && !stopRotation) {
    planet.rotation.y += planetData.rotationRate;
  }
  if (orbitData.runOrbit) {
    planet.position.x =
      Math.cos(
        time * (1.0 / (planetData.orbitRate * orbitData.value + 1)) + 10.0
      ) * planetData.distanceFromAxis;
    planet.position.z =
      1.3 *
      Math.sin(
        time * (1.0 / (planetData.orbitRate * orbitData.value + 1)) + 10.0
      ) *
      planetData.distanceFromAxis;
  }
};

export const moveMoon = (moon, planet, moonData, time) => {
  movePlanet(moon, moonData, time);
  if (orbitData.runOrbit) {
    moon.position.x = moon.position.x + planet.position.x;
    moon.position.z = moon.position.z + planet.position.z;
  }
};
