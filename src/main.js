import "./style.css";

import {
    AmbientLight,
    Clock,
    DirectionalLight,
    Group,
    LinearSRGBColorSpace,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import Stats from "stats.js";

import { startLoading } from "./loading";

import { ENVIRONMENT, physics, setup } from "./physics";
import { updateHabdometer } from "./habdometer";
import { setupControlPanel, updateControlPanel } from "./controlPanel";

/* DOM access */
const canvas = document.getElementById("scene");

/* Global Constants */
const scene = new Scene();
const camera = new PerspectiveCamera(
    75,
    canvas.width / canvas.height,
    0.1,
    10000,
);
const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
});
const shipGroup = new Group();
const clock = new Clock(false);
const jumpClock = new Clock(false);

let jumped = false,
    opened = false;
let panda,
    parachute,
    ship,
    cloud,
    skybox,
    ground,
    pandaAnimationMixer,
    pandaAnimations = [];

/** @type {Stats} */
let stats;

/* Functions */
function handleWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
}

function changeState() {
    if (!jumped) {
        jumped = true;
        jumpClock.start();

        shipGroup.remove(panda);
        panda.position.set(
            shipGroup.position.x,
            shipGroup.position.y,
            shipGroup.position.z,
        );
        scene.add(panda);
    } else if (!opened) {
        opened = true;
        panda.add(parachute);
        ENVIRONMENT.A = ENVIRONMENT.A2;
        updateControlPanel();
    }
}

function handleKeypress(e) {
    if (e.code.startsWith("Digit")) {
        const scaler = parseInt(e.code.slice(-1));
        camera.position.z = scaler === 0 ? 5 : scaler * 10;
    }
    if (e.code === "Space") {
        changeState();
    }
}

function init() {
    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom); // for mb use chrome with flag: --enable-precise-memory-info

    clock.start();

    setupControlPanel(({ controllers: { A } }) => {
        if (opened) {
            const scaler = A / 20;
            parachute.scale.set(scaler, scaler, scaler);
        }
    });

    scene.background = skybox;

    panda.position.set(-3, 12.8, -8);
    panda.add(camera);

    shipGroup.add(panda);
    shipGroup.add(ship);

    shipGroup.position.y = ENVIRONMENT.H;

    scene.add(shipGroup);
    scene.add(ground);

    /* Lighting */
    const ambientLight = new AmbientLight(0xffffff, 1);
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10000, 10);
    scene.add(ambientLight, directionalLight);

    camera.position.set(0, 1, 5);
    setTimeout(() => {
        window.addEventListener("keypress", handleKeypress);
        window.addEventListener("dblclick", changeState);
    }, 1000);

    renderer.outputColorSpace = LinearSRGBColorSpace;
}

function update(deltaTime) {
    pandaAnimationMixer.update(deltaTime);

    if (jumped) {
        shipGroup.position.x += deltaTime * ENVIRONMENT.V0x;
        const { v, a, tv, pos } = physics(deltaTime);

        if (panda.position.y > 1) {
            panda.position.setX(panda.position.x + pos.x);
            panda.position.setY(panda.position.y - pos.y);

            updateHabdometer(
                jumpClock.getElapsedTime(),
                deltaTime,
                v,
                tv,
                a,
                panda.position.x,
                panda.position.y,
                pos.x,
                pos.y,
            );
        } else {
            panda.position.setY(0.6);

            updateHabdometer(
                jumpClock.getElapsedTime(),
                deltaTime,
                0,
                0,
                0,
                panda.position.x,
                0,
                0,
                0,
            );
            // TODO: Make the parachute fall back instead
            panda.remove(parachute);
        }
    } else {
        cloud.rotateY(clock.getElapsedTime() * 0.0001);
    }
}

function render() {
    renderer.render(scene, camera);
}

function loop() {
    window.requestAnimationFrame(loop);

    stats.begin();
    update(clock.getDelta());
    render();
    stats.end();
}

function handleValuesSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const fields = Object.fromEntries(data.entries());

    ENVIRONMENT.V0x = +fields.shipSpeed;
    ENVIRONMENT.H = +fields.shipHeight;
    setup();

    document.querySelector(".loading").remove();

    init();
    loop();
}

function handleOnLoad(loads) {
    document
        .querySelector(".loading .spinner-container")
        .classList.add("hidden");

    const form = document.querySelector(".loading .initials");
    form.classList.remove("hidden");

    panda = loads.panda;
    parachute = loads.parachute;
    ship = loads.ship;
    cloud = loads.cloud;
    skybox = loads.skybox;
    ground = loads.ground;
    pandaAnimationMixer = loads.pandaAnimationMixer;
    pandaAnimations = loads.pandaAnimations;
    console.log(pandaAnimations);

    form.addEventListener("submit", handleValuesSubmit);
}

function handleOnProgress(_url, itemsLoaded, itemsTotal) {
    const progress = document.getElementById("progress-bar");
    progress.value = (itemsLoaded / itemsTotal) * 100;
}

function main() {
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("load", handleWindowResize);

    startLoading(handleOnLoad, handleOnProgress);
}

/* Main program (function calls) */
main();
