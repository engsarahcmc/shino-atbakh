# 🍳 شنو أطبخ؟ — Backend Documentation

## 1. Project Overview

**شنو أطبخ؟** هو تطبيق يساعد المستخدم على اختيار وتحضير الوجبات، من خلال إدخال المكونات المتوفرة لديه، استكشاف الوصفات، حفظ الوصفات المفضلة، وتنظيم الوجبات الأسبوعية.

هذا الجزء يمثل **Backend** الخاص بالمشروع، والمسؤول عن:

* Users & Authentication
* Favorites
* Explore & Categories
* Weekly Meals
* PostgreSQL Database

---

# 2. Technologies

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **JWT Authentication**
* **bcrypt**
* **Google Authentication**
* **dotenv**
* **CORS**

---

# 3. Project Structure

```text
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── favoriteController.js
│   │   ├── categoryController.js
│   │   ├── recipeController.js
│   │   └── weeklyMealController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   ├── favoriteModel.js
│   │   ├── categoryModel.js
│   │   ├── recipeModel.js
│   │   └── weeklyMealModel.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── favoriteRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── weeklyMealRoutes.js
│   │
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# 4. Running the Backend

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Run normally:

```bash
npm start
```

The server runs on:

```text
http://localhost:3000
```

---

# 5. Authentication

The project uses **JWT** for authenticated requests.

After successful login, the API returns a token.

For protected endpoints, send the token in the request header:

```text
Authorization: Bearer YOUR_TOKEN
```

Protected features:

* Profile
* Favorites
* Weekly Meals

---

# 6. Users API

Base URL:

```text
/api/users
```

### Register

```http
POST /api/users/register
```

Request:

```json
{
  "name": "Fatima",
  "email": "fatima@example.com",
  "password": "password"
}
```

---

### Login

```http
POST /api/users/login
```

Request:

```json
{
  "email": "fatima@example.com",
  "password": "password"
}
```

Returns a JWT token.

---

### Google Login

```http
POST /api/users/google
```

Request:

```json
{
  "credential": "GOOGLE_ID_TOKEN"
}
```

The backend verifies the Google credential and returns a JWT token.

---

### Get Profile

```http
GET /api/users/profile
```

🔒 Requires authentication.

---

### Update Profile

```http
PUT /api/users/profile
```

🔒 Requires authentication.

Request:

```json
{
  "name": "Fatima Aboud",
  "email": "fatima@example.com"
}
```

---

# 7. Favorites API ❤️

Base URL:

```text
/api/favorites
```

All Favorites endpoints require authentication.

### Add Favorite

```http
POST /api/favorites
```

Request:

```json
{
  "recipeId": 1
}
```

---

### Get My Favorites

```http
GET /api/favorites
```

Returns the recipes saved by the authenticated user.

---

### Remove Favorite

```http
DELETE /api/favorites/:recipeId
```

Example:

```http
DELETE /api/favorites/1
```

---

# 8. Explore & Categories API 🔎

Base URL:

```text
/api/categories
```

### Get Categories

```http
GET /api/categories
```

---

### Get Popular Recipes

```http
GET /api/categories/popular
```

Returns up to 10 recipes ordered by views.

---

### Search Recipes

```http
GET /api/categories/search?q=Chicken
```

The search currently checks the recipe name.

---

### Get Recipes by Category

```http
GET /api/categories/:categoryId/recipes
```

Example:

```http
GET /api/categories/1/recipes
```

---

### Count Recipe View

```http
PATCH /api/categories/recipes/:recipeId/views
```

Example:

```http
PATCH /api/categories/recipes/1/views
```

Increases the recipe's `views_count` by 1.

---

# 9. Weekly Meals API 📅

Base URL:

```text
/api/weekly-meals
```

All endpoints require authentication.

### Add Weekly Meal

```http
POST /api/weekly-meals
```

Request:

```json
{
  "recipeId": 1,
  "day": "Monday",
  "mealType": "Lunch",
  "servings": 2
}
```

---

### Get My Weekly Meals

```http
GET /api/weekly-meals
```

Returns the authenticated user's weekly meals.

---

### Update Weekly Meal

```http
PUT /api/weekly-meals/:weeklyMealId
```

Request:

```json
{
  "recipeId": 2,
  "day": "Tuesday",
  "mealType": "Dinner",
  "servings": 3
}
```

---

### Delete Weekly Meal

```http
DELETE /api/weekly-meals/:weeklyMealId
```

Example:

```http
DELETE /api/weekly-meals/1
```

---

# 10. Database

The backend uses PostgreSQL.

Main tables:

1. `roles`
2. `users`
3. `categories`
4. `recipes`
5. `ingredients`
6. `recipe_ingredients`
7. `favorites`
8. `weekly_meals`
9. `posts`
10. `comments`
11. `post_likes`
12. `recipe_ratings`
13. `search_history`
14. `suggestion_history`

### Important relationships

```text
roles
  ↓
