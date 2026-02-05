"use client";

/* eslint-disable react/no-unknown-property */
import { forwardRef, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, ShaderMaterial } from "three";

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2 r = (G * sin(G * texCoord));
  return fract(r.x * r.y);
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c) * uv;
}

void main() {
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  float t = uSpeed * uTime;

  uv.y += 0.03 * sin(8.0 * uv.x - t);

  float pattern =
    0.6 +
    0.4 *
      sin(
        5.0 *
          (uv.x +
            uv.y +
            cos(3.0 * uv.x + 5.0 * uv.y) +
            0.02 * t)
      );

  float rnd = noise(gl_FragCoord.xy);
  vec3 col = uColor * pattern - rnd * 0.06 * uNoiseIntensity;

  gl_FragColor = vec4(col, 1.0);
}
`;

export type SilkUniforms = {
  uSpeed: { value: number };
  uScale: { value: number };
  uNoiseIntensity: { value: number };
  uColor: { value: any };
  uRotation: { value: number };
  uTime: { value: number };
};

type Props = {
  uniforms: SilkUniforms;
};

const SilkPlane = forwardRef<Mesh, Props>(({ uniforms }, ref) => {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (ref && typeof ref !== "function") {
      ref.current?.scale.set(viewport.width, viewport.height, 1);
    }
  }, [viewport, ref]);

  useFrame((_, delta) => {
    if (ref && typeof ref !== "function") {
      const mat = ref.current?.material as ShaderMaterial | undefined;
      if (mat) mat.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});

SilkPlane.displayName = "SilkPlane";
export default SilkPlane;
