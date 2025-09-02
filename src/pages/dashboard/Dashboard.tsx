import { Plus, AlertCircle } from "lucide-react";
import { useAccounts } from "../../actions/account";
import { Card, CardContent } from "../../components/ui/card";
import CreateAccountDrawer from "../../components/create-account-drawer";
import { AccountCard } from "../../components/dashboard/AccountCard";
import { useToken } from "../../lib/useClerkToken";
import { useMyCurrentBudget } from "../../actions/budget";
import BudgetProgress from "../../components/dashboard/BudgetProgress";
import type { TBudget } from "../../types";

const Dashboard = () => {
  const { token, isLoading: isTokenLoading, error: tokenError } = useToken();
  const {
    data: accounts,
    isLoading: isAccountsLoading,
    error: accountsError,
  } = useAccounts(token as string, {
    enabled: !!token,
  });

  const defaultAccount = accounts?.data?.find((account) => account.isDefault);

  const { data: currentBudget, isLoading: isBudgetLoading } =
    useMyCurrentBudget(token as string, defaultAccount?.id || "", {
      enabled: !!defaultAccount?.id && !!token,
    });

  const isLoading = isTokenLoading || isAccountsLoading || isBudgetLoading;
  const hasError = tokenError || accountsError;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-700">
              Loading Dashboard
            </h2>
            <p className="text-slate-500 text-sm">
              Preparing your workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-800">
                Something went wrong
              </h2>
              <p className="text-slate-600 text-sm">
                {tokenError
                  ? "Authentication failed"
                  : "Unable to load accounts"}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  let budgetData = null;
  if (defaultAccount) {
    budgetData = currentBudget?.data;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-600 mt-2">
            Manage your accounts and track your progress
          </p>
        </div>

        {/* budget progress */}
        {defaultAccount && (
          <BudgetProgress
            initialBudget={budgetData?.budget as unknown as TBudget}
            currentExpenses={budgetData?.currentExpenses || 0}
          />
        )}

        <div className="grid pt-10 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accounts?.data && (
            <CreateAccountDrawer>
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300">
                <CardContent className="flex flex-col items-center justify-center text-blue-600 h-48 space-y-3">
                  <div className="transform group-hover:scale-110 transition-transform duration-200">
                    <Plus className="h-10 w-10" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-semibold">Add Account</p>
                    <p className="text-xs text-blue-500">Click to create</p>
                  </div>
                </CardContent>
              </Card>
            </CreateAccountDrawer>
          )}

          {accounts?.data?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>

        {!accounts?.data?.length && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-10 w-10 text-slate-400" />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-xl font-semibold text-slate-700">
                No accounts yet
              </h3>
              <p className="text-slate-500 text-sm">
                Create your first account to get started with managing your
                dashboard
              </p>
            </div>
            <div className="mt-6">
              <CreateAccountDrawer>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium">
                  Create Account
                </button>
              </CreateAccountDrawer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
