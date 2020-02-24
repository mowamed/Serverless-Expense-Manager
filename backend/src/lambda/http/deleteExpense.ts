import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { deleteExpense } from '../../businessLogic/expense'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteExpense')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const userId = getUserId(event)
    const expenseId = event.pathParameters.expenseId

    await deleteExpense(userId, expenseId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: " "
    }

}
