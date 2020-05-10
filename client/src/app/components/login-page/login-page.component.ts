import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });
  }

  get f() { return this.loginForm.controls; }
  ngOnInit(): void {
  }


  onSubmit(user: User) {
    this.authService.login(user).subscribe(() => {
      this.authService.setUser({ username : user.username });
      this.router.navigate(['insights']);
    }, error => {
      if (error.error) {
        this.error = error.error;
      } else {
        this.error = 'An error happened during authentication.';
      }
    });
  }
}
