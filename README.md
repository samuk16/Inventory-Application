<h1 align="center">Inventory Application</h1>

# Description
This project is an interactive manhwa inventory management system developed as part of The Odin Project curriculum. It allows users to create, edit, and delete manhwa entries with password protection for content management. The system provides efficient filtering capabilities to help users discover their favorite manhwa series.

# Features
- Complete CRUD operations for manhwa entries
- Password-protected editing and deletion functionality
- Advanced filtering system by author and tags
- Server-side rendering for optimal performance
- Secure content management with password protection per manhwa

# Key Functionalities
- Create new manhwa entries with detailed information
- Edit existing entries (password required)
- Delete manhwa entries (password required)
- Filter manhwa collection by:
  - Author name
  - Tags/Genres
- View comprehensive details for each manhwa

# Technologies Used
- Express.js (Backend framework)
- TypeScript (Type-safe programming)
- EJS (Template engine)
- TSX (TypeScript Execute - Node.js enhancement to run TypeScript)
- PostgreSQL (Database)
- CSS (Styling)

# Setup and Installation
1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Build the project
```bash
pnpm run build
```

5. Start the server
```bash
pnpm start
```

# Project Structure
```
Inventory-Application/
├── src/
│   ├── controllers/   # Request handlers
│   ├── db/            # Database 
│   ├── routes/        # API routes
│   ├── views/         # EJS templates
│   └── app.ts         # Server entry point
├── public/            # Static files
```

# Acknowledgments
- The Odin Project for providing the project structure and requirements
- Express.js documentation and community
- TypeScript team for the amazing type system
- EJS for the powerful templating engine