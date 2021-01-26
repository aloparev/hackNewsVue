export const UNKNOWN_ERROR = 'Something wrong!'

//when user not exist
export const AUTH_ERROR = 'Sorry, your credentials are wrong!'

//sign up
export const EMAIL_EXIST = 'Email already exist'
export const PASSWORT_SHORT =
  'Accept only passwords with a length of at least 8 characters'
export const SIGNUP_ERRORS = [PASSWORT_SHORT, EMAIL_EXIST]

//login
export const LOGIN_FAILED = 'Wrong email/password combination'
export const LOGIN_ERRORS = [LOGIN_FAILED]

//vote post
export const VOTE_UP_ALREADY = 'This user upvoted on that post already.'
export const VOTE_DOWN_ALREADY = 'This user downvoted on that post already.'
export const VOTE_ID_NOT_FOUND = 'No post with this ID found.'
export const VOTE_ERRORS = [
  VOTE_UP_ALREADY,
  VOTE_DOWN_ALREADY,
  AUTH_ERROR,
  VOTE_ID_NOT_FOUND,
]

//remove post
export const DELETE_AUTHOR = 'Only the author of the post may delete the post.'
export const DELETE_ERRORS = [DELETE_AUTHOR, AUTH_ERROR]
