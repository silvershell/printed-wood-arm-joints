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
    translate([-32.5,0,0]){
      hull(){
        translate([2,2,2]){
          sphere(d=4,$fn=16);
        }
        translate([63,2,2]){
          sphere(d=4,$fn=16);
        }
        translate([2,63,2]){
          sphere(d=4,$fn=16);
        }
        translate([63,63,2]){
          sphere(d=4,$fn=16);
        }
        translate([2,2,13]){
          sphere(d=4,$fn=16);
        }
        translate([63,2,13]){
          sphere(d=4,$fn=16);
        }
        translate([2,63,13]){
          sphere(d=4,$fn=16);
        }
        translate([63,63,13]){
          sphere(d=4,$fn=16);
        }
      }
    }
    translate([0,-60,0]){
      rotate_extrude($fn=32,height=15){
        /* <- cylinderRoundTop */
        intersection(){
          hull(){
            square([8,15]);
            square([10,0.1]);
            translate([8,13]){
              circle(r=2,$fn=16);
            }
          }
          square([10,15]);
        }
      }
      translate([-10,0,0]){
        hull(){
          translate([2,2,2]){
            sphere(d=4,$fn=16);
          }
          translate([18,2,2]){
            sphere(d=4,$fn=16);
          }
          translate([2,61,2]){
            sphere(d=4,$fn=16);
          }
          translate([18,61,2]){
            sphere(d=4,$fn=16);
          }
          translate([2,2,13]){
            sphere(d=4,$fn=16);
          }
          translate([18,2,13]){
            sphere(d=4,$fn=16);
          }
          translate([2,61,13]){
            sphere(d=4,$fn=16);
          }
          translate([18,61,13]){
            sphere(d=4,$fn=16);
          }
        }
      }
    }
  }
  translate([-29.5,3,-0.1]){
    linear_extrude(height=15.2){
      /* <- roundCube */
      hull(){
        translate([2,2]){
          circle(r=2,$fn=16);
        }
        translate([57,2]){
          circle(r=2,$fn=16);
        }
        translate([2,57]){
          circle(r=2,$fn=16);
        }
        translate([57,57]){
          circle(r=2,$fn=16);
        }
      }
    }
  }
  translate([0,-60,-0.1]){
    cylinder(d=6.4,h=15.2,$fn=32);
  }
  translate([-2,-26.9,-0.1]){
    cube([4,33.1,15.2]);
    cube([20,2,15.2]);
  }
  translate([-10.1,-17.75,7.5]){
    rotate([0,90,0]){
      cylinder(d=6.4,h=20.2,$fn=16);
      translate([0,0,16.5]){
        cylinder(d=12.3,h=3.7,$fn=6);
      }
    }
  }
}

