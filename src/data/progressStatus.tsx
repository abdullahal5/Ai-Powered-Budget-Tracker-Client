import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import type { TBudget } from "../types";

export const getBudgetStatus = (percentUsed: number, initialBudget: TBudget) => {
  if (!initialBudget)
    return {
      status: "none",
      color: "slate",
      icon: DollarSign,
      cardBg:
        "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",
      progressColor: "bg-slate-400",
    };

  if (percentUsed >= 100)
    return {
      status: "exceeded",
      color: "red",
      icon: AlertTriangle,
      message: "Budget Exceeded!",
      cardBg:
        "bg-gradient-to-br from-red-50 via-red-25 to-red-100 dark:from-red-950/40 dark:via-red-950/20 dark:to-red-900/40",
      progressColor: "bg-gradient-to-r from-red-500 to-red-600",
    };
  if (percentUsed >= 90)
    return {
      status: "critical",
      color: "orange",
      icon: AlertTriangle,
      message: "Critical Level",
      cardBg:
        "bg-gradient-to-br from-orange-50 via-orange-25 to-orange-100 dark:from-orange-950/40 dark:via-orange-950/20 dark:to-orange-900/40",
      progressColor: "bg-gradient-to-r from-orange-500 to-red-500",
    };
  if (percentUsed >= 75)
    return {
      status: "warning",
      color: "amber",
      icon: TrendingUp,
      message: "Approaching Limit",
      cardBg:
        "bg-gradient-to-br from-amber-50 via-yellow-25 to-amber-100 dark:from-amber-950/40 dark:via-amber-950/20 dark:to-amber-900/40",
      progressColor: "bg-gradient-to-r from-amber-500 to-orange-500",
    };
  if (percentUsed >= 50)
    return {
      status: "moderate",
      color: "blue",
      icon: TrendingUp,
      message: "On Track",
      cardBg:
        "bg-gradient-to-br from-blue-50 via-blue-25 to-blue-100 dark:from-blue-950/40 dark:via-blue-950/20 dark:to-blue-900/40",
      progressColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
    };
  return {
    status: "good",
    color: "emerald",
    icon: CheckCircle,
    message: "Excellent Progress",
    cardBg:
      "bg-gradient-to-br from-emerald-50 via-green-25 to-emerald-100 dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-emerald-900/40",
    progressColor: "bg-gradient-to-r from-emerald-500 to-green-500",
  };
};
