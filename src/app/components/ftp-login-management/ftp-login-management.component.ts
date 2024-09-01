import { Component, OnInit } from '@angular/core';
import { Mp3FileService } from '../../services/mp3-file.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-ftp-login-management',
  templateUrl: './ftp-login-management.component.html',
  styleUrl: './ftp-login-management.component.scss'
})
export class FtpLoginManagementComponent implements OnInit{
  isLoggedIn = false;
  constructor(private ftpService: Mp3FileService, private route: Router, private storageService: StorageService) { }
  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.storageService.isLoggedIn()) {

    }else{
      this.route.navigateByUrl("/login");
    }
  }
  serverIP: any;
  username: any;
  password: any;
  changeFTPLogin(): void {
    console.log(this.serverIP);
    console.log(this.username);
    console.log(this.password);

    this.ftpService.updateFTPLogin(this.serverIP, this.username, this.password).subscribe(
      response => {
        console.log('Update successful:', response);
        // Optionally, handle success, e.g., show a success message
      },
      error => {
        console.error('Error updating FTP login:', error);
        // Optionally, handle error, e.g., show an error message
      }
    );
  }
}



