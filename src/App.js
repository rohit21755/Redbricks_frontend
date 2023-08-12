import React, { useEffect, useState } from 'react';
import { Canvas , useThree} from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';
import './App.css';
import Model from "./Scene"

function Controls() {
  const {
    camera,
    gl: { domElement },
  }= useThree();

  return (
    <OrbitControls
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      zoomSpeed={0.5}
      panSpeed={0.5}
      rotateSpeed={0.5}
      target={[0, 0, 0]} // Set the target position for the camera to look at
      args={[camera, domElement]}
    />
  );
}

function App() {
  const [sc,setSc ] = useState('/ss/scene.gltf');
  // setSc('/skull/scene.gltf')
  return (
    <>
            <button onClick={()=>{setSc("/skull/scene.gltf")}}>Skull</button>
          <button onClick={()=>{ setSc("/ss/scene.gltf");console.log("status changed") }}>Scene1</button>

      <div className="App">
        <div className="App-header">


          <Canvas
            dpr={[1, 2]}
            shadows
            camera={{ fov: 45 }} // Update the camera property name from 'fav' to 'fov'
            style={{ position: 'absolute' }}
          >      
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Controls/>
              <Model sc={sc}/>
            
          </Canvas>
        </div>

      </div>
    </>
  );
}

export default App;
