import { useMemo, useState } from "react";
import type { TTransaction } from "../../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
} as const;

type DateRangeKey = keyof typeof DATE_RANGES;

type Grouped = {
  date: string;
  income: number;
  expense: number;
};

const AccountChart = ({ transactions }: { transactions: TTransaction[] }) => {
  const [dateRange, setDateRange] = useState<DateRangeKey>("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();

    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions?.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered?.reduce<Record<string, Grouped>>(
      (acc, transaction) => {
        const date = format(new Date(transaction.date), "MMM dd");

        if (!acc[date]) {
          acc[date] = { date, income: 0, expense: 0 };
        }

        if (transaction.type === "INCOME") {
          acc[date].income += Number(transaction.amount);
        } else {
          acc[date].expense += Number(transaction.amount);
        }

        return acc;
      },
      {}
    );

    return Object?.values(grouped)?.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [transactions, dateRange]);

  // Calculate totals for the selected period
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + Number(day.income),
        expense: acc.expense + Number(day.expense),
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  const netAmount = totals?.income - totals?.expense;
  const isPositive = netAmount >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-normal">
          Transaction Overview
        </CardTitle>
        <Select
          defaultValue={dateRange}
          onValueChange={(value) => setDateRange(value as DateRangeKey)}
        >
          <SelectTrigger className="w-[140px] border border-neutral-300 cursor-pointer">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem className="cursor-pointer" key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {filteredData && totals && filteredData.length > 0 ? (
          <>
            {/* Totals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 bg-white rounded-lg">
              {/* Income Card */}
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-green-800">
                    Total Income
                  </p>
                  <div className="p-2 bg-green-100 rounded-full">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                  <p className="text-2xl font-bold text-green-700">
                    {totals.income.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Income
                  </span>
                </div>
              </div>

              {/* Expenses Card */}
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-red-800">
                    Total Expenses
                  </p>
                  <div className="p-2 bg-red-100 rounded-full">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <DollarSign className="h-5 w-5 text-red-600 mr-1" />
                  <p className="text-2xl font-bold text-red-700">
                    {totals.expense.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Expenses
                  </span>
                </div>
              </div>

              {/* Net Card */}
              <div
                className={`p-6 rounded-lg border ${
                  isPositive
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <p
                    className={`text-sm font-medium ${
                      isPositive ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    Net Amount
                  </p>
                  <div
                    className={`p-2 rounded-full ${
                      isPositive ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="flex items-baseline">
                  <DollarSign
                    className={`h-5 w-5 mr-1 ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  />
                  <p
                    className={`text-2xl font-bold ${
                      isPositive ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {Math.abs(netAmount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                      isPositive
                        ? "text-green-600 bg-green-100"
                        : "text-red-600 bg-red-100"
                    }`}
                  >
                    {isPositive ? (
                      <>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Profit
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Loss
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value}`, undefined]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-10">
            No transactions available for this period.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountChart;
