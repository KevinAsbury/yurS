import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ReplaySubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { User } from '../_models/user'

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl
  private currentUserSource = new ReplaySubject<User>(1)
  currentUser$ = this.currentUserSource.asObservable()

  constructor(private http: HttpClient) { }

  /**
   * Connect to the API and login
   *
   * @param {*} model The user login data
   * @return {*} The response in a JSON format Observerable
   * @memberof AccountService
   */
  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response
        if (user) {
          this.setCurrentUser(user)
        }
      })
    )
  }

  /**
   * Connect to the API and register a new user
   *
   * @param {*} model The user registration data
   * @return {*} User as a JSON response Observable
   * @memberof AccountService
   */
  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          this.setCurrentUser(user)
        }
      })
    )
  }

  /**
   * Add the current user to the ReplaySubject.
   *
   * @param {User} user
   * @memberof AccountService
   */
  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
    this.currentUserSource.next(user)
  }

  /**
   * Logout by removing user from local storage and setting the ReplaySubject to null.
   *
   * @memberof AccountService
   */
  logout() {
    localStorage.removeItem('user')
    this.currentUserSource.next(null)
  }
}
