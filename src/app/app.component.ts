import { Component, OnInit } from '@angular/core';
import { StorageService } from './services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private storageService: StorageService, private route: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      console.log(this.roles);
      
      this.username = user.userName;
      localStorage.setItem('username', user.userName);
      console.log(this.username);
      
      if (this.username == "admin") {
        this.isAdmin = false;
      } else {
        this.isClient = false;
      }
    }else{
      this.route.navigateByUrl('/login');
    }
  }
  title = 'CRVFTP';
  isLoggedIn = false;
  private roles: any[] = [{ roleName: '', roleDescription: '' }];
  username?: string;
  isAdmin = true;
  isClient = true;

  openNav(): void {
    const sidebar = document.getElementById("mySidebar");
    const main = document.getElementById("main");

    if (sidebar && main) {
      sidebar.style.width = "250px";
      main.style.marginLeft = "250px";
    }
  }

  closeNav(): void {
    const sidebar = document.getElementById("mySidebar");
    const main = document.getElementById("main");

    if (sidebar && main) {
      sidebar.style.width = "0";
      main.style.marginLeft = "0";
    }
  }
  logOut() {
    // this.route.navigateByUrl('login');
    this.storageService.clean();
    window.location.reload();
  
  }
}
