import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Plus,
  Eye,
} from "lucide-react";
import { BarLoader } from "react-spinners";
import TransactionTable from "../../components/dashboard/Transaction-table";
import type { TAccount, TTransaction } from "../../types";
import { useToken } from "../../lib/useClerkToken";
import { useAccountsWithTransactions } from "../../actions/account";
import { Link, useParams } from "react-router-dom";
import AccountChart from "../../components/dashboard/AccountChart";

const AccountDetails = () => {
  const { token } = useToken();
  const params = useParams();

  const {
    data: accountData,
    isLoading,
    error,
  } = useAccountsWithTransactions(token as string, params.id || "");

  if (!params?.id)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );

  if (isLoading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading account data...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">Error loading account data</div>
      </div>
    );

  let account: Omit<TAccount, "transactions"> | undefined;
  let _transactions: TTransaction[] = [];

  if (accountData?.data) {
    const { transactions, ...rest } = accountData.data;
    account = rest;
    _transactions = transactions;
  }

  // Calculate transaction statistics
  const totalIncome = _transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = _transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const getAccountTypeIcon = (type: string) => {
    return type === "SAVINGS" ? (
      <TrendingUp className="h-5 w-5" />
    ) : (
      <CreditCard className="h-5 w-5" />
    );
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === "string" ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getAccountTypeIcon(account?.type || "")}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance capitalize">
                  {account?.name}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {account?.type
                    ? account.type.charAt(0) +
                      account.type.slice(1).toLowerCase()
                    : "Unknown"}{" "}
                  Account
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Link
                className="cursor-pointer"
                to={`/dashboard/transaction/create`}
              >
                <Button className="cursor-pointer" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span className="text-primary-foreground/80">
                    Current Balance
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-primary-foreground/20 text-primary-foreground border-0"
                >
                  {account?.isDefault ? "Primary" : "Secondary"}
                </Badge>
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {formatCurrency(account?.balance || 0)}
              </div>
              <div className="flex items-center gap-4 text-sm text-primary-foreground/80">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Updated {formatDate(account?.updatedAt || new Date())}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-300 border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transaction Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-chart-1" />
                  <span className="text-sm">Income</span>
                </div>
                <span className="font-semibold text-chart-1">
                  {formatCurrency(totalIncome)}
                </span>
              </div>
              <div className="flex items-center justify-between text-red-500">
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="h-4 w-4" />
                  <span className="text-sm">Expenses</span>
                </div>
                <span className="font-semibold text-red-500">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Transactions</span>
                <Badge variant="secondary">
                  {account?._count?.transactions || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        {_transactions.length > 0 && (
          <AccountChart transactions={_transactions} />
        )}

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Transactions Table */}
            {_transactions.length > 0 ? (
              <div className="space-y-4">
                <Suspense
                  fallback={
                    <BarLoader className="mt-4" width="100%" color="#197b4e" />
                  }
                >
                  <TransactionTable
                    accountId={account?.id as string}
                    transactions={_transactions}
                  />
                </Suspense>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions found</p>
                <p className="text-sm">
                  Start by adding your first transaction
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountDetails;
