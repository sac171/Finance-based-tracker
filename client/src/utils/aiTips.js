export function generateSmartTips(expenses, budget, income) {
  if (!expenses || expenses.length === 0) return [];

  const tips = [];
  const categories = ["Food", "Travel", "Bills", "Other"];

  // Total expenses
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Category totals
  const categoryTotals = {};
  categories.forEach((cat) => {
    categoryTotals[cat] = expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
  });

  // 🔴 1. Budget-based suggestions
  categories.forEach((cat) => {
    if (budget?.[cat] && categoryTotals[cat] > budget[cat]) {
      const excess = categoryTotals[cat] - budget[cat];
      const percent = Math.round((excess / categoryTotals[cat]) * 100);

      tips.push(
        `Reduce ${cat} spending by ~${percent}% to stay within your budget`
      );
    }
  });

  // 🔴 2. Income vs Expense suggestion
  if (income && totalExpenses > income) {
    const diff = totalExpenses - income;
    tips.push(
      `You're overspending by $${diff}. Try reducing non-essential expenses`
    );
  }

  // 🔴 3. Savings suggestion
  if (income && totalExpenses < income) {
    const savings = income - totalExpenses;
    tips.push(`Great! You saved $${savings} this month. Consider investing it.`);
  }

  // 🔴 4. High category warning
  const maxCategory = Object.keys(categoryTotals).reduce((a, b) =>
    categoryTotals[a] > categoryTotals[b] ? a : b
  );

  if (categoryTotals[maxCategory] > 0) {
    tips.push(
      `${maxCategory} takes up a large portion of your spending. Try optimizing it.`
    );
  }

  // 🔴 5. Monthly comparison
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const current = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const previous = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth - 1 && d.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  if (current > previous && previous > 0) {
    const increase = current - previous;
    tips.push(
      `Your spending increased by $${increase} from last month. Try controlling expenses.`
    );
  }

  return tips;
}