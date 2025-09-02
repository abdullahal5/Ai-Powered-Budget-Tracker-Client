import type React from "react";

import { useState } from "react";
import type { TBudget } from "../../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Check,
  Pencil,
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Progress } from "../ui/progress";
import { useUpdateBudget } from "../../actions/budget";
import { useToken } from "../../lib/useClerkToken";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

const BudgetProgress = ({
  initialBudget,
  currentExpenses,
}: {
  initialBudget: TBudget | null;
  currentExpenses: number;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const { token } = useToken();
  const createOrUpdateBudget = useUpdateBudget(token as unknown as string);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const getBudgetStatus = () => {
    if (!initialBudget) return { status: "none", color: "slate", icon: null };

    if (percentUsed >= 100)
      return {
        status: "exceeded",
        color: "red",
        icon: AlertTriangle,
        message: "Budget exceeded",
      };
    if (percentUsed >= 90)
      return {
        status: "critical",
        color: "orange",
        icon: AlertTriangle,
        message: "Nearly at limit",
      };
    if (percentUsed >= 75)
      return {
        status: "warning",
        color: "amber",
        icon: TrendingUp,
        message: "On track",
      };
    return {
      status: "good",
      color: "emerald",
      icon: CheckCircle,
      message: "Well within budget",
    };
  };

  const budgetStatus = getBudgetStatus();
  const remaining = initialBudget ? initialBudget.amount - currentExpenses : 0;

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  const handleUpdateBudget = async () => {
    const amount = Number.parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const res = await createOrUpdateBudget.mutateAsync({ amount });

    if (res.success) {
      toast.success(res.message);
      setIsEditing(false);
    } else {
      toast.success("Something went wrong");
      setIsEditing(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold text-foreground">
              Monthly Budget
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Default Account
            </CardDescription>
          </div>

          {budgetStatus.icon && (
            <div
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                budgetStatus.color === "red" &&
                  "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400",
                budgetStatus.color === "orange" &&
                  "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400",
                budgetStatus.color === "amber" &&
                  "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400",
                budgetStatus.color === "emerald" &&
                  "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
              )}
            >
              <budgetStatus.icon className="h-3 w-3" />
              {budgetStatus.message}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {isEditing ? (
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border">
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Budget Amount
                </label>
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="h-9"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={createOrUpdateBudget.isPending}
                />
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUpdateBudget}
                  disabled={createOrUpdateBudget.isPending}
                  className="h-9 w-9 p-0 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-950/20"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={createOrUpdateBudget.isPending}
                  className="h-9 w-9 p-0 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {initialBudget ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        ${initialBudget.amount.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        budget
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Spent:{" "}
                        <span className="font-medium text-foreground">
                          ${currentExpenses.toLocaleString()}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          remaining >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {remaining >= 0 ? "Remaining" : "Over"}: $
                        {Math.abs(remaining).toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm mb-2">
                      No budget set
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click the edit button to set your monthly budget
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        {initialBudget && (
          <div className="space-y-3">
            <div className="relative">
              <Progress
                value={Math.min(percentUsed, 100)}
                className={cn(
                  "h-3 transition-all duration-500",
                  "[&>div]:transition-all [&>div]:duration-500"
                )}
                style={
                  {
                    "--progress-background":
                      budgetStatus.color === "red"
                        ? "rgb(239 68 68)"
                        : budgetStatus.color === "orange"
                        ? "rgb(249 115 22)"
                        : budgetStatus.color === "amber"
                        ? "rgb(245 158 11)"
                        : "rgb(34 197 94)",
                  } as React.CSSProperties
                }
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white mix-blend-difference">
                  {percentUsed.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Progress:{" "}
                  <span className="font-medium">{percentUsed.toFixed(1)}%</span>
                </span>
                {percentUsed > 100 && (
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {(percentUsed - 100).toFixed(1)}% over budget
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-muted-foreground">
                  {Math.round(
                    (new Date().getDate() /
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 1,
                        0
                      ).getDate()) *
                      100
                  )}
                  % through month
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
