export default function SmartTips({ tips }) {
  if (!tips || tips.length === 0) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">💡 Smart Tips</h3>
      <ul className="list-disc list-inside">
        {tips.map((tip, index) => (
          <li key={index} className="text-gray-700">
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}