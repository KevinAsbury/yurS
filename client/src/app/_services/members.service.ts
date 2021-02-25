import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { of } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { Member } from '../_models/member'

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl
  members: Member[] = []

  constructor(private http: HttpClient) {}

  /**
   * Returns a user from the API
   *
   * @return {*}
   * @memberof MembersService
   */
  getMembers() {
    if (this.members.length > 0) return of(this.members)
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map((members) => {
        this.members = members
        return members
      }),
    )
  }

  /**
   * Returns a list of users from the API
   *
   * @param {string} username
   * @return {*}
   * @memberof MembersService
   */
  getMember(username: string) {
    const member = this.members.find((x) => x.userName === username)
    if (member !== undefined) return of(member)
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
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member)
        this.members[index] = member
      }),
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {})
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId)
  }
}
