export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export type TUser = {
  id: string;
  clerkUserId: string;
  email: string;
  name?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: TUserRole;
  accounts: TAccount[];
  budgets?: TBudget | null;
  transactions: TTransaction[];
};

export type TAccount = {
  id: string;
  name: string;
  type: TAccountType;
  balance: string;
  isDefault: boolean;
  userId: string;
  createdAt: string;
  updatedAt: Date;
  transactions: TTransaction[];
  _count?: {
    transactions: number;
  };
};

export type TTransaction = {
  id: string;
  type: TTransactionType;
  amount: number;
  description?: string | null;
  date: Date;
  category: string;
  receiptUrl?: string | null;
  isRecurring: boolean;
  recurringInterval?: TRecurringInterval | null;
  status: TTransactionStatus;
  userId: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TBudget = {
  id: string;
  amount: number;
  lastAlertSent?: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TTransactionType = "INCOME" | "EXPENSE";

export const AccountType = {
  CURRENT: "CURRENT",
  SAVINGS: "SAVINGS",
} as const;
export type TAccountType = (typeof AccountType)[keyof typeof AccountType];

export const TransactionStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;
export type TTransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];

export const RecurringInterval = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;
export type TRecurringInterval =
  (typeof RecurringInterval)[keyof typeof RecurringInterval];

export const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;
export type TUserRole = (typeof UserRole)[keyof typeof UserRole];