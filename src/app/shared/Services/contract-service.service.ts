import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../Base/environment/environment';

import { ContractProductResponse } from '../interfaces/contract-product-response';
import { UploadTemplateResponse } from '../interfaces/upload-template-response';
import { UserContractItem } from '../interfaces/user-contracts-response';
import { ContractItem } from '../interfaces/contracts-list-response';

@Injectable({
  providedIn: 'root'
})
export class ContractServiceService {

  private apiUrl = Environment.baseUrl || '';

  constructor(private http: HttpClient) { }

  getContracts(): Observable<ContractItem[]> {
    return this.http.get<ContractItem[]>(`${this.apiUrl}/api/Contracts`);
  }

  getContractProduct(id: number | string): Observable<ContractProductResponse> {
    return this.http.get<ContractProductResponse>(`${this.apiUrl}/api/Contracts/product/${id}`);
  }

  uploadTemplate(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('userToken') || '';

    return this.http.post<any>(`${this.apiUrl}/api/Contracts/fill-template`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }




  getUserContracts(): Observable<UserContractItem[]> {
  const token = localStorage.getItem('userToken') || '';
  return this.http.get<UserContractItem[]>(`${this.apiUrl}/api/Contracts/user-contracts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

}