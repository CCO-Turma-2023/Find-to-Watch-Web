import loginImage from "../../assets/loginIcon.jpg";
import RegisterLayout from "../../layouts/register";
import { motion } from "framer-motion";

export default function Register() {
  return (
    <motion.div
      className={`flex h-screen w-full justify-start bg-cover bg-center`}
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      <RegisterLayout />
    </motion.div>
  );
}
