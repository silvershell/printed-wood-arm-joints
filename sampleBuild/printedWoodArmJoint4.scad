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
        translate([20,3,3]){
          sphere(d=6,$fn=16);
        }
        translate([3,43.8,3]){
          sphere(d=6,$fn=16);
        }
        translate([20,43.8,3]){
          sphere(d=6,$fn=16);
        }
        translate([3,3,33.6]){
          sphere(d=6,$fn=16);
        }
        translate([20,3,33.6]){
          sphere(d=6,$fn=16);
        }
        translate([3,43.8,33.6]){
          sphere(d=6,$fn=16);
        }
        translate([20,43.8,33.6]){
          sphere(d=6,$fn=16);
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
                  translate([0,0,4]){
                    rotate_extrude($fn=32,height=4.6){
                      /* <- cylinderRoundTop */
                      intersection(){
                        hull(){
                          square([6.15,4.6]);
                          square([8.15,0.1]);
                          translate([6.15,2.5999999999999996]){
                            circle(r=2,$fn=16);
                          }
                        }
                        square([8.15,4.6]);
                      }
                    }
                  }
                }
                translate([0,0,-0.1]){
                  cylinder(d=6.4,h=8.799999999999999,$fn=16);
                }
                translate([0,0,4]){
                  cylinder(d=12.3,h=4.699999999999999,$fn=6);
                }
              }
            }
          }
        }
      }
    }
    /* screw hole1 */
    translate([11.5,23.4,-0.1]){
      cylinder(d=6.4,h=33.7,$fn=16);
    }
    /* screw hole2 */
    translate([11.5,23.4,33.6]){
      cylinder(d=6.4,h=6.699999999999999,$fn=16);
    }
  }
}