users

categories
  ↓
recipes
  ↓
recipe_ingredients
  ↓
ingredients

users ─── favorites ─── recipes

users ─── weekly_meals ─── recipes

users ─── posts
           ↓
        comments
           ↓
       post_likes
```

---

# 11. Environment Variables

The backend uses a `.env` file for sensitive configuration.

Required variables:

```env
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=

JWT_SECRET=

GOOGLE_CLIENT_ID=
```

⚠️ Do not upload `.env` to GitHub.

---

# 12. Security

The backend currently uses:

* bcrypt password hashing
* JWT authentication
* Protected routes
* Parameterized PostgreSQL queries
* Environment variables for secrets
* Password excluded from API responses
* User ID taken from the authenticated JWT for user-specific operations

---

# 13. Current Backend Status

### Completed

* Project setup
* PostgreSQL connection
* Database schema
* User registration
* User login
* JWT authentication
* Profile API
* Profile update
* Google Login backend
* Favorites API
* Categories API
* Explore API
* Recipe search
* Popular recipes
* Recipe views
* Weekly Meals CRUD
* CORS configuration
* API testing

### Deferred / Future Integration

Some features depend on the rest of the project and can be added later:

* Full Google Login frontend integration
* AI recipe suggestions
* AI weekly meal planning
* Ingredient-based meal generation
* Budget and preference handling
* Ingredient aggregation for weekly meals
* Connecting missing ingredients to the shopping cart
* Community APIs
* Advanced recommendation/history logic

---

# 14. API Summary

| Feature            | Method | Endpoint                                  | Auth |
| ------------------ | ------ | ----------------------------------------- | ---- |
| Register           | POST   | `/api/users/register`                     | ❌    |
| Login              | POST   | `/api/users/login`                        | ❌    |
| Google Login       | POST   | `/api/users/google`                       | ❌    |
| Get Profile        | GET    | `/api/users/profile`                      | ✅    |
| Update Profile     | PUT    | `/api/users/profile`                      | ✅    |
| Add Favorite       | POST   | `/api/favorites`                          | ✅    |
| Get Favorites      | GET    | `/api/favorites`                          | ✅    |
| Remove Favorite    | DELETE | `/api/favorites/:recipeId`                | ✅    |
| Categories         | GET    | `/api/categories`                         | ❌    |
| Popular Recipes    | GET    | `/api/categories/popular`                 | ❌    |
| Search Recipes     | GET    | `/api/categories/search?q=...`            | ❌    |
| Category Recipes   | GET    | `/api/categories/:categoryId/recipes`     | ❌    |
| Recipe Views       | PATCH  | `/api/categories/recipes/:recipeId/views` | ❌    |
| Add Weekly Meal    | POST   | `/api/weekly-meals`                       | ✅    |
| Get Weekly Meals   | GET    | `/api/weekly-meals`                       | ✅    |
| Update Weekly Meal | PUT    | `/api/weekly-meals/:weeklyMealId`         | ✅    |
| Delete Weekly Meal | DELETE | `/api/weekly-meals/:weeklyMealId`         | ✅    |

---

# 15. Frontend Integration

Frontend developers should use:

```text
http://localhost:3000
```

as the development API base URL.

For protected requests, include:

```text
Authorization: Bearer TOKEN
```

The frontend should store the returned JWT after login and send it with protected requests.

---

## Backend Responsibility

This backend is responsible for the APIs and database functionality assigned to the Backend team member.

Frontend, AI logic, and other application features should be integrated with these APIs according to the team's final project structure.
