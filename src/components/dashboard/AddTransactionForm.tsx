/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Tag,
  FileText,
  CalendarIcon,
  Calendar1Icon,
  Repeat,
  CalendarSync,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import CreateAccountDrawer from "../create-account-drawer";
import { Separator } from "../ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../../schema";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { cn } from "../../lib/utils";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { useToken } from "../../lib/useClerkToken";
import { useCreateTransaction } from "../../actions/transactions";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ReceiptScanner from "./ReceiptScanner";

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function AddTransactionForm({
  accounts,
  categories,
}: {
  accounts: { id: string; name: string }[];
  categories: { id: string; name: string; type: string }[];
}) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      description: "",
      accountId: "",
      category: "",
      date: new Date(),
      isRecurring: false,
      recurringInterval: undefined,
    },
  });

  const { token } = useToken();
  const createTransaction = useCreateTransaction(token as string);

  const watchedType = form.watch("type");
  const isRecurring = form.watch("isRecurring");

  const filteredCategories = categories.filter(
    (category) => category.type === watchedType
  );

  const navigate = useNavigate();

  const onSubmit = async (data: TransactionFormValues) => {
    const toastId = toast.loading("Creating...");

    try {
      const res = await createTransaction.mutateAsync(data);

      if (res.success) {
        toast.success(res.message, { id: toastId });

        form.reset();
        navigate(`/dashboard/account/${res.data.accountId}`);
      } else {
        toast.error(res.message || "Something went wrong", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to create transaction", {
        id: toastId,
      });
    }
  };

  return (
    <div>
      <Form {...form}>
        <div className="pb-6">
          <ReceiptScanner />
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Transaction Type - Enhanced with visual indicators */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100 flex items-center justify-center">
                    {watchedType === "INCOME" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                  Transaction Type
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border-neutral-300 focus:border-blue-300 focus:ring-blue-100 cursor-pointer">
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem className="cursor-pointer" value="EXPENSE">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        Expense
                      </div>
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="INCOME">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Income
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-3 w-full">
            {/* Amount - Enhanced with currency symbol */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    Amount
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                        $
                      </div>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="h-9 pl-8 border-neutral-300 focus:border-blue-300 focus:ring-blue-100 text-lg"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <div className="space-y-2 flex-1">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar1Icon className="h-4 w-4 text-gray-500" />
                    Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger className="cursor-pointer" asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left border border-neutral-300 font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            />
          </div>

          <div className="flex items-center w-full gap-3">
            {/* Account - Enhanced with icon */}
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    Account
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 border-neutral-300 w-full focus:border-blue-300 focus:ring-blue-100 cursor-pointer">
                        <SelectValue placeholder="Choose an account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={account.id}
                          value={account.id}
                        >
                          {account.name}
                        </SelectItem>
                      ))}

                      <div className="relative flex items-center my-3">
                        <Separator className="flex-1 bg-white border-neutral-300 border" />
                        <span className="px-2 text-sm text-muted-foreground">
                          or
                        </span>
                        <Separator className="flex-1 bg-white border-neutral-300 border" />
                      </div>

                      <CreateAccountDrawer>
                        <Button
                          variant="ghost"
                          className="relative flex w-full cursor-pointer select-none items-center text-blue-500 rounded-sm pl-8 pr-2 text-sm outline-none hover:bg-accent border border-blue-200 bg-blue-100"
                        >
                          Create Account
                        </Button>
                      </CreateAccountDrawer>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category - Enhanced with icon and filtered by type */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 w-full border-neutral-300 focus:border-blue-300 focus:ring-blue-100 cursor-pointer">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description - Enhanced with icon */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  Description
                  <span className="text-xs text-gray-400 font-normal">
                    (Optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add a note about this transaction"
                    className="h-12 border-neutral-300 focus:border-blue-300 focus:ring-blue-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Recurring Transaction Switch */}
          <FormField
            control={form.control}
            name="isRecurring"
            render={({ field }) => (
              <div className="flex flex-row items-center justify-between rounded-lg border border-neutral-300 bg-slate-200 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Repeat className="h-4 w-4 text-gray-500" />
                    Recurring Transaction
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Set up a recurring schedule for this transaction
                  </div>
                </div>
                <FormControl>
                  <Switch
                    className="cursor-pointer data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-[#197B4E]"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            )}
          />

          {/* Recurring Interval Select */}
          {isRecurring && (
            <FormField
              control={form.control}
              name="recurringInterval"
              render={({ field }) => (
                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CalendarSync className="h-4 w-4 text-gray-500" />
                    Recurring Interval
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger className="border border-neutral-300 w-full cursor-pointer">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="DAILY">
                          Daily
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="WEEKLY">
                          Weekly
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="MONTHLY">
                          Monthly
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="YEARLY">
                          Yearly
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
          )}

          {/* Actions - Enhanced spacing and styling */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              disabled={createTransaction.isPending}
              className="flex-1 h-12 border-gray-200 cursor-pointer text-gray-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 cursor-pointer text-white shadow-sm"
              type="submit"
              disabled={createTransaction.isPending}
            >
              Create Transaction
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
