import "./style.css";

import {
    AmbientLight,
    Clock,
    DirectionalLight,
    Group,
    LinearSRGBColorSpace,
    LoadingManager,
    PCFSoftShadowMap,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";

import {
    // cloud,
    ground,
    panda,
    pandaAnimationMixer,
    ship,
    skybox,
    startLoading,
} from "./loading";

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
    100_000,
);
const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
const shipGroup = new Group();
const clock = new Clock(false);
const jumpClock = new Clock(false);
let jumped = false;
let opened = false;

/* Functions */
function handleWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
}

function handleKeypress(e) {
    if (e.code === "KeyV") {
        camera.position.z = camera.position.z === 5 ? 300 : 5;
    }
    if (e.code === "Space") {
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
            ENVIRONMENT.A = ENVIRONMENT.A2;
            updateControlPanel();
        }
    }
}

function init() {
    clock.start();

    setupControlPanel();

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
    directionalLight.position.set(-1000, 1000, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 3000;
    scene.add(ambientLight, directionalLight);

    camera.position.set(0, 1, 5);
    window.addEventListener("keypress", handleKeypress);

    renderer.outputColorSpace = LinearSRGBColorSpace;
}

function update(deltaTime) {
    pandaAnimationMixer.update(deltaTime);
    if (jumped) {
        const { v, a, tv, pos } = physics(deltaTime);

        if (panda.position.y > 0) {
            panda.position.setX(panda.position.x + pos.x);
            panda.position.setY(panda.position.y - pos.y);
        }

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
    }
}

function render() {
    renderer.render(scene, camera);
}

function loop() {
    window.requestAnimationFrame(loop);

    update(clock.getDelta());
    render();
}

function handleValuesSubmit(e) {
    e.preventDefault();
    /** Get Inputs and change variables if needed */
    const data = new FormData(e.target);
    const fields = Object.fromEntries(data.entries());

    ENVIRONMENT.V0x = +fields.shipSpeed;
    ENVIRONMENT.H = +fields.shipHeight;
    setup();

    /** Get Inputs */
    document.querySelector(".loading").remove();

    init();
    loop();
}

function handleOnLoad() {
    document
        .querySelector(".loading .spinner-container")
        .classList.add("hidden");

    const form = document.querySelector(".loading .initials");
    form.classList.remove("hidden");

    form.addEventListener("submit", handleValuesSubmit);
}

function handleOnProgress(_url, itemsLoaded, itemsTotal) {
    const progress = document.getElementById("progress-bar");
    progress.value = (itemsLoaded / itemsTotal) * 100;
}

function main() {
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("load", handleWindowResize);

    const loadingManager = new LoadingManager(handleOnLoad, handleOnProgress);

    startLoading(loadingManager);
}

/* Main program (function calls) */
main();
