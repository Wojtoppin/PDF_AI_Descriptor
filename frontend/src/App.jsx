import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Descriptor from "./components/Descriptor.jsx";
import { useState } from "react";
function App() {
  const [language, setLanguage] = useState("pl");

  

  return (
    <div className="flex flex-col min-h-screen">
      <Header language={language} updateLanguage={setLanguage} />
      <main className="flex-grow">
        <Descriptor language={language} setLanguage={setLanguage}/>
      </main>
      <Footer language={language}/>
    </div>
  );
}

export default App;
