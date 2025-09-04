import { useNavigate } from "react-router-dom";
import { useAccounts } from "../../actions/account";
import { AddTransactionForm } from "../../components/dashboard/AddTransactionForm";
import { Button } from "../../components/ui/button";
import { defaultCategories } from "../../data/categories";
import { useToken } from "../../lib/useClerkToken";
import { ArrowLeft, Plus } from "lucide-react";

const CreateTransaction = () => {
  const { token } = useToken();
  const navigate = useNavigate();
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts(
    token as string,
    {
      enabled: !!token,
    }
  );

  if (isAccountsLoading) {
    return (
      <div className="min-h-screen bg-gray-100/50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300 rounded-lg w-1/3"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-12 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              className="p-2 h-auto cursor-pointer border"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5 hover:text-white duration-200" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 text-balance">
                Add New Transaction
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Record your income or expense transaction
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-200/60 rounded-2xl shadow-sm border border-neutral-300 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-medium text-gray-900">Transaction Details</h2>
              <p className="text-sm text-gray-500">
                Fill in the information below
              </p>
            </div>
          </div>

          <AddTransactionForm
            accounts={accounts?.data ?? []}
            categories={defaultCategories}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateTransaction;
