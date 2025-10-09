import { Link, Route, Routes } from "react-router-dom";
import Login from "./view/pages/login/page";
import Home from "./view/pages/home/page";
import Default from "./view/pages/default";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Default />} />
      </Routes>
    </div>
  );
}
