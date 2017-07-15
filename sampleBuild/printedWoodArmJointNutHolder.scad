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

intersection(){
  difference(){
    union(){
      cube([40,40.8,3]);
      translate([20,20.4,3]){
        rotate_extrude($fn=64,height=3.6){
          /* <- cylinderRoundTop */
          intersection(){
            hull(){
              square([7.15,3.6]);
              square([9.15,0.1]);
              translate([7.15,1.6]){
                circle(r=2,$fn=16);
              }
            }
            square([9.15,3.6]);
          }
        }
      }
    }
    translate([20,20.4,0]){
      translate([0,0,3]){
        cylinder(d=12.3,h=3.7,$fn=6);
      }
      translate([0,0,-0.1]){
        cylinder(d=6.4,h=6.8,$fn=16);
      }
    }
    translate([10,10.2,3.1]){
      rotate([0,180,0]){
        union(){
          cylinder(d1=9,d2=4.4,h=2.3,$fn=32);
          translate([0,0,2.3]){
            cylinder(d=4.4,h=20,p=1,$fn=16);
          }
        }
      }
    }
    translate([10,30.599999999999998,3.1]){
      rotate([0,180,0]){
        union(){
          cylinder(d1=9,d2=4.4,h=2.3,$fn=32);
          translate([0,0,2.3]){
            cylinder(d=4.4,h=20,p=1,$fn=16);
          }
        }
      }
    }
    translate([30,10.2,3.1]){
      rotate([0,180,0]){
        union(){
          cylinder(d1=9,d2=4.4,h=2.3,$fn=32);
          translate([0,0,2.3]){
            cylinder(d=4.4,h=20,p=1,$fn=16);
          }
        }
      }
    }
    translate([30,30.599999999999998,3.1]){
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
  translate([3,3.3999999999999986,0]){
    linear_extrude(height=6.6){
      /* <- roundCube */
      hull(){
        translate([3,3]){
          circle(r=3,$fn=16);
        }
        translate([31,3]){
          circle(r=3,$fn=16);
        }
        translate([3,31]){
          circle(r=3,$fn=16);
        }
        translate([31,31]){
          circle(r=3,$fn=16);
        }
      }
    }
  }
}

