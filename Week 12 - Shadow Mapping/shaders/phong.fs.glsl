precision mediump float;

uniform sampler2D uAlbedoTexture;
uniform sampler2D uShadowTexture;
uniform mat4 uLightVPMatrix;
uniform vec3 uDirectionToLight;
uniform vec3 uCameraPosition;

varying vec2 vTexCoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
  vec3 worldNormal01 = normalize(vWorldNormal);
  vec3 directionToEye01 = normalize(uCameraPosition - vWorldPosition);
  vec3 reflection01 = 2.0 * dot(worldNormal01, uDirectionToLight) * worldNormal01 - uDirectionToLight;

  float lambert = max(dot(worldNormal01, uDirectionToLight), 0.0);
  float specularIntensity = pow(max(dot(reflection01, directionToEye01), 0.0), 64.0);

  vec4 texColor = texture2D(uAlbedoTexture, vTexCoords);

  vec3 ambient = vec3(0.2, 0.2, 0.2) * texColor.rgb;
  vec3 diffuseColor = texColor.rgb * lambert;
  vec3 specularColor = vec3(1.0, 1.0, 1.0) * specularIntensity;
  vec3 finalColor = ambient + diffuseColor + specularColor;

  // transform the world position into the lights clip space (clip space and NDC will be the same for orthographic projection)
  vec4 lightSpaceNDC = uLightVPMatrix * vec4(vWorldPosition, 1.0);

  // scale and bias the light-space NDC xy coordinates from [-1, 1] to [0, 1]
  vec2 lightSpaceUV = vec2((lightSpaceNDC.x+1.0)/2.0, (lightSpaceNDC.y+1.0)/2.0);

  // Sample from the shadow map texture using the previously calculated lightSpaceUV
  vec4 shadowColor = texture2D(uShadowTexture, lightSpaceUV);

  // scale and bias the light-space NDC z coordinate from [-1, 1] to [0, 1]
  float lightDepth = (lightSpaceNDC.z+1.0)/2.0;

  float bias = 0.004;

  gl_FragColor = vec4(lightDepth, lightDepth, lightDepth, 1.0);
  if (lightDepth > shadowColor.r+bias) {
    gl_FragColor = vec4(ambient, 1.0);
  } else {
    gl_FragColor = vec4(finalColor, 1.0);
  }
}

// EOF 00100001-10