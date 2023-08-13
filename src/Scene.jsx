import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/skull/scene.gltf')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.defaultMaterial.geometry} material={materials.DefaultMaterial} />
          <mesh geometry={nodes.defaultMaterial_1.geometry} material={materials.DefaultMaterial} />
          <mesh geometry={nodes.defaultMaterial_2.geometry} material={materials.DefaultMaterial} />
          <mesh geometry={nodes.defaultMaterial_3.geometry} material={materials.DefaultMaterial} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/skull/scene.gltf')