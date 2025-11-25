# Habit Tracker Web App

A comprehensive web application for habit tracking, workout planning, and personal goal achievement.

## 🌐 Web App Features

### Core Functionality
- **Multi-Habit Tracking** - Create and track various types of habits
- **Gym Workout Center** - Advanced exercise tracking with templates
- **Progress Visualization** - Interactive charts and heatmaps
- **Achievement System** - Gamification with badges and levels
- **Calendar Integration** - Visual habit adherence tracking

### Technical Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Prisma ORM with SQLite
- **Charts**: Recharts for data visualization
- **Deployment**: Production-ready with Caddy reverse proxy

### Web App Capabilities
- **Responsive Design** - Works on all devices (mobile, tablet, desktop)
- **Real-time Updates** - Live data synchronization
- **Offline-First** - Local database with optional cloud sync
- **Progressive Web App** - PWA manifest included
- **SEO Optimized** - Meta tags and structured data

## 🚀 Getting Started

### Development
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Database Setup
```bash
npm run db:push
npm run db:generate
```

## 📱 Web App Features

### 1. Dashboard
- Real-time habit progress tracking
- Streak counters and statistics
- Achievement overview
- Quick action buttons

### 2. Habit Management
- Create custom habits with flexible metrics
- Pre-built templates (Running, Gym, Study, etc.)
- Personalized themes and colors
- Flexible scheduling options

### 3. Gym Workout Center
- Interactive workout tracking
- Exercise templates (Push/Pull/Legs, Upper/Lower, etc.)
- Real-time rest timers
- Volume and PR tracking
- Progress analytics

### 4. Analytics & Insights
- Calendar heatmaps for habit adherence
- Progress charts and trends
- Personal record detection
- Workout volume tracking

### 5. Gamification
- Achievement badges and milestones
- Points and level system
- Progress celebrations
- Motivational feedback

## 🔧 API Endpoints

### Habits
- `GET /api/habits` - List all habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/[id]` - Update habit
- `DELETE /api/habits/[id]` - Delete habit

### Entries
- `POST /api/entries` - Log habit entry
- `GET /api/entries/[habitId]` - Get habit history

### Achievements
- `GET /api/achievements` - Get user achievements
- `POST /api/achievements` - Award achievement

### Health Check
- `GET /api/health` - Application status

## 🎨 UI Components

### Core Components
- `HabitCard` - Individual habit display
- `CalendarHeatmap` - Visual progress tracking
- `GymWorkoutTracker` - Advanced workout logging
- `AchievementsPanel` - Gamification display
- `WorkoutTemplates` - Pre-built workout programs

### Interactive Features
- Real-time form validation
- Smooth animations and transitions
- Responsive design patterns
- Accessible UI elements

## 📊 Data Models

### Habit
```typescript
interface Habit {
  id: string;
  title: string;
  type: 'running' | 'gym' | 'study' | 'custom';
  theme: { color: string; icon: string };
  recurrence: { frequency: string; target: any };
  metrics: Array<{ name: string; type: string }>;
}
```

### Entry
```typescript
interface Entry {
  id: string;
  habitId: string;
  date: Date;
  value: Record<string, any>;
  completed: boolean;
}
```

## 🌍 Deployment

### Production Setup
1. Build the application: `npm run build`
2. Set up reverse proxy (Caddy configuration included)
3. Configure database (SQLite with Prisma)
4. Set environment variables

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

## 📱 Mobile Experience

The web app is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Adaptive layouts
- Mobile-specific interactions
- PWA capabilities

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection
- Secure API endpoints
- Environment variable management

## 📈 Performance

- Optimized bundle sizes
- Lazy loading components
- Efficient database queries
- Caching strategies
- Code splitting

## 🎯 Future Enhancements

- Push notifications
- Social features
- Advanced analytics
- Health integrations
- Mobile app (React Native)

---

**Built with ❤️ using Next.js 15 and modern web technologies**