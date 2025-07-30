import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Booking } from './models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL;
  private bookings: Booking[] = [];
  private bookingsUpdate = new Subject<Booking[]>();

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000';
  }

  get(uri: string){
    return this.http.get(`${this.ROOT_URL}/${uri}`)
  }

  post(uri: string, payload: Object) {
    return this.http.post(`${this.ROOT_URL}/destinations/book-now`, payload);
  }
  
  patch(uri: string, payload: Object) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload)
  }

  getDestination(id: string) {
    return this.http.get(`${this.ROOT_URL}/destinations/${id}`)
  }

  getDestinations(){
    return this.http.get(`${this.ROOT_URL}/destinations`)
  }

  postDestination(rui: string, payload: Object){
    return this.http.post(`${this.ROOT_URL}/destinations`, payload)
  }

  getUserData(id: string) {
    return this.http.get(`${this.ROOT_URL}/user/${id}`)
  }

  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }

  deleteDestination(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }

  login(email: string, password: string) {
    return this.http.post(`http://localhost:3000/user/login`, {
      email,
      password
    }, {
        observe: 'response'
      });
  }

  signup(email: string, password: string, name: string, lastName: string, phoneNumber: string) {
    return this.http.post(`http://localhost:3000/user/register`, {
      email,
      password,
      name,
      lastName,
      phoneNumber
    }, {
        observe: 'response'
      });
  }
}
