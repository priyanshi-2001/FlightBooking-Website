# FlightBooking-Website
Goibibo Clone

Pages:- Flight Search on Landing Page After Clicking on Book now on Landing Page user will go to details filling page. User needs to enter details of passengers like name,address, seatClass Economy, Economy Premium, Business, Type of Booking as Student, Doctor, Army, etc. Click on Save details and Proceed. Then enter Baggage details for the passengers. Same Save details and proceed. Then enter foodDetails like whatever food to select for each passenger. Also we are keeping track of ticket fare, Student ,Army or Doctor discount, baggage cost and food cost. Then Seat Selection Page. User will select a user and then select a seat. We will show prices of seat also. The cost of seat after selecting is also tracked. Here we use web sockets to show real time data of seat booking. And using Mongoose Transactions(we are using mongodb cluster) to book seat in backend code because we are updating in 2 tables so if there is some error it will be aborted. After this Payment Page. User will see Payment amount and by Clicking on Pay Now Razorpay payment page will open. We are currently using staging mode. After this re - directed to AfterPayment Page.

Redis Caching for storing cities Data

Flight Status Change Email to Passengers:- Whenever a flight status is changed to Delayed all passengers of that flight will receive email of new timings. There is one admin login which can change flight Status. We are using findOneAndUpdate Middleware for this purpose. It will check before updating in flightStatus table that Status=='D' then it will send email.

Web Check In:- Cron jobs are running for this purpose. One will make sure that when 48 hours are left in flight time it will update flight STatus to open for web check in and email will be sent to those users of that flight. Second cron will update status to closing for web check in when 4 hours are left in flight. And it will send email to the users of that flight who still have not done web check in. Next cron job is to make flightSttus as web check in closed when only 1 hour is left in flight take off.

Web check in by user:-

For web check in user needs to login and click on View My Flights. They can see flights which are open for web check in. To see all bookings made by user they will click on See All FLights in same page. They can see all bookings ordered by date.
