"use client";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";
import SilkPlane, { SilkUniforms } from "./SilkPlane";

type Props = {
  uniforms: SilkUniforms;
};

export default function SilkCanvas({ uniforms }: Props) {
  const meshRef = useRef<Mesh | null>(null);

  return (
    <Canvas
      dpr={[1, 2]}
      frameloop="always"
      className="absolute inset-0 z-0"
      gl={{ antialias: true }}
    >
      <SilkPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  );
}
