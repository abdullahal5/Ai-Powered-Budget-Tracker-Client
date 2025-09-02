import { type ReactNode, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Loader2, DollarSign, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { accountSchema } from "../schema";
import { useCreateAccount } from "../actions/account";
import { useToken } from "../lib/useClerkToken";

const CreateAccountDrawer = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useToken();
  const createAccountMutation = useCreateAccount(token as unknown as string);

  const form = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      const result = await createAccountMutation.mutateAsync(data);
      if (result.success) {
        toast.success(result.message);
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="min-h-[90vh]">
        <div className="mx-auto w-full max-w-xl">
          <DrawerHeader className="text-center pb-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <DrawerTitle className="text-xl font-semibold">
              Create New Account
            </DrawerTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Set up a new account to manage your finances
            </p>
          </DrawerHeader>

          <div className="px-4 pb-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-sm font-medium">
                          Account Name
                        </FormLabel>
                        <FormControl className="border border-neutral-300">
                          <Input
                            placeholder="e.g., Main Checking"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-sm font-medium">
                          Account Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 border border-neutral-300">
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CURRENT">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Current Account
                              </div>
                            </SelectItem>
                            <SelectItem value="SAVINGS">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Savings Account
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Initial Balance
                      </FormLabel>
                      <FormControl className="border border-neutral-300 rounded-md">
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="h-11 pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="border border-neutral-300 rounded-md">
                      <div className="flex items-center justify-between rounded-lg border p-4 space-y-0">
                        <div className="space-y-1">
                          <FormLabel className="text-base font-medium cursor-pointer">
                            Set as Default Account
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            This account will be selected by default for
                            transactions
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            className="cursor-pointer data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-[#197B4E]"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <DrawerClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-11 bg-transparent cursor-pointer border border-neutral-300"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                  <Button
                    type="submit"
                    className="flex-1 h-11 cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
