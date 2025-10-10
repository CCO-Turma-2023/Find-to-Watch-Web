// App.js

import { Route, Routes } from "react-router-dom";
import Login from "./view/pages/login/page";
import Home from "./view/pages/home/page";
import Default from "./view/pages/default";
import Register from "./view/pages/register/page";
import AuthGuard from "./view/components/authGuard";
import SeriesPage from "./view/pages/series/page";
import MoviesPage from "./view/pages/movies/page";
import CinemaPage from "./view/pages/cinema/page";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Default />} />

        <Route element={<AuthGuard />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/cinema" element={<CinemaPage />} />
        </Route>
      </Routes>
    </div>
  );
}
