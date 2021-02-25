import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ɵɵsetComponentScope,
} from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { AccountService } from '../_services/account.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter()
  model: any = {}

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {}

  /**
   * Registers a new user using the AccountService
   *
   */
  register() {
    this.accountService.register(this.model).subscribe(
      (response) => {
        console.log(response)
        this.cancel
      },
      (error) => {
        console.log(error)
        this.toastr.error(error.error)
      },
    )
  }

  /**
   * Emits a registration cancelation when cancel button is clicked
   *
   */
  cancel() {
    this.cancelRegister.emit(false)
  }
}
