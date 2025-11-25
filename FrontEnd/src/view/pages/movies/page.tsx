import ContentCarousel from "../../components/contentCarousel";
import HeaderPage from "../../components/header";

export default function MoviesPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      <div className="bg-gradient-to-b from-black/90 to-transparent px-4 pt-4 pb-8 transition-all duration-300">
        <HeaderPage />
      </div>
      <ContentCarousel type={1} />
    </div>
  );
}
