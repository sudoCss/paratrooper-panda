import { GUI } from "lil-gui";
import { ENVIRONMENT } from "./physics";

let guiA;

export function setupControlPanel(handleOnChange) {
    const gui = new GUI();

    gui.add(ENVIRONMENT, "G", 0, 100, 0.01);

    gui.add(ENVIRONMENT, "Cd", 0.8, 1.2, 0.001);
    gui.add(ENVIRONMENT, "Ro", 0, 10, 0.001);

    guiA = gui.add(ENVIRONMENT, "A", 0.1, 200, 0.1).onChange(()=>{
        const values = gui.save();
        handleOnChange(values);
    });

    gui.add(ENVIRONMENT, "M", 1, 1000, 0.1);
}

export function updateControlPanel() {
    guiA?.updateDisplay();
}
