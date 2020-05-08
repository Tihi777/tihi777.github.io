const planetSegments = 48;
const earthSize = 2;
const sunData = {
    orbitRate: 0.00001,
    rotationRate: 0.0009,
    distanceFromAxis: 0,
    name: "Солнце",
    texture: "img/planets/sun.jpg",
    size: 40,
    segments: planetSegments,
    info: {
        orbitRate: "0 млн. км.",
        rotationRate: "0 дней",
        radius: "695, 5 тыс. км",
        mass: "1.9x10^30 кг",
        temperature: "5780K",
        moons: "нет",
    },
}

const mercuryData = {
    orbitRate: 6,
    rotationRate: 0.05,
    distanceFromAxis: 48,
    name: "Меркурий",
    texture: "img/planets/mercury.jpg",
    size: 2,
    segments: planetSegments,
    info: {
        orbitRate: "58 млн. км.",
        rotationRate: "88 дней",
        radius: "2.4 тыс. км",
        mass: "3.3x10^23 кг",
        temperature: "440K",
        moons: "нет",
    },
}

const venusData = {
    orbitRate: 8,
    rotationRate: 0.005,
    distanceFromAxis: 62,
    name: "Венера",
    description: " ",
    texture: "img/planets/venus.jpeg",
    size: 4,
    segments: planetSegments,
    info: {
        orbitRate: "108 млн. км.",
        rotationRate: "225 дней",
        radius: "6.1 тыс. км",
        mass: "4.9x10^24 кг",
        temperature: "730K",
        moons: "нет",
    },
}

const earthData = {
    orbitRate: 12,
    rotationRate: 0.025,
    distanceFromAxis: 80,
    name: "Земля",
    description: " ",
    texture: "img/planets/earth.jpg",
    size: 5,
    segments: planetSegments,
    info: {
        orbitRate: "150 млн. км.",
        rotationRate: "365 дней",
        radius: "6.4 тыс. км",
        mass: "6x10^24 кг",
        temperature: "287K",
        moons: "Луна",
    },
}

const marsData = {
    orbitRate: 35,
    rotationRate: 0.026,
    distanceFromAxis: 100,
    name: "Марс",
    description: " ",
    texture: "img/planets/mars.jpg",
    size: 3,
    segments: planetSegments,
    info: {
        orbitRate: "228 млн. км.",
        rotationRate: "687 дней",
        radius: "3.4 тыс. км",
        mass: "6.4x10^23 кг",
        temperature: "218K",
        moons: "Фобос, Деймос",
    },
}

const jupiterData = {
    orbitRate: 100,
    rotationRate: 0.03,
    distanceFromAxis: 150,
    name: "Юпитер",
    description: " ",
    texture: "img/planets/jupiter.svg",
    size: 20,
    segments: planetSegments,
    info: {
        orbitRate: "778 млн. км.",
        rotationRate: "12 лет",
        radius: "71 тыс. км",
        mass: "1.9x10^27 кг",
        temperature: "120K",
        moons: "Ганимед, Каллисто, Ио, Европа, Амальтея, Гималия, Фива и еще 72",
    },
}

const saturnData = {
    orbitRate: 200,
    rotationRate: 0.029,
    distanceFromAxis: 210,
    name: "Сатурн",
    description: " ",
    texture: "img/planets/saturn.jpg",
    size: 15,
    segments: planetSegments,
    rings: {
        innerRadius: earthSize / 0.1057 + 1,
        outerRadius: earthSize / 0.1057 + 15,
        size: 60,
    },
    info: {
        orbitRate: "1429 млн. км.",
        rotationRate: "29 лет",
        radius: "60 тыс. км",
        mass: "5.7x10^26 кг",
        temperature: "88K",
        moons: "Мимас, Энцелад, Тефия, Диона, Рея, Титан, Гиперион и еще 75",
    },
}

const uranusData = {
    orbitRate: 300,
    rotationRate: 0.029,
    distanceFromAxis: 250,
    name: "Уран",
    description: " ",
    texture: "img/planets/uranus.png",
    size: 9,
    segments: planetSegments,
    info: {
        orbitRate: "2871 млн. км.",
        rotationRate: "84 года",
        radius: "26 тыс. км",
        mass: "8.7x10^25 кг",
        temperature: "59K",
        moons: "Корделия, Офелия, Бианка, Крессида, Дездемона, Джульетта, Порция и еще 20",
    },
}

const neptuneData = {
    orbitRate: 350,
    rotationRate: 0.035,
    distanceFromAxis: 280,
    name: "Нептун",
    description: " ",
    texture: "img/planets/neptune.png",
    size: 8,
    segments: planetSegments,
    info: {
        orbitRate: "4504 млн. км.",
        rotationRate: "165 дней",
        radius: "25 тыс. км",
        mass: "1.0x10^26 кг",
        temperature: "48K",
        moons: "Тритон, Нереида, Наяда, Таласса, Деспина, Галатея, Ларисса и еще 7",
    },
}

const plutoData = {
    orbitRate: 380,
    rotationRate: 0.008,
    distanceFromAxis: 295,
    name: "Плутон",
    description: " ",
    texture: "img/planets/pluto.jpg",
    size: 1.5,
    segments: planetSegments,
    info: {
        orbitRate: "6021 млн. км.",
        rotationRate: "248 лет",
        radius: "1.1 тыс. км",
        mass: "1.3x10^22 кг",
        temperature: "50K",
        moons: "Харон, Стикс, Никта, Кербер, Гидра",
    },
}


