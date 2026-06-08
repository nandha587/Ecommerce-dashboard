# Real-Time E-Commerce MVP

A modern, fully responsive Real-Time E-Commerce Dashboard built with React, Vite, Firebase, and Stripe.

## Features

### 1. Secure Authentication (Login/Register)
- Users can sign up for a new account or log into an existing one.
- *Note:* The code is set up for Firebase Auth. Until you add your real Firebase API keys, it uses a smart "mock" login so you can still test the flow seamlessly.
- Protected routes ensure that only logged-in users can access the Product Dashboard and Checkout page.

### 2. Real-Time Product Management (Admin Dashboard)
- A dedicated dashboard where you can easily manage inventory.
- You can add new products by providing a Name, Price, Description, and Image URL. The new products appear on the homepage instantly.
- You can delete existing products with the click of a button.

### 3. Interactive Product Catalog
- A beautiful homepage that displays all available products in a responsive grid.
- Users can view product details, pricing, and click "Add to Cart".

### 4. Persistent Shopping Cart
- A dynamic shopping cart that tracks what users want to buy.
- Users can increase/decrease the quantity of items or remove them completely.
- The cart automatically calculates the order total.
- The cart data is saved locally, so if a user accidentally refreshes the page, they won't lose their items!

### 5. Secure Payment Checkout (Stripe)
- A dedicated checkout page that displays the final order summary.
- Integrates Stripe Elements, the industry standard for secure payments.
- Currently configured in "Test Mode" so you can simulate real transactions using Stripe's test credit cards without using actual money.

### 6. Premium UI & Responsive Design
- Built with a sleek, modern "dark mode" aesthetic.
- Uses "glassmorphism" (frosted glass effects) on the navigation bar and cards.
- Fully responsive, meaning it looks great on large desktop monitors, tablets, and small mobile phone screens.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Development Server**
   ```bash
   npm run dev
   ```

3. **Production Setup**
   - Create a Firebase project and insert your API keys into `src/firebase.js`.
   - Add your live Stripe Publishable Key to `src/pages/Checkout.jsx`.
