import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
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
