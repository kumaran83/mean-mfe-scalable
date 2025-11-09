import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(
        this.loginForm.value.username,
        this.loginForm.value.password
      ).subscribe(
        response => {
          this.loading = false;
          console.log('Login successful');
          this.router.navigateByUrl('/?login=1', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/']);
          });
        },
        error => {
          this.loading = false;
          console.error('Login failed', error);
        }
      );
    }
  }
}