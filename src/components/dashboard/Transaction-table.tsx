import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Checkbox } from "../../components/ui/checkbox";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Trash,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { useMemo, useState } from "react";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import type { TTransaction } from "../../types";
import { useBulkDeleteTransactions } from "../../actions/account";
import { categoryColors } from "../../data/categories";
import { useToken } from "../../lib/useClerkToken";

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({
  transactions,
  accountId,
}: {
  transactions: TTransaction[];
  accountId: string;
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");

  const { token } = useToken();
  const deleteTransactions = useBulkDeleteTransactions(token as unknown as string);

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((t) =>
        t.description?.toLowerCase().includes(searchLower)
      );
    }

    if (recurringFilter) {
      result = result.filter((t) => {
        if (recurringFilter === "recurring") return t.isRecurring;
        return !t.isRecurring;
      });
    }

    if (typeFilter) {
      result = result.filter((t) => t.type === typeFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = Number(new Date(a.date)) - Number(new Date(b.date));
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;

        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  const handleSort = (field: string) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field == field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item != id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === filteredAndSortedTransactions.length
        ? []
        : filteredAndSortedTransactions.map((t) => t.id)
    );
  };

  const handleBulkDelete = async () => {
    const toastId = toast.loading("Deleting...");
    try {
      const response = await deleteTransactions.mutateAsync({
        id: accountId,
        data: selectedIds,
      });
      if (response.success) {
        toast.success(response.message, { id: toastId });
        setSelectedIds([]);
      } else {
        toast.error("Failed to update", { id: toastId });
        setSelectedIds([]);
      }
    } catch {
      toast.error("Error when bulk delete transaction operation", {
        id: toastId,
      });
      setSelectedIds([]);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
  };

  return (
    <div>
      {/* filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="pl-8 border border-neutral-300"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[130px] cursor-pointer border border-neutral-300">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value="INCOME">
              Income
            </SelectItem>
            <SelectItem className="cursor-pointer" value="EXPENSE">
              Expense
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={recurringFilter}
          onValueChange={(value) => setRecurringFilter(value)}
        >
          <SelectTrigger className="w-[160px] border cursor-pointer border-neutral-300">
            <SelectValue placeholder="All Transactions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value="recurring">
              Recurring Only
            </SelectItem>
            <SelectItem className="cursor-pointer" value="non-recurring">
              Non-recurring Only
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Bulk delete */}
        {selectedIds.length > 0 && (
          <div className="flex items-center cursor-pointer gap-2">
            <Button
              className="cursor-pointer"
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Selected ({selectedIds.length})
            </Button>
          </div>
        )}

        {(searchTerm || typeFilter || recurringFilter) && (
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            onClick={handleClearFilters}
            title="Clear filters"
          >
            <X className="h-4 w-5" />
          </Button>
        )}
      </div>

      {/* transactions */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                onCheckedChange={handleSelectAll}
                checked={
                  filteredAndSortedTransactions.length === selectedIds.length &&
                  filteredAndSortedTransactions.length > 0
                }
                className="border border-neutral-300 cursor-pointer"
              />
            </TableHead>
            <TableHead
              onClick={() => handleSort("date")}
              className="cursor-pointer"
            >
              <div className="flex items-center">
                Date{" "}
                {sortConfig.field === "date" &&
                sortConfig.direction === "asc" ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead
              onClick={() => handleSort("category")}
              className="cursor-pointer"
            >
              <div className="flex items-center">
                Category
                {sortConfig.field === "category" &&
                sortConfig.direction === "asc" ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead
              onClick={() => handleSort("amount")}
              className="cursor-pointer"
            >
              <div className="flex items-center">
                Amount{" "}
                {sortConfig.field === "amount" &&
                sortConfig.direction === "asc" ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">Recuuring</div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">Actions</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-black">
          {filteredAndSortedTransactions?.length === 0 ? (
            <TableRow>
              <TableCell
                className="text-center text-muted-foreground"
                colSpan={7}
              >
                No Transactions Found
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Checkbox
                    onCheckedChange={() => handleSelect(transaction.id)}
                    checked={selectedIds.includes(transaction.id)}
                    className="border border-neutral-300 cursor-pointer"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.date), "PP")}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <span
                    style={{
                      background: categoryColors[transaction.category],
                    }}
                    className="capitalize px-2 py-1 rounded text-white text-sm"
                  >
                    {transaction.category}
                  </span>
                </TableCell>
                <TableCell
                  className="font-medium"
                  style={{
                    color: transaction.type === "EXPENSE" ? "red" : "green",
                  }}
                >
                  {transaction.type === "EXPENSE" ? "- " : "+ "}${" "}
                  {Number(transaction.amount)?.toFixed(2)}
                </TableCell>
                <TableCell>
                  {transaction.isRecurring ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          variant={"outline"}
                          className="gap-1 border-neutral-300 border cursor-pointer text-purple-700 bg-purple-100 hover:bg-purple-200 duration-200"
                        >
                          <RefreshCcw className="h-3 w-3" />
                          {transaction?.recurringInterval
                            ? RECURRING_INTERVALS[transaction.recurringInterval]
                            : "N/A"}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <div className="font-medium">Next Date:</div>
                          <div>{format(new Date(transaction.date), "PP")}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Badge
                      variant={"outline"}
                      className="gap-1 cursor-pointer border-neutral-300 border"
                    >
                      <Clock className="h-3 w-3" /> One-time
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"ghost"}
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
