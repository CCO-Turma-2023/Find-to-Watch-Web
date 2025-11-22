import { motion } from "framer-motion";
import YouTube from "react-youtube";

interface TrailerModalProps {
  videoId: string;
  onClose: () => void;
}

export default function TrailerModal({ videoId, onClose }: TrailerModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div
        className="relative aspect-video w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 z-10 text-3xl text-white"
          aria-label="Fechar player"
        >
          &times;
        </button>
        <YouTube
          videoId={videoId}
          opts={{
            height: "100%",
            width: "100%",
            playerVars: {
              autoplay: 1,
              controls: 1,
            },
          }}
          className="h-full w-full"
        />
      </div>
    </motion.div>
  );
}
