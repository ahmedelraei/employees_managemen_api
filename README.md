# Employee Management System

A comprehensive Employee Management System built with NestJS, TypeScript, TypeORM, and MySQL. This system provides full CRUD operations for employees and departments, advanced reporting features with CSV and PDF export capabilities, activity logging, and comprehensive API documentation.

## 🚀 Features

- **Employee Management**: Full CRUD operations with validation
- **Department Management**: Department creation and management
- **Advanced Filtering**: Search, filter, and sort employees
- **Pagination**: Efficient data loading with pagination support
- **Export Capabilities**: CSV and PDF export with customizable options
- **Activity Logging**: Complete audit trail of all operations
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Database Migrations**: Version-controlled database schema
- **Data Seeding**: Sample data generation for testing
- **Error Handling**: Global exception handling with structured responses
- **Validation**: Input validation using class-validator
- **Statistics**: Employee and salary statistics by department

## 🛠 Technical Stack

- **Framework**: NestJS (latest version)
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: TypeORM
- **Validation**: class-validator and class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Export Libraries**: csv-writer, pdfkit
- **Logging**: Winston with NestJS integration

## 📋 Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (v16 or higher)
- pnpm (or npm/yarn)
- MySQL (v8.0 or higher)
- Git

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd employees_assessment
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your database credentials:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=employees_db
   ```

4. **Database Setup**

   Create the MySQL database:

   ```sql
   CREATE DATABASE employees_db;
   ```

5. **Run Migrations and Seed Data**

   ```bash
   pnpm run db:setup
   ```

   Or run them separately:

   ```bash
   pnpm run migration:run
   pnpm run seed
   ```

6. **Start the Application**

   ```bash
   # Development mode
   pnpm run start:dev

   # Production mode
   pnpm run build
   pnpm run start:prod
   ```

## 🌐 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Swagger Documentation

```
http://localhost:3000/api/docs
```

### Departments

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/departments`     | Get all departments   |
| GET    | `/departments/:id` | Get department by ID  |
| POST   | `/departments`     | Create new department |
| PATCH  | `/departments/:id` | Update department     |
| DELETE | `/departments/:id` | Delete department     |

### Employees

| Method | Endpoint                | Description                         |
| ------ | ----------------------- | ----------------------------------- |
| GET    | `/employees`            | Get all employees (with pagination) |
| GET    | `/employees/:id`        | Get employee by ID                  |
| GET    | `/employees/statistics` | Get employee statistics             |
| POST   | `/employees`            | Create new employee                 |
| PATCH  | `/employees/:id`        | Update employee                     |
| DELETE | `/employees/:id`        | Delete employee                     |

#### Employee Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `department_id`: Filter by department
- `search`: Search in name or email
- `sort_by`: Sort field (name, email, salary, created_at)
- `order`: Sort order (ASC, DESC)

### Reports

| Method | Endpoint                        | Description             |
| ------ | ------------------------------- | ----------------------- |
| GET    | `/reports/employees/export/csv` | Export employees to CSV |
| GET    | `/reports/employees/export/pdf` | Export employees to PDF |

#### Export Query Parameters

- `department_id`: Filter by department
- `includeTimestamps`: Include created/updated timestamps
- `sort_by`: Sort field
- `order`: Sort order

## 📊 API Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  },
  "timestamp": "2023-12-01T10:00:00.000Z",
  "path": "/api/employees"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10,
  "message": "Employees retrieved successfully"
}
```

## 🗄 Database Schema

### Departments Table

```sql
CREATE TABLE departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Employees Table

```sql
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

### Activity Logs Table

```sql
CREATE TABLE activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  action VARCHAR(50) NOT NULL,
  entity VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  old_values JSON,
  new_values JSON,
  user_id INT,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Available Scripts

| Script                      | Description                    |
| --------------------------- | ------------------------------ |
| `pnpm run start:dev`        | Start development server       |
| `pnpm run build`            | Build for production           |
| `pnpm run start:prod`       | Start production server        |
| `pnpm run migration:run`    | Run database migrations        |
| `pnpm run migration:revert` | Revert last migration          |
| `pnpm run seed`             | Seed database with sample data |
| `pnpm run db:setup`         | Run migrations and seed data   |
| `pnpm run lint`             | Run ESLint                     |
| `pnpm run test`             | Run unit tests                 |
| `pnpm run test:e2e`         | Run end-to-end tests           |

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 📝 Sample Data

The system comes with pre-seeded sample data:

- **6 Departments**: HR, IT, Sales, Marketing, Finance, Operations
- **50 Sample Employees**: Distributed across all departments with realistic data

## 🏗 Project Structure

```
src/
├── common/                 # Shared utilities
│   ├── decorators/
│   ├── filters/           # Exception filters
│   ├── guards/
│   ├── interceptors/      # Logging interceptor
│   └── pipes/             # Validation pipes
├── config/                # Configuration files
│   ├── app.config.ts
│   └── database.config.ts
├── modules/               # Feature modules
│   ├── departments/       # Department management
│   ├── employees/         # Employee management
│   ├── logs/              # Activity logging
│   └── reports/           # Export functionality
├── database/              # Database related files
│   ├── migrations/        # TypeORM migrations
│   └── seeders/           # Data seeders
├── main.ts               # Application entry point
└── app.module.ts         # Root module
```

## 🔐 Environment Variables

| Variable      | Description      | Default           |
| ------------- | ---------------- | ----------------- |
| `NODE_ENV`    | Environment mode | `development`     |
| `PORT`        | Application port | `3000`            |
| `API_PREFIX`  | API route prefix | `api`             |
| `DB_HOST`     | MySQL host       | `localhost`       |
| `DB_PORT`     | MySQL port       | `3306`            |
| `DB_USERNAME` | MySQL username   | `root`            |
| `DB_PASSWORD` | MySQL password   | ``                |
| `DB_DATABASE` | Database name    | `employees_db`    |
| `JWT_SECRET`  | JWT secret key   | `your-secret-key` |
| `CORS_ORIGIN` | CORS origin      | `*`               |

## 🚀 Deployment

### Production Build

```bash
pnpm run build
pnpm run start:prod
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production database credentials
3. Set secure `JWT_SECRET`
4. Configure proper `CORS_ORIGIN`

### Docker (Optional but recommended)

```bash
docker compose up -d
docker compose logs -t --follow
```

## 📈 Performance Considerations

- **Database Indexing**: Indexes on email, department_id, and created_at
- **Pagination**: Efficient pagination for large datasets
- **Query Optimization**: Optimized TypeORM queries with proper relations
- **Connection Pooling**: MySQL connection pooling configured
- **Validation**: Input validation to prevent malformed data

## 🔍 Monitoring & Logging

- **Activity Logs**: All CRUD operations are logged to database
- **Request Logging**: HTTP request/response logging with duration
- **Error Tracking**: Structured error responses with correlation IDs
- **Performance Metrics**: Request duration tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **Migration Errors**
   - Check database permissions
   - Verify TypeORM configuration
   - Ensure migrations are in correct format

3. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Kill process using the port: `lsof -ti:3000 | xargs kill`

4. **Module Not Found Errors**
   - Run `pnpm install` to install dependencies
   - Check import paths in TypeScript files
