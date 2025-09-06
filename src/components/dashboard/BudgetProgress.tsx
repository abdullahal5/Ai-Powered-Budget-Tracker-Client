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
  DollarSign,
} from "lucide-react";
import { Progress } from "../ui/progress";
import { useUpdateBudget } from "../../actions/budget";
import { useToken } from "../../lib/useClerkToken";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { getBudgetStatus } from "../../data/progressStatus";

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

  const budgetStatus = getBudgetStatus(percentUsed, initialBudget as TBudget);
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
      toast.error("Something went wrong");
      setIsEditing(false);
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden border border-neutral-300 transition-all duration-500 hover:shadow-md",
        budgetStatus.cardBg
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  budgetStatus.color === "red" &&
                    "bg-red-100 dark:bg-red-900/30",
                  budgetStatus.color === "orange" &&
                    "bg-orange-100 dark:bg-orange-900/30",
                  budgetStatus.color === "amber" &&
                    "bg-amber-100 dark:bg-amber-900/30",
                  budgetStatus.color === "blue" &&
                    "bg-blue-100 dark:bg-blue-900/30",
                  budgetStatus.color === "emerald" &&
                    "bg-emerald-100 dark:bg-emerald-900/30",
                  budgetStatus.color === "slate" &&
                    "bg-slate-100 dark:bg-slate-800"
                )}
              >
                <DollarSign
                  className={cn(
                    "h-5 w-5",
                    budgetStatus.color === "red" &&
                      "text-red-600 dark:text-red-400",
                    budgetStatus.color === "orange" &&
                      "text-orange-600 dark:text-orange-400",
                    budgetStatus.color === "amber" &&
                      "text-amber-600 dark:text-amber-400",
                    budgetStatus.color === "blue" &&
                      "text-blue-600 dark:text-blue-400",
                    budgetStatus.color === "emerald" &&
                      "text-emerald-600 dark:text-emerald-400",
                    budgetStatus.color === "slate" &&
                      "text-slate-600 dark:text-slate-400"
                  )}
                />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">
                  Monthly Budget Limit
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Default Account •{" "}
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </CardDescription>
              </div>
            </div>
          </div>

          {budgetStatus.message && (
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold shadow-sm border backdrop-blur-sm",
                budgetStatus.color === "red" &&
                  "bg-red-100/80 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
                budgetStatus.color === "orange" &&
                  "bg-orange-100/80 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800",
                budgetStatus.color === "amber" &&
                  "bg-amber-100/80 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
                budgetStatus.color === "blue" &&
                  "bg-blue-100/80 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
                budgetStatus.color === "emerald" &&
                  "bg-emerald-100/80 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
              )}
            >
              <budgetStatus.icon className="h-4 w-4" />
              {budgetStatus.message}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          {isEditing ? (
            <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-white/20 dark:border-slate-700/50 backdrop-blur-sm shadow-sm">
              <div className="flex-1">
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Budget Amount
                </label>
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="h-11 text-lg font-semibold cursor-text"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={createOrUpdateBudget.isPending}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUpdateBudget}
                  disabled={createOrUpdateBudget.isPending}
                  className="h-11 w-11 p-0 cursor-pointer hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-950/30 transition-colors"
                >
                  <Check className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={createOrUpdateBudget.isPending}
                  className="h-11 w-11 p-0 cursor-pointer hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/30 transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                {initialBudget ? (
                  <>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-foreground">
                        ${initialBudget.amount.toLocaleString()}
                      </span>
                      <span className="text-lg text-muted-foreground font-medium">
                        budget
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-muted-foreground block">
                          Spent
                        </span>
                        <span className="font-bold text-lg text-foreground">
                          ${currentExpenses.toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground block">
                          {remaining >= 0 ? "Remaining" : "Over Budget"}
                        </span>
                        <span
                          className={cn(
                            "font-bold text-lg",
                            remaining >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          )}
                        >
                          ${Math.abs(remaining).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    </div>
                    <p className="text-muted-foreground text-lg mb-2 font-semibold">
                      No budget set
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click the edit button to set your monthly budget
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-10 w-10 p-0 cursor-pointer hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors rounded-full"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {initialBudget && (
          <div className="space-y-4">
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Progress
                </span>
                <span className="text-sm font-bold text-foreground">
                  {percentUsed.toFixed(1)}%
                </span>
              </div>

              <div className="relative">
                <Progress
                  value={0}
                  className="h-4 bg-white/40 border border-white/20 "
                />

                {/* Custom progress bar with gradient */}
                <div
                  className={cn(
                    "absolute top-0 left-0 h-4 rounded-full transition-all duration-700 ease-out shadow-sm",
                    budgetStatus.progressColor
                  )}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                />

                {/* Percentage text overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold drop-shadow-sm">
                    {percentUsed.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm bg-white/40 dark:bg-slate-800/40 rounded-lg p-3 border border-white/20 dark:border-slate-700/50">
              <div className="flex items-center gap-6">
                {percentUsed > 100 && (
                  <span className="text-red-600 dark:text-red-400 font-bold">
                    {(percentUsed - 100).toFixed(1)}% over budget
                  </span>
                )}
                <span className="text-muted-foreground">
                  Days elapsed:{" "}
                  <span className="font-semibold text-foreground">
                    {new Date().getDate()}/
                    {new Date(
                      new Date().getFullYear(),
                      new Date().getMonth() + 1,
                      0
                    ).getDate()}
                  </span>
                </span>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {Math.round(
                      (new Date().getDate() /
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          0
                        ).getDate()) *
                        100
                    )}
                    %
                  </span>{" "}
                  through month
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
