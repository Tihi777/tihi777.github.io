import * as THREE from "three";

export const getMaterial = (type, color, texture) => {
  const materialOptions = {
    color: color === undefined ? "rgb(255, 255, 255)" : color,
    map: texture === undefined ? null : texture,
  };

  switch (type) {
    case "basic":
      return new THREE.MeshBasicMaterial(materialOptions);
    case "lambert":
      return new THREE.MeshLambertMaterial(materialOptions);
    case "phong":
      return new THREE.MeshPhongMaterial(materialOptions);
    case "standard":
      return new THREE.MeshStandardMaterial(materialOptions);
    default:
      return new THREE.MeshBasicMaterial(materialOptions);
  }
};
