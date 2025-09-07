import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent {
  verifyForm: FormGroup = new FormGroup({
    code: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(6)
    ])
  });

  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  resendLoading: boolean = false;

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  verifySubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.verifyForm.invalid) {
      this.errorMessage = 'الرجاء إدخال الكود بشكل صحيح';
      return;
    }

    if (!this.email) {
      this.errorMessage = 'البريد الإلكتروني غير موجود';
      return;
    }

    this.isLoading = true;

    const payload = {
      email: this.email.trim(),
      code: this.verifyForm.value.code.trim()
    };

    console.log("Verify payload:", payload);

    this._AuthService.verifyCode(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success('تم تأكيد الحساب بنجاح ✅');
        setTimeout(() => {
          this._Router.navigate(['/login']);
        }, 1500);
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('فشل التحقق، حاول مرة أخرى.');
      }
    });
  }

  resendCode() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email) {
      this.errorMessage = 'البريد الإلكتروني غير موجود';
      return;
    }

    this.resendLoading = true;

    this._AuthService.resendCode({ email: this.email.trim() }).subscribe({
      next: () => {
        this.resendLoading = false;
        this.toastr.success('تم إرسال الكود مرة أخرى ✅');
      },
      error: () => {
        this.resendLoading = false;
        this.toastr.error('فشل إرسال الكود، حاول مرة أخرى.');
      }
    });
  }
}
