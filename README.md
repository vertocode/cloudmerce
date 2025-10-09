<div align="center">
  <img src="assets/logo.png" alt="Cloudmerce Logo" width="200"/>
</div>

# Cloudmerce

A white-label e-commerce platform built for creating and managing online stores. This is the frontend application that handles the customer-facing storefront and admin dashboard.

![Demo](https://i.imgur.com/fG6sT12.png)

## What is this?

Cloudmerce is a full-featured e-commerce system that lets you run multiple online stores from a single codebase. Think of it as your own customizable shopping platform where each store can have its own branding, products, and settings.

The platform handles everything you'd expect from a modern e-commerce site - product catalogs, shopping carts, order management, and payment processing. It's built to be fast, scalable, and easy to customize.

## Tech Stack

Built with modern web technologies:

- **Nuxt 3** - The Vue.js framework that powers the whole thing
- **Vuetify 3** - Material Design components for a clean UI
- **VeeValidate** - Handles all the form validation
- **TypeScript** - For type safety and better developer experience
- **SCSS** - CSS with superpowers for styling
- **Stripe** - Payment processing integration
- **EmailJS** - Contact form handling

## Getting Started

Clone the repo and install dependencies:

```shell
git clone git@github.com:vertocode/cloudmerce.git
cd cloudmerce
bun install
```

Fire up the dev server:

```shell
bun dev
```

That's it. Your local server should be running at `http://localhost:3000`

## Project Structure

```
cloudmerce/
├── components/          # Vue components
├── composables/         # Reusable composition functions
├── layouts/             # App layouts
├── pages/               # File-based routing pages
├── plugins/             # Nuxt plugins
├── public/              # Static files
├── styles/              # Global styles
├── types/               # TypeScript type definitions
├── assets/              # Images, fonts, etc
└── nuxt.config.ts       # Nuxt configuration
```

## Main Features

**For Customers:**
- Browse products with filters and search
- Add items to cart and manage quantities
- Secure checkout with Stripe
- Order tracking and history
- User authentication

**For Admins:**
- Full product management (CRUD operations)
- Product variants with colors, sizes, and custom options
- Order management and status updates
- Store customization (colors, logo, etc)
- Admin dashboard with analytics

## License

Custom license - commercial use restricted to the author, Everton Vanoni Fernandes. Check the LICENSE file for full details.
