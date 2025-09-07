# Kondate AI - Project Overview

## Purpose
**Kondate AI** is a Japanese meal planning app that helps users generate complete meal suggestions (main dish, side dish, soup) using AI. Users input available ingredients, mood, and preferred cuisine, and OpenAI generates structured recipes. The app includes features for saving favorite menus and generating shopping lists.

## Key Features
- 🔐 Google OAuth authentication via Auth.js
- 🍱 AI-powered meal generation using OpenAI GPT-4o
- 🔄 Retry functionality for alternative suggestions
- 📖 Recipe display with accordion-style ingredients/instructions
- ❤️ Save/favorite menus functionality
- 🛒 Auto-generated shopping lists based on ingredient differences

## Tech Stack
- **Framework**: Next.js 15.4.1 with App Router
- **UI**: Tailwind CSS 4, React 19.1.0
- **Authentication**: Auth.js (next-auth) with Google provider
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI API (GPT-4o)
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Uses mise for tool management

## Database Schema
- User authentication tables (User, Account, Session, VerificationToken)
- Menu table storing JSON for dishes, ingredients, mood, cuisine preferences
- All tables use cuid() for IDs and include proper indexing