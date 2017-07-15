/* 
 * Printed Wood Arm Joints
 * 
 * Copyright 2017 Mitsuaki Fujii - silvershell100@gmail.com
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * See <http://www.gnu.org/licenses/>.
 */

include <./lib/util.scad>

union(){
  difference(){
    union(){
      hull(){
        translate([3,3,3]){
          sphere(d=6,$fn=16);
        }
        translate([40,3,3]){
          sphere(d=6,$fn=16);
        }
        translate([3,43.8,3]){
          sphere(d=6,$fn=16);
        }
        translate([40,43.8,3]){
          sphere(d=6,$fn=16);
        }
        translate([3,3,33.6]){
          sphere(d=6,$fn=16);
        }
        translate([40,3,33.6]){
          sphere(d=6,$fn=16);
        }
        translate([3,43.8,33.6]){
          sphere(d=6,$fn=16);
        }
        translate([40,43.8,33.6]){
          sphere(d=6,$fn=16);
        }
      }
      translate([21.5,23.4,33.6]){
        rotate_extrude($fn=64,height=6.6){
          /* <- cylinderRoundTop */
          intersection(){
            hull(){
              square([7.15,6.6]);
              square([9.15,0.1]);
              translate([7.15,4.6]){
                circle(r=2,$fn=16);
              }
            }
            square([9.15,6.6]);
          }
        }
      }
      translate([-23.3,14.599999999999998,18.3]){
        rotate([-90,-90,0]){
          union(){
            translate([0,0,0]){
              difference(){
                union(){
                  cylinder(d=36.6,h=4,$fn=32);
                  translate([-18.3,0,0]){
                    cube([36.6,26.3,4]);
                  }
                }
                translate([0,0,-0.1]){
                  cylinder(d=6.4,h=8.799999999999999,$fn=16);
                }
              }
            }
            translate([0,0,8.8]){
              difference(){
                union(){
                  cylinder(d=36.6,h=4,$fn=32);
                  translate([-18.3,0,0]){
                    cube([36.6,26.3,4]);
                  }
                }
                translate([0,0,-0.1]){
                  cylinder(d=6.4,h=8.799999999999999,$fn=16);
                }
              }
            }
            translate([0,0,17.6]){
              difference(){
                union(){
                  cylinder(d=36.6,h=4,$fn=32);
                  translate([-18.3,0,0]){
                    cube([36.6,26.3,4]);
                  }
                }
                translate([0,0,-0.1]){
                  cylinder(d=6.4,h=8.799999999999999,$fn=16);
                }
              }
            }
          }
        }
      }
    }
    /* screw hole1 */
    translate([21.5,23.4,-0.1]){
      cylinder(d=6.4,h=33.7,$fn=16);
    }
    /* screw hole2 */
    translate([21.5,23.4,34]){
      cylinder(d=6.4,h=6.699999999999999,$fn=16);
    }
    /* bar hole */
    translate([3,3,3]){
      cube([43.1,40.8,30.700000000000003]);
    }
    /* nut hole */
    translate([21.5,23.4,36.6]){
      cylinder(d=12.3,h=3.7,$fn=6);
    }
    translate([33,13.2,0]){
      rotate([0,0,0]){
        union(){
          cylinder(d1=9,d2=4.4,h=2.3,$fn=32);
          translate([0,0,2.3]){
            cylinder(d=4.4,h=20,p=1,$fn=16);
          }
        }
      }
    }
    translate([13,33.599999999999994,0]){
      rotate([0,0,0]){
        union(){
          cylinder(d1=9,d2=4.4,h=2.3,$fn=32);
          translate([0,0,2.3]){
            cylinder(d=4.4,h=20,p=1,$fn=16);
          }
        }
      }
    }
    translate([13,13.2,36.6]){
      rotate([0,180,0]){
        union(){
          cylinder(d1=9,d2=4.4,h=2.3,$fn=32);
          translate([0,0,2.3]){
            cylinder(d=4.4,h=20,p=1,$fn=16);
          }
        }
      }
    }
    translate([33,33.599999999999994,36.6]){
      rotate([0,180,0]){
        union(){
          cylinder(d1=9,d2=4.4,h=2.3,$fn=32);
          translate([0,0,2.3]){
            cylinder(d=4.4,h=20,p=1,$fn=16);
          }
        }
      }
    }
  }
  translate([3,3,33.6]){
    cube([40,40.8,0.4]);
  }
}

