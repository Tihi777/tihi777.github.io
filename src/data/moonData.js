import { PLANETS } from "./planetData";
const { earthData, marsData } = PLANETS;
const MOON_SEGMENTS = 48;
const PATH = "./src/img/planets/";

export const MOONS = {
  moonData: {
    orbitRate: 6,
    rotationRate: 0.01,
    distanceFromAxis: 7,
    planet: earthData,
    name: "Луна",
    texture: `${PATH}moon.jpg`,
    size: 1.5,
    segments: MOON_SEGMENTS,
  },
  phobosData: {
    orbitRate: 3,
    rotationRate: 0.01,
    distanceFromAxis: 6,
    planet: marsData,
    name: "Фобос",
    texture: `${PATH}phobos.jpg`,
    size: 0.9,
    segments: MOON_SEGMENTS,
  },
  deimosData: {
    orbitRate: 5,
    rotationRate: 0.01,
    distanceFromAxis: 8,
    planet: marsData,
    name: "Деймос",
    texture: `${PATH}deimos.jpg`,
    size: 0.6,
    segments: MOON_SEGMENTS,
  },
};
