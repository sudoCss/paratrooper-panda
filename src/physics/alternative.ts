export const ENVIRONMENT = {
    G: 9.8, // 0<=G<=100
    Cd: 0.8, // 0.8<=Cd<=1.2
    Ro: 1.204, // 0.1<=Ro<=10
    A: 0.5, // 0.1<=A<=10
    M: 70, // 1<=M<=
    H: 1000, // 0<=H<=10_000
    V0x: 257, // 0<=V0<=343
    V0y: 0,
};

let vx = ENVIRONMENT.V0x;
let vy = ENVIRONMENT.V0y;
let ax = 0;
let ay = ENVIRONMENT.G;

export function setup() {
    vx = ENVIRONMENT.V0x;
    vy = ENVIRONMENT.V0y;
    ax = 0;
    ay = ENVIRONMENT.G;
}

// K
function K() {
    return (1 / 2) * ENVIRONMENT.Cd * ENVIRONMENT.Ro * ENVIRONMENT.A;
}

// Vertical

function verticalAcceleration() {
    return ENVIRONMENT.G - (K() / ENVIRONMENT.M) * vy * Math.abs(vy);
}

function verticalVelocity(dt: number) {
    return vy + ay * dt;
}

function verticalTerminalVelocity() {
    return Math.sqrt(
        (2 * ENVIRONMENT.M * ENVIRONMENT.G) /
            (ENVIRONMENT.Ro * ENVIRONMENT.Cd * ENVIRONMENT.A),
    );
}

function Y(dt: number) {
    return 0 + vy * dt + (1 / 2) * ay * dt ** 2;
}

// Horizontal
function horizontalAcceleration() {
    return -(K() / ENVIRONMENT.M) * vx * Math.abs(vx);
}

function horizontalVelocity(dt: number) {
    return vx + ax * dt;
}

function X(dt: number) {
    return 0 + vx * dt + (1 / 2) * horizontalAcceleration() * dt ** 2;
}

// Combining

function acceleration() {
    return Math.sqrt(ax ** 2 + ay ** 2);
}

function velocity() {
    return Math.sqrt(vx ** 2 + vy ** 2);
}

function terminalVelocity() {
    // return Math.sqrt(verticalTerminalVelocity() ** 2 + vx ** 2);
    return verticalTerminalVelocity();
    if (vx === 0) {
        // If the horizontal velocity is zero, use the vertical terminal velocity
        return verticalTerminalVelocity();
    } else {
        // Calculate the horizontal terminal velocity using the current horizontal velocity and A
        const horizontalTerminalVelocity = Math.sqrt(
            (ENVIRONMENT.M * ENVIRONMENT.G) / (K() * Math.abs(vx)),
        );
        return Math.sqrt(
            verticalTerminalVelocity() ** 2 + horizontalTerminalVelocity ** 2,
        );
    }
}

// Main physics
export function physics(dt: number) {
    ax = horizontalAcceleration();
    ay = verticalAcceleration();
    const a = acceleration();

    vx = horizontalVelocity(dt);
    vy = verticalVelocity(dt);
    const v = velocity();

    const x = X(dt);
    const y = Y(dt);
    const pos = { x, y };

    const tv = terminalVelocity();

    return {
        v,
        a,
        tv,
        pos,
    };
}
