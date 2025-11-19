import { useEffect, useState } from "react";
import HeaderSearch from "../../components/headerSearch";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log("aq: ", searchQuery);
  }, [searchQuery]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#1f1f1f] p-12">
      <HeaderSearch onSearch={setSearchQuery} value={searchQuery} />
      <div className="mt-8 w-full max-w-4xl text-white"></div>
    </div>
  );
}

// 1f1f1f
