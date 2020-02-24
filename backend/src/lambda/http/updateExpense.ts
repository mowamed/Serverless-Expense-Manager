import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateExpenseRequest } from '../../requests/CreateExpenseRequest'
import { getUserId } from '../utils'
import { updateExpense } from '../../businessLogic/expense'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateExpense')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const expenseId = event.pathParameters.expenseId
    const updatedExpense: CreateExpenseRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    await updateExpense(userId, expenseId, updatedExpense)
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: " "
    }
}
