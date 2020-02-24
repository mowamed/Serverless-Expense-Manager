import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { filter, map, shareReplay, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AddExpense } from "../models/addExpense";
import { Expense } from "../models/expense";

@Injectable({
  providedIn: "root"
})
export class ExpenseService {
  baseUrl = "https://xm6pd9tj3g.execute-api.us-east-1.amazonaws.com/dev";

  constructor(private http: HttpClient) {}

  createExpense(newExpense: AddExpense): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/expenses`, JSON.stringify(newExpense))
      .pipe(map(response => response as Expense));
  }

  getExpenses(): Observable<Expense[]> {
    return this.http.get(`${this.baseUrl}/expenses`).pipe(
      map(response => response["expenses"] as Expense[]),
      map(expenses => {
        return expenses.sort(
          (a, b) =>
            new Date(b.expenseDate).getTime() -
            new Date(a.expenseDate).getTime()
        );
      }),
      shareReplay(1)
    );
  }

  patchExpense(expenseId: string, expenseData: AddExpense): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/expenses/${expenseId}`,
      expenseData,
      { responseType: "text" }
    );
  }

  deleteExpense(expenseId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/expenses/${expenseId}`, {
      responseType: "text"
    });
  }

  getUploadUrl(expenseId: string): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/expenses/${expenseId}/image`, "")
      .pipe(map(response => response));
  }

  uploadImage(uploadUrl: string, image: File): Observable<any> {
    return this.http.put(uploadUrl, image);
  }

  getExpense(expenseId: string) {
    return this.getExpenses().pipe(
      map(expenses =>
        expenses.filter(expense => expense.expenseId === expenseId)
      ),
      map(data => data[0])
    );
  }

  getTotalSpent() {
    return this.getExpenses().pipe(
      map(expenses => {
        let totalExpense = 0;
        expenses.forEach(expense => {
          totalExpense += expense.amount;
        });
        return totalExpense;
      })
    );
  }
}
