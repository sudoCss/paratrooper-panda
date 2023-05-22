import {
    AnimationMixer,
    CubeTextureLoader,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry,
    RepeatWrapping,
    TextureLoader,
    Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export let panda,
    ship,
    // cloud,
    skybox,
    ground,
    pandaAnimationMixer,
    pandaAnimations = [];

export function startLoading(loadingManager) {
    const modelLoader = new GLTFLoader(loadingManager);
    modelLoader.load(
        "/assets/models/Sushi Restaurant/Characters/Normal/Panda.gltf",
        (gltf) => {
            gltf.scene.traverse((i) => {
                if (i.isObject3D) {
                    i.castShadow = true;
                    i.receiveShadow = true;
                }
            });
            panda = gltf.scene;

            pandaAnimationMixer = new AnimationMixer(gltf.scene);
            console.log(gltf.animations.map((i) => i.name));
            const action1 = pandaAnimationMixer
                .clipAction(gltf.animations[9])
                .play();

            pandaAnimations.push(action1);
        },
    );

    modelLoader.load("/assets/models/Pirate/ship_dark.gltf", (gltf) => {
        gltf.scene.traverse((i) => {
            if (i.isObject3D) {
                i.castShadow = true;
                i.receiveShadow = true;
            }
        });
        gltf.scene.scale.set(10, 10, 10);
        gltf.scene.position.set(-43, 0, 0);
        ship = gltf.scene;
    });

    // modelLoader.load("/assets/models/Cloud/cloud.glb", (gltf) => {
    //     cloud = gltf.scene;
    // });

    /* Textures */
    const cubeTextureLoader = new CubeTextureLoader(loadingManager);

    cubeTextureLoader.load(
        [
            "/assets/skyboxes/Cloudy Puresky/px.png",
            "/assets/skyboxes/Cloudy Puresky/nx.png",
            "/assets/skyboxes/Cloudy Puresky/py.png",
            "/assets/skyboxes/Cloudy Puresky/ny.png",
            "/assets/skyboxes/Cloudy Puresky/pz.png",
            "/assets/skyboxes/Cloudy Puresky/nz.png",
        ],
        (texture) => {
            skybox = texture;
        },
    );

    const textureLoader = new TextureLoader(loadingManager);

    ground = new Mesh(
        new PlaneGeometry(10000, 10000, 1000, 1000),
        new MeshStandardMaterial({
            displacementScale: 0.0001,
            metalness: 0.1,
            roughness: 0.9,
        }),
    );
    ground.rotateOnAxis(new Vector3(1, 0, 0), -Math.PI / 2);
    ground.receiveShadow = true;

    textureLoader.load(
        "/assets/textures/Grass/Grass_005_AmbientOcclusion.jpg",
        (texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(1000, 1000);
            ground.material.aoMap = texture;
        },
    );

    textureLoader.load(
        "/assets/textures/Grass/Grass_005_BaseColor.jpg",
        (texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(1000, 1000);
            ground.material.map = texture;
        },
    );

    textureLoader.load(
        "/assets/textures/Grass/Grass_005_Height.png",
        (texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(1000, 1000);
            ground.material.displacementMap = texture;
        },
    );

    textureLoader.load(
        "/assets/textures/Grass/Grass_005_Normal.jpg",
        (texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(1000, 1000);
            ground.material.normalMap = texture;
        },
    );

    textureLoader.load(
        "/assets/textures/Grass/Grass_005_Roughness.jpg",
        (texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(1000, 1000);
            ground.material.roughnessMap = texture;
        },
    );
}
