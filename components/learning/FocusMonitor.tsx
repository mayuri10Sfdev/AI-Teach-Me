'use client';

import { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

type MonitorStatus = 'starting' | 'calibrating' | 'in-view' | 'away' | 'missing' | 'error' | 'off';

const statusText: Record<MonitorStatus, string> = {
  starting: 'Starting camera check…',
  calibrating: 'Look toward the screen to calibrate the check.',
  'in-view': 'Face in view',
  away: 'Head turned to the side',
  missing: 'No face detected in the camera view',
  error: 'Camera check could not start',
  off: 'Camera check is off',
};

export function FocusMonitor({
  paused,
  onConcern,
}: {
  paused: boolean;
  onConcern: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedRef = useRef(paused);
  const onConcernRef = useRef(onConcern);
  const concernActiveRef = useRef(false);
  const [enabled, setEnabled] = useState(true);
  const [status, setStatus] = useState<MonitorStatus>('starting');
  const [error, setError] = useState('');

  pausedRef.current = paused;
  onConcernRef.current = onConcern;

  useEffect(() => {
    if (!enabled) return;

    const previewElement = videoRef.current;
    let cancelled = false;
    let animationFrame = 0;
    let stream: MediaStream | undefined;
    let landmarker: FaceLandmarker | undefined;

    async function startMonitor() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('This browser does not support camera access.');
        }

        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const videoElement = previewElement;
        if (!videoElement) throw new Error('The camera preview is unavailable.');
        videoElement.srcObject = stream;
        await videoElement.play();
        setStatus('starting');

        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm',
        );
        landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          minFaceDetectionConfidence: 0.6,
          minFacePresenceConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });
        if (cancelled) {
          landmarker.close();
          return;
        }

        setStatus('calibrating');
        let lastDetection = 0;
        let missingSince = 0;
        let awaySince = 0;
        let calibrationTotal = 0;
        let calibrationCount = 0;
        let neutralNosePosition: number | undefined;

        function detectFrame(timestamp: number) {
          if (cancelled) return;
          const currentVideo = videoRef.current;
          if (!currentVideo || currentVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
            animationFrame = requestAnimationFrame(detectFrame);
            return;
          }
          if (pausedRef.current || timestamp - lastDetection < 700) {
            animationFrame = requestAnimationFrame(detectFrame);
            return;
          }

          lastDetection = timestamp;
          const result = landmarker?.detectForVideo(currentVideo, timestamp);
          const landmarks = result?.faceLandmarks[0];
          if (!landmarks) {
            awaySince = 0;
            if (!missingSince) missingSince = timestamp;
            if (timestamp - missingSince >= 6000) {
              setStatus('missing');
              if (!concernActiveRef.current && timestamp - missingSince >= 8000) {
                concernActiveRef.current = true;
                onConcernRef.current();
              }
            } else {
              setStatus('calibrating');
            }
            animationFrame = requestAnimationFrame(detectFrame);
            return;
          }

          missingSince = 0;
          const leftCheek = landmarks[234];
          const rightCheek = landmarks[454];
          const nose = landmarks[1];
          const faceWidth = rightCheek.x - leftCheek.x;
          if (faceWidth <= 0) {
            setStatus('calibrating');
            animationFrame = requestAnimationFrame(detectFrame);
            return;
          }

          const nosePosition = (nose.x - leftCheek.x) / faceWidth;
          if (calibrationCount < 5) {
            calibrationTotal += nosePosition;
            calibrationCount += 1;
            if (calibrationCount === 5) neutralNosePosition = calibrationTotal / calibrationCount;
            setStatus('calibrating');
            animationFrame = requestAnimationFrame(detectFrame);
            return;
          }

          const turnedAway = neutralNosePosition !== undefined
            && Math.abs(nosePosition - neutralNosePosition) > 0.14;
          if (turnedAway) {
            if (!awaySince) awaySince = timestamp;
            setStatus('away');
            if (!concernActiveRef.current && timestamp - awaySince >= 8000) {
              concernActiveRef.current = true;
              onConcernRef.current();
            }
          } else {
            awaySince = 0;
            concernActiveRef.current = false;
            setStatus('in-view');
          }
          animationFrame = requestAnimationFrame(detectFrame);
        }

        animationFrame = requestAnimationFrame(detectFrame);
      } catch (monitorError) {
        if (cancelled) return;
        landmarker?.close();
        stream?.getTracks().forEach((track) => track.stop());
        if (previewElement) previewElement.srcObject = null;
        setError(monitorError instanceof Error ? monitorError.message : 'Camera check failed to start.');
        setStatus('error');
      }
    }

    void startMonitor();
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      landmarker?.close();
      stream?.getTracks().forEach((track) => track.stop());
      if (previewElement) previewElement.srcObject = null;
    };
  }, [enabled]);

  function stopMonitor() {
    setEnabled(false);
    setStatus('off');
  }

  return (
    <section className="flex items-center gap-3 rounded-xl border border-[#e4eae5] bg-white p-3">
      <video
        ref={videoRef}
        className={`h-14 w-20 rounded-lg bg-[#e8ecea] object-cover${enabled ? ' scale-x-[-1]' : ''}`}
        muted
        playsInline
        aria-label="Local camera preview"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold">Local focus check</p>
        <p role="status" aria-live="polite" className={`mt-1 text-[11px] ${status === 'error' || status === 'away' || status === 'missing' ? 'text-[#9b713f]' : 'text-secondaryText'}`}>
          {paused && enabled && status !== 'error' ? 'Camera check paused with your focus timer' : statusText[status]}
        </p>
        {error && <p role="alert" className="mt-1 text-[10px] text-error">{error}</p>}
        <p className="mt-1 text-[10px] text-secondaryText">This only estimates face visibility and side-to-side head turns; it cannot tell whether you are paying attention. Frames stay in this browser and are not recorded or uploaded.</p>
      </div>
      <button
      type="button"
      onClick={enabled ? stopMonitor : () => { setError(''); setStatus('starting'); setEnabled(true); }}
      className="shrink-0 rounded-lg border border-[#e1e8e2] px-2.5 py-2 text-[11px] font-semibold text-[#536158]"
      >
      {enabled ? 'Turn off' : 'Turn on'}
      </button>
    </section>
  );
}
