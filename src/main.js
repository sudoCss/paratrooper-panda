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

import { ENVIRONMENT, physics } from "./physics/index";

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
const pandaJumpPos = { x: 0, y: 0 };
let jumped = false;
let opened = false;

/* Functions */
const handleWindowResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
};

const init = () => {
    clock.start();

    scene.background = skybox;

    panda.position.set(-3, 12.8, -8);
    // panda.rotation.set(0, -Math.PI / 2, 0);
    panda.add(camera);

    shipGroup.add(panda);
    shipGroup.add(ship);

    shipGroup.position.y = ENVIRONMENT.H;

    scene.add(shipGroup);
    // scene.add(cloud);
    scene.add(ground);

    /* Lighting */
    const ambientLight = new AmbientLight(0xffffff, 1);
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-1000, 1000, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 3000;
    scene.add(ambientLight, directionalLight);

    camera.position.set(0, 1, 5);
    window.addEventListener("keypress", (e) => {
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
                pandaJumpPos.x = panda.position.x;
                pandaJumpPos.y = panda.position.y;
                scene.add(panda);
            } else if (!opened) {
                opened = true;

                pandaJumpPos.x = panda.position.x;
                pandaJumpPos.y = panda.position.y;

                jumpClock.start();
                ENVIRONMENT.A = 5;
            }
        }
    });

    renderer.outputColorSpace = LinearSRGBColorSpace;
};

const update = (delta, elapsedTime) => {
    pandaAnimationMixer.update(delta);
    if (jumped) {
        const { v, a, tv, pos } = physics(elapsedTime);

        if (panda.position.y > 0) {
            panda.position.setX(pandaJumpPos.x - pos.x);
            panda.position.setY(pandaJumpPos.y - pos.y);
        }
        console.log(elapsedTime, panda.position, v, a, tv);
    }
};

const render = () => {
    renderer.render(scene, camera);
};

export const main = () => {
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("load", handleWindowResize);

    const loop = () => {
        window.requestAnimationFrame(loop);

        update(clock.getDelta(), clock.elapsedTime);
        render();
    };

    const loadingManager = new LoadingManager(
        () => {
            document
                .querySelector(".loading .spinner-container")
                .classList.add("hidden");

            const form = document.querySelector(".loading .initials");
            form.classList.remove("hidden");

            form.addEventListener("submit", (e) => {
                e.preventDefault();
                /** Get Inputs and change variables if needed */
                const data = new FormData(e.target);
                const fields = Object.fromEntries(data.entries());
                console.log(fields);
                ENVIRONMENT.V0x = +fields.shipSpeed;
                ENVIRONMENT.H = +fields.shipHeight;

                /** Get Inputs */
                document.querySelector(".loading").remove();

                init();
                loop();
            });
        },
        (_url, itemsLoaded, itemsTotal) => {
            const progress = document.getElementById("progress-bar");
            progress.value = (itemsLoaded / itemsTotal) * 100;
        },
    );

    startLoading(loadingManager);
};

/* Main program (function calls) */
main();
