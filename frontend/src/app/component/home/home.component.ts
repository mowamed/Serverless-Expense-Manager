import { Component, OnInit } from "@angular/core";
import { AddExpenseModalComponent } from "../../modals/add-expense-modal/add-expense-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "../../core/services/auth.service";
import { ExpenseService } from "../../core/services/expense.service";
import { Observable } from "rxjs";
import { Expense } from "../../core/models/expense";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

  expenseList$: Observable<Expense[]>;
  totalExpense: number;

  constructor(
    public authService: AuthService,
    public expenseService: ExpenseService,
    public dialog: MatDialog
  ) {
    this.expenseList$ = this.expenseService.getExpenses();
  }

  async ngOnInit() {
    this.getTotalSpent();
  }

  async openAddNewExpense() {
    const dialogRef = this.dialog.open(AddExpenseModalComponent, {
      width: "500px",
      data: { update: false, expenseData: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.expenseList$ = this.expenseService.getExpenses();
      this.getTotalSpent();
    });
  }

  async getTotalSpent() {
    this.totalExpense = await this.expenseService.getTotalSpent().toPromise();
  }
}
