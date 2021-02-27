import { User } from "./user"

export class UserParams {
    gender: string
    minAge = 18
    maxAge = 99
    pageNumber = 1
    pageSize = 5
    orderBy = 'lastActive'
    orientation: string

    constructor(user: User) {
        this.gender = ''
        this.orientation = ''

        // Check users orientation to determine preset filters
        if (user.orientation == 'gay') {
            this.orientation = user.orientation
            if (user.gender == 'male') {
                this.gender = 'male'
            }
            if (user.gender == 'female') {
                this.gender = 'female'
            }
        }

        if (user.orientation == 'straight') {
            this.orientation = user.orientation
            if (user.gender == 'male') {
                this.gender = 'female'
            }
            if (user.gender == 'female') {
                this.gender = 'male'
            }
        }
        
    }
}