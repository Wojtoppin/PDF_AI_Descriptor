import ColumnRow from "./ColumnRow";

export default function PDFTable({ files, children, updateDescription }) {
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
          <th className="border border-gray-300 px-5 py-3 w-[8%]">Action</th>
          <th className="border border-gray-300 px-5 py-3 w-[8%]">AI</th>
        </tr>
      </thead>
      <tbody className="text-sm text-gray-800">
        {Object.values(files).map(({ name, description, fileValue }, index) => (
          <ColumnRow
            updateDescription={updateDescription}
            name={name}
            description={description}
            fileValue={fileValue}
            index={index}
          />
        ))}
        {children}
      </tbody>
      <tfoot className="bg-gray-50 text-sm font-medium text-gray-700">
        <tr>
          <td className="border border-gray-300 px-5 py-3">
            Total Files: {files.length}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
