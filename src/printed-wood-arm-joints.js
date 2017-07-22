
// #scad-builder:start
const {
  call, comment, func, generateScad, GeneratorScad, genImportSrc, square, circle, scircle, polygon, cube, sphere, cylinder, polyhedron, union, difference, intersection, translate, scale, rotate, mirror, multmatrix, minkowski, hull, linear_extrude, rotate_extrude, color, text, 
} = require('scad-builder');
// #scad-builder:end

const _ = require('lodash');

// ------------

function roundCube(p){
    if( !p ){
        p = {};
    }

    let d = p.d ? p.d : ( p.r ? p.r * 2 : 1 );
    let r = d / 2;
    let ct = p.ctype ? p.ctype : [1,1,1,1];
    let size = p.size ? p.size : [10,10,10];
    let $fn = p.$fn ? p.$fn : 16;
    
    let oa = [];

    for( let yi of [0, 1] ){
        let y = yi ? size[1] - r : r;
        let yt = yi ? ct.slice(2,4) : ct.slice(0,2);
        
        for( let xi of [0, 1] ){
            let x = xi ? size[0] - r : r;
            let xt = yt[xi];

            let o;

            if( xt == 1 ){
                // circle
                o = translate([x,y],
                        circle({r, $fn})
                    );
            }else{
                // square
                o = translate([x-r,y-r],
                        square([d,d])
                    );
            }

            oa.push(o);
        }
    }

    let res = 
    linear_extrude({height: size[2]}, [
        comment('<- roundCube'),
        hull(oa),
    ])

    return res;
}



/**
 * @deprecated OpenJSCAD can't use hull for 3D model.
 * @param {Object} p 
 */
function hullCube(p){
    if( !p ){
        p = {};
    }

    let d = p.d ? p.d : ( p.r ? p.r * 2 : 1 );
    let r = d / 2;
    let ct = p.ctype ? p.ctype : [1,1,1,1,1,1,1,1];
    let size = p.size ? p.size : [10,10,10];
    let $fn = p.$fn ? p.$fn : 16;
    
    let oa = [];

    for( let zi of [0, 1] ){
        let z = zi ? size[2] - r : r;
        let zt = zi ? ct.slice(4,8) : ct.slice(0,4);

        for( let yi of [0, 1] ){
            let y = yi ? size[1] - r : r;
            let yt = yi ? zt.slice(2,4) : zt.slice(0,2);

            for( let xi of [0, 1] ){
                let x = xi ? size[0] - r : r;
                let xt = yt[xi];

                let o;

                if( xt == 1 ){
                    // sphere
                    o = translate([x,y,z],
                            sphere({d, $fn})
                        );
                }else if( xt == 2 ){
                    // cylinder
                    o = translate([x,y,z],
                            cylinder({d, h:d, $fn})
                        );
                }else{
                    // cube
                    o = translate([x-r,y-r,z-r],
                            cube([d,d,d])
                        );
                }

                oa.push(o);
            }
        }
    }

    return hull(oa);
}



function thread(opts){
    let p = {
        d: 6 + 0.4,
        h: 20,
        p: 1,
        fn: 32,
        simple: true,
    }
    _.merge(p, opts);
    
    let m
    
    if( p.simple ){
        m = cylinder({d:p.d, h:p.h, p:p.p, fn:p.fn})
    }else{
        m = call('SSThread', {d:p.d, h:p.h, p:p.p, fn:p.fn})
    }
    
    return m
}


function flatThread(opts){
    let p = {
        d: 6 + 0.4,
        h: 20,
        p: 1,
        fn: 32,
        simple: true,
        head: {
            h: 3.4,
            fn: 32,
        }
    }
    _.merge(p, opts);
    
    let m = 
    union([
        cylinder({d1:p.d+p.head.h*2, d2:p.d, h:p.head.h, fn:p.head.fn}),
        translate([0,0,p.head.h], [
            thread(p),
        ]),
    ])

    return m
}


function nutSlideHole(opts){
    let p = {
        d: 11.5 + 0.8,
        h: 5 + 0.4,
        l: 10,
    }
    _.merge(p, opts);

    let ds = p.d*Math.sin(60*Math.PI/180);

    let m =
    union([
        cylinder({d:p.d, h:p.h, fn:6}),
        translate([0,-ds/2,0], [
            cube([p.l, ds, p.h])
        ]),
    ])

    return m
}




