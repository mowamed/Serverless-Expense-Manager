import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { CreateExpenseRequest } from '../../requests/CreateExpenseRequest'
import { createExpense } from '../../businessLogic/expense'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createExpense')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const userId = getUserId(event)
    const newExpense: CreateExpenseRequest = JSON.parse(event.body)

    const expenseItem = await createExpense(newExpense, userId)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ expense: expenseItem })
    }
}
