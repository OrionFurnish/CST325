/*
 * An object representing a 4x4 matrix
 */

var Matrix4 = function(x, y, z) {
	this.elements = new Float32Array(16);

	if (!(this instanceof Matrix4)) {
		console.error("Matrix4 constructor must be called with the new operator");
	}

	return this.makeIdentity();
}

//=============================================================================  
Matrix4.prototype = {

	// -------------------------------------------------------------------------
	clone: function() {
		var newMatrix = new Matrix4();
		for (var i = 0; i < 16; ++i) {
			newMatrix.elements[i] = this.elements[i];
		}
		return newMatrix;
	},

	// -------------------------------------------------------------------------
	copy: function(m) {
		for (var i = 0; i < 16; ++i) {
			this.elements[i] = m.elements[i];
		}

		return this;
	},

	// -------------------------------------------------------------------------
	getElement: function(row, col) {
		return this.elements[row * 4 + col];
	},

	// -------------------------------------------------------------------------
	set: function(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
		var e = this.elements;

		e[0] = n11; e[1] = n12; e[2] = n13; e[3] = n14;
		e[4] = n21; e[5] = n22; e[6] = n23; e[7] = n24;
		e[8] = n31; e[9] = n32; e[10] = n33; e[11] = n34;
		e[12] = n41; e[13] = n42; e[14] = n43; e[15] = n44;

		return this;
	},

	// -------------------------------------------------------------------------
	makeIdentity: function() {
		this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
		return this;
	},

	// -------------------------------------------------------------------------
	multiplyScalar: function(s) {
		for (var i = 0; i < 16; ++i) {
			this.elements[i] = this.elements[i] * s;
		}
	},

	// -------------------------------------------------------------------------
	multiplyVector: function(v) {
		// safety check
		if (!(v instanceof Vector4)) {
			console.error("Trying to multiply a 4x4 matrix with an invalid vector value");
		}

		var result = new Vector4();
		var e = this.elements;
		result.x = e[0]*v.x + e[1]*v.y + e[2]*v.z + e[3];
		result.y = e[4]*v.x + e[5]*v.y + e[6]*v.z + e[7];
		result.z = e[8]*v.x + e[9]*v.y + e[10]*v.z + e[11];
		result.w = e[12]*v.x + e[13]*v.y + e[14]*v.z + e[15];
		return result;
	},

	// -------------------------------------------------------------------------
	multiply: function(rightSideMatrix) {
		// safety check
		if (!(rightSideMatrix instanceof Matrix4)) {
			console.error("Trying to multiply a 4x4 matrix with an invalid matrix value");
		}

		var l = this.elements;
		var r = rightSideMatrix.elements;
		var results = new Matrix4();
		results[0] = l[0]*r[0] + l[1]*r[4] + l[2]*r[8] + l[3]*r[12];
		results[1] = l[0]*r[1] + l[1]*r[5] + l[2]*r[9] + l[3]*r[13];
		results[2] = l[0]*r[2] + l[1]*r[6] + l[2]*r[10] + l[3]*r[14];
		results[3] = l[0]*r[3] + l[1]*r[7] + l[2]*r[11] + l[3]*r[15];

		results[4] = l[4]*r[0] + l[5]*r[4] + l[6]*r[8] + l[7]*r[12];
		results[5] = l[4]*r[1] + l[5]*r[5] + l[6]*r[9] + l[7]*r[13];
		results[6] = l[4]*r[2] + l[5]*r[6] + l[6]*r[10] + l[7]*r[14];
		results[7] = l[4]*r[3] + l[5]*r[7] + l[6]*r[11] + l[7]*r[15];

		results[8] = l[8]*r[0] + l[9]*r[4] + l[10]*r[8] + l[11]*r[12];
		results[9] = l[8]*r[1] + l[9]*r[5] + l[10]*r[9] + l[11]*r[13];
		results[10] = l[8]*r[2] + l[9]*r[6] + l[10]*r[10] + l[11]*r[14];
		results[11] = l[8]*r[3] + l[9]*r[7] + l[10]*r[11] + l[11]*r[15];

		results[12] = l[12]*r[0] + l[13]*r[4] + l[14]*r[8] + l[15]*r[12];
		results[13] = l[12]*r[1] + l[13]*r[5] + l[14]*r[9] + l[15]*r[13];
		results[14] = l[12]*r[2] + l[13]*r[6] + l[14]*r[10] + l[15]*r[14];
		results[15] = l[12]*r[3] + l[13]*r[7] + l[14]*r[11] + l[15]*r[15];
		this.elements = results;
		return this;
	},

	// -------------------------------------------------------------------------
	premultiply: function(leftSideMatrix) {
		// ignore this, the implementation will be distributed with the solution
		return this;
	},

	// -------------------------------------------------------------------------
	makeScale: function(x, y, z) {
		this.elements.fill(0);
		this.elements[0] = x;
		this.elements[5] = y;
		this.elements[10] = z;
		this.elements[15] = 1;
		return this;
	},

	// -------------------------------------------------------------------------
	makeRotationX: function(degrees) {
		var radians = degrees*Math.PI/180;
		var e = this.elements;
		e.fill(0);
		e[0] = 1;
		e[5] = Math.cos(radians);
		e[6] = -Math.sin(radians);
		e[9] = Math.sin(radians);
		e[10] = Math.cos(radians);
		e[15] = 1;
		this.elements = e;
		return this;
	},

	// -------------------------------------------------------------------------
	makeRotationY: function(degrees) {
		var radians = degrees*Math.PI/180;
		var e = this.elements;
		e.fill(0);
		e[0] = Math.cos(radians);
		e[2] = Math.sin(radians);
		e[5] = 1;
		e[8] = -Math.sin(radians);
		e[10] = Math.cos(radians);
		e[15] = 1;
		this.elements = e;
		return this;
	},

	// -------------------------------------------------------------------------
	makeRotationZ: function(degrees) {
		var radians = degrees*Math.PI/180;
		var e = this.elements;
		e.fill(0);
		e[0] = Math.cos(radians);
		e[1] = -Math.sin(radians);
		e[4] = Math.sin(radians);
		e[5] = Math.cos(radians);
		e[10] = 1;
		e[15] = 1;
		this.elements = e;
		return this;
	},

	// -------------------------------------------------------------------------
	makeTranslation: function(arg1, arg2, arg3) {
		var e = this.elements;
		e.fill(0);
		e[0] = 1;
		e[5] = 1;
		e[10] = 1;
		e[15] = 1;
		if (arg1 instanceof Vector4) {
			e[3] = arg1.x;
			e[7] = arg1.y;
			e[11] = arg1.z;
		} else if (arg1 instanceof Vector3) {
			e[3] = arg1.x;
			e[7] = arg1.y;
			e[11] = arg1.z;
		} else {
			e[3] = arg1;
			e[7] = arg2;
			e[11] = arg3;
		}
		this.elements = e;
		return this;
	},

	// -------------------------------------------------------------------------
	makePerspective: function(fovy, aspect, near, far) {
		var fovyRads = fovy*Math.PI/180;
		var t = Math.tan(fovyRads/2)*near;
		var r = aspect*t;

		var e = this.elements;
		e.fill(0);
		e[0] = near/r;
		e[5] = near/t;
		e[10] = -((far + near)/(far - near));
		e[11] = -((2*near*far)/(far - near));
		e[14] = -1;
		this.elements = e;
		return this;
	},

	// -------------------------------------------------------------------------
	makeOrthographic: function(left, right, top, bottom, near, far) {
		var e = this.elements;
		e.fill(0);
		e[0] = 2/(right-left);
		e[3] = -(right+left)/(right-left);
		e[5] = 2/(top-bottom);
		e[7] = -(top+bottom)/(top-bottom);
		e[10] = -2/(far-near);
		e[11] = -(far+near)/(far-near);
		e[15] = 1;
		this.elements = e;
		return this;
	},

	// -------------------------------------------------------------------------
	// @param moonRotationAngle A scalar value representing the rotation angle around Earth
	// @param moonOffsetFromEarth A Vector3 representing the space between the earth and the moon
	// @param earthWorldMatrix The world transformation of the Earth composed of both rotation and translation
	createMoonMatrix: function(moonRotationAngle, offsetFromEarth, earthWorldMatrix) {
		var moonTranslation = new Matrix4().makeTranslation(offsetFromEarth);
		var moonMatrix = new Matrix4().makeRotationZ(moonRotationAngle);
		moonMatrix.multiply(moonTranslation);
		moonMatrix = earthWorldMatrix.clone().multiply(moonMatrix);
		return moonMatrix;
	},

	// -------------------------------------------------------------------------
	determinant: function() {
		var e = this.elements;

		// laid out for clarity, not performance
		var m11 = e[0]; var m12 = e[1]; var m13 = e[2]; var m14 = e[3];
		var m21 = e[4]; var m22 = e[5]; var m23 = e[6]; var m24 = e[7];
		var m31 = e[8]; var m32 = e[8]; var m33 = e[9]; var m34 = e[10];
		var m41 = e[12]; var m42 = e[13]; var m43 = e[14]; var m44 = e[15];

		var det11 = m11 * (m22 * (m33 * m44 - m34 * m43) +
			m23 * (m34 * m42 - m32 * m44) +
			m24 * (m32 * m43 - m33 * m42));

		var det12 = -m12 * (m21 * (m33 * m44 - m34 * m43) +
			m23 * (m34 * m41 - m31 * m44) +
			m24 * (m31 * m43 - m33 * m41));

		var det13 = m13 * (m21 * (m32 * m44 - m34 * m42) +
			m22 * (m34 * m41 - m31 * m44) +
			m24 * (m31 * m42 - m32 * m41));

		var det14 = -m14 * (m21 * (m32 * m43 - m33 * m42) +
			m22 * (m33 * m41 - m31 * m43) +
			m23 * (m31 * m42 - m32 * m41));

		return det11 + det12 + det13 + det14;
	},

	// -------------------------------------------------------------------------
	transpose: function() {
		var te = this.elements;
		var tmp;

		tmp = te[1]; te[1] = te[4]; te[4] = tmp;
		tmp = te[2]; te[2] = te[8]; te[8] = tmp;
		tmp = te[6]; te[6] = te[9]; te[9] = tmp;

		tmp = te[3]; te[3] = te[12]; te[12] = tmp;
		tmp = te[7]; te[7] = te[13]; te[13] = tmp;
		tmp = te[11]; te[11] = te[14]; te[14] = tmp;

		return this;
	},


	// -------------------------------------------------------------------------
	inverse: function() {
		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		var te = this.elements,
			me = this.clone().elements,

			n11 = me[0], n21 = me[1], n31 = me[2], n41 = me[3],
			n12 = me[4], n22 = me[5], n32 = me[6], n42 = me[7],
			n13 = me[8], n23 = me[9], n33 = me[10], n43 = me[11],
			n14 = me[12], n24 = me[13], n34 = me[14], n44 = me[15],

			t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
			t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
			t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
			t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

		var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

		if (det === 0) {
			var msg = "can't invert matrix, determinant is 0";
			console.warn(msg);
			return this.makeIdentity();
		}

		var detInv = 1 / det;

		te[0] = t11 * detInv;
		te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
		te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
		te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

		te[4] = t12 * detInv;
		te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
		te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
		te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

		te[8] = t13 * detInv;
		te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
		te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
		te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

		te[12] = t14 * detInv;
		te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
		te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
		te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

		return this;
	},

	// -------------------------------------------------------------------------
	log: function() {
		var te = this.elements;
		console.log('[ ' +
			'\n ' + te[0] + ', ' + te[1] + ', ' + te[2] + ', ' + te[3] +
			'\n ' + te[4] + ', ' + te[5] + ', ' + te[6] + ', ' + te[7] +
			'\n ' + te[8] + ', ' + te[9] + ', ' + te[10] + ', ' + te[11] +
			'\n ' + te[12] + ', ' + te[13] + ', ' + te[14] + ', ' + te[15] +
			'\n]'
		);

		return this;
	}
};

// EOF 00100001-10