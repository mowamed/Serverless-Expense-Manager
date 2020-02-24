import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material";
import { ExpenseService } from "../../core/services/expense.service";
import { MessagingService } from "../../core/services/messaging.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Expense } from "../../core/models/expense";

export interface DialogData {
  update: boolean;
  expenseData: any;
}

@Component({
  selector: "app-add-expense-modal",
  templateUrl: "./add-expense-modal.component.html",
  styleUrls: ["./add-expense-modal.component.scss"]
})
export class AddExpenseModalComponent implements OnInit {
  expenseForm: FormGroup;
  formSubmitted: boolean = false;
  isUpdateExpense: boolean;
  expenseId: string;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessagingService,
    private expenseService: ExpenseService,
    public dialogRef: MatDialogRef<AddExpenseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.isUpdateExpense = this.data.update;
    if (this.isUpdateExpense) {
      let updateData: Expense = this.data.expenseData;
      this.expenseId = this.data.expenseData.expenseId;
      this.expenseForm = this.formBuilder.group({
        amount: [updateData.amount, Validators.required],
        category: [updateData.category, Validators.required],
        description: [updateData.description],
        expenseDate: [updateData.expenseDate, Validators.required]
      });
    } else {
      this.expenseForm = this.formBuilder.group({
        amount: ["", Validators.required],
        category: ["", Validators.required],
        description: [""],
        expenseDate: ["", Validators.required]
      });
    }
  }

  async submitForm() {
    this.formSubmitted = true;
    await this.expenseService.createExpense(this.expenseForm.value).toPromise();
    this.formSubmitted = false;
    this.cancel();
    this.messageService.showToast(
      "Expense added successfully!",
      "notif-success"
    );
  }

  async updateExpense() {
    this.formSubmitted = true;
    await this.expenseService
      .patchExpense(this.expenseId, this.expenseForm.value)
      .toPromise();
    this.formSubmitted = false;
    this.cancel();
    this.messageService.showToast(
      "Expense updated successfully!",
      "notif-success"
    );
  }

  cancel() {
    this.dialogRef.close();
  }
}
