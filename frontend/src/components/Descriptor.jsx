import { useRef, useState, useEffect } from "react"; // Import useEffect
import PDFTable from "./PDFTable";
import { jsPDF } from "jspdf";

// Import the exported function from your font file
import { registerLiberationSansBaDnNormal } from "../fonts/LiberationSans-BaDn-normal.js";

export default function Descriptor() {
  const FileInput = useRef();
  const [files, setFiles] = useState({});

  useEffect(() => {
    registerLiberationSansBaDnNormal(jsPDF.API);
  }, []);

  const handleExport = () => {
    const normalizeText = (str) =>
      str.replace(/\u00A0/g, " ").normalize("NFKC");

    const doc = new jsPDF();
    doc.setFont("LiberationSans-BaDn", "normal");
    doc.setFontSize(10); // Base font size
    const x = 15; 
    let y = 20; // Starting Y position for the first item
    const lineSpacing = 5; // Approximate height of a single line of text (adjust as needed for your font size and aesthetic)
    const paragraphSpacing = 3; // Extra space between different elements (like name and description)

    Object.values(files).map((file) => {
      const fileNameText = `${normalizeText(file.name)}:`;
      const splitFileName = doc.splitTextToSize(fileNameText, 180);

      doc.text(splitFileName, x-5, y);
      y += splitFileName.length * lineSpacing;
      y += paragraphSpacing;

      doc.text("Streszczenie: ", x, y);
      y += paragraphSpacing * 2;
      const fileDescriptionText = normalizeText(file.description);
      const maxWidthDescription = 160;
      const splitFileDescription = doc.splitTextToSize(
        fileDescriptionText,
        maxWidthDescription
      );

      doc.text(splitFileDescription, x+5, y);
      y += splitFileDescription.length * lineSpacing;

      if (file.messages && file.messages.length > 1) {
        doc.text("Historia czatu:", x, y); 
        y += paragraphSpacing * 2;

        file.messages.slice(1).forEach((message) => {
          const new_x = message.sender === "ai" ? x+20 : x+5;
          const messageContent = normalizeText(message.text);

          const splitMessage = doc.splitTextToSize(messageContent, 160); 

          doc.setFont("LiberationSans-BaDn", "normal"); 
          doc.text(splitMessage, new_x, y); 
          y += splitMessage.length * lineSpacing;
          y += paragraphSpacing; 
        });
        y += paragraphSpacing * 2; 
      }

      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("data_export.pdf");
  };

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
          description: "Generating...",
          messages: [
            {
              sender: "ai",
              text: "Cześć! Co byś chciał wiedzieć o tym pliku?",
            },
          ],
        };
        return acc;
      }, {});

      if (action === "select") {
        setFiles(filesObject);
      } else if (action === "add") {
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
      <h1 className="text-3xl font-bold mb-4">PDF AI Descriptor</h1>
      <p className="mb-4">
        This application provides a description of PDF files using AI.
      </p>
      <p className="mb-4">You can upload a PDF file to get started.</p>
      <input
        type="file"
        multiple
        onChange={(e) => handleFileChange("select", e)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      ></input>
      {Object.values(files).length > 0 && (
        <PDFTable
          files={files}
          updateMessages={updateMessages}
          handleDelete={handleFileChange}
          updateDescription={updateDescription}
        >
          <button
            className=" w-[calc(100%-16px)] h-full bg-blue-600 text-white mx-2 my-2 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleAddFilesButtonClicked}
          >
            + Add More Files
          </button>
          <input
            type="file"
            ref={FileInput}
            multiple
            onChange={(e) => handleFileChange("add", e)}
            className="hidden"
          />
        </PDFTable>
      )}
      {Object.keys(files).length > 0 && (
        <button
          onClick={handleExport}
          className="bg-green-700 text-white px-4 py-2 my-2 rounded hover:bg-green-800"
        >
          Exportuj do pliku pdf
        </button>
      )}
    </div>
  );
}
