import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
  onSignupButtonClicked(email: string, password: string, name: string, lastName: string, phoneNumber: string) {
    this.authService.signup(email, password, name, lastName, phoneNumber).subscribe((res: HttpResponse<any>) => {
      console.log(res);
      this.router.navigate(['/']);
      window.location.reload()
    });
  }

}
