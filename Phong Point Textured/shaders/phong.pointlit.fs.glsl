precision mediump float;

uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;

varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    // diffuse contribution
    vec3 lightDir = normalize(uLightPosition-vWorldPosition);
    vec3 normalizedWorldNormal = normalize(vWorldNormal);
    float lambertTerm = dot(lightDir, normalizedWorldNormal);

    // specular contribution
    vec3 eyeVector = normalize(uCameraPosition-vWorldPosition);
    vec3 reflectionVector = dot(lightDir, normalizedWorldNormal)*normalizedWorldNormal*2.0-lightDir;
    float phongTerm = pow(max(dot(reflectionVector, eyeVector), 0.0), 64.0);

    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;

    vec3 ambient = albedo * 0.1;
    vec3 diffuseColor = albedo * lambertTerm;
    vec3 specularColor = vec3(0.3, 0.3, 0.3)*phongTerm;

    vec3 finalColor = ambient + diffuseColor + specularColor;

    gl_FragColor = vec4(finalColor, 1.0);
}

// EOF 00100001-10