import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Mp3FileService, UserDto } from '../../services/mp3-file.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit{
  isLoggedIn = false;
  constructor(private mp3FileService: Mp3FileService, private storageService: StorageService, private route: Router) { }
  
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      
    } else{
      this.route.navigateByUrl("/login");
    }
  }

  user: UserDto = {
    username: '',
    password: '',
    email: '',
    userFirstName: '',
    userLastName: '',
  };

  onSubmit() {
    this.mp3FileService.registerClient(this.user).subscribe(
      response => {
        console.log('User registered successfully!', response);
        alert(response.message);
        this.route.navigateByUrl('/callRecords');
        // Handle successful registration, e.g., show a message, redirect, etc.
      },
      error => {
        console.error('Error registering user', error);
        alert(error.message);
        // Handle error, e.g., show an error message
      }
    );
  }

}
