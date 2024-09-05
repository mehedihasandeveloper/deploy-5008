import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Mp3FileService } from '../../services/mp3-file.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {


  constructor(private fb: FormBuilder, private route: Router, private storageService: StorageService, private mp3FileService: Mp3FileService) {
    this.adminLoginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.clientLoginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
      const wrapper = document.querySelector('.wrapper');
      const signUpLink = document.querySelector('.signUp-link');
      const signInLink = document.querySelector('.signIn-link');

      signUpLink?.addEventListener('click', () => {
        wrapper?.classList.add('animate-signIn');
        wrapper?.classList.remove('animate-signUp');
      });

      signInLink?.addEventListener('click', () => {
        wrapper?.classList.add('animate-signUp');
        wrapper?.classList.remove('animate-signIn');
      });

      if (this.storageService.isLoggedIn()) {
        this.isLoggedIn = true;
        this.username = this.storageService.getUser().userName;
        if (this.username == "admin") {
          this.route.navigateByUrl("/callRecords");
        } else {
          this.route.navigateByUrl("/clientCallRecords");
        }
        this.roles = this.storageService.getUser().roles;
        this.campaignName = localStorage.getItem('campaignName');
      }else{
        // this.route.navigateByUrl('');
      }
    
      
  }
  isLoggedIn = false;
  validationMessage: string = '';
  isAgentLogin: boolean = true;
  clientLoginForm: FormGroup;
  adminLoginForm!: FormGroup;
  username: string = '';
  isLoginFailed = false;
  roles: any[] = [];
  errorMessage = '';
  campaignName: string | null = '';

  onAdminSubmit() {
    if (this.adminLoginForm.valid) {
      const { username, password } = this.adminLoginForm.value;

      // Set a timeout of 50 seconds
      const timeoutId = setTimeout(() => {
        this.errorMessage = 'Login failed! Wrong username or password.';
        this.isLoginFailed = true;
      }, 7000); // 50 seconds

      this.mp3FileService.login(username, password).subscribe({
        next: data => {
          // Clear the timeout if the login is successful
          clearTimeout(timeoutId);

          this.reloadPage();
          this.storageService.saveUser(data);
          this.isLoggedIn = true;
          this.roles = this.storageService.getUser().roles;
          this.username = this.storageService.getUser().userName;
          // this.route.navigateByUrl('/callRecords');
        },
        error: err => {
          clearTimeout(timeoutId); // Clear the timeout if the login fails before 50 seconds
          this.errorMessage = 'Login Failed!';
          this.isLoginFailed = true;
        }
      });
    }
  }

  onClientSubmit() {
    if (this.clientLoginForm.valid) {
      const { username, password } = this.clientLoginForm.value;

      // Set a timeout of 50 seconds
      const timeoutId = setTimeout(() => {
        this.errorMessage = 'Login failed! Wrong username or password.';
        this.isLoginFailed = true;
      }, 7000); // 50 seconds

      this.mp3FileService.loginClient(username, password).subscribe({
        next: data => {
          // Clear the timeout if the login is successful
          clearTimeout(timeoutId);

          this.reloadPage();
          this.storageService.saveUser(data);
          this.isLoggedIn = true;
          this.roles = this.storageService.getUser().roles;
          this.username = this.storageService.getUser().userName;
          // this.route.navigateByUrl('/callRecords');
        },
        error: err => {
          clearTimeout(timeoutId); // Clear the timeout if the login fails before 50 seconds
          this.errorMessage = 'Login Failed!';
          this.isLoginFailed = true;
        }
      });
    }
  }
  reloadPage(): void {
    window.location.reload();
  }
}
