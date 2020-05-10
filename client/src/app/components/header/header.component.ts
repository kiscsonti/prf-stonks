import { Component, OnInit } from '@angular/core';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faChartLine = faChartLine;
  faUser = faUser;

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.authService.unsetUser();
      this.router.navigate(['']);
    }, error => {
      if (error.error === 'Log in, before you log out') {
        this.authService.unsetUser();
      } else {
        this.snackBar.open('An unexpected error happened while logging out.', null, {
          duration: 3000,
          panelClass: ['snack-bar']
        });
      }
    });
  }

}
