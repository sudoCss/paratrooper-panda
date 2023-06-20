// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Group, LoadingManager, Scene, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/**
 * @type {Map<string, Group>}
 */
const models = new Map();

const loadingManager = new LoadingManager();
const loader = new GLTFLoader(loadingManager);

/**
 *
 * @param {string} key - A unique string key to identify each model
 * @param {string} path - The GLTF model path
 * @param {Vector3} scale - The scale to apply to the model
 * @returns {void}
 */
export function loadGLTFModel(key, path, scale = { x: 1, y: 1, z: 1 }) {
    loader.load(path, (gltf) => {
        gltf.scene.traverse((i) => {
            if (i.isObject3D) {
                i.castShadow = true;
                i.receiveShadow = true;
            }
        });

        gltf.scene.scale.set(scale.x, scale.y, scale.z);

        console.log(gltf.animations);

        models.set(key, gltf.scene);
    });
}

/**
 *
 * @param {string} key - The key of the model to add
 * @param {Vector3} position - The position to place the model
 * @param {Scene} scene - The scene to add the model in
 * @returns {void}
 */
export function placeGLTFModel(key, position = { x: 0, y: 0, z: 0 }, scene) {
    loadingManager.addHandler("");
    const model = models.get(key)?.clone();
    if (model === undefined) return;
    model.position.set(position.x, position.y, position.z);
    scene.add(model);
}

export const GLTFLoadingManager = loadingManager;
