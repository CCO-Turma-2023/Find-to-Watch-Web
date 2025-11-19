import ContentCarousel from "../../components/contentCarousel";
import HeaderPage from "../../components/header";

export default function MoviesPage() {
  return (
    <div className="min-h-screen w-full bg-[#1f1f1f]">
      <HeaderPage />
      <ContentCarousel type={1} />
    </div>
  );
}
