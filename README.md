# Dflamez Shot - Photography Portfolio

A modern, full-stack web application for Akingbade Gold Wuraola (Dflamez Shot) to showcase photography work, publish blogs, and manage bookings. Built with Next.js 15, React 19, and Supabase.

**Note**: This application is developed specifically for Akingbade Gold Wuraola and her brand "Dflamez Shot". It is proprietary software and requires permission for any use or modification. Contact jattodare002@gmail.com for licensing inquiries.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [License](#license)
- [Contact](#contact)

## Features

- **Gallery Showcase**: Beautiful responsive gallery with category filtering for images and videos
- **Blog System**: Full-featured blog with article management and categorization
- **Booking System**: Multi-step booking process for clients to schedule sessions
- **Admin Dashboard**: Comprehensive admin panel to manage gallery, blog, bookings, and messages
- **Payment Integration**: Stripe and Paystack payment processing
- **Authentication**: Secure admin authentication with Supabase Auth
- **Media Management**: Image uploads to Cloudinary with automatic database logging
- **Responsive Design**: Mobile-first design that works on all device sizes
- **Dark Mode**: Theme switching capability for user preference

## Tech Stack

- **Frontend**: 
  - React 19
  - Next.js 15 (App Router)
  - TypeScript
  - Tailwind CSS
  - Radix UI
  - Framer Motion (Animations)
  - Embla Carousel (Image sliders)

- **Backend**:
  - Next.js API Routes
  - Supabase (Database & Authentication)
  - Cloudinary (Media Storage)
  - Stripe & Paystack (Payment Processing)

- **Database**:
  - Supabase PostgreSQL

- **Development Tools**:
  - pnpm (Package Manager)
  - ESLint (Code Linting)
  - Prettier (Code Formatting)

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm
- Supabase account
- Cloudinary account
- Stripe and/or Paystack accounts (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/dfalmez-gallery.git
cd dfalmez-gallery
```

2. Install dependencies:
```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Paystack (optional)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

### Database Setup

1. Run the setup script to initialize your database:
```bash
pnpm setup
```

2. This will:
   - Create all necessary database tables
   - Set up the admin user
   - Configure database relationships and indexes

## Project Structure

```
dfalmez-gallery/
├── app/                    # Next.js App Router pages and API routes
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── gallery/           # Gallery pages
│   └── ...
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   ├── ui/                # Reusable UI components
│   └── ...
├── lib/                   # Utility functions and services
│   ├── supabase/          # Supabase client configuration
│   └── ...
├── public/                # Static assets
├── scripts/               # Setup and utility scripts
└── styles/                # Global styles
```

## Available Scripts

- `pnpm dev` - Starts the development server
- `pnpm build` - Builds the application for production
- `pnpm start` - Starts the production server
- `pnpm lint` - Runs ESLint
- `pnpm setup` - Initializes the database and admin user

## Deployment

The easiest way to deploy this application is with [Vercel](https://vercel.com), which provides one-click deployment for Next.js applications.

### Vercel Deployment

1. Push your code to a GitHub repository
2. Sign up/in to Vercel
3. Create a new project and import your repository
4. Add your environment variables in the Vercel dashboard
5. Deploy!

### Other Hosting Options

This application can be deployed to any hosting provider that supports Node.js. Make sure to set your environment variables in your hosting environment.

## Contact

For support or inquiries about this application, please contact:
- Akingbade Gold Wuraola (Client)
- Email: jattodare002@gmail.com (for technical inquiries)