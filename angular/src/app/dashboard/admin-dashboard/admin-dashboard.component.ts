import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminDashboardService, DashboardStats } from './admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  formFilters: FormGroup;
  stats: DashboardStats;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private dashboardService: AdminDashboardService
  ) {
    this.formFilters = this.fb.group({
      times: null
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    const times = this.formFilters.get('times')?.value;
    const startDate = times?.fromDate;
    const endDate = times?.toDate;

    this.dashboardService.getDashboardStats(startDate, endDate).subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.loading = false;
      }
    });
  }
}
