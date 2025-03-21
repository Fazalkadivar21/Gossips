# Gossips - A Secure Chat Platform for Cat Lovers

Gossips is a secure, real-time chat application designed for cat lovers! Built with modern technologies, it ensures smooth communication through polling-based message fetching and secure password encryption.

## Features

- **User Authentication**: Secure login and registration with password encryption.
- **Real-time Chat**: Polling-based message retrieval for seamless communication.
- **Profile Management**: View and update user profile pictures and last seen status.
- **User Search**: Easily find and connect with other cat enthusiasts.
- **Theming**: Toggle between light and dark modes for a comfortable chat experience.

## Tech Stack

### Frontend:
- **React** (TypeScript) - For a responsive and interactive UI
- **Tailwind CSS** - For a modern and lightweight styling approach
- **Vite** - For optimized build performance

### Backend:
- **PHP** - Server-side logic and secure authentication
- **MySQL** - Relational database for storing user and chat data
- **Axios & Fetch API** - For efficient API calls

## Installation

### Prerequisites
- Node.js & npm
- PHP & MySQL
- A running MySQL database with appropriate tables

### Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/fazalkadivar21/Gossips.git
   cd fazalkadivar21-Gossips
   ```

2. **Backend Configuration:**
   - Navigate to the `backend/` folder and configure the `db_connection.php` file with your MySQL database credentials.

3. **Frontend Setup:**
   - Navigate to the `frontend/` folder and install dependencies:
     ```sh
     npm install
     ```
   - Start the development server:
     ```sh
     npm run dev
     ```

4. **Database Migration:**
   - Import the provided SQL dump into your MySQL database to set up the required tables.

## Security Measures

- **Password Encryption**: Uses secure hashing methods to store user credentials.
- **Secure Database Access**: Prevents SQL injection with prepared statements.
- **Limited Data Exposure**: Only necessary user data is exposed via APIs.

## Future Enhancements

- WebSockets for real-time message updates instead of polling.
- Message Reactions and Typing Indicators.
- Profile Customization Options.

## Contribution

Contributions are welcome! Feel free to fork the repo, create a feature branch, and submit a pull request.

## License

This project is licensed under the MIT License.

---

Enjoy chatting with fellow cat lovers! 🐱

