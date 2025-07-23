export default function Header({language, updateLanguage}) {
  const cssLanguage = "cursor-pointer text-gray-400";
  const cssSelected = "cursor-pointer"
  return (
    <header className="bg-gray-800 text-white p-4 w-full flex justify-between items-center">
      <h1 className="text-2xl font-bold text-center w-fit">Wielik</h1>
      <nav className=" mt-0">
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:underline">{language === "en" ? "Description" : "Streszczenie"}</a></li>
          <li className={language==="pl"?cssSelected:cssLanguage} onClick={()=>updateLanguage("pl")}>Polski</li>
          <li className={language==="en"?cssSelected:cssLanguage} onClick={()=>updateLanguage("en")}>English</li>
        </ul>
      </nav>
    </header>
  );
}