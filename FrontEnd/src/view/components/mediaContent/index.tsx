import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function MediaContent({
  urlImage,
  id,
}: {
  urlImage?: string;
  id?: number;
}) {
  const navigate = useNavigate();
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="max-h-72 min-h-62 max-w-56 min-w-52"
      onClick={() => {
        navigate(`/content/${id}`);
      }}
    >
      <img className="h-full w-full object-contain" src={urlImage} alt="" />
    </motion.button>
  );
}
