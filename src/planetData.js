const planetSegments = 48;
const earthSize = 2;
const sunData = {
    orbitRate: 0.00001,
    rotationRate: 0.0009,
    distanceFromAxis: 0,
    name: "Sun",
    description: " ",
    texture: "img/planets/sun.jpg",
    size: 40,
    segments: planetSegments,
}

const mercuryData = {
    orbitRate: 88,
    rotationRate: 0.009,
    distanceFromAxis: 48,
    name: "Mercury",
    description: " ",
    texture: "img/planets/mercury.jpg",
    size: earthSize / 2.5,
    segments: planetSegments,
}

const venusData = {
    orbitRate: 224.7,
    rotationRate: 0.024,
    distanceFromAxis: 62,
    name: "Mercury",
    description: " ",
    texture: "img/planets/venus.jpeg",
    size: earthSize / 2.1,
    segments: planetSegments,
}

const earthData = {
    orbitRate: 365.2564,
    rotationRate: 0.024,
    distanceFromAxis: 80,
    name: "Earth",
    description: " ",
    texture: "img/planets/earth.jpg",
    size: earthSize,
    segments: planetSegments,
}

const marsData = {
    orbitRate: 687,
    rotationRate: 0.015,
    distanceFromAxis: 100,
    name: "Mars",
    description: " ",
    texture: "img/planets/mars.jpg",
    size: earthSize / 1.88,
    segments: planetSegments,
}

const jupiterData = {
    orbitRate: 4343.5,
    rotationRate: 0.015,
    distanceFromAxis: 130,
    name: "Earth",
    description: " ",
    texture: "img/planets/jupiter.svg",
    size: earthSize / 0.089,
    segments: planetSegments,
}

const saturnData = {
    orbitRate: 167.5,
    rotationRate: 0.015,
    distanceFromAxis: 180,
    name: "Earth",
    description: " ",
    texture: "img/planets/saturn.jpg",
    size: earthSize / 0.1057,
    segments: planetSegments,
    rings: {
        innerRadius: earthSize / 0.1057 + 1,
        outerRadius: earthSize / 0.1057 + 15,
        size: 60,
    },
}

const uranusData = {
    orbitRate: 30660,
    rotationRate: 0.015,
    distanceFromAxis: 220,
    name: "Earth",
    description: " ",
    texture: "img/planets/uranus.png",
    size: earthSize / 0.249,
    segments: planetSegments,
}

const neptuneData = {
    orbitRate: 365.2564,
    rotationRate: 0.015,
    distanceFromAxis: 240,
    name: "Earth",
    description: " ",
    texture: "img/planets/neptune.png",
    size: earthSize / 0.2577,
    segments: planetSegments,
}

const plutoData = {
    orbitRate: 365.2564,
    rotationRate: 0.015,
    distanceFromAxis: 250,
    name: "Earth",
    description: " ",
    texture: "img/planets/pluto.jpg",
    size: earthSize / 4.25,
    segments: planetSegments,
}


