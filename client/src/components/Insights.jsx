export default function Insights({ insights }) {
  if (!insights || insights.length === 0)
    return (
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Insights</h3>
        <p>No insights available yet. Add some expenses!</p>
      </div>
    );

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Insights</h3>
      <ul className="list-disc list-inside">
        {insights.map((insight, idx) => (
          <li key={idx} className="text-gray-700">
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}