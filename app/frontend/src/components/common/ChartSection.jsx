import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const transformData = coinChartData =>
  coinChartData.prices.map(([time, price]) => ({
    time: new Date(time).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    }),
    price,
  }));

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white p-2 shadow-lg rounded border'>
        <p className='text-sm'>{`Time: ${payload[0].payload.time}`}</p>
        <p className='text-sm font-bold'>{`Price: $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
}

function ChartSection({ coinChartData, timeRange, setTimeRange }) {
  if (!coinChartData || !coinChartData.prices) {
    return (
      <div className='bg-white rounded-lg border border-gray-300 mb-8 p-6'>
        <p className='text-center text-gray-500'>Loading chart data...</p>
      </div>
    );
  }

  const data = transformData(coinChartData);
  const days = ['24h', '7d', '30d', '1y'];

  // console.log(timeRange);

  return (
    <div className='bg-white rounded-lg border border-gray-300 mb-8'>
      <div className='p-4 border-b'>
        <div className='flex space-x-2'>
          {days.map(range => {
            const isActive = timeRange === range;
            const baseClasses = 'px-4 py-2 rounded-md transition-colors';
            const activeClasses = isActive
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200';

            return (
              <button
                key={range}
                type='button'
                onClick={() => setTimeRange(range)}
                className={`${baseClasses} ${activeClasses}`}
              >
                {range.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>
      <div className='p-6'>
        <div className='h-[400px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='time' />
              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={value => `$${value.toLocaleString()}`}
              />
              <Tooltip content={CustomTooltip} allowAsProps />
              <Area
                type='monotone'
                dataKey='price'
                stroke='#2563eb'
                fill='#2563eb'
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ChartSection;
