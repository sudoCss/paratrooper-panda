const timeMeter = document.getElementById("time-meter");
const deltaTimeMeter = document.getElementById("delta-time-meter");
const velocityMeter = document.getElementById("velocity-meter");
const terminalVelocityMeter = document.getElementById(
    "terminal-velocity-meter",
);
const accelerationMeter = document.getElementById("acceleration-meter");
const currentXMeter = document.getElementById("current-x-meter");
const currentYMeter = document.getElementById("current-y-meter");
const deltaXMeter = document.getElementById("delta-x-meter");
const deltaYMeter = document.getElementById("delta-y-meter");

export function updateHabdometer(t, dt, v, tv, a, x, y, dx, dy) {
    timeMeter.innerText = t.toFixed(2);
    deltaTimeMeter.innerText = dt.toFixed(2);
    velocityMeter.innerText = v.toFixed(2);
    terminalVelocityMeter.innerText = tv.toFixed(2);
    accelerationMeter.innerText = a.toFixed(2);
    currentXMeter.innerText = x.toFixed(2);
    currentYMeter.innerText = y.toFixed(2);
    deltaXMeter.innerText = dx.toFixed(2);
    deltaYMeter.innerText = dy.toFixed(2);
}
