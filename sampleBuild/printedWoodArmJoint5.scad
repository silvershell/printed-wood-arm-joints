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

difference(){
  union(){
    translate([18.3,0,0]){
      union(){
        /* circle */
        translate([0,0,42]){
          rotate([0,90,0]){
            rotate_extrude($fn=32){
              translate([9.5,2.5]){
                circle(d=5,$fn=32);
              }
              square([9.5,5]);
            }
          }
        }
        /* arm */
        translate([0,0,6.7]){
          linear_extrude(height=35.3){
            translate([2.5,9.5,0]){
              circle(d=5,$fn=16);
            }
            translate([2.5,-9.5,0]){
              circle(d=5,$fn=16);
            }
            translate([0,-9.5,0]){
              square([5,19]);
            }
          }
        }
      }
    }
    translate([-23.3,0,0]){
      union(){
        /* circle */
        translate([0,0,42]){
          rotate([0,90,0]){
            rotate_extrude($fn=32){
              translate([9.5,2.5]){
                circle(d=5,$fn=32);
              }
              square([9.5,5]);
            }
          }
        }
        /* arm */
        translate([0,0,6.7]){
          linear_extrude(height=35.3){
            translate([2.5,9.5,0]){
              circle(d=5,$fn=16);
            }
            translate([2.5,-9.5,0]){
              circle(d=5,$fn=16);
            }
            translate([0,-9.5,0]){
              square([5,19]);
            }
          }
        }
      }
    }
    translate([-23.3,-12,0]){
      hull(){
        translate([2.5,2.5,2.5]){
          sphere(d=5,$fn=16);
        }
        translate([44.1,2.5,2.5]){
          sphere(d=5,$fn=16);
        }
        translate([2.5,21.5,2.5]){
          sphere(d=5,$fn=16);
        }
        translate([44.1,21.5,2.5]){
          sphere(d=5,$fn=16);
        }
        translate([2.5,2.5,10.9]){
          sphere(d=5,$fn=16);
        }
        translate([44.1,2.5,10.9]){
          sphere(d=5,$fn=16);
        }
        translate([2.5,21.5,10.9]){
          sphere(d=5,$fn=16);
        }
        translate([44.1,21.5,10.9]){
          sphere(d=5,$fn=16);
        }
      }
    }
    /* nut holder */
    translate([-23.3,0,42]){
      rotate([0,-90,0]){
        rotate_extrude($fn=32,height=3.6){
          /* <- cylinderRoundTop */
          intersection(){
            hull(){
              square([6.15,3.6]);
              square([9.15,0.1]);
              translate([6.15,0.6000000000000001]){
                circle(r=3,$fn=16);
              }
            }
            square([9.15,3.6]);
          }
        }
      }
    }
  }
  translate([0,0,4]){
    rotate([0,0,-90]){
      union(){
        cylinder(d=12.3,h=5.4,$fn=6);
        translate([0,-5.326056233274298,0]){
          cube([12.1,10.652112466548596,5.4]);
        }
      }
    }
  }
  translate([0,0,-0.1]){
    cylinder(d=6.4,h=4.2,$fn=16);
  }
  translate([0,0,9.8]){
    cylinder(d=6.4,h=4.2,$fn=16);
  }
  /* nut holder hole */
  translate([-23.3,0,42]){
    rotate([0,-90,0]){
      cylinder(h=3.6,d=12.3,$fn=6);
    }
  }
  translate([-23.400000000000002,0,42]){
    rotate([0,90,0]){
      cylinder(d=6.4,h=46.800000000000004,$fn=16);
    }
  }
}

