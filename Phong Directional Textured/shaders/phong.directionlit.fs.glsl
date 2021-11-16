precision mediump float;

uniform vec3 uLightDirection;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;

varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    // diffuse contribution
    // 1. normalize the light direction and store in a separate variable
    vec3 normalizedLightDirection = normalize(uLightDirection);
    // 2. normalize the world normal and store in a separate variable
    vec3 normalizedWorldNormal = normalize(vWorldNormal);
    // 3. calculate the lambert term
    float lambertTerm = dot(normalizedLightDirection, normalizedWorldNormal);

    // specular contribution
    // 1. in world space, calculate the direction from the surface point to the eye (normalized)
    vec3 eyeVector = normalize(uCameraPosition-vWorldPosition);
    // 2. in world space, calculate the reflection vector (normalized)
    vec3 reflectionVector = dot(normalizedLightDirection, normalizedWorldNormal)*normalizedWorldNormal*2.0-normalizedLightDirection;
    // 3. calculate the phong term
    float phongTerm = pow(max(dot(reflectionVector, eyeVector), 0.0), 64.0);

    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;

    vec3 ambient = albedo * 0.1;
    vec3 diffuseColor = albedo * lambertTerm;
    vec3 specularColor = vec3(0.3, 0.3, 0.3)*phongTerm;

    vec3 finalColor = ambient + diffuseColor + specularColor;

    gl_FragColor = vec4(finalColor, 1.0);
}

// EOF 00100001-10