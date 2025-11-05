import ContentCarousel from "../../components/contentCarousel";
import HeaderPage from "../../components/header";

export default function SeriesPage() {
  return (
    <div className="min-h-screen w-full bg-black">
      <HeaderPage />
      <ContentCarousel type={2} />
    </div>
  );
}
