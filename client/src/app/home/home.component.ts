import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  
  constructor() { }

  ngOnInit(): void { }

  /**
   * Toggles registration mode
   *
   * @memberof HomeComponent
   */
  registerToggle() {
    this.registerMode = !this.registerMode;
  }


  /**
   * Set registration mode to true or false
   *
   * @param {boolean} event
   * @memberof HomeComponent
   */
  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
}
