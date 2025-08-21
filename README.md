# CMS - Modern Content Management System

A powerful, developer-friendly content management system built with Next.js 14, React 18, TypeScript, and modern web technologies.

## ✨ Features

### 🔐 Authentication & User Management
- **Google OAuth Integration** - Sign in with Google accounts
- **Email/Password Authentication** - Traditional login system
- **Role-based Access Control** - User and Admin roles
- **Protected Routes** - Secure access to admin features
- **User Registration** - Complete user onboarding

### 📝 Content Management
- **Rich Text Editor** - React Quill with full formatting options
- **Post Management** - Create, edit, delete, and publish posts
- **Category System** - Organize content with categories
- **Status Management** - Draft, Published, and Archived states
- **SEO Optimization** - Keywords, excerpts, and meta descriptions
- **Image Support** - Thumbnail and featured image management
- **Real Views Counter** - Per-post views (admin views ignored), summed on dashboard

### 🎛️ Admin Panel
- **Dashboard Overview** - Quick stats and actions
- **User Management** - View, filter, and update roles
- **Content Management** - Moderate and manage posts
- **Category Management** - Create and organize categories

### 🌐 Public Blog
- **Responsive Design** - Mobile-first, modern UI
- **Search & Filtering** - Find content quickly
- **Category Navigation** - Browse by topic
- **Pagination** - Navigate through content efficiently
- **SEO Ready** - Optimized for search engines

### 🛠️ Developer Experience
- **TypeScript** - Full type safety throughout
- **Modern Stack** - Next.js 14, React 18, Tailwind CSS
- **Component Library** - shadcn/ui components
- **API Routes** - RESTful API endpoints
- **Database ORM** - Prisma with MongoDB
- **Authentication** - NextAuth.js integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/ramankumar7c/Content-Management-System.git
cd Content-Management-System
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/cms"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App
NODE_ENV="development"
```

### 4. Database Setup
```bash
# Push the schema to your database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 5. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Content_Management_System/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   │   ├── signin/        # Sign in page
│   │   └── signup/        # Sign up page
│   ├── (admin)/           # Admin panel
│   │   ├── users/         # User management
│   │   └── ...            # Other admin features
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication API
│   │   ├── register/      # User registration
│   │   └── v1/            # Version 1 APIs
│   │       ├── posts/     # Post management
│   │       ├── users/     # User management
│   │       └── categories/# Category management
│   ├── blog/              # Public blog
│   │   └── [slug]/        # Individual post pages
│   ├── dashboard/         # User dashboard
│   │   ├── create/        # Create new post
│   │   └── edit/          # Edit existing posts
│   ├── about/             # About page
│   └── ...                # Other pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── editor/            # Rich text editor
│   └── layout/            # Layout components
├── lib/                   # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Database client
│   └── utils/             # Helper functions
├── prisma/                # Database schema
│   └── schema.prisma      # Prisma schema definition
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  name          String?
  email         String    @unique
  username      String?   @unique
  password      String?   # For email/password auth
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
}
```

### Post Model
```prisma
model Post {
  id         String     @id @default(auto()) @map("_id") @db.ObjectId
  title      String
  slug       String     @unique
  content    String
  thumbnail  String?
  excerpt    String?
  keywords   String[]   @default([])
  categoryId String?    @db.ObjectId
  authorId   String     @db.ObjectId
  status     PostStatus @default(DRAFT)
  views      Int        @default(0)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  
  author   User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  category Category? @relation(fields: [categoryId], references: [id])
}
```

### Category Model
```prisma
model Category {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  title String @unique
  slug  String @unique
  posts Post[]
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/auth/signin` - Sign in (handled by NextAuth)
- `POST /api/auth/signout` - Sign out (handled by NextAuth)

### Posts
- `GET /api/v1/posts` - Get all posts with filtering
- `POST /api/v1/posts` - Create new post
- `GET /api/v1/posts/[slug]` - Get single post
- `PUT /api/v1/posts/[slug]` - Update post
- `DELETE /api/v1/posts/[slug]` - Delete post

### Users (Admin Only)
- `GET /api/v1/users` - Get all users
- `PUT /api/v1/users` - Update user role
- `DELETE /api/v1/users` - Delete user

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category (Admin only)

### Search
- `GET /api/v1/search?q=term&page=1&limit=10` - Full-text search across posts

## 🎨 UI Components

The project uses [shadcn/ui](https://ui.shadcn.com/) components built on top of Radix UI and Tailwind CSS:

- **Buttons** - Various button styles and variants
- **Cards** - Content containers with headers
- **Forms** - Input fields, labels, and validation
- **Navigation** - Menus, dropdowns, and breadcrumbs
- **Feedback** - Alerts, badges, and notifications
- **Layout** - Containers, grids, and spacing utilities

## 🔐 Authentication Flow

1. **User Registration**
   - Users can sign up with email/password or Google OAuth
   - Passwords are hashed using bcrypt
   - Email verification can be added

2. **User Login**
   - Email/password authentication
   - Google OAuth integration
   - JWT-based sessions

3. **Role-based Access**
   - Regular users can create and manage their posts
   - Admins can manage all users and content
   - Protected routes based on user roles

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
postinstall          # Prisma generate (runs automatically on install)
```

### Code Quality
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Husky** - Git hooks for pre-commit checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Prisma](https://www.prisma.io/) - Database toolkit
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

- **Documentation** - Check this README and code comments
- **Issues** - Report bugs and request features on GitHub
- **Discussions** - Ask questions and share ideas

---

Built with ❤️ by [Raman](https://github.com/ramankumar7c)
