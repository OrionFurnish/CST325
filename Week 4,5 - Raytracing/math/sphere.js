/*
 * An object type representing an implicit sphere.
 *
 * @param center A Vector3 object representing the position of the center of the sphere
 * @param radius A Number representing the radius of the sphere.
 * 
 * Example usage:
 * var mySphere = new Sphere(new Vector3(1, 2, 3), 4.23);
 * var myRay = new Ray(new Vector3(0, 1, -10), new Vector3(0, 1, 0));
 * var result = mySphere.raycast(myRay);
 * 
 * if (result.hit) {
 *   console.log("Got a valid intersection!");
 * }
 */

var Sphere = function(center = new Vector3(), radius = 1, color = new Vector3(1, 1, 1)) {
  // Sanity checks (your modification should be below this where indicated)
  if (!(this instanceof Sphere)) {
    console.error("Sphere constructor must be called with the new operator");
  }

  this.center = center;
  this.radius = radius;
  this.color = color;

  // Sanity checks (your modification should be above this)
  if (!(this.center instanceof Vector3)) {
    console.error("The sphere center must be a Vector3");
  }

  if ((typeof(this.radius) != 'number')) {
    console.error("The radius must be a Number");
  }
};

Sphere.prototype = {
  
  //----------------------------------------------------------------------------- 
  raycast: function(r1) {
    var originMinusCenter = r1.origin.clone().subtract(this.center);
    var b = r1.direction.clone().multiplyScalar(2).dot(originMinusCenter);
    var c = originMinusCenter.dot(originMinusCenter)-(this.radius*this.radius);
    // Quadratic equation. a = 1 so it can be ignored.
    var discriminant =  b*b-4*c;

    var result = {hit: false};
    if(discriminant >= 0) { // If has intersection
      var alpha = (-b + Math.sqrt(discriminant))/2; 
      var alpha2 = (-b - Math.sqrt(discriminant))/2;
      if(alpha > 0 && alpha2 > 0) { // If intersection is positive
        if(alpha2 < alpha) {alpha = alpha2;}
        var hitPoint = r1.origin.clone().add(r1.direction.clone().multiplyScalar(alpha));
        var normal = hitPoint.clone().subtract(this.center.clone()).normalize();
        result = {
          hit: true,
          point: hitPoint,
          normal: normal,
          distance: alpha,
          color: this.color
        };
      }
    }

    return result;
  }
}

// EOF 00100001-10