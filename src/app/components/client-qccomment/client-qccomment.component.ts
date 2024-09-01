import { Component, OnInit } from '@angular/core';
import { Mp3FileService } from '../../services/mp3-file.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-qccomment',
  templateUrl: './client-qccomment.component.html',
  styleUrl: './client-qccomment.component.scss'
})
export class ClientQCCommentComponent implements OnInit{
  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.username = user.userName; 
    }
  }
  isLoggedIn = false;
  private roles: any[] = [{ roleName: '', roleDescription: '' }];
  username?: string;
  constructor(private route: Router, private storageService: StorageService, private mp3FileService: Mp3FileService) {}

}
