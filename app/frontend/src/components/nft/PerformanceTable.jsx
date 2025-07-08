function PerformanceTable({ chartData }) {
  return (
    <div className='overflow-x-auto shadow-md rounded-xl border-gray-200'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            {chartData.map((item, index) => (
              <th
                key={index}
                className='px-2 py-2 whitespace-nowrap text-center text-sm font-medium text-gray-900'
              >
                {item.timePeriod}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          <tr>
            {chartData.map((item, index) => (
              <td
                key={index}
                className={`px-2 py-2 whitespace-nowrap text-center text-sm ${item.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {item.percentage.toFixed(2)}%
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PerformanceTable;
