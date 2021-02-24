import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { Member } from '../_models/member'

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }


  /**
   * Returns a user from the API
   *
   * @return {*} 
   * @memberof MembersService
   */
  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users')
  }
  
  /**
   * Returns a list of users from the API
   *
   * @param {string} username
   * @return {*} 
   * @memberof MembersService
   */
  getMember(username: string) {
    return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }

  /**
   * Updates the API with new user information
   *
   * @param {Member} member
   * @return {*} 
   * @memberof MembersService
   */
  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member)
  }
}
