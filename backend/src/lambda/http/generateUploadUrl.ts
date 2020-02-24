import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getUserId } from '../utils'
import { generateUploadUrl } from '../../businessLogic/expense'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

const XAWS = AWSXRay.captureAWS(AWS)


const docClient = new XAWS.DynamoDB.DocumentClient()

const expensesTable = process.env.EXPENSES_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId = getUserId(event)
  const expenseId = event.pathParameters.expenseId
  const validTodo = await expenseExists(userId, expenseId)

  if (!validTodo) {
    logger.info('expense does not exist')
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'expense does not exist'
      })
    }
  }

  let url = await generateUploadUrl(userId, expenseId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}


export async function expenseExists(userId: string, expenseId: string) {
  const result = await docClient
    .get({
      TableName: expensesTable,
      Key: {
        userId: userId,
        expenseId: expenseId
      }
    })
    .promise()
  return !!result.Item
}
