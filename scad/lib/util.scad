/* 
 * util.scad
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

include <./threads.scad>

module SSThread(
  h=10,     // length
  d=3,      // diameter
  p=0.5,    // pitch
  a=60     // angle
){
  internal=false;
  n_starts=1;
  thread_size=-1;
  groove=false;
  square=false;
  rectangle=0;
  /*fn=64*/

  metric_thread(
    diameter=d, pitch=p, length=h, internal=internal, n_starts=n_starts,
    thread_size=thread_size, groove=groove, square=square, rectangle=rectangle,
    angle=a/2
  );
}