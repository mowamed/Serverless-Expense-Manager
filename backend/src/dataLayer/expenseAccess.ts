import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { Expense } from '../models/Expense'
import { createLogger } from '../utils/logger'
import {ExpenseUpdate} from "../models/ExpenseUpdate";

const logger = createLogger('Expenses')

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})


export class ExpenseAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly expensesTable = process.env.EXPENSES_TABLE,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
        private readonly bucketName = process.env.IMAGES_S3_BUCKET) {
    }

    async getUserExpenses(userId: string): Promise<Expense[]> {
        logger.info('Getting all expenses done by a user')

        const result = await this.docClient.query({
            TableName: this.expensesTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        logger.info('Expense retrieved successfully!')

        const items = result.Items
        return items as Expense[]
    }

    async createExpense(todo: Expense): Promise<Expense> {
        await this.docClient.put({
            TableName: this.expensesTable,
            Item: todo
        }).promise()

        logger.info('Expense created successfully!')
        return todo
    }

    async updateExpense(userId: string, expenseId: string, expenseUpdate: ExpenseUpdate): Promise<ExpenseUpdate> {

        await this.docClient.update({
            TableName: this.expensesTable,
            Key: {
                userId: userId,
                expenseId: expenseId
            },
            UpdateExpression: "set amount = :amount, category = :category, description = :description, expenseDate = :expenseDate",
            ExpressionAttributeValues: {
                ":amount": expenseUpdate.amount,
                ":category": expenseUpdate.category,
                ":description": expenseUpdate.description,
                ":expenseDate": expenseUpdate.expenseDate
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
        logger.info('Expense updated successfully!', {
            expenseId: expenseId
        })
        return expenseUpdate
    }

    async deleteExpense(userId: string, expenseId: string): Promise<String> {
        await this.docClient.delete({
            TableName: this.expensesTable,
            Key: {
                userId: userId,
                expenseId: expenseId
            }
        }).promise()
        logger.info('Expense deleted successfully!', {
            expenseId: expenseId
        })
        return ''
    }

    async generateUploadUrl(userId: string, expenseId: string): Promise<String> {
        const url = getUploadUrl(expenseId, this.bucketName, this.urlExpiration)

        const attachmentUrl: string = 'https://' + this.bucketName + '.s3.amazonaws.com/' + expenseId

        await this.docClient.update({
            TableName: this.expensesTable,
            Key: {
                userId: userId,
                expenseId: expenseId
            },
            UpdateExpression: "set attachmentUrl = :url",
            ExpressionAttributeValues: {
                ":url": attachmentUrl
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
        logger.info('upload url generated successfully!', url)

        return url;
    }

}

function getUploadUrl(imageId: string, bucketName: string, urlExpiration: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: Number(urlExpiration)
    })
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
