import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { Booking } from './models/booking.model';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private bookingUpdate = new Subject<Booking[]>()

  constructor(private webReqService: WebRequestService, private authService: AuthService) { }

  getBookings() {
    return this.webReqService.get('booking');
  }

  getBookingUpdateListener(){
    return this.bookingUpdate.asObservable()
  }

  getBookingsById(id: string){
    return this.webReqService.get(`booking/${id}`)
  }

  getUser() {
    return this.authService.getUserId();
  }

  getDestinationT(id: string){
    return this.webReqService.getDestination(id);
  }

  getDes(id: string){
    return this.webReqService.get(`destinations/${id}`);
  }

  getDestinations(){
    return this.webReqService.getDestinations();
  }

  createDestination(destination: string, type: string, description: string, price: string){
    return this.webReqService.postDestination('destinations/',{ destination, type, description, price})
  }

  deleteDestination(id: string){
    return this.webReqService.deleteDestination(`destinations/${id}`);
  }

  createBooking(destination: string, startDate: string, endDate: string, numberOfGuests: string,
    name: string, lastName: string, email: string, phoneNumber: string) {
    // We want to send a web request to create a list
    return this.webReqService.post('book-now/', { destination, startDate, endDate, numberOfGuests, name, lastName, email, phoneNumber });
  }

  deleteBooking(id: string) {
    return this.webReqService.delete(`booking/${id}`);
  }

  updateBooking(id: string, destination: string){
    return this.webReqService.patch(`booking/${id}`, { destination });
  }
}
