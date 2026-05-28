import { useState, useEffect, useRef, useCallback } from 'react';
import { FaceVerificationEngine, VerificationState, type FaceVerificationResult } from './FaceVerificationEngine';
import type { BiometricVerificationState } from './CheckInTypes';

export function useFaceVerification() {
  const [state, setState] = useState<BiometricVerificationState>({ status: 'idle' });
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load face detection models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        setState({ status: 'loading' });
        await FaceVerificationEngine.loadModels();
        setModelsLoaded(true);
        setState({ status: 'idle' });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load models';
        setState({ status: 'failed', error: errorMessage });
      }
    };

    loadModels();
  }, []);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        return; // Already running
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Camera access denied';
      setState({ status: 'failed', error: errorMessage });
      throw error;
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Verify face for check-in (detect and capture descriptor)
  const verifyFaceForCheckIn = useCallback(async (): Promise<FaceVerificationResult> => {
    if (!modelsLoaded) {
      return { success: false, error: 'Models not loaded', message: 'Face detection models not ready' };
    }

    if (!videoRef.current) {
      return { success: false, error: 'Camera not ready', message: 'Camera not initialized' };
    }

    try {
      setState({ status: 'detecting' });

      // Allow video to load
      await new Promise(resolve => {
        if (videoRef.current?.readyState === 4) {
          resolve(null);
        } else {
          videoRef.current?.addEventListener('loadedmetadata', resolve, { once: true });
        }
      });

      setState({ status: 'scanning' });

      // Detect face
      const descriptor = await FaceVerificationEngine.detectFace(videoRef.current);

      setState({
        status: 'verified',
        faceDescriptor: descriptor,
      });

      return {
        success: true,
        descriptor,
        message: 'Face verification successful',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Face verification failed';
      setState({ status: 'failed', error: errorMessage });
      return { success: false, error: errorMessage, message: errorMessage };
    }
  }, [modelsLoaded]);

  // Verify against enrolled descriptor
  const verifyAgainstEnrolled = useCallback(
    async (enrolledDescriptor: Float32Array, threshold = 0.6): Promise<FaceVerificationResult> => {
      if (!modelsLoaded) {
        return { success: false, error: 'Models not loaded', message: 'Face detection models not ready' };
      }

      if (!videoRef.current) {
        return { success: false, error: 'Camera not ready', message: 'Camera not initialized' };
      }

      try {
        setState({ status: 'detecting' });

        // Allow video to load
        await new Promise(resolve => {
          if (videoRef.current?.readyState === 4) {
            resolve(null);
          } else {
            videoRef.current?.addEventListener('loadedmetadata', resolve, { once: true });
          }
        });

        setState({ status: 'scanning' });

        // Detect face
        const currentDescriptor = await FaceVerificationEngine.detectFace(videoRef.current);
        const similarity = FaceVerificationEngine.compareFaceDescriptors(enrolledDescriptor, currentDescriptor);

        if (similarity >= threshold) {
          setState({
            status: 'verified',
            faceDescriptor: currentDescriptor,
          });
          return {
            success: true,
            descriptor: currentDescriptor,
            similarity,
            message: `Face verification successful (${(similarity * 100).toFixed(1)}% match)`,
          };
        } else {
          setState({
            status: 'failed',
            error: 'Face does not match enrolled biometric',
          });
          return {
            success: false,
            error: 'Face does not match',
            similarity,
            message: `Insufficient match (${(similarity * 100).toFixed(1)}% < ${(threshold * 100).toFixed(1)}% required)`,
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Face verification failed';
        setState({ status: 'failed', error: errorMessage });
        return { success: false, error: errorMessage, message: errorMessage };
      }
    },
    [modelsLoaded]
  );

  // Reset state
  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    state,
    videoRef,
    modelsLoaded,
    startCamera,
    stopCamera,
    verifyFaceForCheckIn,
    verifyAgainstEnrolled,
    reset,
  };
}
