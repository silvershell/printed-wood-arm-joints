
// #scad-builder:start
const {
  call, comment, func, generateScad, GeneratorScad, genImportSrc, square, circle, scircle, polygon, cube, sphere, cylinder, polyhedron, union, difference, intersection, translate, scale, rotate, mirror, multmatrix, minkowski, hull, linear_extrude, rotate_extrude, color, text, 
} = require('scad-builder-core');
// #scad-builder:end

const _ = require('lodash');


let printedWoodArmJointParam = require('./config.js');


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

function cylinderRounded(opts){
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
                // square([p.d/2, 0.1]),
                translate([p.d/2-p.cr, p.h-p.cr], [
                    circle({r: p.cr, fn: p.crFn}),
                ]),
                translate([p.d/2-p.cr, p.cr], [
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


function boltHandle(opts){
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
        comment("<- boltHandle"),
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




// -----------------------------------


function boltHandle1(opts){
    return boltHandle({
        bottomT: 3,
    })
}


function boltHandle2(opts){
    return boltHandle({
        bottomT: 10-4,
    })
}


function spacer1(options){
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

function spacer2(options){
    let p = _.cloneDeep(printedWoodArmJointParam)
    _.merge(p, options);
    _.merge(p.spacer, p.spacer2);

    let m = spacer1(p);

    return m
}

function nutHolder(options){
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



function joint1(){
    return printedWoodArmJointBase({})
}


function joint2(){
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

function joint3(){
    return printedWoodArmJointBase({
        nut: {
            enable: false,
        },
        centerScrewHole: {
            enable: false,
        },
    })
}


function joint4(){

    let p = printedWoodArmJointParam;
    let wy = p.rotateJointModule.t * (p.rotateJointModule.num+1)
           + p.rotateJointModule.margin * p.rotateJointModule.num
           + p.rotateJointModule.nutGrip.h
           + p.cr * 2;

    return printedWoodArmJointBase({
        layer: 0,
        nut: {
            enable: false,
        },
        bar: {
            hole: {
                enable: false,
            },
            size: [20,wy,30+0.6],
        },
        rotateJointModule: {
            nutGrip: {
                enable: true,
            }
        },
        woodScrewHole: {
            enable: false,
        }
    })
}


function joint5(){
    let p = _.cloneDeep(printedWoodArmJointParam)

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


function mounterArm(opts){
    let { h, d, l, r, fn } = opts;
    
    let p = printedWoodArmJointParam;

    let diff = [
        union([
            cylinderRounded({
                d:h, h:d/2, fn:fn, cr:r
            }),
            
            translate([0,-h/2,0], [
                hullCube({
                    r: r,
                    size: [l, h, d/2],
                    // ctype: [0,0,0,0,1,1,1,1],
                }),
            ])
        ]),

        translate([0,0,-0.1], [
            cylinder({d:p.screw.d, h:d/2+0.2, fn:p.screw.fn}),
        ]),
    ]

    if( !opts.disable ){
        diff.push(
            translate([0,0,d/2-p.nut.h+0.1], [
            rotate([0,0,30], [
                cylinder({d:p.nut.d, h:p.nut.h+0.1, fn:6}),
            ]),
            ])
        );
    }

    let arm = 
    translate([-l,0,h/2], [
    rotate([90,0,0], [
    difference(diff)
    ])
    ])

    return arm
}

function mounter(opts){
    let p = _.cloneDeep(printedWoodArmJointParam)
    _.merge(p, opts);

    let { h, d, l, r, fn } = p.attachment;
    
    let arm = mounterArm(p.attachment)
    
    let m =
    difference([
        union([
            cylinderRoundTop({
                d:d, h:h, fn:fn, cr:r
            }),
            arm,
            mirror([1,0,0], [
                arm,
            ]),
        ]),
        
        cylinder({d:p.screw.d, h:h+0.2, fn:fn}),
    ])

    return m
}



function attachmentMilkBottle(){
    let p = _.cloneDeep(printedWoodArmJointParam);
    
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

    // arm ------

    let armParam = _.cloneDeep(p.attachment);
    _.merge( armParam, p.arm );
    armParam.l += p.bottle.t;
    armParam.d += p.bottle.margin;

    let arm = mounterArm(armParam)
    
    // ----------
    
    let holeY = armParam.l + armParam.d/2 + p.bottle.t;

    let m =
    difference([
        union([
            translate([-sOut[0]/2, 0, 0], [
                hullCube({
                    r: p.bottle.r,
                    size: sOut,
                }),
            ]),
            translate([0, p.bottle.t, 0], [
            rotate([0,0,90], [
                arm,
            ]),
            ]),
        ]),

        translate([-sOut[0]/2+p.bottle.t, p.bottle.t, -0.1], [
            roundCube({
                r: p.bottle.r,
                size: sIn,
            }),
        ]),


        translate([armParam.d/4-p.bottle.margin/2, -holeY+p.bottle.t-0.1, -0.1], [
        cube([
            p.bottle.margin,
            holeY + 0.2,
            armParam.d + 0.2,
        ]),
        ]),
    ])

    return m
}


function attachmentRotate(){
    let p = _.cloneDeep(printedWoodArmJointParam)

    let { d, l, r, fn } = p.attachment;
    let h = p.rotateArm.h;

    // arm ------

    let armParam = _.cloneDeep(p.attachment);
    _.merge( armParam, p.arm );
    armParam.l += d/2;

    let arm = mounterArm(armParam)
    
    // ----------
    
    let m =
    difference([
        union([
            cylinderRounded({
                d:d, h:h, fn:fn, cr:r
            }),
            mirror([1,0,0], [
            rotate([0,0,90], [
                arm,
            ]),
            ]),
        ]),
        
        cylinder({d:p.screw.d, h:h+0.2, fn:fn}),
    ])

    return m
}



function smartPhoneGrip1(){
    let p = _.cloneDeep(printedWoodArmJointParam)
    
    let barSize = [
        p.smartphone.clipArm.margin + p.smartphone.clipArm.w * 2,
        p.smartphone.centerBar.t2,
        p.smartphone.centerBar.w,
    ];

    let mountSize = [
        p.smartphone.centerBar.w,
        p.smartphone.centerBar.t,
        p.smartphone.centerBar.w,
    ]

    function makeScrewHole(d){
        let r = 
        translate([0, -0.1, barSize[2]/2], [
        rotate([-90,0,0], [
            cylinder({d:d, h:mountSize[1]+0.2, fn: p.screwS.fn})
        ])
        ])
        
        return r
    }

    let screwHole = makeScrewHole(p.screw.d);
    let screwSHole = makeScrewHole(p.screwS.d);

    let m =
    difference([
        union([
            hullCube({size:barSize, r: p.smartphone.centerBar.r}),

            translate([(barSize[0]-mountSize[0])/2, 0, 0], [
                hullCube({size:mountSize, r: p.smartphone.centerBar.r}),
            ]),
        ]),

        comment("screw hole"),
        translate([p.smartphone.clipArm.w/2, 0, 0], [
            screwSHole
        ]),
        translate([barSize[0]-p.smartphone.clipArm.w/2, 0, 0], [
            screwSHole
        ]),

        comment("nut hole"),
        translate([barSize[0]/2, p.smartphone.centerBar.nutT, barSize[2]/2], [
        rotate([-90,-90,0], [
            nutSlideHole({d:p.nut.d, h:p.mount.nutHoleH, l:mountSize[2]/2+0.1})
        ])
        ]),

        translate([barSize[0]/2, 0, 0], [
            screwHole
        ]),
    ])

    return m
}


function smartPhoneGrip2(){
    let p = _.cloneDeep(printedWoodArmJointParam)

    // --------------------

    let t = p.smartphone.clipArm.t;
    // let x1 = p.smartphone.clipArm.margin/2 + t/2;
    let x1 = p.smartphone.w/2 + t/2;
    let x2 = x1 - p.smartphone.clipArm.wingFrontL - t/2;
    let x3 = x1 - p.smartphone.clipArm.wingBackL - t/2;
    let x4 = p.smartphone.centerBar.w/2 + t/2 + p.smartphone.clipArm.marginBar;
    let y1 = p.smartphone.t + t;
    let y2 = -p.smartphone.clipArm.marginY;
    let y3 = y2 - p.smartphone.clipArm.mount.t - t/2;
    let y4 = y3 - p.smartphone.clipArm.mount.wing;
    let h = p.smartphone.clipArm.w;
    let mounterT = y2-y3;

    let clipXY = [
        [x2, y1],
        [x1, y1],
        [x1, 0],
        [x3, 0],
        [x4, y2],
        [x4, y4],
    ];

    let cyl = cylinder({d:t, h:h, fn:p.smartphone.clipArm.fn});

    let listClip = [];
    for( let i=0; i<clipXY.length-1; i++ ){
        listClip.push(
            hull([
                translate([clipXY[i][0], clipXY[i][1], 0], [
                    cyl
                ]),
                translate([clipXY[i+1][0], clipXY[i+1][1], 0], [
                    cyl
                ]),
            ])
        );
    }

    listClip.push(
        translate([0, y2-mounterT, 0], [
            cube([x4, mounterT, h])
        ])
    );

    let half = 
    union(listClip)

    let m = 
    difference([
        union([
            half,

            mirror([1,0,0], [
                half,
            ]),
        ]),

        translate([0,y2-p.smartphone.clipArm.nutT,h/2], [
        rotate([90,-90,0], [
            nutSlideHole({d:p.nutS.d, h:p.nutS.h, l:h/2+0.1}),
        ]),
        ]),

        translate([0,y2+0.1,h/2], [
        rotate([90,0,0], [
            cylinder({d:p.screwS.d, h:mounterT+0.2, fn: p.screwS.fn})
        ]),
        ]),
    ])

    return m
}


// ----------------------

function preview1(){
    let m = union([
        joint1(),
        color([1,0,0], translate([-(40+0.8+8), (40+0.8+6), 0], rotate([0,0,180], joint2()))),
    ])

    return m
}


function preview2(){
    let m = union([
        joint3(),
        color([1,0,0], translate([-(40+0.8+8), (40+0.8+6), 0], rotate([0,0,180], joint4()))),
        translate([-110,(40+0.8+6)/2,(30+0.6+3*2)/2], rotate([0,90,0], joint5())),
    ])

    return m
}

function preview3(){
    let p = _.cloneDeep(printedWoodArmJointParam)

    let m = union([
        smartPhoneGrip1(),
        translate([0, 30, p.smartphone.centerBar.w/2], [
        rotate([0, 90, 0], [
            smartPhoneGrip2(),
        ]),
        ]),
        // color([1,0,0], translate([-(40+0.8+8), (40+0.8+6), 0], rotate([0,0,180], joint4()))),
        // translate([-110,(40+0.8+6)/2,(30+0.6+3*2)/2], rotate([0,90,0], joint5())),
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
    preview3,

    joint1,
    joint2,
    joint3,
    joint4,
    joint5,
    spacer1,
    spacer2,
    nutHolder,
    boltHandle1,
    boltHandle2,
    mounter,
    attachmentMilkBottle,
    attachmentRotate,
    smartPhoneGrip1,
    smartPhoneGrip2,
};
