import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { TaskService } from 'src/app/task.service';
import { WebRequestService } from 'src/app/web-request.service';

@Component({
  selector: 'app-new-destination',
  templateUrl: './new-destination.component.html',
  styleUrls: ['./new-destination.component.css']
})
export class NewDestinationComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router, private authService: AuthService, private webReqService: WebRequestService) { }

  ngOnInit(): void {
  }

  createDestination(destination: string, type: string, description: string, price: string){
    this.taskService.createDestination(destination, type, description, price).subscribe((response: any) => {
      console.log(response);
    })
    this.router.navigate(['/user/admin']);
  }

}
