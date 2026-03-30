import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
const CATEGORIES = ["Food", "Travel", "Bills", "Other"];
const ICONS = { Food: "🍔", Travel: "✈️", Bills: "💡", Other: "📦" };

// ✅ Custom label — outside pie, no overlap
const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  if (percent < 0.04) return null; // hide tiny slices
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x} y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ✅ Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-bold text-gray-700">{ICONS[d.name]} {d.name}</p>
        <p className="text-blue-600 font-semibold">${d.value.toFixed(2)}</p>
        {d.budget > 0 && (
          <p className={d.overBudget ? "text-red-500" : "text-green-500"}>
            Budget: ${d.budget} {d.overBudget ? "⚠️ Over!" : "✓ OK"}
          </p>
        )}
      </div>
    );
  }
  return null;
};

// ✅ Animated progress bar component
function ProgressBar({ spent, budget, color, animate }) {
  const [width, setWidth] = useState(0);
  const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isOver = budget > 0 && spent > budget;

  useEffect(() => {
    if (animate) {
      setTimeout(() => setWidth(percent), 100);
    }
  }, [animate, percent]);

  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${width}%`,
          backgroundColor: isOver ? "#ef4444" : color,
        }}
      />
    </div>
  );
}

export default function CategoryChart({ expenses, budgets }) {
  const [activeTab, setActiveTab] = useState("pie");
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const data = CATEGORIES.map((cat, i) => {
    const spent = expenses
      ? expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0)
      : 0;
    const budget = budgets?.[cat] || 0;
    return {
      name: cat,
      value: spent,
      budget,
      overBudget: budget > 0 && spent > budget,
      color: COLORS[i],
      icon: ICONS[cat],
    };
  });

  const totalSpent = data.reduce((s, d) => s + d.value, 0);
  const hasData = totalSpent > 0;

  return (
    <div className="space-y-6">

      {/* Tab Switch */}
      <div className="flex gap-2">
        {["pie", "bar", "progress"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab === "pie" ? "🥧 Pie" : tab === "bar" ? "📊 Bar" : "📈 Progress"}
          </button>
        ))}
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
          <span className="text-4xl">📭</span>
          <p>No expense data yet. Add some expenses!</p>
        </div>
      ) : (
        <>
          {/* PIE CHART */}
          {activeTab === "pie" && (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={3}
                    labelLine={false}
                    label={renderCustomLabel}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.overBudget ? "#ef4444" : entry.color}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value, entry) =>
                      `${entry.payload.icon} ${value}`
                    }
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* BAR CHART */}
          {activeTab === "bar" && (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(v) => `${ICONS[v]} ${v}`}
                />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={800}>
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.overBudget ? "#ef4444" : entry.color}
                    />
                  ))}
                </Bar>
                {/* Budget line bars */}
                <Bar dataKey="budget" radius={[8, 8, 0, 0]} fill="#e5e7eb" opacity={0.5} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* PROGRESS BAR VIEW */}
          {activeTab === "progress" && (
            <div className="space-y-4">
              {data.map((cat) => (
                <div key={cat.name} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                      {cat.icon} {cat.name}
                    </span>
                    <div className="text-right">
                      <span
                        className="font-bold text-sm"
                        style={{ color: cat.overBudget ? "#ef4444" : cat.color }}
                      >
                        ${cat.value.toFixed(2)}
                      </span>
                      {cat.budget > 0 && (
                        <span className="text-gray-400 text-xs ml-1">
                          / ${cat.budget}
                        </span>
                      )}
                    </div>
                  </div>

                  <ProgressBar
                    spent={cat.value}
                    budget={cat.budget}
                    color={cat.color}
                    animate={animated}
                  />

                  <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                    {cat.budget > 0 ? (
                      <>
                        <span>
                          {cat.overBudget
                            ? `⚠️ $${(cat.value - cat.budget).toFixed(0)} over budget`
                            : `✓ $${(cat.budget - cat.value).toFixed(0)} remaining`}
                        </span>
                        <span>
                          {Math.min(Math.round((cat.value / cat.budget) * 100), 100)}%
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-300">No budget set</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Total summary */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">💰 Total Spent</span>
                  <span className="text-xl font-bold">${totalSpent.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}