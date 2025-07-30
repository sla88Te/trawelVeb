import { Component, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { WebRequestService } from '../web-request.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private webReqService: WebRequestService) { }

  public userEmail!: string;
  public isLoogedIn!: boolean;
  public notLoggedIn!: boolean;
  
  public id!: string;
  public name! : string;
  public lastName!: string;
  public phoneNumber!: string;
  isAdmin!: boolean;

  ngOnInit() {
    
    this.userEmail = this.authService.getEmail() as string;

    //this.loggedin = this.authService.isLoggedIn

    if(this.userEmail) {
      this.isLoogedIn = true;
      this.id = this.authService.getUserId() as string;
      this.webReqService.getUserData(this.id).subscribe((params: Params) => {
        this.name = params['name'];
        this.lastName = params['lastName']
        this.phoneNumber = params['phoneNumber']
        if(this.userEmail == "admin@admin.com"){
          this.isAdmin = true;
        }else{
          this.isAdmin = false;
        }
      })
      
    } else {
      this.notLoggedIn = true;
    }
  }
  
  onClickLogout(){
    this.authService.logout();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    })
    
  }

}
