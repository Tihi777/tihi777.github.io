import { planets } from "../main";
import dat from "dat.gui";

const panel = new dat.GUI();
panel.close();
panel.width = 370;

export const orbitData = {
  value: 0.5,
  runOrbit: true,
  runRotation: true,
  showOrbit: true,
};

const showOrbit = (v) => {
  planets.map((planet) => {
    planet.orbit.material.visible = v;
  });
};

panel.add(orbitData, "value", 0.5, 10, 0.01).name("Скорость вращения");
panel.add(orbitData, "runOrbit").name("Вращать вокруг солнца");
panel.add(orbitData, "runRotation").name("Вращать вокруг своей оси");
panel.add(orbitData, "showOrbit").onChange(showOrbit).name("Отобразить орбиты");
