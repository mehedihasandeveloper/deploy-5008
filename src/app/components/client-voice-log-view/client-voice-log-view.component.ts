import { Component, OnInit } from '@angular/core';
import { CampaignPermission, Mp3FileService } from '../../services/mp3-file.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MP3FileInfo } from '../../model/MP3FileInfo';
declare var bootstrap: any;
@Component({
  selector: 'app-client-voice-log-view',
  templateUrl: './client-voice-log-view.component.html',
  styleUrl: './client-voice-log-view.component.scss'
})
export class ClientVoiceLogViewComponent implements OnInit {
  audioElement: HTMLAudioElement | null = null;
  campaignNames: string[] = [];
  currentDate: string = '';
  selectedDate: string = ''; // Use for date filter
  selectedCampaignName: string = ''; // Use for campaign name filter
  audioSource: string | undefined;
  audioDuration: { [key: string]: string } = {};
  isFiltered: boolean = false; // Flag to determine if filtering is applied
  isSearched: boolean = false; // Flag to determine if searching is applied
  searchTerm: string = ''; // Property to hold the search term
  mp3Files: MP3FileInfo[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 100; // Adjust if needed
  folderPath = '/'; // Set default or get from input

  constructor(private mp3FileService: Mp3FileService, private storageService: StorageService, private route: Router) { }

  ngOnInit(): void {
    const username = localStorage.getItem('username');
  
    if (this.storageService.isLoggedIn()) {
  
      if (username) {
        // Fetch campaign names by client
        this.mp3FileService.getCampaignNamesByClient(username).subscribe(
          (data) => {
            this.campaignNames = data.map(campaign => campaign.campaignName);
            // Call loadMP3Files after campaignNames is initialized
            this.loadMP3Files();
          },
          (error) => {
            console.error('Error fetching campaigns', error);
          }
        );
      } else {
        console.error('No username found in localStorage');
      }
  
      // Set the current date and initialize other variables
      this.setCurrentDate();
      this.selectedDate = '';
      this.selectedCampaignName = '';
      this.currentPage = 0;
      this.isFiltered = false;
      this.searchTerm = '';
      this.MSISDN = '';
      this.searchMSISDN;
      this.setupModalCloseListener();
    } else {
      this.route.navigateByUrl("/login");
    }
  }

  loadMP3Files(page: number = 0): void {
    const folderPath = `/${this.currentDate}/`;
  
    if (this.campaignNames.length === 0) {
      console.error('No campaign names available');
      return;
    }
  
    const selectedCampaignName = this.campaignNames[0];
  
    this.mp3FileService.listMP3FilesByFilter(folderPath, selectedCampaignName, page, this.pageSize).subscribe(response => {
      this.mp3Files = response.content.map((file, index) => {
        const phoneNumberPrefix = file.phoneNumber.startsWith('0') ? '88' : '880';
        return {
          ...file,
          sl: (page * this.pageSize) + index + 1,
          phoneNumber: `${phoneNumberPrefix}${file.phoneNumber}`,
          dateTime: this.convertToStandardDate(file.dateTime),
          formattedDuration: this.formatDuration(file.duration)
        };
      });
  
      this.totalElements = response.totalElements;
      this.totalPages = response.totalPages;
      this.currentPage = page;
    });
  }
  

  applyFilter(page: number = 0): void {
    if (!this.selectedDate || !this.selectedCampaignName) {
      alert("Please select date and campaign!")
      return;
    }

    const folderPath = `/${this.selectedDate}/`;
    this.isFiltered = true;

    this.mp3FileService.listMP3FilesByFilter(folderPath, this.selectedCampaignName, page, this.pageSize).subscribe(response => {
      this.mp3Files = response.content.map((file, index) => {
        const phoneNumberPrefix = file.phoneNumber.startsWith('0') ? '88' : '880';
        return {
          ...file,
          sl: (page * this.pageSize) + index + 1,
          phoneNumber: `${phoneNumberPrefix}${file.phoneNumber}`,
          dateTime: this.convertToStandardDate(file.dateTime),
          formattedDuration: this.formatDuration(file.duration)
        };
      });
      this.totalElements = response.totalElements;
      this.totalPages = response.totalPages;
      this.currentPage = page;
    });
  }

  onPageChange(page: number): void {
    if (this.isFiltered) {
      this.applyFilter(page);
    } else {
      this.loadMP3Files(page);
    }
  }
  
  MSISDN: any;
  searchDateMSISDN: any;
  searchMSISDN(page: number = 0): void {
    const folderPath = `/${this.searchDateMSISDN}/`;
    this.isSearched = true; // Set the flag to true
    this.mp3FileService.searchMP3Files(folderPath, this.MSISDN, page, this.pageSize).subscribe(response => {
      this.mp3Files = response.content.map((file, index) => {
        const phoneNumberPrefix = file.phoneNumber.startsWith('0') ? '88' : '880';
        return {
          ...file,
          sl: (page * this.pageSize) + index + 1,
          phoneNumber: `${phoneNumberPrefix}${file.phoneNumber}`,
          dateTime: this.convertToStandardDate(file.dateTime),
          formattedDuration: this.formatDuration(file.duration)
        };
      });
      this.totalElements = response.totalElements;
      this.totalPages = response.totalPages;
      this.currentPage = page;
    });
  }


  setCurrentDate(): void {
    const now = new Date();
    this.currentDate = formatDate(now, 'yyyy-MM-dd', 'en-US');
  }


  convertToStandardDate(dateTime: string): string {
    const year = dateTime.substring(0, 4);
    const month = dateTime.substring(4, 6);
    const day = dateTime.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  
  formatDuration(duration: number): string {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    // Format hours, minutes, and seconds to always be two digits
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  refresh(): void {
    this.ngOnInit();
  }

  downloadFile(fileName: string): void {
    let folderName: string;
    if (this.isFiltered) {
      folderName = this.selectedDate;
    } else {
      folderName = this.currentDate;
    }

    const fullPath = `${folderName}/${fileName}`;
    const encodedPath = encodeURIComponent(fullPath);
    window.open(`http://localhost:8080/download-mp3?fileName=${encodedPath}`);
  }

  playFile(fileName: string): void {
    let folderName: string;
    if (this.isFiltered) {
      folderName = this.selectedDate;
    } else {
      folderName = this.currentDate;
    }
    const fullPath = `${folderName}/${fileName}`;
    this.audioSource = `http://localhost:8080/download-mp3?fileName=${encodeURIComponent(fullPath)}`;

    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      // Force the audio to reload
      this.audioElement = modalElement.querySelector('audio') as HTMLAudioElement;
      if (this.audioElement) {
        this.audioElement.src = this.audioSource;
        this.audioElement.load();

        // Wait for metadata to be loaded
        this.audioElement.addEventListener('loadedmetadata', () => {
          this.audioDuration[fileName] = this.formatDuration(this.audioElement!.duration);
        });
      }
    }
  }
  setupModalCloseListener(): void {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      modalElement.addEventListener('hide.bs.modal', () => {
        if (this.audioElement) {
          this.audioElement.pause(); // Pause the audio when modal is closed
          this.audioElement.currentTime = 0; // Reset the audio to the start
        }
      });
    }
  }



  openModal(file: any) {
    console.log('Opening modal with file:', file); // Debugging line
    this.audioSource = file.fileName; 
    this.selectedFile = file; 
    this.comment = ''; 
  }
  
  
  postComment(): void {
    console.log('Selected file:', this.selectedFile);
    console.log('Comment:', this.comment);
  
    if (!this.comment || !this.selectedFile) {
      console.error('Comment or file details are missing');
      return;
    }
  
    const commentData = {
      fileName: this.selectedFile.fileName,
      dateTime: this.selectedFile.dateTime,
      phoneNumber: this.selectedFile.phoneNumber,
      campaignName: this.selectedFile.campaignName,
      agentId: this.selectedFile.agentId,
      duration: this.selectedFile.formattedDuration,
      comment: this.comment
    };
  
    this.mp3FileService.saveComment(commentData).subscribe(
      response => {
        console.log('Comment saved successfully', response);
      },
      error => {
        console.error('Error saving comment', error);
      }
    );
  }
  selectedFile: any; // Selected file details
  comment: string = ''; // Comment from textarea
}
