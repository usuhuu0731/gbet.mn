"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrthographicCamera } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
export type Part = "deck" | "piers" | "cables" | "foundations";
function Structure({ parts, animate }: { parts: Part[]; animate: boolean }) {
  const { size } = useThree();
  const stayCount = size.width < 600 ? 6 : 10;
  const deck = useRef<THREE.Group>(null);
  const piers = useRef<THREE.Group>(null);
  const tower = useRef<THREE.Group>(null);
  const cables = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  const time = useRef(0);
  const deckMaterial = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state, delta) => {
    time.current += delta;
    const t = time.current;
    if (deckMaterial.current)
      deckMaterial.current.wireframe = animate && t < 4.8;
    if (animate) {
      if (deck.current)
        deck.current.scale.x = THREE.MathUtils.smoothstep(t, 0.5, 2);
      if (piers.current)
        piers.current.scale.y = THREE.MathUtils.smoothstep(t, 1, 3);
      if (tower.current)
        tower.current.scale.y = THREE.MathUtils.smoothstep(t, 2, 4);
      if (cables.current)
        cables.current.scale.y = THREE.MathUtils.smoothstep(t, 3, 5);
    }
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.lerp(
        root.current.rotation.y,
        animate ? state.pointer.x * 0.025 : 0,
        0.025,
      );
    }
  });
  return (
    <group ref={root}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <planeGeometry args={[44, 32]} />
        <meshStandardMaterial color="#c9cfd0" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <planeGeometry args={[12, 32]} />
        <meshStandardMaterial color="#668a9a" roughness={0.65} />
      </mesh>
      <gridHelper
        args={[42, 28, "#99aaaf", "#aebbc0"]}
        position={[0, -0.015, 0]}
      />
      {[-1, 1].map((side) => (
        <group key={side}>
          {[3.5, 5, 6.5, 8].map((radius) => (
            <Line
              key={radius}
              points={Array.from({ length: 49 }, (_, i) => {
                const a = (i / 48) * Math.PI * 2;
                return [
                  side * 17 + Math.cos(a) * radius * 0.5,
                  0.01,
                  Math.sin(a) * radius + 7,
                ] as [number, number, number];
              })}
              color="#8fa4ad"
              lineWidth={0.7}
            />
          ))}
        </group>
      ))}
      {[-11, -6, 6, 11].map((x) => (
        <mesh key={`node-${x}`} position={[x, 3.94, 1.27]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <meshBasicMaterial color="#003dff" />
        </mesh>
      ))}
      {parts.includes("foundations") &&
        [-11, -6, 0, 6, 11].map((x) => (
          <mesh key={x} position={[x, 0.15, 0]}>
            <boxGeometry args={[1.8, 0.4, 2.8]} />
            <meshStandardMaterial color="#a9afb0" />
          </mesh>
        ))}
      {parts.includes("piers") && (
        <group ref={piers}>
          {[-11, -6, 6, 11].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              {[-0.65, 0.65].map((z) => (
                <mesh key={z} position={[0, 1.65, z]}>
                  <boxGeometry args={[0.55, 3.3, 0.55]} />
                  <meshStandardMaterial color="#d3d4ce" roughness={1} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )}
      {parts.includes("deck") && (
        <group ref={deck}>
          <mesh position={[0, 3.45, 0]}>
            <boxGeometry args={[29, 0.55, 2.65]} />
            <meshStandardMaterial
              ref={deckMaterial}
              color="#edece5"
              roughness={0.9}
            />
          </mesh>
          {[-1.25, 1.25].map((z) => (
            <group key={z}>
              <mesh position={[0, 3.86, z]}>
                <boxGeometry args={[29, 0.18, 0.12]} />
                <meshStandardMaterial color="#143c5b" />
              </mesh>
              <mesh position={[0, 3.65, z]}>
                <boxGeometry args={[29, 0.2, 0.12]} />
                <meshStandardMaterial color="#546e7c" />
              </mesh>
            </group>
          ))}
          <mesh position={[0, 3.735, 0]}>
            <boxGeometry args={[29, 0.015, 2.2]} />
            <meshStandardMaterial color="#58636a" />
          </mesh>
          {Array.from({ length: 28 }, (_, i) => (
            <mesh key={i} position={[-13.5 + i, 3.75, 0]}>
              <boxGeometry args={[0.45, 0.01, 0.025]} />
              <meshBasicMaterial color="#fff" />
            </mesh>
          ))}
        </group>
      )}
      {parts.includes("piers") && (
        <group ref={tower}>
          <mesh position={[0, 5, 0]}>
            <boxGeometry args={[0.6, 10, 0.55]} />
            <meshStandardMaterial color="#e8e6dd" />
          </mesh>
          <mesh position={[0, 9.6, 0]}>
            <boxGeometry args={[0.82, 0.8, 0.7]} />
            <meshStandardMaterial color="#1645d8" />
          </mesh>
        </group>
      )}
      {parts.includes("cables") && (
        <group ref={cables}>
          {[-1, 1].flatMap((side) =>
            Array.from({ length: stayCount }, (_, i) => (
              <Line
                key={`${side}-${i}`}
                points={[
                  [0, 9.5 - i * 0.16, 0],
                  [side * (2.5 + (i * 9.9) / (stayCount - 1)), 3.9, 0.95],
                ]}
                color="#d6d4c9"
                lineWidth={1.35}
              />
            )),
          )}
        </group>
      )}
    </group>
  );
}
export default function BridgeScene({
  parts,
  animate,
  onFail,
}: {
  parts: Part[];
  animate: boolean;
  onFail: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={animate ? "always" : "demand"}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onFail, {
          once: true,
        });
      }}
    >
      <CameraFit />
      <ambientLight intensity={1.8} />
      <directionalLight position={[10, 20, 10]} intensity={2.5} />
      <PerformanceGuard onFail={onFail} />
      <Structure parts={parts} animate={animate} />
    </Canvas>
  );
}
function CameraFit() {
  const { size, setDpr } = useThree();
  useEffect(() => {
    setDpr(size.width < 600 ? 1 : Math.min(devicePixelRatio, 1.5));
  }, [size.width, setDpr]);
  return (
    <OrthographicCamera
      makeDefault
      position={[24, 18, 27]}
      zoom={Math.min(24, size.width / 35)}
      onUpdate={(c) => c.lookAt(0, 3, 0)}
    />
  );
}
function PerformanceGuard({ onFail }: { onFail: () => void }) {
  const framesRef = useRef(0);
  const timeRef = useRef(0);
  useFrame((_, delta) => {
    framesRef.current++;
    timeRef.current += delta;
    if (framesRef.current === 90 && timeRef.current > 9) onFail();
  });
  return null;
}
