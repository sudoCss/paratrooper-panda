export const ENVIRONMENT = {
    G: 9.8, // 0<=G<=100
    Cd: 0.8, // 0.8<=Cd<=1.2
    Ro: 1.204, // 0.1<=Ro<=10
    A: 0.5, // 0.1<=A<=10
    M: 70, // 1<=M<=
    H: 1000, // 0<=H<=10_000
    V0x: 257, // 0<=V0<=343
};

// K
function K() {
    return (1 / 2) * ENVIRONMENT.Cd * ENVIRONMENT.Ro * ENVIRONMENT.A;
}

// Terminal
function terminalVelocity(): number {
    const v = Math.sqrt((ENVIRONMENT.M * ENVIRONMENT.G) / K());
    return v;
}

// Vertical
function verticalVelocity(t: number): number {
    return (
        Math.sqrt((ENVIRONMENT.M * ENVIRONMENT.G) / K()) *
        Math.tanh(Math.sqrt((ENVIRONMENT.G * K()) / ENVIRONMENT.M) * t)
    );
}

function verticalAcceleration(v: number): number {
    return ENVIRONMENT.G - (K() / ENVIRONMENT.M) * v ** 2;
}

function Y(t: number): number {
    return (
        (ENVIRONMENT.M / K()) *
        Math.log(
            Math.cosh(Math.sqrt((ENVIRONMENT.G * K()) / ENVIRONMENT.M) * t),
        )
    );
}

// Horizontal
function horizontalVelocity(t: number): number {
    return Math.abs(
        -(ENVIRONMENT.M * ENVIRONMENT.V0x) /
            (K() * ENVIRONMENT.V0x * t - ENVIRONMENT.M),
    );
}

function horizontalAcceleration(v: number): number {
    return -((K() / ENVIRONMENT.M) * v ** 2);
}

function X(t: number): number {
    // return Math.sqrt(
    //     Math.pow(
    //         (ENVIRONMENT.M / K()) *
    //             (Math.log(K() * ENVIRONMENT.V0x * t - ENVIRONMENT.M) -
    //                 Math.log(ENVIRONMENT.M)),
    //         2,
    //     ) + Math.pow(1.36437635 * (ENVIRONMENT.M / K()), 2),
    // );
    return ENVIRONMENT.V0x * t - (K() * t ** 2) / ENVIRONMENT.M;
}

// Combining
function velocity(hv: number, vv: number): number {
    return Math.sqrt(Math.pow(hv, 2) + Math.pow(vv, 2));
}

function acceleration(ha: number, va: number): number {
    return Math.sqrt(Math.pow(ha, 2) + Math.pow(va, 2));
}

// Main physics
export function physics(t: number) {
    const hv = horizontalVelocity(t);
    const vv = verticalVelocity(t);
    const v = velocity(hv, vv);

    const ha = horizontalAcceleration(hv);
    const va = verticalAcceleration(vv);
    const a = acceleration(ha, va);

    const x = X(t);
    const y = Y(t);
    const pos = { x, y };

    const tv = terminalVelocity();

    return {
        v,
        a,
        tv,
        pos,
    };
}
