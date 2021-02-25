import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ɵɵsetComponentScope,
} from '@angular/core'
import { AbstractControl, ControlContainer, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms'
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
  registerForm: FormGroup

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.initializeForm()
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password'), Validators.minLength(4), Validators.maxLength(20)]),
    })

    // Check password field for changes and make confirmPassword field aware of change
    // just in case someone changes the password field after confirming password match
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity()
    })
  }

  
  /**
   * Compare confirm password control with password you want to match to
   * if passwords match return null meaning validation passed else return isMatching true
   * 
   * @param {string} matchTo
   * @return {*}  {ValidatorFn}
   */
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true }
    }
  }

  /**
   * Registers a new user using the AccountService
   *
   */
  register() {
    // this.accountService.register(this.model).subscribe(
    //   (response) => {
    //     console.log(response)
    //     this.cancel
    //   },
    //   (error) => {
    //     console.log(error)
    //     this.toastr.error(error.error)
    //   },
    // )
  }

  /**
   * Emits a registration cancelation when cancel button is clicked
   *
   */
  cancel() {
    this.cancelRegister.emit(false)
  }
}
