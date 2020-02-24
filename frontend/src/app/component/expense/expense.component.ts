import {Component, ElementRef, OnInit} from '@angular/core';
import {ExpenseService} from "../../core/services/expense.service";
import {Expense} from "../../core/models/expense";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {MessagingService} from "../../core/services/messaging.service";
import {AddExpenseModalComponent} from "../../modals/add-expense-modal/add-expense-modal.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {


  selectedFile: File;
  status: string = "Add Picture";
  uploadUrl: any;
  expenseId: string;
  expense$: Observable<Expense>;
  imageIcon: string = "image";

  constructor(
    private expenseService: ExpenseService,
    private messageService: MessagingService,
    private router: Router,
    private _elementRef : ElementRef,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.expenseId = this.activeRoute.snapshot.paramMap.get('expenseId');
    this.fetchExpense(this.expenseId);
  }

  fetchExpense(expenseId: string) {
    this.expense$ = this.expenseService.getExpense(expenseId);
  }

  async onFileChanged(event: any, expense: any) {
    this.selectedFile = event.target.files[0];
    this.imageIcon = "cloud_upload";
    this.status = "Adding metadata...";
    this.uploadUrl = await this.generateUploadUrl(expense.expenseId);
    this.status = "Uploading picture...";
    console.log(this.uploadUrl);
    await this.expenseService.uploadImage(this.uploadUrl.uploadUrl, this.selectedFile).toPromise();
    this.fetchExpense(this.expenseId);
    this.status = "Success";
    this.imageIcon = "done_all";
    setTimeout(() => {
      this.imageIcon = "cloud_upload";
      this.status = "Add Picture";
    }, 2000)
  }

  generateUploadUrl(expenseId: string): Promise<any> {
    return this.expenseService.getUploadUrl(expenseId).toPromise();
  }

  selectPicture() {
    this._elementRef.nativeElement.querySelector(`#fileInput`).click();
  }

  async deleteExpense(expenseId: any) {
    await this.expenseService.deleteExpense(expenseId).toPromise();
    this.messageService.showToast("Expense deleted successfully!", "notif-success");
    await this.expenseService.getExpenses().toPromise();
    await this.expenseService.getTotalSpent();
    await this.router.navigate(['/']);
  }

  openEditExpense(expense): void {
    const dialogRef = this.dialog.open(AddExpenseModalComponent, {
      width: '500px',
      data: {update: true, expenseData: expense}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchExpense(this.expenseId);
    });
  }

}
