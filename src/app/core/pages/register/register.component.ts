import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  // تعريف الـ FormGroup مع validator صحيح
  registerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(35)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/)]),
    rePassword: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)])
  }, { validators: RegisterComponent.passwordMatchValidator() });

  constructor(private _AuthService: AuthService, private _Router: Router) {}

  // الـ static validator method
  static passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const rePassword = formGroup.get('rePassword')?.value;
      return password === rePassword ? null : { mismatch: true };
    };
  }

  // ارسال البيانات للتسجيل
  registerSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;

    this._AuthService.sendRegister(this.registerForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'OTP has been sent';
        this._Router.navigate(['/verify'], { queryParams: { email: this.registerForm.value.email } });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Registration failed. Please try again.';
      }
    });
  }
}
