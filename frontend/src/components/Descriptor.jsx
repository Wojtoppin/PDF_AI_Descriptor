import { useRef, useState, useEffect } from "react";
import PDFTable from "./PDFTable";
import { jsPDF } from "jspdf";
import { handleExport } from "./handleExport.js";
// Import the exported function from your font file
import { registerFonts } from "../fonts/fonts.js";
export default function Descriptor({ language }) {
  const FileInput = useRef();
  const [files, setFiles] = useState({});

  const updateLanguage = () => {
    setFiles((prevFiles) => {
      const updatedFiles = {};
      Object.keys(prevFiles).forEach((key) => {
        const file = { ...prevFiles[key] };
        if (file.messages && file.messages.length > 0) {
          file.messages = [
            {
              ...file.messages[0],
              text:
                lang === "en"
                  ? "Hey! What do you want to know about this file?"
                  : "Cześć! Co byś chciał wiedzieć o tym pliku?",
            },
            ...file.messages.slice(1),
          ];
        }
        updatedFiles[key] = file;
        console.log("Updated file:", updatedFiles[key]);
      });
      return updatedFiles;
    });
  };

  useEffect(() => {
    updateLanguage;
  }, [language]);

  useEffect(() => {
    registerFonts(jsPDF.API);
  }, []);

  const updateDescription = (index, newDescription) => {
    setFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      updatedFiles[index].description = newDescription;
      return updatedFiles;
    });
  };

  const updateMessages = (index, newMessage) => {
    setFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      updatedFiles[index].messages = [
        ...updatedFiles[index].messages,
        newMessage,
      ];
      return updatedFiles;
    });
  };

  const handleFileChange = (action, e = {}, fileName = "") => {
    if (action !== "delete") {
      const selectedFiles = Array.from(e.target.files);
      const filesObject = selectedFiles.reduce((acc, file) => {
        const id = `${file.lastModified}-${file.name}`;
        acc[id] = {
          name: file.name,
          fileValue: file,
          description: "",
          messages: [
            {
              sender: "ai",
              text:
                language === "en"
                  ? "Hey! What do you want to know about this file?"
                  : "Cześć! Co byś chciał wiedzieć o tym pliku?",
            },
          ],
        };
        return acc;
      }, {});

      if (action === "add") {
        setFiles((prevFiles) => ({
          ...prevFiles,
          ...filesObject,
        }));
      }
    } else {
      setFiles((prevFiles) => {
        const updatedFiles = { ...prevFiles };
        delete updatedFiles[fileName];
        return updatedFiles;
      });
    }
  };

  const handleAddFilesButtonClicked = (e) => {
    e.preventDefault();
    FileInput.current.click();
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        {language === "en" ? "PDF AI Descriptor" : "Streszczacz plików PDF"}
      </h1>
      <p className="mb-4">
        {language === "en"
          ? "This application provides a description of PDF files using AI."
          : "Ta aplikacja dostarcza opis plików PDF przy użyciu AI."}
      </p>
      <p className="mb-4">
        {language === "en"
          ? "Upload a PDF file to get started."
          : "Prześlij plik PDF aby rozpocząć."}
      </p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleAddFilesButtonClicked}
      >
        {language === "en" ? "Select Files" : "Wybierz pliki"}
      </button>
      <input
        type="file"
        ref={FileInput}
        multiple
        onChange={(e) => handleFileChange("add", e)}
        className="hidden"
      />
      {Object.values(files).length > 0 && (
        <PDFTable
          files={files}
          language={language}
          updateMessages={updateMessages}
          handleDelete={handleFileChange}
          updateDescription={updateDescription}
        >
          <button
            className=" w-[calc(100%-16px)] h-full bg-blue-600 text-white mx-2 my-2 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleAddFilesButtonClicked}
          >
            {language === "en" ? "+ Add More Files" : "+ Dodaj Więcej Plików"}
          </button>
        </PDFTable>
      )}
      {Object.keys(files).length > 0 && (
        <button
          onClick={() => handleExport(files, jsPDF)}
          className="bg-green-700 float-right text-white text-l px-4 py-2 my-4 mr-2 rounded hover:bg-green-800"
        >
          {language === "en" ? "Export to PDF" : "Eksportuj do PDF"}
        </button>
      )}
    </div>
  );
}
