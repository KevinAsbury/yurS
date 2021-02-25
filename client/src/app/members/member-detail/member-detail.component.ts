import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Member } from 'src/app/_models/member'
import { MembersService } from 'src/app/_services/members.service'
import { NgxGalleryOptions } from '@kolkov/ngx-gallery'
import { NgxGalleryImage } from '@kolkov/ngx-gallery'
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery'

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  member: Member
  galleryOptions: NgxGalleryOptions[]
  galleryImages: NgxGalleryImage[]

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadMember()

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ]
  }

  /**
   *  Returns an array of images for a photo gallery
   *
   * @return {*}  {NgxGalleryImage[]}
   * @memberof MemberDetailComponent
   */
  getImages(): NgxGalleryImage[] {
    const imageUrls = []
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url,
      })
    }

    return imageUrls
  }

  /**
   * Subscribes to the member service, sets the member property, loads member's photo gallery
   *
   * @memberof MemberDetailComponent
   */
  loadMember() {
    this.memberService
      .getMember(this.route.snapshot.paramMap.get('username'))
      .subscribe((member) => {
        this.member = member
        this.galleryImages = this.getImages()
      })
  }
}
