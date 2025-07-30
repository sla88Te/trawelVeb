import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Booking } from 'src/app/models/booking.model';
import { Destination } from 'src/app/models/destination.model';
import { TaskService } from 'src/app/task.service';
import { WebRequestService } from 'src/app/web-request.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  bookings: Booking[] = [];
  //private bookingSubscription: Subscription
  _id: Booking[] = [];
  destination: Booking[] = [];
  startDate: Booking[] = [];
  endDate: Booking[] = [];
  numberOfGuests: Booking[] = [];
  name: Booking[] = [];
  lastName : Booking[] = [];
  email : Booking[] = [];
  phoneNumber : Booking[] = [];

  des : Destination[] = [];
  destinations : Destination[] = [];
  description : Destination[] = [];
  price : Destination[] = [];

  filtersLoaded!: Promise<boolean>;

  selectedBooking!: string;

  public id!: string;


  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router, private authService: AuthService, private webReqService: WebRequestService) {}

  ngOnInit() {


    this.taskService.getBookings().subscribe((bookings: any) => {
      this.bookings = bookings;
    })
    this.route.params.subscribe((params: Params) => {
      this.selectedBooking = params['_id'] as string;
    })
    console.log(this.selectedBooking);
    

  }

  deleteBooking(id: string) {
    this.taskService.deleteBooking(id).subscribe((res: any) => {
      this.bookings = this.bookings.filter(val => val._id !== id)
    })
  }

}
