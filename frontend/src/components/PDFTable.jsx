import ColumnRow from "./ColumnRow";

export default function PDFTable({
  files,
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
            File Name
          </th>
          <th className="border border-gray-300 px-5 py-3 w-[69%]">
            Description
          </th>
          <th className="border border-gray-300 px-5 py-3 w-[8%]">AI</th>
          <th className="border border-gray-300 px-5 py-3 w-[8%]">Action</th>
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
            Statistics
          </td>
          <td className="border text-center space-x-1.5 border-gray-300 px-5 py-3">
            <span>Total files count: {Object.keys(files).length}</span>
            <span>
              Total size:{" "}
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
