import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  step: number = 1; 
  forgetForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private _AuthService: AuthService, 
    private _Router: Router, 
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: [''],
      newPassword: [''],
      confirmPassword: ['']
    });

    this.setValidatorsForStep();
  }

  setValidatorsForStep(): void {
    if (this.step === 2) {
      this.forgetForm.get('code')?.setValidators([Validators.required]);
    } else if (this.step === 3) {
      this.forgetForm.get('newPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.forgetForm.get('confirmPassword')?.setValidators([Validators.required]);
    }
    Object.keys(this.forgetForm.controls).forEach(key => {
      this.forgetForm.get(key)?.updateValueAndValidity();
    });
  }

  sendOtp(): void {
    if (this.forgetForm.get('email')?.invalid) return;

    this.loading = true;
    this._AuthService.sendResetOtp(this.forgetForm.value.email).subscribe({
      next: () => {
        this.step = 2;
        this.setValidatorsForStep();
        this.loading = false;
        this.toastr.success('تم إرسال OTP بنجاح ✅');
      },
      error: () => {
        this.loading = false;
        this.toastr.error('فشل في إرسال OTP، تأكد من البريد الإلكتروني.');
      }
    });
  }

  verifyOtp(): void {
    const { email, code } = this.forgetForm.value;
    if (!email || !code) return;

    this.loading = true;
    this._AuthService.verifyOtp(email, code).subscribe({
      next: () => {
        this.step = 3;
        this.setValidatorsForStep();
        this.loading = false;
        this.toastr.success('تم التحقق من OTP بنجاح ✅');
      },
      error: () => {
        this.loading = false;
        this.toastr.error('رمز OTP غير صحيح.');
      }
    });
  }

  resetPassword(): void {
    const { email, code, newPassword, confirmPassword } = this.forgetForm.value;
    if (!newPassword || newPassword !== confirmPassword) {
      this.toastr.error('كلمة المرور غير متطابقة');
      return;
    }

    this.loading = true;
    this._AuthService.resetPassword(email, code, newPassword, confirmPassword).subscribe({
      next: () => {
        this.toastr.success('تم تغيير كلمة المرور بنجاح!✅');
        this.forgetForm.reset();
        this.step = 1;
        this.setValidatorsForStep();
        this.loading = false;
        this._Router.navigate(['/login']);
      },
      error: () => {
        this.loading = false;
        this.toastr.error('حدث خطأ أثناء إعادة التعيين، حاول مرة أخرى.');
      }
    });
  }
}
