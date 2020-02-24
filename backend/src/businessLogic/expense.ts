import * as uuid from 'uuid'
import 'source-map-support/register'
import { Expense } from '../models/Expense'
import { ExpenseUpdate } from '../models/ExpenseUpdate'
import { ExpenseAccess } from '../dataLayer/expenseAccess'
import { CreateExpenseRequest } from '../requests/CreateExpenseRequest'

const expenseAccess = new ExpenseAccess()


/**
 * get all expenses created by a user
 *
 * @export
 * @param {string} userId
 * @returns {Promise<Expense[]>}
 */
export async function getExpenses(userId: string): Promise<Expense[]> {
    return expenseAccess.getUserExpenses(userId)
}


/**
 * create a new Expense
 *
 * @export
 * @param {CreateExpenseRequest} createExpenseRequest
 * @param {string} userId
 * @param {string} jwtToken
 * @returns {Promise<Expense>}
 */
export async function createExpense(
    createExpenseRequest: CreateExpenseRequest,
    userId: string
): Promise<Expense> {

    const expenseId = uuid.v4()

    return await expenseAccess.createExpense({
        userId: userId,
        expenseId: expenseId,
        createdAt: new Date().toISOString(),
        amount: createExpenseRequest.amount,
        description: createExpenseRequest.description,
        category: createExpenseRequest.category,
        expenseDate: createExpenseRequest.expenseDate
    })
}


/**
 * update an existing expense
 *
 * @export
 * @param {string} userId
 * @param {string} expenseId
 * @param {CreateExpenseRequest} updateExpenseRequest
 * @returns {Promise<ExpenseUpdate>}
 */
export async function updateExpense(
    userId: string,
    expenseId: string,
    updateExpenseRequest: CreateExpenseRequest
): Promise<ExpenseUpdate> {

    const updatedExpense: ExpenseUpdate = {
        amount: updateExpenseRequest.amount,
        description: updateExpenseRequest.description,
        category: updateExpenseRequest.category,
        expenseDate: updateExpenseRequest.expenseDate
    }

    return await expenseAccess.updateExpense(userId, expenseId, updatedExpense)
}


/**
 * delete a expense
 *
 * @export
 * @param {string} userId
 * @param {string} expenseId
 * @returns {Promise<String>}
 */
export async function deleteExpense(userId: string, expenseId: string): Promise<String>  {
    return expenseAccess.deleteExpense(userId, expenseId)
}


/**
 * generate a link to upload a expense image
 *
 * @export
 * @param {string} userId
 * @param {string} expenseId
 * @returns {Promise < String >}
 */
export async function generateUploadUrl(userId: string, expenseId: string):  Promise < String >{
    return expenseAccess.generateUploadUrl(userId, expenseId)
}
