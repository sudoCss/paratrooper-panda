import { GUI } from "dat.gui";
import { ENVIRONMENT } from "./physics";

let guiA;

export function setupControlPanel() {
    const gui = new GUI();

    gui.add(ENVIRONMENT, "G", 0, 100, 0.01);

    gui.add(ENVIRONMENT, "Cd", 0.8, 1.2, 0.001);
    gui.add(ENVIRONMENT, "Ro", 0, 10, 0.001);

    guiA = gui.add(ENVIRONMENT, "A", 0.1, 100, 0.1);

    gui.add(ENVIRONMENT, "M", 1, 1000, 0.1);
}

export function updateControlPanel() {
    guiA?.updateDisplay();
}
