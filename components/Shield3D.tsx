"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial } from "@react-three/drei";

/**
 * The futuristic 3D hero: a glowing, gently morphing glass crystal wrapped in a
 * slow violet wireframe — the "shield" guarding your reputation. Pure WebGL, no
 * external HDR assets, so it renders reliably anywhere.
 */
function Core() {
  return (
    <Float speed={1.4} rotationIntensity={0.9} floatIntensity={1.2}>
      <Icosahedron args={[1.35, 6]}>
        <MeshDistortMaterial
          color="#22d3ee"
          emissive="#0e7490"
          emissiveIntensity={0.55}
          distort={0.34}
          speed={1.7}
          roughness={0.22}
          metalness={0.1}
        />
      </Icosahedron>
      <Icosahedron args={[1.72, 1]}>
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.2} />
      </Icosahedron>
    </Float>
  );
}

export default function Shield3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 4, 6]} intensity={2.6} decay={0} color="#22d3ee" />
      <pointLight position={[-6, -3, 2]} intensity={2.0} decay={0} color="#8b5cf6" />
      <pointLight position={[0, 5, -5]} intensity={1.3} decay={0} color="#38bdf8" />
      <Core />
    </Canvas>
  );
}
