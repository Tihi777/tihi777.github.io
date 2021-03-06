import * as THREE from "three";
import { planets } from "../main";

export const resizeRendererToDisplay = (renderer) => {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
};

export const randomInteger = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};
