/**
 * Fields in a request to create a single expense.
 */
export interface CreateExpenseRequest {
    amount: number;
    category: string;
    description: string;
    expenseDate: string;
}
