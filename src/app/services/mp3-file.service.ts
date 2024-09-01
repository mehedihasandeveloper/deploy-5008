import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
// import { MP3FileInfo } from '../model/MP3FileInfo';

interface MP3FileInfo {
  dateTime: string;
  phoneNumber: string;
  campaignName: string;
  agentId: string;
  fileName: string;
  duration: number;
}

interface MP3FilePage {
  content: MP3FileInfo[];
  totalElements: number;
  totalPages: number;
  size: number;
  first: boolean;
  last: boolean;
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class Mp3FileService {
  private apiUrl = 'http://43.231.78.77:5008/list-mp3-files'; 
  private apiUrlFilter = 'http://43.231.78.77:5008/list-mp3-files-by-filter';
  private url = 'http://43.231.78.77:5008';
  private FTPLogin = 'http://43.231.78.77:5008/api/FTPLogin/editFTPLogin';

  constructor(private http: HttpClient) { }


  listMP3Files(folderPath: string, page: number, size: number): Observable<MP3FilePage> {
    const params = new HttpParams()
      .set('folderPath', folderPath)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<MP3FilePage>(this.apiUrl, { params });
  }

  listMP3FilesByFilter(folderPath: string, campaignName: string, page: number, size: number): Observable<MP3FilePage> {
    const params = new HttpParams()
      .set('folderPath', folderPath)
      .set('campaignName', campaignName)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<MP3FilePage>(this.apiUrlFilter, { params });
  }

  searchMP3Files(directory: string, msisdn: string, page: number, size: number): Observable<MP3FilePage> {
    let params = new HttpParams().set('directory', directory)
      .set('msisdn', msisdn)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<MP3FilePage>(this.url + '/search', { params });
  }

  updateFTPLogin(server: string, username: string, password: string): Observable<any> {
    const body = {
      server: server,
      username: username,
      password: password
    };

    return this.http.put<any>(this.FTPLogin, body);
  }
 
  login(username: string, password: string): Observable<any> {
    return this.http.post(this.url+ '/api/auth/signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  loginClient(username: string, password: string): Observable<any> {
    return this.http.post(this.url+ '/api/auth/signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  registerClient(user: UserDto): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.url + '/api/auth/client/signup', user, { headers })
      .pipe(
        catchError(this.handleError<any>('registerClient'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(error);
    };
  }

  allowCampaignPermission(campaignPermission: any): Observable<any> {
    return this.http.post<any>(`${this.url}/api/campaignPermission/allowPermission`, campaignPermission);
  }

  getNonAdminUsernames(): Observable<{ username: string }[]> {
    return this.http.get<{ username: string }[]>(`${this.url}/api/users/getAllNonAdminUsers`);
  }

  getCampaignNamesByClient(username: string): Observable<CampaignPermission[]> {
    return this.http.get<CampaignPermission[]>(`${this.url}/api/campaignPermission/getCampaignNamesByClient?username=${encodeURIComponent(username)}`);
  }

  // private baseUrl: string = '/api/CommentData'; // Base URL for your API

  // // Method to save a comment
  // saveComment(commentData: any): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/save-comment`, commentData);
  // }

}

export interface UserDto {
  username: string;
  email: string;
  password: string;
  userFirstName: string;
  userLastName: string;
  roles?: string[];
}

export interface CampaignPermission {
  id: number;
  username: string;
  campaignName: string;
}