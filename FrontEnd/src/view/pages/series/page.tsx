import ContentCarousel from "../../components/contentCarousel";
import HeaderPage from "../../components/header";

export default function SeriesPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      <HeaderPage />
      <ContentCarousel type={2} />
    </div>
  );
}
