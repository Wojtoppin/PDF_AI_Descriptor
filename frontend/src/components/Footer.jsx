export default function Footer({language}) {
  return (
    <footer className="w-full bg-gray-100 mt-auto border-t border-gray-300 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        
        <div className="mb-2 sm:mb-0 italic font-medium tracking-wide">
          Polska Grupa Biogazowa
        </div>

        <div className="text-center sm:text-right">
          © {new Date().getFullYear()}{language === "en" ? " Made by: " : " Stronę napisał: "}
          <a
            href="https://github.com/Wojtoppin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold hover:underline"
          >
            Wojciech Polit
          </a>
        </div>

      </div>
    </footer>
  );
}
