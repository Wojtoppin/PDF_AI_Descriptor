import ColumnRow from "./ColumnRow";

export default function PDFTable({
  files,
  language,
  children,
  updateMessages,
  updateDescription,
  handleDelete,
}) {
  return (
    <table className="mt-6 w-full border border-gray-300 rounded-lg shadow-sm overflow-hidden">
      <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
        <tr>
          <th className="border border-gray-300 px-5 py-3 w-[15%]">
            {language === "en" ? "File Name" : "Nazwa Pliku"}
            
          </th>
          <th className="border border-gray-300 px-5 py-3 w-[69%]">
            {language === "en" ? "Description" : "Opis"}
          </th>
          <th className="border border-gray-300 px-5 py-3 w-[8%]">AI</th>
          <th className="border border-gray-300 px-5 py-3 w-[8%]">{language === "en" ? "Action" : "Działania"}</th>
        </tr>
      </thead>
      <tbody className="text-sm text-gray-800">
        {Object.values(files).map(({ name, description, fileValue, messages }, index) => (
          <ColumnRow
            messages={messages}
            updateMessages={updateMessages}
            handleDelete={handleDelete}
            updateDescription={updateDescription}
            name={name}
            description={description}
            fileValue={fileValue}
          />
        ))}
      </tbody>
      <tfoot className="bg-gray-50 text-sm font-medium text-gray-700">
        <tr>
          <td className="border border-gray-300 bg-gray-100  px-5 py-3">
            {language === "en" ? "Statistics" : "Statystyki"}
          </td>
          <td className="border text-center space-x-5 border-gray-300 px-5 py-3">
            <span>{language === "en" ? "Total files count: " : "Łączna ilość plików: "} {Object.keys(files).length}</span>
            <span>
              {language === "en" ? "Total size: " : "Łączny rozmiar: "}
              {(
                Object.values(files).reduce((acc, fileObj) => {
                  return acc + (fileObj.fileValue?.size || 0);
                }, 0) /
                (1024 * 1024)
              ).toFixed(2)}{" "}
              MB
            </span>
            <span></span>
          </td>
          <td colSpan={2}>{children}</td>
        </tr>
      </tfoot>
    </table>
  );
}
