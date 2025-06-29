import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon } from './icons/CameraIcon.tsx';
import { BackIcon } from './icons/BackIcon.tsx';
import { motion } from 'framer-motion';

interface ScannerProps {
  onScanComplete: (imageDataUrl: string) => void;
  onCancel: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanComplete, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("無法存取相機。請檢查權限設定，並確認沒有其他應用程式正在使用相機。");
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, videoWidth, videoHeight);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        onScanComplete(imageDataUrl);
      }
    }
  }, [onScanComplete]);

  return (
    <div className="w-full h-[75vh] flex flex-col items-center justify-center bg-black rounded-2xl relative overflow-hidden">
      <canvas ref={canvasRef} className="hidden"></canvas>
      {error ? (
        <div className="text-center p-8 text-white">
            <p className="text-red-400">{error}</p>
            <button onClick={onCancel} className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg">
                返回列表
            </button>
        </div>
      ) : (
        <>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="w-full flex justify-start">
                    <motion.button 
                      onClick={onCancel}
                      className="bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                        <BackIcon className="w-6 h-6" />
                    </motion.button>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[90%] h-[50%] border-4 border-dashed border-white/40 rounded-2xl"></div>
                </div>

                <div className="w-full flex justify-center">
                    <motion.button
                        onClick={handleCapture}
                        disabled={!stream}
                        className="w-20 h-20 bg-white/20 rounded-full border-4 border-white flex items-center justify-center backdrop-blur-sm disabled:opacity-50"
                        aria-label="Capture photo"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                    >
                        <CameraIcon className="w-10 h-10 text-white" />
                    </motion.button>
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default Scanner;