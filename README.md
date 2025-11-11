# Kapadokya Cafe & Restaurant

Modern, bilingual (German/Turkish) restaurant website with admin CMS built with Next.js and Supabase.

## Features

### Public Website
- 🌐 **Bilingual Support**: German (DE) and Turkish (TR) language options
- 🎥 **Video Background**: Professional homepage with video background
- 🍽️ **Dual Menu System**: 
  - Ready-made menu photo uploads (PDF/Images)
  - Detailed product menu with individual dish photos and descriptions
- ⭐ **Dish of the Day**: Featured daily special dish
- 📱 **Responsive Design**: Mobile-friendly interface
- 🎨 **Modern UI**: Clean, professional design with Tailwind CSS

### Admin Panel
- 🔐 **Secure Authentication**: Protected admin area with Supabase Auth
- 📊 **Financial Management**: Income and expense tracking with categories
- 📈 **Reports**: Financial reports with charts and analytics
- 🍴 **Menu Management**: 
  - Upload menu photos (JPG, PNG, PDF)
  - Manage detailed product menu with categories
  - Set dish of the day
- 🖼️ **Media Gallery**: Upload and manage restaurant images
- ⚙️ **Site Settings**: Configure restaurant information, hours, contact details

## Tech Stack

- **Framework**: Next.js 14.2.33 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **i18n**: next-intl
- **Charts**: Recharts
- **Notifications**: react-hot-toast

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AliVeli0650/kapadokya_restaurant_cafe.git
cd kapadokya_restaurant_cafe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy .env.example to .env.local
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Set up the database:

Run the following SQL scripts in your Supabase SQL Editor in this order:

a. **Main Schema** (`SUPABASE_WEBSITE_SCHEMA.sql`):
   - Creates all necessary tables (menu_images, dish_categories, dishes, site_settings)
   - Sets up RLS policies
   - Creates storage buckets

b. **Dish of the Day** (`ADD_DISH_OF_DAY_COLUMN.sql`):
   - Adds the dish_of_the_day column
   - Creates trigger to ensure only one dish is featured at a time

c. **Complete Migration** (`SUPABASE_MIGRATION_COMPLETE.sql`):
   - Full schema including accounting tables (expenses, income, etc.)

d. **Reservations Table** (`supabase/migrations/create_reservations_table.sql`):
   - Creates reservations table for customer bookings
   - Adds RLS policies for public form submissions and admin management

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

### Default Admin Access

After setting up the database, create an admin user in Supabase:
- Go to Authentication > Users in your Supabase dashboard
- Add a new user with email and password
- Use these credentials to login at `/login`

## Deployment to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Push code to GitHub** (see authentication options below if needed)

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import `AliVeli0650/kapadokya_restaurant_cafe` repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: `./`
     - Build Command: `npm run build` (default)
     - Output Directory: `.next` (default)

3. **Add Environment Variables**:
   In Vercel project settings, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Deploy**: Click "Deploy" and wait for the build to complete

### GitHub Authentication Options

If you get permission errors pushing to GitHub:

**Option A: Use Personal Access Token (PAT)**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Copy the token
4. Update git remote:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/AliVeli0650/kapadokya_restaurant_cafe.git
git push -u origin main
```

**Option B: Use GitHub CLI**
```bash
gh auth login
git push -u origin main
```

**Option C: Use SSH**
1. Set up SSH key with GitHub
2. Update remote:
```bash
git remote set-url origin git@github.com:AliVeli0650/kapadokya_restaurant_cafe.git
git push -u origin main
```

## Project Structure

```
kapadokya-cafe-restaurant/
├── app/
│   ├── [lang]/              # Bilingual public pages
│   │   ├── page.tsx         # Homepage with video background
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   └── layout.tsx       # Public layout
│   ├── admin/               # Admin panel
│   │   ├── income/          # Income management
│   │   ├── expenses/        # Expense tracking
│   │   ├── reports/         # Financial reports
│   │   └── website/         # Website content management
│   ├── speisekarte/         # Combined menu page
│   └── login/               # Authentication
├── components/
│   ├── Navbar.tsx           # Navigation with language switcher
│   └── Footer.tsx           # Site footer
├── lib/
│   ├── supabaseClient.ts    # Supabase configuration
│   └── i18n.ts              # i18n setup
├── messages/
│   ├── de.json              # German translations
│   └── tr.json              # Turkish translations
├── public/
│   └── Sunum.mp4            # Homepage video
└── supabase/
    └── migrations/          # Database migrations
```

## Environment Variables

Required variables for deployment:

```env
NEXT_PUBLIC_SUPABASE_URL=     # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Your Supabase anon/public key
```

## Database Schema

Main tables:
- `menu_images` - Menu photo uploads
- `dish_categories` - Menu categories
- `dishes` - Individual menu items with `is_dish_of_the_day` flag
- `site_settings` - Restaurant information and settings
- `expenses` - Expense tracking
- `income` - Income tracking
- `expense_categories` - Expense categories
- `income_sources` - Income source categories

## Support

For issues or questions, please open an issue on GitHub.

## License

Private project - All rights reserved.
