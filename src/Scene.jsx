import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function Model(props) {
  const { nodes, materials } = useGLTF(props.sc || '/ss/scene.gltf');

  const meshComponents = [];

  for (const nodeName in nodes) {
    const node = nodes[nodeName];

    if (node.isMesh) {
      meshComponents.push(
        <mesh key={nodeName} geometry={node.geometry} material={node.material} />
      );
    }
  }

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          {meshComponents}
        </group>
      </group>
    </group>
  );
}
