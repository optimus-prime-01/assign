

2. Install dependencies:

In the terminal, run the following commands:

```shellscript
npm init -y
npm install express pg bcrypt jsonwebtoken dotenv
npm install --save-dev nodemon
```


3. Set up the database:

a. Create a new database named 'railway_management'
b. In VS Code, create a new file 'db/schema.sql' and paste the following SQL:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE trains (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  source VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  total_seats INTEGER NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  train_id INTEGER REFERENCES trains(id),
  seat_number INTEGER NOT NULL,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

d. Run these SQL commands in your PostgreSQL database


4. Configure environment variables:

a. Create a new file named '.env' in the root of your project
b. Add the following content (replace with your actual values):

```plaintext
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/railway_management
JWT_SECRET=your_jwt_secret_here
ADMIN_API_KEY=your_admin_api_key_here
```


5. Create the necessary files and folders:

Create the following files and folders in your project:

```plaintext
railway-management-system/
├── db/
│   └── index.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── trains.js
│   └── bookings.js
├── .env
└── server.js
```

Copy the code for each file from the previous responses.


6. Update package.json:

Add the following script to your package.json file:

```json
"scripts": {
  "start": "nodemon server.js"
}
```


7. Run the server:

In the terminal, run:

```shellscript
npm start
```

You should see a message saying "Server is running on port 3000"


8. Test the API endpoints using Postman:

Now, let's test each endpoint:

a. Register a user:

1. Method: POST
2. URL: [http://localhost:3000/api/auth/register](http://localhost:3000/api/auth/register)
3. Body (raw JSON):

```json
{
  "username": "testuser",
  "password": "password123",
  "role": "user"
}
```




b. Login:

1. Method: POST
2. URL: [http://localhost:3000/api/auth/login](http://localhost:3000/api/auth/login)
3. Body (raw JSON):

```json
{
  "username": "testuser",
  "password": "password123"
}
```


4. Save the token from the response


c. Add a new train (admin only):

1. Method: POST
2. URL: [http://localhost:3000/api/trains](http://localhost:3000/api/trains)
3. Headers:

1. Authorization: Bearer `<token>`
2. x-api-key: `<your_admin_api_key>`



4. Body (raw JSON):

```json
{
  "name": "Express 1",
  "source": "City A",
  "destination": "City B",
  "total_seats": 100
}
```




d. Get seat availability:

1. Method: GET
2. URL: [http://localhost:3000/api/trains/availability?source=City](http://localhost:3000/api/trains/availability?source=City) A&destination=City B


e. Book a seat:

1. Method: POST
2. URL: [http://localhost:3000/api/bookings](http://localhost:3000/api/bookings)
3. Headers:

1. Authorization: Bearer `<token>`



4. Body (raw JSON):

```json
{
  "train_id": 1
}
```




f. Get booking details:

1. Method: GET
2. URL: [http://localhost:3000/api/bookings/1](http://localhost:3000/api/bookings/1)
3. Headers:

1. Authorization: Bearer `<token>`








For each request, you should see appropriate responses. If you encounter any errors, check the server console for more details.

Remember to replace `<token>` with the actual JWT token you received from the login response, and `<your_admin_api_key>` with the API key you set in your .env file.

This setup allows you to run and test your railway management system locally. You can continue to expand on this system by adding more features or improving existing ones.
