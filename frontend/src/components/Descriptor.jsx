import { useRef, useState } from "react";
import PDFTable from "./PDFTable";
export default function Descriptor() {
  const FileInput = useRef();
  const [files, setFiles] = useState([]);

  const updateDescription = (index, newDescription) => {
    setFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      updatedFiles[index].description = newDescription;
      return updatedFiles;
    });
  }

  const handleFileChange = (action, e={},fileName="") => {
    if (action !=="delete"){
    const selectedFiles = Array.from(e.target.files);
    const filesObject = selectedFiles.reduce((acc, file) => {
      const id = `${file.lastModified}-${file.name}`;
      acc[id] = {
        name: file.name,
        fileValue: file,
        description: "Generating...",
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
    }} else {
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
        <PDFTable files={files} handleDelete={handleFileChange} updateDescription={updateDescription}>
          
              <button
                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleAddFilesButtonClicked}
              >
                + Add More Files
              </button>
              <input
                type="file"
                ref={FileInput}
                multiple
                onChange={(e) => handleFileChange("add",e)}
                className="hidden"
              />
        </PDFTable>
      )}
    </div>
  );
}
