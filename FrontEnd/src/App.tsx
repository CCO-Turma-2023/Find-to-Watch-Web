import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./view/pages/home/page";
import Default from "./view/pages/default";
import AuthGuard from "./view/components/authGuard";
import SeriesPage from "./view/pages/series/page";
import MoviesPage from "./view/pages/movies/page";
import CinemaPage from "./view/pages/cinema/page";
import AuthPage from "./view/pages/authPage/page";
import InfoContent from "./view/pages/infoContent/infoContent";
import SearchPage from "./view/pages/search/page";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Default />} />
        <Route path="/" element={<Home />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/cinema" element={<CinemaPage />} />
        <Route path="/content/:id" element={<InfoContent />} />
        <Route path="/search" element={<SearchPage />} />

        <Route element={<AuthGuard />}></Route>
      </Routes>
    </AnimatePresence>
  );
}
