import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Booking } from 'src/app/models/booking.model';
import { Destination } from 'src/app/models/destination.model';
import { TaskService } from 'src/app/task.service';
import { WebRequestService } from 'src/app/web-request.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public userEmail!: string;

  bookings: Booking[] = [];

  
  des : Destination[] = [];
  destinations : Destination[] = [];
  type : Destination[] = [];
  description : Destination[] = [];
  price : Destination[] = [];

  filtersLoaded!: Promise<boolean>;

  selectedBooking!: string;
  booking!: Booking[];

  public id!: string;


  showBooking!: boolean;
  showDestination!: boolean;

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router, private authService: AuthService, private webReqService: WebRequestService) {}

  async ngOnInit() {
    
    this.userEmail = this.authService.getEmail() as string;
    if(this.userEmail != 'admin@admin.com'){
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      })
    }

  }

  onclickGetBookings(){
    this.taskService.getBookings().subscribe((bookings : any) => {
      this.bookings = bookings;
      this.showBooking = true;
      this.showDestination = false;
    })
  }

  onClickDestinations(){
    this.taskService.getDestinations().subscribe((destinations : any) => {
      this.des = destinations;
      this.showDestination = true;
      this.showBooking = false;
    })
  }

  deleteDestination(id: string){
    this.taskService.deleteDestination(id).subscribe((res: any) => {
      this.des = this.des.filter(val => val._id !== id)
    })
  }

  deleteBooking(id: string) {
    this.taskService.deleteBooking(id).subscribe((res: any) => {
      this.bookings = this.bookings.filter(val => val._id !== id)
    })
  }
}
