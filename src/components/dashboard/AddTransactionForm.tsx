import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Tag,
  FileText,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transactionSchema = z.object({
  type: z.string(),
  amount: z.string(),
  description: z.string().optional(),
  accountId: z.string(),
  category: z.string(),
  date: z.date(),
  isRecurring: z.boolean().default(false),
  recurringInterval: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function AddTransactionForm({
  accounts,
  categories,
}: {
  accounts: { id: string; name: string }[];
  categories: { id: string; name: string; type: string }[];
}) {
  const form = useForm<TransactionFormValues>({
    // resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      description: "",
      accountId: "",
      category: "",
      date: new Date(),
      isRecurring: false,
    },
  });

  const watchedType = form.watch("type");

  // Filter categories based on transaction type
  const filteredCategories = categories.filter(
    (category) => category.type === watchedType
  );

  // 🟢 Empty onSubmit (you'll add logic later)
  const onSubmit = (data: TransactionFormValues) => {
    console.log("Form submitted", data);
  };

  return (
    <div>
      <Form {...form}>
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

          {/* Amount - Enhanced with currency symbol */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
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
                      className="h-12 pl-8 border-neutral-300 focus:border-blue-300 focus:ring-blue-100 text-lg"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Account - Enhanced with icon */}
          <FormField
            control={form.control}
            name="accountId"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
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
                  <Input
                    placeholder="Add a note about this transaction"
                    className="h-12 border-neutral-300 focus:border-blue-300 focus:ring-blue-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions - Enhanced spacing and styling */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 border-gray-200 cursor-pointer text-gray-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 cursor-pointer text-white shadow-sm"
              type="submit"
            >
              Create Transaction
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
