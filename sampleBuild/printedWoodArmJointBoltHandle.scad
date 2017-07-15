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
  /* <- printedWoodArmJointBoltHandle */
  hull(){
    /* center cylinder */
    rotate_extrude($fn=32,height=10){
      /* <- cylinderRoundTop */
      intersection(){
        hull(){
          square([7.35,10]);
          square([9.35,0.1]);
          translate([7.35,8]){
            circle(r=2,$fn=16);
          }
        }
        square([9.35,10]);
      }
    }
    /* side cylinder */
    translate([10,0]){
      rotate_extrude($fn=16,height=10){
        /* <- cylinderRoundTop */
        intersection(){
          hull(){
            square([2.5,10]);
            square([4.5,0.1]);
            translate([2.5,8]){
              circle(r=2,$fn=16);
            }
          }
          square([4.5,10]);
        }
      }
    }
    /* side cylinder */
    translate([-10,0]){
      rotate_extrude($fn=16,height=10){
        /* <- cylinderRoundTop */
        intersection(){
          hull(){
            square([2.5,10]);
            square([4.5,0.1]);
            translate([2.5,8]){
              circle(r=2,$fn=16);
            }
          }
          square([4.5,10]);
        }
      }
    }
  }
  translate([0,0,3]){
    /* <- bolt head hole */
    cylinder(d=12.7,h=7.1,$fn=6);
  }
  translate([0,0,-0.1]){
    /* <- bolt hole */
    cylinder(d=6.4,h=3.2,$fn=32);
  }
}

