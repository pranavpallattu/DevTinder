# api list

- POST /signup
- POST /login
- POST /logout

- GET   /profile/view
- PATCH /profile/edit
- PATCH /profile/password


- POST /request/send/interested/userId
- POST /request/send/ignored/userId
/request/send/:status/:toUserId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

/request/review/:status/:requestId

status : interested, ignored, accepted, rejected

- GET /user/connections
- GET /user/requests/received
- GET /user/feed  - Gets you all the profiles of users