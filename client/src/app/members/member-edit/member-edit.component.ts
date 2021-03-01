import { Component, HostListener, OnInit, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { take } from 'rxjs/operators'
import { Member } from 'src/app/_models/member'
import { User } from 'src/app/_models/user'
import { AccountService } from 'src/app/_services/account.service'
import { MembersService } from 'src/app/_services/members.service'

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm
  member: Member
  user: User
  genderList = [
    { value: 'male', display: 'Male' },
    { value: 'female', display: 'Female' },
    { value: '', display: 'Expansive' },
  ]
  orientationList = [
    { value: 'straight', display: 'Straight' },
    { value: 'bisexual', display: 'Bisexual' },
    { value: 'gay', display: 'Gay' },
    { value: '', display: 'Expansive' }
  ]
  relationshipStatusList = [
    { value: 'single', display: 'Single' },
    { value: 'dating', display: 'Dating' },
    { value: 'open', display: 'Open' },
    { value: 'poly', display: 'Polyamorous' },
    { value: 'complicated', display: "It's complicated" },
    { value: 'married', display: "Married" },
  ]
  pronounsList = [
    { value: 'he/him', display: 'He/Him' },
    { value: 'she/her', display: 'She/Her' },
    { value: 'they/them', display: 'They/Them' },
    { value: '', display: 'Expansive' }
  ]
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any,
  ) {
    if (this.editForm.dirty) {
      $event.returnValue = true
    }
  }

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private toastr: ToastrService,
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user))
  }

  ngOnInit(): void {
    this.loadMember()
  }

  loadMember() {
    this.memberService.getMember(this.user.userName).subscribe((member) => {
      this.member = member
    })
  }

  updateMember() {
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastr.success('Profile updated')
      this.editForm.reset(this.member)
    })
  }
}
