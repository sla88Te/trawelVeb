import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Booking } from 'src/app/models/booking.model';
import { Destination } from 'src/app/models/destination.model';
import { TaskService } from 'src/app/task.service';
import { WebRequestService } from 'src/app/web-request.service';

@Component({
  selector: 'app-book-now',
  templateUrl: './book-now.component.html',
  styleUrls: ['./book-now.component.css']
})
export class BookNowComponent implements OnInit {


  bookings: Booking[] = [];
  //private bookingSubscription: Subscription
  destination: Booking[] = [];
  startDate: Booking[] = [];
  endDate: Booking[] = [];
  numberOfGuests: Booking[] = [];

  des : Destination[] = [];
  destinations : Destination[] = [];
  type : Destination[] = [];
  description : Destination[] = [];
  price : Destination[] = [];

  filtersLoaded!: Promise<boolean>;

  public id!: string;
  public name!: string
  public lastName!: string
  public email!: string
  public phoneNumber!: string

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router, private authService: AuthService, private webReqService: WebRequestService) {}

  async ngOnInit() {
  
    this.taskService.getBookings().subscribe((bookings: any) => {
      this.bookings = bookings;
    })
    
    
    this.route.params.subscribe((params: Params) => {
      if(params['id']){
        this.taskService.getDestinationT(params['id']).subscribe(() => {
          this.router.navigate(['/destinations', params['id']]);
          //this.des = des;
          this.taskService.getDes(params['id']).subscribe((des: any) => {
            this.des = des;
            this.destinations = des.destinations;
            this.description = des.description;
            this.price = des.price;
            this.webReqService.getUserData(this.id).subscribe((params: Params) => {
              this.name = params['name'];
              this.lastName = params['lastName'];
              this.phoneNumber = params['phoneNumber'] as string;
              this.email = params['email'];
            })
            this.filtersLoaded = Promise.resolve(true);
          })
          
        })
      } else{
        this.des = undefined || [];
        
      }
      this.id = this.authService.getUserId() as string;
    })
    
  }
//, name: string, lastName: string, email: string, phoneNumber: number
  createBooking(destination: string, startDate: string, endDate: string, numberOfGuests: string) {
    
    this.taskService.createBooking( destination, startDate, endDate, numberOfGuests, this.name, this.lastName, this.email, this.phoneNumber).subscribe((response: any) => {
      console.log(response);
      
    })
    
  }

}
