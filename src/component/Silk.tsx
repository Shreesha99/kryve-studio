"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { Color } from "three";
import type { SilkUniforms } from "./SilkPlane";

const SilkCanvas = dynamic(() => import("./SilkCanvas"), {
  ssr: false,
});

type Props = {
  speed?: number;
  scale?: number;
  noiseIntensity?: number;
  rotation?: number;
};

export default function Silk({
  speed = 2,
  scale = 3,
  noiseIntensity = 0.6,
  rotation = 12,
}: Props) {
  const uniforms = useMemo<SilkUniforms>(() => {
    return {
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uRotation: { value: rotation },
      uColor: { value: new Color(1, 1, 1) }, // default white
      uTime: { value: 0 },
    };
  }, [speed, scale, noiseIntensity, rotation]);

  useEffect(() => {
    const updateColor = () => {
      const isDark = document.documentElement.classList.contains("dark");

      // NOT pure black / white — perceptual contrast
      const color = isDark
        ? new Color(0.5, 0.5, 0.5) // rich charcoal (visible silk)
        : new Color(0.92, 0.92, 0.95); // soft pearl white

      uniforms.uColor.value.copy(color);
    };

    updateColor();

    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [uniforms]);

  return <SilkCanvas uniforms={uniforms} />;
}