function cylinderRoundTop(opts){
    let p = {
        h: 1,
        d: 1,
        cr: 0.5,    // corner round r
        crFn: 16,    // corner round fn
        fn: 32,
    }
    _.merge(p, opts);

    let m = 
    rotate_extrude({h: p.h, fn: p.fn}, [
        comment("<- cylinderRoundTop"),
        intersection([
            hull([
                square([p.d/2-p.cr, p.h]),
                square([p.d/2, 0.1]),
                translate([p.d/2-p.cr, p.h-p.cr], [
                    circle({r: p.cr, fn: p.crFn}),
                ])
            ]),
            square([p.d/2, p.h]),
        ])
    ])

    return m
}


// ------------------

function rotateJoint1(options){
    let p = {
        t: 4 - 0.4,
        d: 30,
        l: 20,
        fn: 32,
        screw: {
            d: 6+0.4,
            fn: 16,
        },
        nutGrip: {
            enable: false,
            d: 11.5 + 0.4*2,
            h: 3.6 + 1,
            t: 2,
            cr: 2,    // corner round r
            crFn: 16,    // corner round fn
            fn: 32,
        },
    }
    _.merge(p, options);

    let solid = [
        cylinder({d: p.d, h:p.t, fn:p.fn}),
        translate([-p.d/2, 0, 0], [
            cube([p.d, p.l, p.t]),
        ]),
    ]

    let diff = [
        union(solid),
        translate([0,0,-0.1], [
            cylinder({d: p.screw.d, h:p.t + p.nutGrip.h + 0.2, fn:p.screw.fn}),
        ]),
    ]

    if( p.nutGrip.enable ){
        let o;

        o =
        translate([0,0,p.t], [
            cylinderRoundTop({
                d: p.nutGrip.d + p.nutGrip.t*2,
                h: p.nutGrip.h,
                cr: p.nutGrip.cr,
                crFn: p.nutGrip.crFn,
                fn: p.nutGrip.fn,
            }),
        ])

        solid.push(o)

        o =
        translate([0,0,p.t], [
            cylinder({d: p.nutGrip.d, h:p.nutGrip.h + 0.1, fn:6}),
        ])

        diff.push(o)
    }

    let m =
    difference(diff)

    return m
}


function rotateJointModule1(options){
    let p = {
        t: 4 - 0.4,
        d: 30,
        l: 20,
        fn: 32,
        screw: {
            d: 6,
            fn: 16,
        },

        num: 4,
        margin: 0.4,

        nutGrip: {
            enable: false,
            d: 11.5,
            h: 3.6 + 1,
            t: 2,
            cr: 2,    // corner round r
            crFn: 16,    // corner round fn
            fn: 32,
        },
    }
    _.merge(p, options);

    let nutGripEnable = p.nutGrip.enable;
    p.nutGrip.enable = false;

    let list = [];

    for( let i=0; i<p.num; i++ ){
        if( i == (p.num-1) ){
            p.nutGrip.enable = nutGripEnable;
        }

        let ele = 
        translate([0,0,i*(p.t + p.margin)*2], [
            rotateJoint1(p),
        ])

        list.push(ele);
    }

    return union(list);
}


