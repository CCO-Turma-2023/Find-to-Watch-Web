import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./view/pages/home/page";
import Default from "./view/pages/default/page";
import AuthGuard from "./view/components/authGuard";
import SeriesPage from "./view/pages/series/page";
import MoviesPage from "./view/pages/movies/page";
import CinemaPage from "./view/pages/cinema/page";
import AuthPage from "./view/pages/authPage/page";
import InfoContent from "./view/pages/infoContent/page";
import SearchPage from "./view/pages/search/page";
import UserLists from "./view/pages/UserLists/page";
import ListDetails from "./view/pages/ListDetails/page";

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
        <Route path="/lists" element={<UserLists />} />
        <Route path="/lists/:id" element={<ListDetails />} />
        <Route element={<AuthGuard />}></Route>
      </Routes>
    </AnimatePresence>
  );
}
