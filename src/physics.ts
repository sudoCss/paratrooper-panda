export const ENVIRONMENT = {
    G: 9.8, // 0<=G<=100
    Cd: 0.8, // 0.8<=Cd<=1.2
    Ro: 1.204, // 0.1<=Ro<=10
    A: 0.5, // 0.1<=A<=10
    A2: 5, // A<A2<=
    M: 70, // 1<=M<=
    H: 1000, // 0<=H<=10_000
    V0x: 257, // 0<=V0<=343
    V0y: 0,
};

let vx: number;
let vy: number;
let ax: number;
let ay: number;

export function setup(): void {
    vx = ENVIRONMENT.V0x;
    vy = ENVIRONMENT.V0y;
    ax = 0;
    ay = ENVIRONMENT.G;
}

// K
function K(): number {
    return (1 / 2) * ENVIRONMENT.Cd * ENVIRONMENT.Ro * ENVIRONMENT.A;
}

// Vertical
function verticalAcceleration(): number {
    return ENVIRONMENT.G - (K() / ENVIRONMENT.M) * vy * Math.abs(vy);
}

function verticalVelocity(dt: number): number {
    return vy + ay * dt;
}

function Y(dt: number): number {
    return vy * dt + (1 / 2) * ay * dt ** 2;
}

// Horizontal
function horizontalAcceleration(): number {
    return -(K() / ENVIRONMENT.M) * vx * Math.abs(vx);
}

function horizontalVelocity(dt: number): number {
    return vx + ax * dt;
}

function X(dt: number): number {
    return vx * dt + (1 / 2) * ax * dt ** 2;
}

// Combining

function acceleration(): number {
    return Math.sqrt(ax ** 2 + ay ** 2);
}

function velocity(): number {
    return Math.sqrt(vx ** 2 + vy ** 2);
}

function terminalVelocity(): number {
    return Math.sqrt((ENVIRONMENT.M * ENVIRONMENT.G) / K());
}

type physicsResult = {
    v: number;
    a: number;
    tv: number;
    pos: {
        x: number;
        y: number;
    };
};

// Main physics
export function physics(dt: number): physicsResult {
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