function printedWoodArmJointBoltHandle(opts){
    let p = {
        h: 10,
        t: 3,
        cr: 2,    // corner round r
        crFn: 16,    // corner round fn
        fn: 32,
        bottomT: 3,
        nut: {
            d: 11.5 + 1.2,
            h: 3.6 + 1,
        },
        bolt: {
            d: 6 + 0.4,
            fn: 32,
        },
        handle: {
            x: 10,
            d: 3,
            fn: 16,
        },
    }
    _.merge(p, opts);

    let list = [
        comment("center cylinder"),
        cylinderRoundTop({
            h: p.h,
            d: p.nut.d + p.t * 2,
            cr: p.cr,
            crFn: p.crFn,
            fn: p.fn,
        }),
    ]

    for( let x of [1, -1] ){
        list.push(
            comment("side cylinder")
        );

        list.push(
            translate([p.handle.x * x, 0], [
                cylinderRoundTop({
                    h: p.h,
                    d: p.handle.d + p.t * 2,
                    cr: p.cr,
                    crFn: p.crFn,
                    fn: p.handle.fn,
                }),
            ])
        )
    }

    let m =
    difference([
        comment("<- printedWoodArmJointBoltHandle"),
        hull(list),
        translate([0, 0, p.bottomT],[
            comment("<- bolt head hole"),
            cylinder({d:p.nut.d, h:p.h-p.bottomT+0.1, fn:6})
        ]),
        translate([0, 0, -0.1],[
            comment("<- bolt hole"),
            cylinder({d:p.bolt.d, h:p.bottomT+0.2, fn:p.bolt.fn})
        ]),
    ])

    return m
}



