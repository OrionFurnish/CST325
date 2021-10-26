function Camera(input) {
    // The following two parameters will be used to automatically create the cameraWorldMatrix in this.update()
    this.cameraYaw = 0;
    this.cameraPosition = new Vector3();

    this.cameraWorldMatrix = new Matrix4();

    // -------------------------------------------------------------------------
    this.getViewMatrix = function() {
        return this.cameraWorldMatrix.clone().inverse();
    }

    // -------------------------------------------------------------------------
    this.getForward = function() {
        var m = this.cameraWorldMatrix;
        return new Vector3(m.getElement(2, 0), m.getElement(2, 1), -m.getElement(2, 2));
    }
    // -------------------------------------------------------------------------
    this.update = function(dt) {
        var currentForward = this.getForward();

        if (input.up) {
            this.cameraPosition.add(currentForward.multiplyScalar(dt*5));
        }

        if (input.down) {
            this.cameraPosition.subtract(currentForward.multiplyScalar(dt*5));
        }

        if (input.left) {
            this.cameraYaw += dt*100;
        }

        if (input.right) {
            this.cameraYaw -= dt*100;
        }

        this.cameraWorldMatrix = new Matrix4().makeTranslation(this.cameraPosition);
        this.cameraWorldMatrix.multiply(new Matrix4().makeRotationY(this.cameraYaw));
    }
}

// EOF 00100001-10