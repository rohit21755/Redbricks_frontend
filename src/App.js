import React, { useEffect, useRef, useState } from 'react';
import * as Hands from '@mediapipe/hands';
import { Canvas , useThree} from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';
import * as mediapipeUtils from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
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
const App = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef();
  const [prevDistance, setPrevDistance] = useState(0);
  const [modelPosition, setModelPosition] = React.useState([0, 0, 0]);
var camera = null;
const [zoomLevel, setZoomLevel] = useState(5); // Initial zoom level
  const [isZoomingIn, setIsZoomingIn] = useState(false);
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  
  const handlePinched = () => {
    setZoomLevel(zoomLevel - 0.1);
  };

  const handleNotPinched = () => {
    setZoomLevel(zoomLevel + 0.1);
  };
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
    mediapipeUtils.drawLandmarks(
      canvasCtx,
      landmarks,
      { color: '#FF0000', lineWidth: 1 }
    );
    console.log(results.multiHandLandmarks.maxNumHands)
    // const thumbTip = landmarks[4];
    // const pinkyTip = landmarks[20];
    // const indexTip = landmarks[8];
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        // ... Existing code ...

        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];

        const distanceThumbToIndex = Math.sqrt(
          (thumbTip.x - indexTip.x) ** 2 + (thumbTip.y - indexTip.y) ** 2
        );

        // Define a threshold for pinched gesture detection
        const pinchThreshold = 0.05; // Adjust as needed

        if (distanceThumbToIndex < pinchThreshold) {
          // setIsPinched(true);
          // Model.scale.set(0,0, -1);
          // cameraRef.current.scal;
        } else {
          // setIsPinched(false);
          // Model.scale.set(0,0, 1);
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
              <Model />
            
          </Canvas>
    </div>
  );
};

export default App;
