# WTWR (What to Wear?): Back End
This project is a RESTful API built with Express.js, designed to manage users and clothing items. It provides endpoints for creating, reading, updating, and deleting (CRUD) both users and clothing items. The application includes features such as user authentication and error handling, ensuring robust and secure interactions with the API.

# Functionality
The main functionalities of the project include:

1. User Management: Create, retrieve, update, and delete user information.
2. Clothing Item Management: Create, retrieve, update, and delete clothing items.
3. Authentication: Secure endpoints with user authentication.
4. Error Handling: Comprehensive error handling for invalid routes and requests.

# Technologies and Techniques Used

# Technologies
1. Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine, used for building the server-side application.
2. Express.js: A fast, unopinionated, minimalist web framework for Node.js, used to create the RESTful API.
3. MongoDB: A NoSQL database for storing user and clothing item data.
4. Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js, used for data validation and query building.
5. JWT (JSON Web Tokens): Used for secure user authentication and authorization.

# Techniques
1. RESTful API Design: The application follows REST principles, making it easy to use and extend.
2. Middleware: Utilized for logging, authentication, and error handling, ensuring a modular and maintainable codebase.
3. Validation and Sanitization: Input validation are performed to ensure data integrity and security.
4. Error Handling: Comprehensive error handling to manage different types of errors, including 404 for unknown routes and validation errors.