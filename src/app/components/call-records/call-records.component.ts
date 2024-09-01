import { Component, OnInit } from '@angular/core';

import { Mp3FileService } from '../../services/mp3-file.service';
import { formatDate } from '@angular/common';
import { MP3FileInfo } from '../../model/MP3FileInfo';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-call-records',
  templateUrl: './call-records.component.html',
  styleUrls: ['./call-records.component.scss']
})
export class CallRecordsComponent implements OnInit {

  constructor(private mp3FileService: Mp3FileService, private storageService: StorageService, private route: Router) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.setCurrentDate();
      this.loadMP3Files();
      this.selectedDate = '';
      this.selectedCampaignName = '';
      this.currentPage = 0;
      this.isFiltered = false;
      this.searchTerm = '';
      this.MSISDN = '';
      // this.searchDateMSISDN = '';
      this.searchMSISDN;
      this.setupModalCloseListener();
    } else {
      this.route.navigateByUrl("/login");
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

  currentDate: string = '';
  selectedDate: string = ''; // Use for date filter
  selectedCampaignName: string = ''; // Use for campaign name filter
  audioSource: string | undefined;
  audioDuration: { [key: string]: string } = {};
  isFiltered: boolean = false; // Flag to determine if filtering is applied
  isSearched: boolean = false; // Flag to determine if searching is applied
  searchTerm: string = ''; // Property to hold the search term

  setCurrentDate(): void {
    const now = new Date();
    this.currentDate = formatDate(now, 'yyyy-MM-dd', 'en-US');
  }

  convertToStandardDate(dateTime: string): string {
    // Assuming the format is yyyyMMdd-HHmmss, adjust if needed
    const datePart = dateTime.substring(0, 8); // yyyyMMdd
    const timePart = dateTime.substring(9); // HHmmss

    const year = datePart.substring(0, 4);
    const month = datePart.substring(4, 6);
    const day = datePart.substring(6, 8);

    return `${year}-${month}-${day} ${timePart.substring(0, 2)}:${timePart.substring(2, 4)}:${timePart.substring(4, 6)}`;
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

  // playFile(fileName: string): void {
  //   let folderName: string;
  //   if (this.isFiltered) {
  //     folderName = this.selectedDate;
  //   } else {
  //     folderName = this.currentDate;
  //   }
  //   const fullPath = `${folderName}/${fileName}`;
  //   this.audioSource = `http://localhost:8080/download-mp3?fileName=${encodeURIComponent(fullPath)}`;

  //   const modalElement = document.getElementById('exampleModal');
  //   if (modalElement) {
  //     const modal = new bootstrap.Modal(modalElement);
  //     modal.show();

  //     // Force the audio to reload
  //     const audioElement = modalElement.querySelector('audio') as HTMLAudioElement;
  //     if (audioElement) {
  //       audioElement.src = this.audioSource; // Update the src to reload
  //       audioElement.load();

  //       // Wait for metadata to be loaded
  //       audioElement.addEventListener('loadedmetadata', () => {
  //         this.audioDuration[fileName] = this.formatDuration(audioElement.duration);
  //       });
  //     }
  //   }
  // }

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

  audioElement: HTMLAudioElement | null = null;


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

  mp3Files: MP3FileInfo[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 100; // Adjust if needed
  folderPath = '/'; // Set default or get from input



  loadMP3Files(page: number = 0): void {
    const folderPath = `/${this.currentDate}/`;
    this.mp3FileService.listMP3Files(folderPath, page, this.pageSize).subscribe(response => {
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
    const folderPath = `/${this.selectedDate}/`;
    this.isFiltered = true; // Set the flag to true
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
}
