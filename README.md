# TechHorizon-API

The TechHorizon-API is the backend server for the TechHorizon website. It serves as the backbone for managing data and providing APIs to facilitate interactions with the TechHorizon platform.

## Features

- **Express.js**: A fast and lightweight Node.js framework for building the backend.
- **MongoDB**: A NoSQL database to store and manage data.
- **CORS**: Middleware to enable secure cross-origin resource sharing.
- **Environment Variables**: Configured using dotenv for secure and flexible configuration.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd TechHorizon-API
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:

   ```env
   MONGO_URI=<your-mongodb-connection-string>
   PORT=5000
   ```

### Running the Server

1. Start the server in development mode:

   ```bash
   npm run dev
   ```

2. Or, start the server in production mode:

   ```bash
   npm start
   ```

3. The server will run on `http://localhost:5000` by default (or the port specified in the `.env` file).

### Testing the Server

- Visit the base endpoint in your browser or API testing tool:

````GET http://localhost:5000/

  ```  Response:

  ```json
  "Welcome to the TechHorizon API"
````

## Project Structure

```plaintext
TechHorizon-API/
├── routes/          # API route handlers (to be added)
├── models/          # Mongoose models (to be added)
├── config/          # Configuration files (optional)
├── .env             # Environment variables
├── server.js        # Main server file
```

## Future Development

- **User Authentication**: Implement secure login and registration.
- **Event Management**: Add routes to manage events and resources.
- **Admin Features**: Create APIs for managing the TechHorizon platform.

## Contributing

1. Fork the repository.
2. Create a feature branch:

   ```bash
      git checkout -b feature-name
   ```

3. Commit your changes:

   ```bash
      git commit -m "Description of changes"
   ```

4. Push to your fork:

   ```bash
      git push origin feature-name
   ```

5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or contributions, feel free to reach out to the TechHorizon team!
