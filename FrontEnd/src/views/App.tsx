import { Link, Route, Routes } from "react-router-dom";
import Login from "./page/login/page";
import Home from "./page/home/page";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
