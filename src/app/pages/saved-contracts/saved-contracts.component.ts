import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ContractServiceService } from '../../shared/Services/contract-service.service';
import { UserContractItem } from '../../shared/interfaces/user-contracts-response';

@Component({
  selector: 'app-saved-contracts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './saved-contracts.component.html',
  styleUrls: ['./saved-contracts.component.css']
})
export class SavedContractsComponent implements OnInit {
  userContracts: UserContractItem[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private contractService: ContractServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserContracts();
  }

  fetchUserContracts(): void {
    this.loading = true;
    this.contractService.getUserContracts().subscribe(
      (res: UserContractItem[]) => {
        this.userContracts = res;
        this.loading = false;
      },
      (err) => {
        this.error = 'حدث خطأ أثناء تحميل العقود';
        console.error(err);
        this.loading = false;
      }
    );
  }
}
