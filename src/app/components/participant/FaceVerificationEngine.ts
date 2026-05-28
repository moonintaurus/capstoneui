import * as faceapi from 'face-api.js';
import type { BiometricVerificationState } from './CheckInTypes';

const MODEL_URLS = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/';

export class FaceVerificationEngine {
  private static modelsLoaded = false;
  private static loadingPromise: Promise<void> | null = null;

  /**
   * Load face-api.js models from CDN
   */
  static async loadModels(): Promise<void> {
    if (this.modelsLoaded) {
      return;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URLS),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URLS),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URLS),
        ]);
        this.modelsLoaded = true;
      } catch (error) {
        this.loadingPromise = null;
        throw new Error(`Failed to load face detection models: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    })();

    await this.loadingPromise;
  }

  /**
   * Detect and get face descriptor from video element
   */
  static async detectFace(videoElement: HTMLVideoElement): Promise<Float32Array> {
    if (!this.modelsLoaded) {
      throw new Error('Models not loaded. Call loadModels() first.');
    }

    const detection = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw new Error('No face detected. Please ensure your face is clearly visible in the camera.');
    }

    return detection.descriptor;
  }

  /**
   * Compare two face descriptors for similarity
   * Returns similarity score between 0 and 1 (1 = identical)
   */
  static compareFaceDescriptors(descriptor1: Float32Array, descriptor2: Float32Array): number {
    if (descriptor1.length !== descriptor2.length) {
      throw new Error('Face descriptors have different lengths');
    }

    let sumSquareDifferences = 0;
    for (let i = 0; i < descriptor1.length; i++) {
      const diff = descriptor1[i] - descriptor2[i];
      sumSquareDifferences += diff * diff;
    }

    const euclideanDistance = Math.sqrt(sumSquareDifferences);
    // Convert to similarity score (max distance is around 0.6)
    return Math.max(0, 1 - euclideanDistance);
  }

  /**
   * Check if two face descriptors match (similarity above threshold)
   */
  static areFaceDescriptorsMatching(descriptor1: Float32Array, descriptor2: Float32Array, threshold = 0.6): boolean {
    const similarity = this.compareFaceDescriptors(descriptor1, descriptor2);
    return similarity >= threshold;
  }

  /**
   * Store face descriptor in localStorage (for enrollment/reference)
   */
  static saveFaceDescriptor(key: string, descriptor: Float32Array): void {
    const descriptorArray = Array.from(descriptor);
    localStorage.setItem(key, JSON.stringify(descriptorArray));
  }

  /**
   * Retrieve face descriptor from localStorage
   */
  static loadFaceDescriptor(key: string): Float32Array | null {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    try {
      const array = JSON.parse(stored);
      return new Float32Array(array);
    } catch {
      return null;
    }
  }

  /**
   * Clear face descriptor from localStorage
   */
  static clearFaceDescriptor(key: string): void {
    localStorage.removeItem(key);
  }
}

/**
 * Enum for verification states
 */
export enum VerificationState {
  IDLE = 'idle',
  LOADING = 'loading',
  DETECTING = 'detecting',
  SCANNING = 'scanning',
  VERIFIED = 'verified',
  FAILED = 'failed',
}

/**
 * Result of a face verification attempt
 */
export interface FaceVerificationResult {
  success: boolean;
  descriptor?: Float32Array;
  similarity?: number;
  error?: string;
  message: string;
}
