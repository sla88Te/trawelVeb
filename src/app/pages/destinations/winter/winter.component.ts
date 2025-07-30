import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Destination } from 'src/app/models/destination.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-winter',
  templateUrl: './winter.component.html',
  styleUrls: ['./winter.component.css']
})
export class WinterComponent implements OnInit {

  constructor(private authService: AuthService, private taskService: TaskService) { }

  des : Destination[] = [];
  destinations : Destination[] = [];
  type : Destination[] = [];
  description : Destination[] = [];
  price : Destination[] = [];

  filtersLoaded!: Promise<boolean>;

  public userEmail!: string;
  public isLoogedIn!: boolean;
  public notLoggedIn!: boolean;

  cities : string[] = [];
  
 ngOnInit() {
    
  this.userEmail = this.authService.getEmail() as string;

    if(this.userEmail) {
      this.isLoogedIn = true;
    } else {
      this.notLoggedIn = true;
    }

    this.taskService.getDestinations().subscribe((des : any) => {
      this.des = des;
      this.destinations = des.destinations;
    })

    this.filtersLoaded = Promise.resolve(true);
  }

}
