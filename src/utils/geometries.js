import * as THREE from "three";

export const getSphere = (material, size, segments) => {
  const geometry = new THREE.SphereGeometry(size, segments, segments);
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;

  return sphere;
};

export const getRings = (
  innerRadius,
  outerRadius,
  size,
  texture,
  name,
  distanceFromAxis
) => {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, size);
  const ringTexture = new THREE.TextureLoader().load(texture);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      texture: { value: ringTexture },
      innerRadius: { value: innerRadius },
      outerRadius: { value: outerRadius },
    },
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const rings = new THREE.Mesh(geometry, material);
  rings.name = name;
  rings.position.set(distanceFromAxis, 0, 0);
  rings.rotation.x = Math.PI / 2;
  rings.rotation.y = -Math.PI / 8;
  return rings;
};

export const getEllipse = (x, y, size, color, name, distanceFromAxis) => {
  const curve = new THREE.EllipseCurve(
    x,
    y,
    distanceFromAxis,
    1.3 * distanceFromAxis,
    0,
    2 * Math.PI,
    false,
    0
  );

  const points = curve.getPoints(size);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: color });
  const ellipse = new THREE.Line(geometry, material);
  ellipse.rotation.x = Math.PI / 2;
  return ellipse;
};
