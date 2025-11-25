import HeaderPage from "../../components/header";
import HomeLayout from "../../layouts/home";

export default function Home() {
  return (
    <div className={`flex h-screen w-full flex-col items-end justify-center`}>
      <div className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-b from-black/90 to-transparent px-4 pt-4 pb-8 transition-all duration-300">
        <HeaderPage />
      </div>
      <HomeLayout />
    </div>
  );
}
