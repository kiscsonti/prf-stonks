import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { flatMap } from 'rxjs/operators';
import { MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  registerForm: FormGroup;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]],
      confirmPassword: ['', [
        Validators.required
      ]]
    }, {
      validator: this.passwordsMustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.registerForm.controls; }
  ngOnInit(): void {
  }


  onSubmit(user: User) {
    this.authService.register(user).pipe(
      flatMap( data => {
        this.authService.setUser({ username : user.username });
        return this.authService.login(user);
      })
    ).subscribe(() => {
        this.authService.setUser(user);
        this.router.navigate(['insights']);
        this.snackBar.open('Registration successful.', null, {
          duration: 2000,
          panelClass: ['snack-bar']
        });
      }, error => {
        if (error.error.name === 'MongoError') {
          this.error = 'This username is already in use.';
        } else {
          this.error = 'An error has happened during the registration process';
        }
    });
  }

  passwordsMustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}

