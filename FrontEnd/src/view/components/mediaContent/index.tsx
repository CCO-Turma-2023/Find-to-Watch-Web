import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import defaultContent from "../../assets/defaultContent.png";

export default function MediaContent({
  urlImage,
  id,
  type,
}: {
  urlImage?: string;
  id?: number;
  type?: string;
}) {
  const navigate = useNavigate();
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="max-h-72 min-h-62 max-w-56 min-w-52"
      onClick={() => {
        navigate(`/content/${id}`, { state: { type } });
      }}
    >
      <img
        className="h-full w-full object-cover"
        src={urlImage || defaultContent}
        alt=""
      />
    </motion.button>
  );
}
