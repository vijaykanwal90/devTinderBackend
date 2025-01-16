AuthRouter
-POST /signup
-POST /login
-POST /logout

profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/resetPassword and forgot password

connectionRequestRouter
-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

-GET /connections
-GET /requests/received
-GET /feed -Gets you the profiles of other users on plattform

Status: ignore, interested, accepted, rejected
