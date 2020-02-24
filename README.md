# Serverless Expense Manager

This is the submission of Cloud Developer Nanodegree Capstone project. i've implemented a Simple Expense Manager application using AWS Lambda and Serverless framework in the backend and Angular 8 in the frontend.

# Functionality of the application

This application allow creating/removing/updating/fetching Expenses. Each Expense can optionally have an attachment image. Each user only has access to Expense that he/she has created.

# Deployment Link

the frontend have been deployed as a static website using S3 and CloudFront as a CDN.
- frontend link [https://d16t0bma8g1do4.cloudfront.net](https://d16t0bma8g1do4.cloudfront.net)

# Tech Stack
## frontend
- Angular 8
- Angular Material and FlexLayout
- Auth0 for authentication
- AWS S3
- AWS CloudFront
## backend
- Serverless Framework
- NodeJS
- AWS Lambda
- AWS S3
- AWS DynamoDB
- API Gateway
- AWS XRAY

# API Endpoints
```ts
endpoints:
  GET - https://xm6pd9tj3g.execute-api.us-east-1.amazonaws.com/dev/expenses
  POST - https://xm6pd9tj3g.execute-api.us-east-1.amazonaws.com/dev/expenses
  PATCH - https://xm6pd9tj3g.execute-api.us-east-1.amazonaws.com/dev/expenses/{expenseId}
  DELETE - https://xm6pd9tj3g.execute-api.us-east-1.amazonaws.com/dev/expenses/{expenseId}
  POST - https://xm6pd9tj3g.execute-api.us-east-1.amazonaws.com/dev/expenses/{expenseId}/image
functions:
  Auth: expense-manager-app-dev-Auth
  GetExpenses: expense-manager-app-dev-GetExpenses
  CreateExpense: expense-manager-app-dev-CreateExpense
  UpdateExpense: expense-manager-app-dev-UpdateExpense
  DeleteExpense: expense-manager-app-dev-DeleteExpense
  GenerateUploadUrl: expense-manager-app-dev-GenerateUploadUrl
  ```
# Frontend credentials
```ts
export const environment = {
  production: false,
  baseUrl: "https://xm6pd9tj3g.execute-api.us-east-1.amazonaws.com/dev",
  auth0: {
    domain: "mowamed.auth0.com",
    client_id: "LGYoHVP8w9iFdgoAU166OlT2VpA8gDUj",
    redirect_uri: `${window.location.origin}`,
    audience: "http://finale-project-expense-manager.com",
    scope: "openid profile email read:users"
  }
};
```





# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `frontend/src/environments/environment.ts` file to set correct parameters. And then run the following commands:
>_tip_: the default credentials have already been added in the file

```
cd frontend
npm install
ng serve
```

This should start a development server with the Angular application that will interact with the serverless Expense application.
>_tip_: you can view it in your browser at `localhost:4200`

# Screenshots

## AWS
Xray screenshot:

![Xray](images/xray.png?raw=true "Xray")

Debugging with Xray:
![Xray](images/xray-service-map.png?raw=true "Xray")

API Gateway screenshot:

![API Gateway](images/api-gateway.png?raw=true "API Gateway")

CloudWatch screenshot:

![CloudWatch](images/cloudwatch.png?raw=true "CloudWatch")

## Backend

sls deploy output:

![sls deploy](images/sls-deploy.png?raw=true "sls deploy")

Serveless Dashboard:

![Serveless Dashboard](images/serverless-dashboard.png?raw=true "Serveless Dashboard")

## Frontend
Unauthenticated user:

![Unauthenticated user](images/frontend-1.png?raw=true "Unauthenticated user")

Authenticated user:

![Authenticated user](images/frontend-2.png?raw=true "Authenticated user")

Add new expense:

![Add new expense](images/frontend-3.png?raw=true "Add new expense")

Expense details:

![Expense details](images/frontend-4.png?raw=true "Expense details")

Expense List:

![Expense List](images/frontend-5.png?raw=true "Expense List")






