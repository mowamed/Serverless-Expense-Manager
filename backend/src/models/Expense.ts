export interface Expense {
    userId: string
    expenseId: string
    createdAt: string
    amount: number
    category: string
    description: string
    expenseDate: string
    attachmentUrl?: string
}
