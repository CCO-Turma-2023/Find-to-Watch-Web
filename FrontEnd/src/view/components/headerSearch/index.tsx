import SearchIcon from "../../assets/icons/searcIcon";
import logo from "../../assets/logo.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../assets/icons/leftArrow";
import MicrophoneIcon from "../../assets/icons/microphoneIcon";

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition {
  lang: string;
  start(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export default function HeaderSearch({
  onSearch,
  value,
  onFilterType,
  onFilterGenre,
}: {
  onSearch: (query: string) => void;
  value: string;
  onFilterType: (type: string) => void;
  onFilterGenre: (genre: string) => void;
}) {
  const navigate = useNavigate();

  const voiceSearch = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.start();
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onSearch(transcript);
    };
  };

  return (
    <header className="absolute top-0 flex w-full items-center justify-center gap-6 border-b-2 border-[#3c4043] bg-[#1f1f1f] p-4">
      <motion.button
        className="absolute top-4 left-4 z-30 flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1B1B1BE5] md:h-12 md:w-12"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
      >
        <LeftArrow />
      </motion.button>
      <div className="flex items-center justify-start gap-15">
        <button
          className="flex flex-1 justify-start"
          onClick={() => navigate("/")}
        >
          <img className="h-14 w-auto flex-shrink-0" src={logo} alt="Logo" />
        </button>
        <div className="relative">
          <input
            className="h-12 w-96 appearance-none rounded-full border-none bg-[#4d5156] p-2 text-white outline-none focus:ring-0 focus:outline-none"
            type="text"
            onChange={(e) => onSearch(e.target.value)}
            value={value}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
            onClick={() => onSearch(value)}
          >
            <SearchIcon />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="absolute top-1/2 right-10 -translate-y-1/2 cursor-pointer"
            onClick={() => {
              voiceSearch();
            }}
          >
            <MicrophoneIcon />
          </motion.button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <select
          className="h-12 rounded-full bg-[#4d5156] p-2 text-white outline-none focus:ring-0"
          onChange={(e) => onFilterType(e.target.value)}
        >
          <option value="all">Tudo</option>
          <option value="movie">Filmes</option>
          <option value="tv">Séries</option>
        </select>
        <select
          className="h-12 rounded-full bg-[#4d5156] p-2 text-white outline-none focus:ring-0 [&_option:checked]:bg-[#4d5156] [&_option:checked]:text-white"
          onChange={(e) => onFilterGenre(e.target.value)}
        >
          <option value="all">Todos Gêneros</option>
          <option value="Ação">Ação</option>
          <option value="Aventura">Aventura</option>
          <option value="Comédia">Comédia</option>
          <option value="Drama">Drama</option>
          <option value="Fantasia">Fantasia</option>
          <option value="Terror">Terror</option>
          <option value="Romance">Romance</option>
          <option value="Ficção científica">Ficção Científica</option>
        </select>
      </div>
    </header>
  );
}
