let config = {
    layer: 0.4,
    t: 3,
    cr: 2,
    nut: {
        enable: true,
        d: 11.5 + 0.8,
        h: 3.6,
    },
    nutS: {
        enable: true,
        // // M4
        // d: 8.1 + 0.3,
        // h: 3.2 + 0.4,
        // M3
        d: 6.4 + 0.4,
        h: 2.4 + 0.4,
    },
    bar: {
        hole: {
            enable: true,
        },
        size: [40,40+0.8,30+0.6],
    },
    screw: {
        d: 6 + 0.4,
        fn: 16,
    },
    screwS: {
        // // M4
        // d: 4 + 0.4,
        // M3
        d: 3 + 0.6,
        fn: 16,
    },
    centerScrewHole: {
        enable: true,
    },
    sideScrewHole: {
        enable: false,
        d: 6 + 0.4,
        fn: 16,
    },
    rotateJointModule: {
        enable: true,
        t: 4,
        // d: 30,
        // l: 20,
        fn: 32,
        screw: {
            d: 6 + 0.4,
            fn: 16,
        },

        num: 3,
        margin: 0.4,

        nutGrip: {
            enable: false,
            d: 11.5 + 0.8,
            h: 3.6 + 1,
            t: 2,
            cr: 2,    // corner round r
            crFn: 16,    // corner round fn
            fn: 32,
        },
    },
    mount: {
        d: 24,
        fn: 32,
        l: 34,
        t: 5,
        bottomT: 4,
        crfn: 16,
        nutHoleH: 5 + 0.4,
    },
    woodScrewHole: {
        enable: true,
        d: 4 + 0.4,
        h: 20,
        fn: 16,
        head: {
            h: 2.3,
            fn: 32,
        }
    },
    spacer: {
        d: 28,
        h: 11,
        fn: 64,
    },
    spacer2: {
        h: 6,
    },
    attachment: {
        d: 20,
        h: 15,
        fn: 32,
        l: 40,
        r: 2,
    },
    nutHolder: {
        clip: {
            r: 3,
            size: [34,34,20],
        }
    },
    arm: {
        l: 20,
        disable: true,
    },
    rotateArm: {
        h: 15+20,
    },
    bottle: {
        t: 3,
        h: 15,
        l: 60,
        w: 57+2,           // milk bottle 50mm - 57mm
        margin: 4,
        r: 2,
    },
    smartphone: {
        t: 16-2,
        w: 70+1.6*2,
        margin: 10,
        clipArm: {
            w: 8.4 + 2*2,
            t: 3,
            fn: 16,
            margin: 95,
            wingFrontL: 7,
            wingBackL: 20,
            marginY: 10,
            marginBar: 0.4,
            mount: {
                t: 7,
                w: 8.4 + 2*2,
                wing: 3,
            },
            nutT: 1.6,
        },
        centerBar: {
            w: 11.5 + 3*2,
            t: 5+4+1,
            t2: 5,
            r: 1,
            nutT: 1.6,
        },
    },
}


module.exports = config
