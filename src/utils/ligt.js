import * as THREE from "three";

export const getPointLight = (intensity, color) => {
  const light = new THREE.PointLight(color, intensity);
  light.castShadow = true;
  light.shadow.bias = 0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  return light;
};
