import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html } from "@react-three/drei";
import ZiggyGLB from "../assets/Ziggy.glb";

useGLTF.preload(ZiggyGLB);

function ZiggyModel({ animation, position = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF(ZiggyGLB);
  const ref = useRef();

  // subtle per-part offsets (if model has named children you can target them).
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();

    // always gentle idle bob
    if (animation === "Idle" || !animation) {
      ref.current.position.y = position[1] + Math.sin(t * 2) * 0.05;
      ref.current.rotation.y = Math.sin(t * 0.4) * 0.06;
      ref.current.rotation.z = 0;
    }

    if (animation === "Cheer") {
      // jump + spin
      ref.current.position.y = position[1] + Math.abs(Math.sin(t * 6)) * 0.35;
      ref.current.rotation.y += 0.08;
    }

    if (animation === "Point") {
      // quick lean to the right (pointing)
      ref.current.position.y = position[1] + Math.sin(t * 2) * 0.04;
      ref.current.rotation.y = Math.sin(t * 4) * 0.35; // look/lean
      ref.current.rotation.z = Math.sin(t * 6) * 0.08;
    }

    if (animation === "React") {
      // little startled shake
      ref.current.rotation.z = Math.sin(t * 20) * 0.18;
      ref.current.position.y = position[1] + Math.sin(t * 6) * 0.05;
    }
  });

  return <primitive ref={ref} object={scene} position={position} scale={scale} />;
}

export default function Ziggy({ animation = "Idle", position = [0, 0, 0], scale = 1 }) {
  return (
    <div style={{ width: "100%", height: "380px" }}>
      <Canvas camera={{ position: [0, 1.5, 3], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <React.Suspense fallback={<Html center>Loading Ziggy...</Html>}>
          <ZiggyModel animation={animation} position={position} scale={scale} />
        </React.Suspense>
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}
