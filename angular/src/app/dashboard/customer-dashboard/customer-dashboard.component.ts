import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {
  formFilters: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formFilters = this.fb.group({
      times: null
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    // Implement your refresh logic here
    console.log('Refreshing dashboard with filters:', this.formFilters.value);
  }
}
