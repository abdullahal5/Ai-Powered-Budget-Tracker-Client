import { ArrowUpRight, ArrowDownRight, CreditCard, Wallet } from "lucide-react";
import { toast } from "sonner";
import type { TAccount } from "../../types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Link } from "react-router-dom";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { useChangeIsDefaultStatus } from "../../actions/account";
import { useToken } from "../../lib/useClerkToken";

export function AccountCard({ account }: { account: TAccount }) {
  const { name, type, balance, id, isDefault, createdAt } = account;
  const { token } = useToken();
  const changeIsDefault = useChangeIsDefaultStatus(token as unknown as string);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getAccountIcon = () => {
    return type === "SAVINGS" ? (
      <Wallet className="h-5 w-5" />
    ) : (
      <CreditCard className="h-5 w-5" />
    );
  };

  const formatBalance = (balance: string) => {
    const num = Number.parseFloat(balance);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const handleSwitchToggle = async (checked: boolean) => {
    const toastId = toast.loading("Updating...");
    try {
      const response = await changeIsDefault.mutateAsync({
        id,
        data: { isDefault: checked },
      });
      if (response.success) {
        toast.success(response.message, { id: toastId });
      } else {
        toast.error("Failed to update", { id: toastId });
      }
    } catch {
      toast.error("Error occurred when updating isDefault status", {
        id: toastId,
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group relative overflow-hidden border border-neutral-300 border-dashed bg-gradient-to-br from-background to-muted/20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="flex flex-row items-start justify-between space-y-0 relative z-10">
        <Link
          to={`/dashboard/account/${id}`}
          className="flex items-center space-x-3 flex-1"
        >
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            {getAccountIcon()}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold capitalize flex items-center gap-2">
              {name}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Since {formatDate(createdAt)}
            </p>
          </div>
        </Link>

        <div className="flex flex-col items-end gap-2">
          <Switch
            checked={isDefault}
            onCheckedChange={handleSwitchToggle}
            className="cursor-pointer data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-[#197B4E]"
          />
          <Badge
            variant={type === "SAVINGS" ? "secondary" : "outline"}
            className="text-xs border border-neutral-300"
          >
            {type === "SAVINGS" ? "Savings" : "Current"}
          </Badge>
        </div>
      </CardHeader>

      <Link to={`/account/${id}`} className="block relative z-10">
        <CardContent className="pb-">
          <div className="space-y-2">
            <div className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
              {formatBalance(balance)}
            </div>
            {Number.parseFloat(balance) >= 1000 && (
              <p className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                ${Number.parseFloat(balance).toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t border-border/50">
          <div className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 transition-colors">
            <ArrowUpRight className="h-4 w-4" />
            <span className="font-medium">Income</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors">
            <ArrowDownRight className="h-4 w-4" />
            <span className="font-medium">Expense</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
