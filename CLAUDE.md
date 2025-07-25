# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Docker Commands

- `docker-compose up -d` - Build and run the application in Docker containers
- `docker-compose down` - Stop and remove containers
- `docker-compose logs provider-portal` - View application logs
- `docker-compose restart provider-portal` - Restart the application container

The application will be available at http://localhost:8080 when running via Docker Compose.

## Vercel Deployment

- **Easy Deploy**: Click "Import Project" in Vercel dashboard and connect the GitHub repository
- **Auto Configuration**: Vercel will automatically detect Vite framework and use the vercel.json config
- **Build Settings**: 
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`
- **Environment**: The app will be automatically deployed with SPA routing support

## Architecture Overview

This is a Vue 3 + Vite application for a provider management portal. Key architectural elements:

- **Framework**: Vue 3 with Composition API (using `<script setup>`)
- **Build Tool**: Vite with hot module replacement
- **Module Type**: ES modules (type: "module" in package.json)
- **Path Aliases**: `@/` maps to `./src/` directory

## Project Structure

- `/src/main.js` - Application entry point, creates Vue app and mounts to DOM
- `/src/App.vue` - Root component with header and main sections
- `/src/components/` - Reusable Vue components including icons and welcome sections
- `/src/assets/` - Static assets (CSS, images)
- `/vite.config.js` - Vite configuration with Vue plugin and path aliases
- `/jsconfig.json` - JavaScript project configuration for IDE support

## Development Notes

- Uses Vue 3 Single File Components (.vue files) with scoped styles
- Vite development server runs on default port with hot-reload
- No testing framework or linting tools currently configured
- No state management library (Vuex/Pinia) - uses component-level state

## Application Structure

This is the APA Insurance Provider Management Portal with the following layout:
- TopNavigation: Main header with APA Insurance logo and login/logout functionality
- SecondaryNavigation: Menu bar with provider management options (Dashboard, Provider Category, etc.)
- MainContent: Landing page with "Provider Management System" title and jumbotron containing menu cards
- Footer: Contact information and branding for APA Insurance

The application is designed for managing healthcare providers (doctors & hospitals) for medical schemes.