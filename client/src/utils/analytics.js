export function getCategoryInsights(expenses, budget, income) {
  if (!expenses || expenses.length === 0) return [];

  const categories = ["Food", "Travel", "Bills", "Other"];
  const data = categories.map((cat) => ({
    category: cat,
    total: expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0),
  }));

  const insights = [];

  // Highest spending category
  const maxCategory = data.reduce((prev, curr) =>
    curr.total > prev.total ? curr : prev
  );
  if (maxCategory.total > 0) {
    insights.push(
      `You spent the most on ${maxCategory.category} ($${maxCategory.total})`
    );
  }

  // Budget alerts
  categories.forEach((cat) => {
    if (budget?.[cat] && data.find((d) => d.category === cat).total > budget[cat]) {
      insights.push(`⚠️ ${cat} exceeded budget ($${budget[cat]})`);
    }
  });

  // Income comparison
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  if (income && totalExpenses > income) {
    insights.push(`⚠️ Total expenses ($${totalExpenses}) exceed your income ($${income})`);
  }

  // Monthly trend example (current vs previous month)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const prevMonthExpenses = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth - 1 && d.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const currentMonthExpenses = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  if (currentMonthExpenses > prevMonthExpenses) {
    insights.push(
      `Your spending increased by $${currentMonthExpenses - prevMonthExpenses} compared to last month`
    );
  } else if (currentMonthExpenses < prevMonthExpenses) {
    insights.push(
      `Good job! Spending decreased by $${prevMonthExpenses - currentMonthExpenses} compared to last month`
    );
  }

  return insights;
}