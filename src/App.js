import React, { useEffect, useRef, useState } from 'react';
import * as Hands from '@mediapipe/hands';
import { Canvas , useThree} from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls, useAnimations } from '@react-three/drei';
import * as mediapipeUtils from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
// import { model } from '@tensorflow/tfjs';
// import Model from "./Scene";
// import { useGLTF } from '@react-three/drei'

function Model(props) {

  // const { nodes, materials } = useGLTF('/skull/scene.gltf')
  const modelRef = useRef();
  const [modelScale, setModelScale] = useState(0.0); 
  const [modelRotation, setModelRotation] = useState(0.0);
  // const group = useRef()
  // const { nodes, materials, animations } = useGLTF('/skull/scene.gltf')
  // const { actions } = useAnimations(animations, group)
  useEffect(() => {}, [props.rotation]);

  
  useEffect(() => {
    if (props.behavior === 'scale') {
      setModelScale(1.5); 
    } else if (props.behavior === 'rotate') {
      setModelRotation(Math.PI / 4); 
    }
    else if (props.behavior === 'default') {
      setModelScale(1.0); 
      setModelRotation(0.0); 
    }
       
    
  }, [props.behavior]);
  const { nodes, materials } = useGLTF('/skull/scene.gltf')
  return (
    
    <group {...props} dispose={null} scale={modelScale}>
    <mesh geometry={nodes.Clouds_2_Clouds_1.geometry} material={materials.Clouds} position={[0, 0, -500]} />
    <mesh geometry={nodes.Ocean_Mat_0.geometry} material={materials.material} position={[0, 0, -500]} />
    <mesh geometry={nodes.CONT_Extrude_Mat3_0.geometry} material={materials['Mat.3']} position={[-64.303, 10.837, -5]} />
    <mesh geometry={nodes.SP_Extrude_Ice_0.geometry} material={materials.material_3} position={[0, 500, -500]} />
    <mesh geometry={nodes.NP_Extrude_Ice_0.geometry} material={materials.material_3} position={[0, -500, -500]} />
  </group>

    
  )
}
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

const App = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelBehavior, setModelBehavior] = useState('default');
  const cameraRef = useRef();
var camera = null;
const [zoomLevel, setZoomLevel] = useState(5); // Initial zoom level

 const onResults = (results) =>   {
  // console.log("Hello")
  console.log('Number of hands detected:', results.multiHandLandmarks.length);
  const canvasElement = canvasRef.current;
const canvasCtx = canvasElement.getContext('2d');

canvasCtx.save();
canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
canvasCtx.drawImage(
  results.image,
  0,
  0,
  canvasElement.width,
  canvasElement.height
);

if (results.multiHandLandmarks) {
  for (const landmarks of results.multiHandLandmarks) {
    mediapipeUtils.drawConnectors(
      canvasCtx,
      landmarks,
      Hands.HAND_CONNECTIONS,
      { color: '#00FF00', lineWidth: 1 }
    );
    // mediapipeUtils.drawLandmarks(
    //   canvasCtx,
    //   landmarks,
    //   { color: '#FF0000', lineWidth: 0 }
    // );
    console.log(results.multiHandLandmarks.maxNumHands)
    // const thumbTip = landmarks[4];
    // const pinkyTip = landmarks[20];
    // const indexTip = landmarks[8];
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        // ... Existing code ...

      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      const middleTip = landmarks[12];
      const ringFinger = landmarks[16];
      const pinkyTip = landmarks[20];
      

      const distanceThumbToPinky = Math.sqrt((pinkyTip.x - thumbTip.x) ** 2 + (pinkyTip.y - thumbTip.y) ** 2);

      const distanceThumbToIndex = Math.sqrt(
        (thumbTip.x - indexTip.x) ** 2 + (thumbTip.y - indexTip.y) ** 2
      );
      const distanceIndexToMiddle = Math.sqrt(
        (indexTip.x - middleTip.x) ** 2 + (indexTip.y - middleTip.y) ** 2
      );

      // Define gesture thresholds
      const rightClickThreshold = 0.03;
      const leftClickThreshold = 0.05;

      if (distanceThumbToPinky < rightClickThreshold) {
        console.log("Hello")
        // Update model behavior for right-click
        // Model.zoomIn();
        setModelBehavior('rotate'); // Or perform any other action you want
      } else if (distanceThumbToIndex < leftClickThreshold && distanceIndexToMiddle < leftClickThreshold) {
        // Update model behavior for left-click
        console.log("not hello")
        setModelBehavior('scale'); // Or perform any other action you want
      }
      else {
        
        setModelBehavior('default'); 
      }
      }
    }
  }
  // for (const landmarks of results.multiHandLandmarks){
    // const thumbTip = landmarks[4];
          // const indexTip = landmarks[8];

          // Calculate the distance between thumb and index finger tips
          // const distance = Math.sqrt(
            // (thumbTip.x - indexTip.x) ** 2 + (thumbTip.y - indexTip.y) ** 2
          // );
          // if (distance < 0.1) {
          //   setModelPosition([thumbTip.x, thumbTip.y, thumbTip.z]);
          // }
  // }
}
canvasCtx.restore();
}

  useEffect(() => {
    const videoElement = webcamRef.current;


    const hands = new Hands.Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null ){

    }
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      
    });
    hands.onResults(onResults);

     if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
      cameraRef.current = camera;
    }
  }, []);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 9,
          width: 1280,
          height: 960,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 9,
          width: 1240,
          height: 960,
        }}
      />
      <Canvas
            dpr={[1, 2]}
            shadows
            camera={{ fov: 45, position: [0, 0, zoomLevel] }}
        style={{ position: 'absolute', zIndex: 100, top:"10" }}
          >      
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Controls/>
              <Model behavior={modelBehavior}/>
            
          </Canvas>
    </div>
  );
};

export default App;
