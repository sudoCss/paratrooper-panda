import {
    AnimationMixer,
    CubeTextureLoader,
    LoadingManager,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry,
    RepeatWrapping,
    TextureLoader,
    Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loads = {
    panda: null,
    parachute: null,
    ship: null,
    cloud: null,
    tree: null,
    skybox: null,
    ground: null,
    pandaAnimationMixer: null,
    pandaAnimations: [],
};

export function startLoading(handleOnLoad, handleOnProgress) {
    const loadingManager = new LoadingManager(() => {
        handleOnLoad(loads);
    }, handleOnProgress);

    const modelLoader = new GLTFLoader(loadingManager);

    modelLoader.load("/assets/models/panda/Panda.gltf", (gltf) => {
        loads.panda = gltf.scene;

        loads.pandaAnimationMixer = new AnimationMixer(gltf.scene);
        const action1 = loads.pandaAnimationMixer
            .clipAction(gltf.animations[9])
            .play();

        loads.pandaAnimations.push(action1);
    });

    modelLoader.load("/assets/models/parachute/scene.gltf", (gltf) => {
        gltf.scene.position.set(0, -0.3, -1);
        loads.parachute = gltf.scene;
    });

    modelLoader.load("/assets/models/ship/ship_dark.gltf", (gltf) => {
        gltf.scene.rotateOnAxis(new Vector3(0, 1, 0), -Math.PI / 2);
        gltf.scene.scale.set(10, 10, 10);
        gltf.scene.position.set(-11, 0, -55);
        loads.ship = gltf.scene;
    });

    modelLoader.load("/assets/models/cloud/scene.gltf", (gltf) => {
        loads.cloud = gltf.scene;
    });

    modelLoader.load("/assets/models/tree/scene.gltf", (gltf) => {
        loads.tree = gltf.scene;
    });

    /* Textures */
    const cubeTextureLoader = new CubeTextureLoader(loadingManager);

    cubeTextureLoader.load(
        [
            "/assets/skybox/px.png",
            "/assets/skybox/nx.png",
            "/assets/skybox/py.png",
            "/assets/skybox/ny.png",
            "/assets/skybox/pz.png",
            "/assets/skybox/nz.png",
        ],
        (texture) => {
            loads.skybox = texture;
        },
    );

    const textureLoader = new TextureLoader(loadingManager);

    loads.ground = new Mesh(
        new PlaneGeometry(10000, 10000, 1000, 1000),
        new MeshStandardMaterial({
            displacementScale: 0.0001,
            metalness: 0.1,
            roughness: 0.9,
        }),
    );
    loads.ground.rotateOnAxis(new Vector3(1, 0, 0), -Math.PI / 2);

    textureLoader.load(
        "/assets/textures/Grass/Grass_005_AmbientOcclusion.jpg",
        (texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(1000, 1000);
            loads.ground.material.aoMap = texture;
        },
    );

    textureLoader.load(
        "/assets/textures/Grass/Grass_005_BaseColor.jpg",
        (texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(1000, 1000);
            loads.ground.material.map = texture;
        },
    );

    textureLoader.load(
        "/assets/textures/Grass/Grass_005_Height.png",
        (texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(1000, 1000);
            loads.ground.material.displacementMap = texture;
        },
    );

    textureLoader.load(
        "/assets/textures/Grass/Grass_005_Normal.jpg",
        (texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(1000, 1000);
            loads.ground.material.normalMap = texture;
        },
    );

    textureLoader.load(
        "/assets/textures/Grass/Grass_005_Roughness.jpg",
        (texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(1000, 1000);
            loads.ground.material.roughnessMap = texture;
        },
    );
}