let printedWoodArmJointParam = {
    layer: 0.4,
    t: 3,
    cr: 2,
    nut: {
        enable: true,
        d: 11.5 + 0.8,
        h: 3.6,
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
        l: 42,
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
    attachment: {
        d: 20,
        h: 8,
        fn: 32,
    },
    nutHolder: {
        clip: {
            r: 3,
            size: [34,34,20],
        }
    }
}


function printedWoodArmJointSpacer(options){
    let p = _.cloneDeep(printedWoodArmJointParam)
    _.merge(p, options);

    let m = difference([
        cylinder({d:p.spacer.d, h:p.spacer.h, fn:p.spacer.fn}),
        translate([0,0,-0.1], [
            cylinder({d:p.screw.d, h:p.spacer.h+0.2, fn:p.screw.fn}),
        ]),
    ])

    return m
}

function printedWoodArmJointNutHolder(options){
    let p = _.cloneDeep(printedWoodArmJointParam)
    _.merge(p, options);

    let holed = [
        union([
            cube([p.bar.size[0], p.bar.size[1], p.t]),
            translate([p.bar.size[0]/2, p.bar.size[1]/2, p.t], [
                cylinderRoundTop({
                    d: p.nut.d + p.t * 2, 
                    h: p.nut.h, 
                    fn: 64,
                    cr: p.cr,
                }),
            ]),
        ]),

        translate([p.bar.size[0]/2, p.bar.size[1]/2, 0], [
            translate([0,0,p.t], [
                cylinder({d:p.nut.d, h:p.nut.h + 0.1, fn:6}),
            ]),

            translate([0,0, -0.1], [
                cylinder({
                    d:p.screw.d,
                    h:p.nut.h + p.t + 0.2,
                    fn:p.screw.fn
                }),
            ]),
        ]),
    ];

    for( let x of [p.bar.size[0]/4, p.bar.size[0]*3/4] )
    for( let y of [p.bar.size[1]/4, p.bar.size[1]*3/4] )
    {
        holed.push(
            translate([x,y,p.t+0.1],
            rotate([0,180,0],
            flatThread({
                d: p.woodScrewHole.d,
                h: p.woodScrewHole.h,
                fn: p.woodScrewHole.fn,
                simple: true,
                head: p.woodScrewHole.head,
            })
            )
            )
        )
    }

    let m = intersection([
        difference(holed),
        translate([
            (p.bar.size[0] - p.nutHolder.clip.size[1])/2,
            (p.bar.size[1] - p.nutHolder.clip.size[1])/2,
            0
        ], [
            roundCube({
                r: p.nutHolder.clip.r, 
                size: [
                    p.nutHolder.clip.size[0],
                    p.nutHolder.clip.size[1],
                    p.nut.h + p.t,
                ]
            }),
        ])
    ])

    return m
}



function printedWoodArmJointBase(options){
    let p = _.cloneDeep(printedWoodArmJointParam)
    _.merge(p, options);

    let roundCubeSize = [
        p.bar.size[0] + p.t,
        p.bar.size[1] + p.t *2,
        p.bar.size[2] + p.t *2,
    ]
}



function printedWoodArmJointBase(options){
    let p = _.cloneDeep(printedWoodArmJointParam)
    _.merge(p, options);

    let roundCubeSize = [
        p.bar.size[0] + p.t,
        p.bar.size[1] + p.t *2,
        p.bar.size[2] + p.t *2,
    ]

    let centerHole = [
        roundCubeSize[0]/2, 
        roundCubeSize[1]/2,
    ]

    let solid = [
        // roundCube({
        //     r: p.t,
        //     size: roundCubeSize,
        // }),

        hullCube({
            r: p.t,
            size: roundCubeSize,
        }),
    ]

    let holed = [
        union(solid),
    ]

    if( p.centerScrewHole.enable ){
        holed.push(
            comment("screw hole1"),
            translate([centerHole[0], centerHole[1], -0.1], [
                cylinder({
                    d:p.screw.d, 
                    h:p.bar.size[2] + p.t + 0.1, 
                    fn:p.screw.fn
                }),
            ]),

            comment("screw hole2"),
            translate([centerHole[0], centerHole[1], p.bar.size[2] + p.t + p.layer], [
                cylinder({
                    d:p.screw.d, 
                    h:p.t + p.nut.h + 0.1, 
                    fn:p.screw.fn
                }),
            ])
        )
    }

    // bar hole
    if( p.bar.hole.enable ){
        holed.push( comment("bar hole") );

        holed.push(
            translate([p.t, p.t, p.t], [
                cube([
                    p.bar.size[0] + p.t + 0.1,
                    p.bar.size[1],
                    p.bar.size[2] + 0.1,
                ])
            ])
        );
    }

    // nut hole
    if( p.nut.enable ){
        solid.push(
            translate([roundCubeSize[0]/2, roundCubeSize[1]/2, p.bar.size[2]+p.t], [
                cylinderRoundTop({
                    d: p.nut.d + p.t * 2, 
                    h: p.nut.h + p.t, 
                    fn: 64,
                    cr: p.cr,
                }),
            ])
        );

        holed.push(
            comment("nut hole")
        );

        holed.push(
            translate([centerHole[0], centerHole[1], p.bar.size[2]+p.t*2], [
                cylinder({d:p.nut.d, h:p.nut.h + 0.1, fn:6}),
            ])
        );
    }

    if( p.rotateJointModule.enable ){
        p.rotateJointModule.d = p.bar.size[2] + p.t*2;
        p.rotateJointModule.l = p.rotateJointModule.d/2 + 5 + p.t;

        solid.push(
            translate([
                -p.rotateJointModule.l+p.t, 
                (p.bar.size[1]+p.t*2)/2 - (p.rotateJointModule.t+p.rotateJointModule.margin)*(p.rotateJointModule.num-1),
                // 0
                p.rotateJointModule.d/2
            ],[
                rotate([-90,-90,0],[
                    rotateJointModule1(p.rotateJointModule),
                ])
            ])
        );
    }

    if( p.sideScrewHole.enable ){
        holed.push(
            translate([roundCubeSize[0]/2, 0, roundCubeSize[2]/2], [
            rotate([-90,0,0],[
                cylinder({
                    d:p.sideScrewHole.d, 
                    h:roundCubeSize[1] + 0.2, 
                    fn:p.sideScrewHole.fn}),
            ])
            ])
        )
    }

    if( p.woodScrewHole.enable ){
        
        for( let v of [
            [
                [p.t+p.bar.size[0]*3/4, p.t+p.bar.size[1]/4, 0],
                [0,0,0],
            ],
            [
                [p.t+p.bar.size[0]/4, p.t+p.bar.size[1]*3/4, 0],
                [0,0,0],
            ],
            // [
            //     [p.t+p.bar.size[0]/4, p.t+p.bar.size[1]/4, 0],
            //     [0,0,0],
            // ],
            // [
            //     [p.t+p.bar.size[0]*3/4, p.t+p.bar.size[1]*3/4, 0],
            //     [0,0,0],
            // ],
            [
                [p.t+p.bar.size[0]/4, p.t+p.bar.size[1]/4, roundCubeSize[2]],
                [0,180,0],
            ],
            [
                [p.t+p.bar.size[0]*3/4, p.t+p.bar.size[1]*3/4, roundCubeSize[2]],
                [0,180,0],
            ],
        ]){
            holed.push(
                translate(v[0],
                rotate(v[1],
                flatThread({
                    d: p.woodScrewHole.d,
                    h: p.woodScrewHole.h,
                    fn: p.woodScrewHole.fn,
                    simple: true,
                    head: p.woodScrewHole.head,
                })
                )
                )
            )
        }
    }


    let mList = [
        difference(holed),
    ]

    if( p.layer > 0 ){
        mList.push(
            translate([p.t, p.t, p.t+p.bar.size[2]], [
                cube([p.bar.size[0], p.bar.size[1], p.layer]),
            ])
        )
    }

    let m = union(mList)

    return m
}



function printedWoodArmJoint1(options){
    return printedWoodArmJointBase({})
}


function printedWoodArmJoint2(options){
    return printedWoodArmJointBase({
        nut: {
            enable: false,
        },
        centerScrewHole: {
            enable: false,
        },
        rotateJointModule: {
            enable: true,
            nutGrip: {
                enable: true,
            }
        },
    })
}

function printedWoodArmJoint3(options){
    return printedWoodArmJointBase({
        nut: {
            enable: false,
        },
        centerScrewHole: {
            enable: false,
        },
    })
}


function printedWoodArmJoint4(options){
    return printedWoodArmJointBase({
        layer: 0,
        nut: {
            enable: false,
        },
        bar: {
            hole: {
                enable: false,
            },
            size: [20,40+0.8,30+0.6],
        },
        rotateJointModule: {
            // enable: true,
            nutGrip: {
                enable: true,
            }
        },
        sideScrewHole: {
            // enable: true,
        },
        woodScrewHole: {
            enable: false,
        }
    })
}


function printedWoodArmJoint5(options){
    let p = _.cloneDeep(printedWoodArmJointParam)
    _.merge(p, options);

    let h = p.bar.size[2] + p.t*2 + p.mount.t*2;
    let bottomT = p.mount.nutHoleH + p.mount.bottomT*2;

    let t = p.mount.t
    let circleR = p.mount.d/2-t/2;
    let armW = p.mount.d-t;

    let arm =
    union([
        comment("circle"),
        translate([0, 0, p.mount.l], [
        rotate([0,90,0], [
            rotate_extrude({fn: p.mount.fn}, [
                translate([circleR, t/2], [
                    circle({d: t, fn: p.mount.fn}),
                ]),
                square([circleR, t]),
            ])
        ])
        ]),
        comment("arm"),
        translate([0, 0, bottomT/2], [
        linear_extrude({h: p.mount.l - bottomT/2}, [
            translate([t/2, armW/2, 0], [
                circle({d:t, fn:p.mount.crfn}),
            ]),
            translate([t/2, -armW/2, 0], [
                circle({d:t, fn:p.mount.crfn}),
            ]),
            translate([0, -armW/2, 0], [
                square([t, armW]),
            ]),
        ]),
        ]),
    ])


    let solid = union([
        translate([h/2-t,0,0],[
            arm,
        ]),
        translate([-h/2,0,0],[
            arm,
        ]),
        translate([-h/2, -p.mount.d/2, 0],[
            hullCube({r: t/2, size:[h, p.mount.d, bottomT]}),
        ]),

        comment('nut holder'),
        translate([-h/2, 0, p.mount.l], [
        rotate([0, -90, 0], [
            cylinderRoundTop({h:p.nut.h, d: p.nut.d+p.t*2, cr:3})
        ])
        ])
    ]);

    let holed = [
        solid,
        translate([0, 0, p.mount.bottomT], [
            rotate([0,0,-90], [
                nutSlideHole({d:p.nut.d, h:p.mount.nutHoleH, l:p.mount.d/2+0.1})
            ])
        ]),
        translate([0, 0, -0.1], [
            cylinder({d:p.screw.d, h:p.mount.bottomT+0.2, fn:p.screw.fn}),
        ]),
        translate([0, 0, p.mount.bottomT + p.mount.nutHoleH + p.layer], [
            cylinder({d:p.screw.d, h:p.mount.bottomT+0.2, fn:p.screw.fn}),
        ]),

        comment('nut holder hole'),
        translate([-h/2, 0, p.mount.l], [
        rotate([0, -90, 0], [
            cylinder({h:p.nut.h, d: p.nut.d, fn:6}),
        ])
        ]),

        translate([-h/2-0.1, 0, p.mount.l], [
        rotate([0, 90, 0], [
            cylinder({d:p.screw.d, h:h+0.2, fn:p.screw.fn}),
        ])
        ]),
    ]

    let m = difference(holed)

    return m
}



function printedWoodArmJointAttachmentBottle(opts){
    let p = _.cloneDeep(printedWoodArmJointParam)
    _.merge(p, {
        bottle: {
            t: 3,
            h: 15,
            l: 60,
            w: 57+2,           // milk bottle 50mm - 57mm
            margin: 4,
            r: 2,
        },
    });
    _.merge(p, opts);

    
    let sIn = [
        p.bottle.w,
        p.bottle.w,
        p.bottle.h+0.2
    ];

    let sOut = [
        p.bottle.w + p.bottle.t*2,
        p.bottle.w + p.bottle.t*2,
        p.bottle.h
    ];

    let slitL = (p.bottle.l - p.attachment.d/2)*6/10;

    let m =
    difference([
        union([
            translate([-sOut[0]/2, 0, 0], [
                hullCube({
                    r: p.bottle.r,
                    size: sOut,
                }),
            ]),
            translate([0, -p.bottle.l, 0], [
                cylinderRoundTop({
                    d:p.attachment.d, h:p.bottle.h, fn:p.attachment.fn,
                    cr:p.bottle.r
                }),
                translate([-p.attachment.d/2, 0, 0], [
                    hullCube({
                        r: p.bottle.r, 
                        size: [p.attachment.d, p.bottle.l+p.bottle.t, p.bottle.h]
                    }),
                ]),
            ]),
        ]),

        translate([-sOut[0]/2+p.bottle.t, p.bottle.t, -0.1], [
            roundCube({
                r: p.bottle.r,
                size: sIn,
            }),
        ]),

        translate([0, -p.bottle.l, -0.1], [
            cylinder({d:p.screw.d, h:p.bottle.h+0.2, fn:p.attachment.fn}),
        ]),

        translate([-p.bottle.margin/2, -slitL+p.bottle.t+0.1, -0.1], [
            cube([p.bottle.margin, slitL+p.bottle.t+0.1, p.bottle.h+0.2]),
            cube([p.attachment.d, 2, p.bottle.h+0.2]),
        ]),

        translate([-p.attachment.d/2-0.1, -slitL+p.bottle.t+p.nut.d/2+p.t+0.1, p.bottle.h/2], [
            rotate([0, 90, 0], [
                cylinder({d:p.screw.d, h:p.attachment.d+0.2, fn:p.screw.fn}),
                translate([0,0,p.attachment.d-p.nut.h+0.1], [
                    cylinder({d:p.nut.d, h:p.nut.h+0.1, fn:6}),
                ])
            ]),
        ]),
    ])

    return m
}

function preview1(){
    let m = union([
        printedWoodArmJoint1(),
        color([1,0,0], translate([-(40+0.8+8), (40+0.8+6), 0], rotate([0,0,180], printedWoodArmJoint2()))),
    ])

    return m
}


function preview2(){
    let m = union([
        printedWoodArmJoint3(),
        color([1,0,0], translate([-(40+0.8+8), (40+0.8+6), 0], rotate([0,0,180], printedWoodArmJoint4()))),
        translate([-110,(40+0.8+6)/2,(30+0.6+3*2)/2], rotate([0,90,0], printedWoodArmJoint5())),
    ])

    return m
}


function forEdit(){

    // let m = preview1()
    let m = preview2()

    // console.log(JSON.stringify(m, null, "  "))

    return m;
}


// ------------

module.exports = {
    forEdit,
    preview1,
    preview2,
    printedWoodArmJoint1,
    printedWoodArmJoint2,
    printedWoodArmJoint3,
    printedWoodArmJoint4,
    printedWoodArmJoint5,
    printedWoodArmJointSpacer,
    printedWoodArmJointNutHolder,
    printedWoodArmJointBoltHandle,
    printedWoodArmJointAttachmentBottle,
};
