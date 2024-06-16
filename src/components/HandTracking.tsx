/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import poseData from "../assets/json/dragonballzposes.json";
import Navbar from "./common/Navbar";
import { useAnimationContext } from "../context/AnimationContext";
import { motion } from "framer-motion";
import knn from "knear";
import PoseInfoSidebar from "./PoseInfoSidebar";

const HandTracking: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [poseMatch, setPoseMatch] = useState<string | null>(null);
  const [dragonBallData, setDragonBallData] = useState<any>(null);
  const [detectedDragonBallPoseImage, setDetectedDragonBallPoseImage] =
    useState<string | null>(null);
  const { routeVariants } = useAnimationContext();
  const machine = useRef(new knn.kNear(3));

  const [correctPredictions, setCorrectPredictions] = useState(0);
  const [totalPredictions, setTotalPredictions] = useState(0);
  const [prediction, setPrediction] = useState<string | null>(null);

  useEffect(() => {
    // check if postData is a valid json and not null
    function validateAndCleanData(data: any) {
      return data.data.filter((pose: { label: any; vector: any[] }) => {
        const hasAllFields =
          pose.label && Array.isArray(pose.vector) && pose.vector.length > 0;
        const vectorIsValid = pose.vector.every(
          (coord) => typeof coord === "number"
        );
        return hasAllFields && vectorIsValid;
      });
    }
    validateAndCleanData(poseData);

    poseData.data.forEach((pose) => {
      machine.current.learn(pose.vector, pose.label);
    });

    const getDragonBallZData = async () => {
      fetch("https://dragonball-api.com/api/characters?limit=100")
        .then((res) =>
          res.json().then((data) => {
            setDragonBallData(data.items);
            console.log(data.items);
          })
        )
        .catch((err) => console.log(err));
    };
    getDragonBallZData();
  }, []);

  useEffect(() => {
    if (poseMatch && dragonBallData && dragonBallData.length > 0) {
      const filteredData = dragonBallData.filter((item: any) => {
        return item.name.toLowerCase() === poseMatch.toLowerCase();
      });
      if (filteredData.length > 0) {
        const character = filteredData[0];
        console.log(character);
        setDetectedDragonBallPoseImage(character.image);
      }
    }
  }, [poseMatch]);

  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    const setupCanvas = () => {
      if (videoElement && canvasElement) {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
      }
    };

    if (!videoElement || !canvasElement) return;

    // Listen for when the video has data loaded
    videoElement.addEventListener("loadeddata", setupCanvas);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 1280,
      height: 720,
    });

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    if (!hands) return;

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const calculateDistance = (detected: number[], reference: number[]) => {
      return Math.sqrt(
        detected.reduce(
          (acc, cur, i) => acc + Math.pow(cur - reference[i], 2),
          0
        )
      );
    };

    hands.onResults((results) => {
      const canvasCtx = canvasElement.getContext("2d");
      let foundMatch = false;

      if (canvasCtx) {
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
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
              color: "#00FF00",
              lineWidth: 5,
            });
            drawLandmarks(canvasCtx, landmarks, {
              color: "#FF0000",
              lineWidth: 2,
            });
            const detectedPose = landmarks.flatMap((p) => [p.x, p.y, p.z]);
            const predictedLabel = machine.current.classify(detectedPose);
            setPrediction(predictedLabel);
            setTotalPredictions((prev) => prev + 1);

            poseData.data.forEach((pose) => {
              const distance = calculateDistance(detectedPose, pose.vector);

              if (distance < 0.3) {
                // This value can be adjusted to control the sensitivity of the algorithm
                console.log(`Pose matched: ${pose.label}`);
                setPoseMatch(pose.label);
                setCorrectPredictions((prev) => prev + 1);
                foundMatch = true;
              }
            });
          }
        }
        canvasCtx.restore();
      }
      if (!foundMatch) {
        setPoseMatch(null);
        setDetectedDragonBallPoseImage(null);
      }
    });

    camera.start();

    // Clean up on component unmount
    return () => {
      videoElement.removeEventListener("loadeddata", setupCanvas);
      if (videoElement.srcObject instanceof MediaStream) {
        videoElement.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const accuracy =
    totalPredictions > 0
      ? ((correctPredictions / totalPredictions) * 100).toFixed(2)
      : 0;

  return (
    <>
      <Navbar />
      <PoseInfoSidebar />
      <motion.div
        variants={routeVariants}
        initial="initial"
        animate="final"
        className="flex flex-col justify-center items-center h-screen bg-gray-800 space-y-4 p-4"
      >
        <div className="relative w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-auto transform -scale-x-100"
            autoPlay
            muted
          ></video>
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-auto transform text-white -scale-x-100"
            style={{ width: "100%" }}
          ></canvas>
          {poseMatch && (
            <div className="absolute top-0 left-0 p-4  bg-orange-500 shadow">
              {poseMatch}
            </div>
          )}
          {detectedDragonBallPoseImage && (
            <img
              src={detectedDragonBallPoseImage}
              className="absolute bottom-0 right-0 p-4 w-1/3 h-full object-fill rounded-lg shadow-lg"
              alt="Detected Pose"
            />
          )}
          <div className="absolute bottom-0 left-0 p-4 bg-white text-black shadow">
            <p>
              Accuracy: {accuracy}% ({correctPredictions}/{totalPredictions})
            </p>
            <p>Prediction: {prediction}</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HandTracking;
