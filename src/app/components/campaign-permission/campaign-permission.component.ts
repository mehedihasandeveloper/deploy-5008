import { Component, OnInit } from '@angular/core';
import { Mp3FileService } from '../../services/mp3-file.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-campaign-permission',
  templateUrl: './campaign-permission.component.html',
  styleUrl: './campaign-permission.component.scss'
})
export class CampaignPermissionComponent implements OnInit {
  usernames: string[] = [];
  userForm!: FormGroup;
  isLoggedIn = false;
  constructor(
    private ftpService: Mp3FileService,
    private route: Router,
    private storageService: StorageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.storageService.isLoggedIn()) {
      this.userForm = this.fb.group({
        username: [''],
        campaignName: ['']  // Add other form controls if needed
      });
      this.loadUsernames();
    }else{
      this.route.navigateByUrl("/login");
    }
  }

  loadUsernames(): void {
    this.ftpService.getNonAdminUsernames().subscribe(
      (data: { username: string }[]) => {
        this.usernames = data.map(user => user.username);
      },
      (error) => {
        console.error('Error fetching usernames', error);
      }
    );
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const campaignPermission = this.userForm.value;
      this.ftpService.allowCampaignPermission(campaignPermission).subscribe(
        (response) => {
          console.log('Campaign permission allowed:', response);
          alert('Campaign permission successfully granted!');
          // You can add navigation or other actions here
          this.ngOnInit();
        },
        (error) => {
          console.error('Error allowing campaign permission', error);
          alert('Failed to grant campaign permission.');
        }
      );
    }
  }
}
