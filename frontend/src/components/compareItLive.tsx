import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Webcam from 'react-webcam';
// import { Pose, Results } from '@mediapipe/pose';
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';

import * as cam from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import * as tf from '@tensorflow/tfjs';

type PoseAngleKey =
  | 'leftElbow'
  | 'rightElbow'
  | 'leftShoulder'
  | 'rightShoulder'
  | 'leftKnee'
  | 'rightKnee'
  | 'leftHip'
  | 'rightHip';

type PoseAngles = Record<PoseAngleKey, number>;

interface PoseData {
  angles: PoseAngles;
  timestamp: number;
}

interface PoseComparison {
  similarityScore: number;
  mae: number;
  individualDifferences: Record<PoseAngleKey, number>;
}

interface CountdownState {
  value: number | null;
  isActive: boolean;
}

interface PoseLandmark {
  x: number;
  y: number;
}

const COUNTDOWN_START = 10;
const TARGET_ACCURACY = 65;
const FEEDBACK_THRESHOLD = 20;

const CompareItLive: React.FC = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cameraRef = useRef<cam.Camera | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const isExerciseCompletedRef = useRef<boolean>(false);

  const referencePose = useMemo<PoseData>(() => ({
    angles: {
      leftElbow: 168.67,
      rightElbow: 174.81,
      leftShoulder: 118.91,
      rightShoulder: 69.88,
      leftKnee: 176.73,
      rightKnee: 169.27,
      leftHip: 179.78,
      rightHip: 162.89,
    },
    timestamp: Date.now(),
  }), []);

  const [currentPose, setCurrentPose] = useState<PoseData | null>(null);
  const [comparisonResult, setComparisonResult] = useState<PoseComparison | null>(null);
  const [countdownState, setCountdownState] = useState<CountdownState>({
    value: null,
    isActive: false,
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [feedback, setFeedback] = useState('Position yourself in front of camera');
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false);

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await tf.ready();
      initializePose();
    };

    initialize().catch((error) => {
      console.error('Failed to initialize pose estimation:', error);
    });
  }, []);

  const initializePose = () => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/${file}`,
    });

    pose.setOptions({
      modelComplexity: 2,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);
    poseRef.current = pose;

    const webcam = webcamRef.current;
    const canvas = canvasRef.current;

    if (webcam?.video && canvas) {
      const camera = new cam.Camera(webcam.video, {
        onFrame: async () => {
          // Stop processing if exercise is completed
          if (isExerciseCompletedRef.current) {
            return;
          }
          await pose.send({ image: webcam.video as HTMLVideoElement });
        },
        width: 640,
        height: 480,
      });

      camera.start();
      cameraRef.current = camera;
      canvas.width = 640;
      canvas.height = 480;
    }
  };

  const calculateAngle = (point1: PoseLandmark, point2: PoseLandmark, point3: PoseLandmark) => {
    const radians = Math.atan2(point3.y - point2.y, point3.x - point2.x)
      - Math.atan2(point1.y - point2.y, point1.x - point2.x);

    let angle = Math.abs((radians * 180.0) / Math.PI);

    if (angle > 180.0) {
      angle = 360 - angle;
    }

    return angle;
  };

  const extractPoseData = (landmarks: PoseLandmark[]): PoseData => {
    const angles: PoseAngles = {
      leftElbow: calculateAngle(landmarks[11], landmarks[13], landmarks[15]),
      rightElbow: calculateAngle(landmarks[12], landmarks[14], landmarks[16]),
      leftShoulder: calculateAngle(landmarks[13], landmarks[11], landmarks[23]),
      rightShoulder: calculateAngle(landmarks[14], landmarks[12], landmarks[24]),
      leftKnee: calculateAngle(landmarks[23], landmarks[25], landmarks[27]),
      rightKnee: calculateAngle(landmarks[24], landmarks[26], landmarks[28]),
      leftHip: calculateAngle(landmarks[11], landmarks[23], landmarks[25]),
      rightHip: calculateAngle(landmarks[12], landmarks[24], landmarks[26]),
    };

    return { angles, timestamp: Date.now() };
  };

  const comparePoses = (reference: PoseData, current: PoseData): PoseComparison => {
    const angleKeys = Object.keys(reference.angles) as PoseAngleKey[];

    let totalDifference = 0;
    const individualDifferences = {} as Record<PoseAngleKey, number>;

    angleKeys.forEach((key) => {
      const diff = Math.abs(reference.angles[key] - current.angles[key]);
      const normalizedDiff = Math.min(diff, 360 - diff);

      individualDifferences[key] = normalizedDiff;
      totalDifference += normalizedDiff;
    });

    const mae = totalDifference / angleKeys.length;
    const threshold = 30;
    const similarityScore = 100 * Math.exp(-mae / threshold);

    return {
      similarityScore,
      mae,
      individualDifferences,
    };
  };

  const generateFeedback = (differences: Record<PoseAngleKey, number>) => {
    const suggestions: string[] = [];

    Object.entries(differences).forEach(([joint, diff]) => {
      if (diff > FEEDBACK_THRESHOLD) {
        suggestions.push(`Adjust your ${joint.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      }
    });

    if (suggestions.length === 0) {
      return 'Great! Hold this position.';
    }

    return suggestions.slice(0, 2).join(' and ');
  };

  const startCountdown = () => {
    // Prevent multiple intervals from being created
    if (countdownIntervalRef.current) {
      return;
    }

    setCountdownState({
      value: COUNTDOWN_START,
      isActive: true,
    });

    countdownIntervalRef.current = setInterval(() => {
      setCountdownState((prev) => {
        const nextValue = prev.value !== null ? prev.value - 1 : null;

        if (nextValue !== null && nextValue <= 0) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }

          // Stop the exercise and pose comparison
          isExerciseCompletedRef.current = true;
          setIsExerciseCompleted(true);
          setFeedback('Exercise completed! Great job!');
          
          // Stop the camera
          if (cameraRef.current) {
            cameraRef.current.stop();
            cameraRef.current = null;
          }

          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);

          return {
            value: 0,
            isActive: false,
          };
        }

        return {
          value: nextValue,
          isActive: true,
        };
      });
    }, 1000);
  };

  const resetCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    setCountdownState({
      value: null,
      isActive: false,
    });
  };

  const onResults = (results: Results) => {
    // Stop processing if exercise is completed
    if (isExerciseCompletedRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const canvasCtx = canvas.getContext('2d');

    if (!canvasCtx) {
      return;
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.image) {
      canvasCtx.drawImage(
        results.image as CanvasImageSource,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    }

    if (results.poseLandmarks) {
      drawConnectors(
        canvasCtx,
        results.poseLandmarks,
        POSE_CONNECTIONS,
        { color: '#00FF00', lineWidth: 4 },
      );



      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 2,
      });

      const extractedData = extractPoseData(results.poseLandmarks as PoseLandmark[]);
      setCurrentPose(extractedData);

      const comparison = comparePoses(referencePose, extractedData);
      setComparisonResult(comparison);

      if (comparison.similarityScore >= TARGET_ACCURACY) {
        if (!countdownIntervalRef.current) {
          startCountdown();
        }

        setFeedback('Perfect! Hold the pose...');
      } else {
        if (countdownIntervalRef.current) {
          resetCountdown();
        }

        const improvementTips = generateFeedback(comparison.individualDifferences);
        setFeedback(improvementTips);
      }
    }

    canvasCtx.restore();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <h1>Real-Time Pose Comparison</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Match the reference pose and hold for 10 seconds
      </p>

      {showSuccessMessage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '40px 60px',
            borderRadius: '15px',
            fontSize: '36px',
            fontWeight: 'bold',
            zIndex: 1000,
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          }}
        >
          ✓ DONE!
        </div>
      )}

      {countdownState.value !== null && (
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: countdownState.value > 5 ? '#4CAF50' : '#FF5722',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {countdownState.value}
        </div>
      )}

      <div style={{ position: 'relative' }}>
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
            width: 640,
            height: 480,
            display: 'none',
          }}
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: 'user',
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'relative',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480,
            border: '3px solid #333',
            borderRadius: '8px',
          }}
        />
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px 30px',
          backgroundColor:
            comparisonResult && comparisonResult.similarityScore >= TARGET_ACCURACY
              ? '#4CAF50'
              : '#FF9800',
          color: 'white',
          borderRadius: '8px',
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          minWidth: '400px',
        }}
      >
        {feedback}
      </div>

      {comparisonResult && (
        <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          Accuracy: {comparisonResult.similarityScore.toFixed(1)}%
        </div>
      )}

      {comparisonResult && currentPose && (
        <details
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            maxWidth: '640px',
            width: '100%',
          }}
        >
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            View Detailed Comparison
          </summary>
          <div style={{ marginTop: '15px', fontSize: '14px', fontFamily: 'monospace' }}>
            {Object.entries(comparisonResult.individualDifferences).map(([key, diff]) => {
              const joint = key as PoseAngleKey;
              const currentAngle = currentPose.angles[joint];
              const referenceAngle = referencePose.angles[joint];
              const isGood = diff < 10;
              const isOk = diff < 20;

              return (
                <div
                  key={key}
                  style={{
                    padding: '6px',
                    marginBottom: '6px',
                    backgroundColor: isGood ? '#e8f5e9' : isOk ? '#fff9c4' : '#ffebee',
                    borderRadius: '4px',
                    borderLeft: `3px solid ${isGood ? '#4CAF50' : isOk ? '#FFC107' : '#F44336'}`,
                  }}
                >
                  <strong>{joint}:</strong> Ref: {referenceAngle.toFixed(1)}° | Current:{' '}
                  {currentAngle.toFixed(1)}°
                  <span
                    style={{
                      color: isGood ? '#4CAF50' : isOk ? '#F57C00' : '#D32F2F',
                      marginLeft: '10px',
                    }}
                  >
                    (±{diff.toFixed(1)}°)
                  </span>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
};

export default CompareItLive;

