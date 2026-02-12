interface Column<T> {
  header: string;
  accessor: (row: T) => string | number;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
}

const DataTable = <T,>({ columns, rows }: Props<T>) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-left text-sm">
      <thead>
        <tr className="text-slate-600">
          {columns.map((col) => (
            <th key={col.header} className="px-3 py-2 border-b border-slate-200 font-medium">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} className="border-b border-slate-100">
            {columns.map((col) => (
              <td key={col.header} className="px-3 py-2 text-slate-800">
                {col.accessor(row)}
              </td>
            ))}
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="px-3 py-4 text-center text-slate-500">
              No data
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default DataTable;
