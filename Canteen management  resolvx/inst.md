# BiteQ — Smart Campus Canteen Management System

## 1. Project Overview

Build a production-quality, modern Smart Campus Canteen Management System called **BiteQ**.

Tagline:

> **Skip the queue. Get your food.**

The application should work as a complete digital operating system for a college canteen.

It must connect:

Student → Menu → Cart → Pickup Slot → Payment → Digital Token → Kitchen Queue → Preparation → Pickup → Feedback

and:

Admin → Menu → Inventory → Orders → Staff → Payments → Refunds → Complaints → Analytics

The application must be responsive and optimized for:

* Students on mobile
* Kitchen staff on tablets
* Admin/principal on desktop

---

# 2. Design Direction

Create a premium, futuristic but practical campus-tech interface.

Design inspiration:

* Apple
* Linear
* Stripe
* Vercel
* modern food delivery applications
* modern POS systems

Avoid making it look like a generic college project.

Use:

* Dark/light adaptive UI
* Glassmorphism where appropriate
* Soft gradients
* Rounded cards
* Smooth Framer Motion animations
* Clean typography
* Large food imagery
* Clear status indicators
* Micro-interactions
* Skeleton loading
* Toast notifications
* Responsive layouts

The UI should feel like a real startup product.

Do not overuse animations.

Performance and usability are more important than visual effects.

---

# 3. Brand

Name:

BiteQ

Tagline:

Skip the queue. Get your food.

Suggested visual identity:

* Food
* Speed
* Queue
* Campus
* Technology

Create a simple modern logo using the letters BQ or a food/queue concept.

---

# 4. User Roles

Implement Role Based Access Control.

Roles:

1. Student
2. Kitchen Staff
3. Canteen Admin
4. Principal / Super Admin

Each role must have a separate dashboard.

Students must never access administrative routes.

Kitchen staff must not access financial/admin settings unless explicitly permitted.

---

# 5. Landing Page

Create a beautiful landing page.

Hero section:

Headline:

> Skip the queue. Get your food.

Subtitle:

> Smart ordering, digital tokens and real-time queue management for modern campus canteens.

Buttons:

* Order Now
* Login

Include a live canteen status card:

* Open/Closed
* Current queue
* Average preparation time
* Current load

Sections:

1. Hero
2. Live Canteen Status
3. How It Works
4. Features
5. Food Categories
6. Smart Queue explanation
7. Digital Token explanation
8. Inventory intelligence
9. Feedback system
10. CTA
11. Footer

---

# 6. Student Authentication

Use Supabase Authentication.

Support:

* Sign up
* Login
* Logout
* Forgot password
* Email verification if enabled

Store profile information:

* Name
* Email
* Student ID
* Department
* Semester
* Phone
* Profile image
* Role

Default new users should be Student unless their role is assigned by an administrator.

---

# 7. Student Dashboard

Dashboard should contain:

* Greeting
* Search
* Food categories
* Featured foods
* Popular foods
* Current canteen status
* Current queue
* Recent orders
* Active order
* Rewards/streak
* Notifications

Example:

Good evening, Sherin 👋

What's cooking?

[ Search food ]

Categories:

Meals
Snacks
Beverages
Desserts
Tea & Coffee
Fast Food

---

# 8. Food Menu

Create food cards with:

* Image
* Name
* Description
* Price
* Category
* Rating
* Preparation time
* Availability
* Remaining quantity
* Vegetarian/non-vegetarian indicator
* Allergens
* Popular badge
* Add button

Availability states:

GREEN:
Available

YELLOW:
Limited stock

RED:
Sold out

GRAY:
Temporarily unavailable

If quantity reaches zero, automatically mark the product as sold out.

---

# 9. Food Detail Page

Display:

* Large food image
* Food name
* Description
* Price
* Rating
* Ingredients
* Allergens
* Preparation time
* Current availability
* Quantity selector
* Add to cart

Show:

> Estimated preparation: 10–15 min

---

# 10. Cart

Cart should show:

* Product image
* Product name
* Quantity
* Unit price
* Total
* Remove button
* Quantity controls

Calculate:

Subtotal
Packaging fee
Discount
Total

Allow:

* Dine-in
* Takeaway

Optional packaging:

Normal: ₹0
Eco-friendly: ₹5

---

# 11. Pickup Scheduling

Allow users to select:

* ASAP
* Available future pickup slots

Do not allow impossible pickup times.

The system must consider:

* Current time
* Kitchen workload
* Number of active orders
* Food preparation time
* Staff capacity

Show:

> Recommended pickup time: 1:05 PM

If a slot is overloaded:

> ⚠️ This slot is busy.

Suggest another slot.

---

# 12. Smart Preparation Time

Create a preparation-time estimation service.

Estimated preparation should consider:

* Base food preparation time
* Quantity ordered
* Current active kitchen orders
* Orders ahead in queue
* Kitchen staff availability
* Selected pickup slot

Display:

> Estimated ready time: 1:05 PM

Do not claim the estimate is guaranteed.

---

# 13. Checkout

Checkout flow:

Cart
→ Order type
→ Pickup slot
→ Payment
→ Payment verification
→ Order creation
→ Token generation

Show complete order summary.

---

# 14. Payment

Integrate Razorpay test mode where practical.

Payment states:

* Pending
* Processing
* Success
* Failed
* Cancelled
* Refunded
* Refund processing

IMPORTANT:

Do not mark an order as paid merely because the frontend says payment succeeded.

Payment must be verified on the server.

Only after verified payment:

1. Create confirmed order
2. Generate token
3. Add order to kitchen queue
4. Generate QR

---

# 15. Failed Payment

If payment fails:

Show:

> Payment failed.

Actions:

* Retry Payment
* Return to Cart

Do not create a confirmed token.

---

# 16. Refund System

Create refund records.

Refund states:

* Requested
* Processing
* Completed
* Failed

Refund reasons:

* Kitchen unavailable
* Item unavailable
* Order cancelled
* Duplicate payment
* Technical failure
* Admin initiated

For hackathon/demo purposes, allow a mock refund flow if live gateway refunds are not configured.

---

# 17. Digital Token System

After successful payment generate a unique token.

Example:

B142

Token should be unique within the required operating period.

Store:

* Token
* Order ID
* Date
* Queue position
* Status

Token statuses:

WAITING
ACCEPTED
PREPARING
READY
PICKED_UP
CANCELLED

---

# 18. QR Code

Generate a QR code for every confirmed order.

QR should contain a secure order verification identifier.

Do not put sensitive personal information directly into the QR.

Kitchen staff can scan the QR to verify pickup.

After successful verification:

Order status = PICKED_UP

---

# 19. Student Order Tracking

Create a real-time order tracking screen.

Timeline:

✓ Order placed

✓ Payment confirmed

✓ Accepted

● Preparing

○ Ready

○ Picked up

Display:

* Token
* Queue position
* Estimated ready time
* Order items
* Pickup type
* Counter
* QR code

---

# 20. Live Queue

Create a live queue interface.

Example:

B137 — READY
B138 — PREPARING
B139 — PREPARING
B140 — WAITING
B141 — WAITING
B142 — YOU

Use Supabase Realtime where possible.

---

# 21. Kitchen Dashboard

Create a Kitchen Display System.

Three columns:

NEW
PREPARING
READY

Order card:

* Token
* Items
* Quantity
* Pickup time
* Order type
* Table number if dine-in
* Time elapsed
* Estimated ready time

Actions:

NEW:

Accept

PREPARING:

Mark Ready

READY:

Verify Pickup

Use drag-and-drop only if it improves usability; buttons are sufficient for MVP.

---

# 22. Kitchen Notifications

When a new order arrives:

Show a visual notification.

When order becomes ready:

Notify the student.

Use realtime updates.

---

# 23. Pickup Verification

Staff scans student QR.

System verifies:

* Order exists
* Payment successful
* Order is ready
* Order has not already been collected

If valid:

> Pickup verified successfully.

Set status:

PICKED_UP

If invalid:

Show appropriate error.

---

# 24. Table QR Ordering

Support QR codes placed on canteen tables.

Example:

Table 12 QR

When scanned:

table_id = 12

Student can order.

Kitchen sees:

B155
Table 12
Dine-in

---

# 25. Takeaway / Parcel

Allow:

Dine-in
Takeaway

Takeaway orders must display:

📦 TAKEAWAY

Optional packaging fee.

---

# 26. Categories

Default categories:

* Meals
* Snacks
* Fast Food
* Beverages
* Tea & Coffee
* Desserts
* Healthy
* Specials

Admins can create custom categories.

---

# 27. Inventory

Create inventory management.

Inventory fields:

* Ingredient
* Unit
* Current quantity
* Minimum quantity
* Maximum quantity
* Cost
* Supplier
* Expiry date
* Last updated

Status:

NORMAL
LOW
CRITICAL
OUT OF STOCK

---

# 28. Ingredient Mapping

Products should be linked to ingredients.

Example:

Chicken Biriyani:

Rice: 250g
Chicken: 150g
Oil: 20ml
Spices: 15g

When an order is confirmed:

Automatically deduct ingredient quantities.

Example:

10 biriyanis:

Rice -2.5kg
Chicken -1.5kg
Oil -200ml

---

# 29. Automatic Product Availability

If ingredients are insufficient for a product:

Automatically prevent ordering.

Example:

Chicken stock = 0

Chicken Biriyani:

SOLD OUT

Show the reason internally to admins.

---

# 30. Inventory Alerts

Create alerts:

LOW STOCK
CRITICAL STOCK
EXPIRING SOON
OUT OF STOCK

Admin dashboard should display alerts.

---

# 31. Canteen Admin Dashboard

Show:

Today's orders
Today's revenue
Active orders
Average preparation time
Refunds
Complaints
Inventory alerts
Popular products
Peak hours

Quick actions:

Add Food
Update Menu
Manage Inventory
View Orders
View Refunds
View Complaints

---

# 32. Add Food

Admin can manually add:

* Food name
* Image
* Description
* Category
* Price
* Preparation time
* Initial quantity
* Ingredients
* Vegetarian/non-vegetarian
* Allergens
* Availability

Allow image upload to Supabase Storage.

---

# 33. Menu Management

Admin can:

* Add product
* Edit product
* Delete/deactivate product
* Change price
* Change availability
* Change preparation time
* Mark featured
* Mark popular
* Update image

---

# 34. Principal Dashboard

Principal/Super Admin should have high-level analytics.

Show:

* Total revenue
* Orders
* Average order value
* Popular foods
* Peak hours
* Food wastage
* Refund amount
* Complaint count
* Average preparation time
* Staff activity

Principal should not be responsible for daily kitchen operations.

---

# 35. Analytics

Charts:

* Orders by hour
* Revenue by day
* Top foods
* Category performance
* Refunds
* Complaints
* Average preparation time

Allow:

Today
7 days
30 days
Custom range

---

# 36. Feedback

After pickup:

Ask:

How was your order?

Rating:

1–5 stars

Categories:

Food quality
Preparation time
Packaging
Service

Allow optional comment.

---

# 37. Complaint System

Complaint categories:

Food Quality
Payment
Delay
Missing Item
Wrong Item
Refund
Staff
Cleanliness
Other

Complaint states:

OPEN
ASSIGNED
INVESTIGATING
RESOLVED
CLOSED

Student can track complaint status.

Allow image upload as evidence.

---

# 38. Notifications

Create notification center.

Examples:

Payment successful
Order accepted
Order preparing
Order ready
Refund initiated
Refund completed
Complaint updated
Food sold out
Pickup reminder

---

# 39. Gamification

Add a lightweight optional reward system.

Features:

Foodie streak
Bite points
Coupons
Most ordered food
Weekly challenge

Example:

🔥 5-day ordering streak

+50 Bite Points

Keep this secondary to the core system.

---

# 40. Queue IQ

Create an innovative feature called Queue IQ.

Show:

Current queue load
Estimated waiting time
Recommended pickup time

Example:

> 🧠 Queue IQ recommends 1:15 PM.

> Current canteen load: BUSY

This should be based on actual order data where possible.

---

# 41. Canteen Mood

Create a fun status indicator.

CHILL
BUSY
CHAOTIC

Determine status based on active orders / queue load.

Example:

🟢 CHILL

🟡 BUSY

🔴 CHAOS

Make it visually fun but not childish.

---

# 42. Food Battle

Optional gamification:

Food A vs Food B

Students vote.

Admin can view results.

---

# 43. POS / Billing Integration Architecture

Design the backend so external POS systems can be integrated later.

Create an abstraction:

Order Service
→ POS Adapter
→ External POS

Do not attempt to reverse engineer proprietary systems.

If the existing billing/token machine provides an official API, USB/Serial interface, LAN interface or ESC/POS protocol, it can be connected through an adapter service.

For the hackathon, create a simulated POS printer.

---

# 44. Thermal Printer Support

Design optional ESC/POS printing.

When an order is confirmed:

Generate:

* Token
* Receipt

Example:

## BITEQ

TOKEN: B142

Chicken Biriyani x2
Lime Juice x1

TOTAL: ₹205

## Pickup: 1:05 PM

Use a mock print service if physical printer is unavailable.

---

# 45. Database Schema

Use Supabase PostgreSQL.

Create tables:

profiles
roles
canteens
categories
products
ingredients
inventory
product_ingredients
orders
order_items
payments
refunds
tokens
pickup_slots
notifications
feedback
complaints
staff
staff_activity
coupons
rewards
audit_logs
tables

Use foreign keys and appropriate indexes.

---

# 46. Security

Use Supabase Row Level Security.

Students:

Can view their own:

* Profile
* Orders
* Payments
* Tokens
* Complaints
* Feedback

Staff:

Can view/manage appropriate kitchen orders.

Admins:

Can manage menu/inventory/orders.

Principal:

Can view high-level analytics and administrative information.

Never expose service-role keys in the frontend.

Never trust frontend payment status.

Validate all sensitive actions on the server.

---

# 47. API / Server Architecture

Use Next.js server actions or API routes where appropriate.

Separate:

* Authentication
* Orders
* Payments
* Inventory
* Tokens
* Queue
* Notifications
* Refunds

Business logic should not be duplicated across frontend components.

---

# 48. Error Handling

Handle:

* Payment failure
* Network failure
* Sold-out product
* Invalid QR
* Duplicate pickup
* Cancelled order
* Refund failure
* Inventory shortage
* Closed canteen
* Invalid pickup slot

Use friendly error messages.

---

# 49. Demo Data

Seed the application with realistic sample data.

Foods:

Chicken Biriyani
Veg Biriyani
Porotta
Chicken Curry
Chicken Roll
Veg Roll
Burger
French Fries
Samosa
Lime Juice
Tea
Coffee
Milkshake

Create realistic prices and preparation times.

Create sample users for:

Student
Staff
Admin
Principal

---

# 50. Demo Mode

Create a demo mode for the hackathon.

Allow judges to experience:

1. Login as Student
2. Order food
3. Complete simulated payment
4. Generate token
5. Open kitchen dashboard
6. Accept order
7. Mark preparing
8. Mark ready
9. Open student screen
10. Show live update
11. Scan/verify QR
12. Submit feedback
13. Show admin analytics

Make the entire demo flow reliable without requiring external production services.

---

# 51. UI Navigation

Student:

Dashboard
Menu
Cart
Orders
Active Order
Notifications
Profile

Kitchen:

Queue
Preparing
Ready
Pickup Verification

Admin:

Dashboard
Orders
Menu
Inventory
Payments
Refunds
Complaints
Feedback
Analytics
Staff
Settings

Principal:

Overview
Analytics
Revenue
Orders
Complaints
Reports
Settings

---

# 52. Responsive Design

Mobile:

Bottom navigation.

Desktop:

Sidebar navigation.

Kitchen:

Large touch-friendly cards.

Admin:

Data tables + charts.

---

# 53. Accessibility

Implement:

* Proper contrast
* Keyboard navigation
* Focus states
* Accessible buttons
* Alt text
* Semantic HTML
* Screen-reader-friendly status indicators

---

# 54. Loading States

Use skeleton loaders.

Avoid blank screens.

For long operations show:

Processing
Verifying payment
Generating token
Updating order

---

# 55. Empty States

Create beautiful empty states.

Example:

No active orders:

> 🍽 Nothing cooking yet.

[ Browse Menu ]

No complaints:

> ✨ No complaints. That's a good sign.

---

# 56. Technical Priority

Build in this order:

PHASE 1
Project setup
Authentication
Database
Roles

PHASE 2
Landing page
Student dashboard
Menu
Food details

PHASE 3
Cart
Checkout
Order creation

PHASE 4
Digital tokens
QR
Order tracking

PHASE 5
Kitchen dashboard
Realtime queue

PHASE 6
Admin dashboard
Menu management
Inventory

PHASE 7
Feedback
Complaints
Notifications

PHASE 8
Analytics

PHASE 9
Payment integration

PHASE 10
Advanced features

---

# 57. MVP Priority

If development time becomes limited, prioritize:

1. Authentication
2. Menu
3. Cart
4. Order
5. Token
6. Kitchen queue
7. Order status
8. Admin menu management
9. Inventory
10. QR pickup

Advanced features can be mocked if necessary.

---

# 58. Important Product Principle

Do NOT build this as just an e-commerce food ordering website.

Build it as:

> **A complete digital operating system for campus canteens.**

The central concept is:

ORDER → QUEUE → KITCHEN → INVENTORY → PICKUP → FEEDBACK

Everything should connect to this lifecycle.

---

# 59. Final Quality Requirements

The final application should:

* Feel production-ready
* Have realistic data
* Have polished UI
* Be responsive
* Have smooth transitions
* Have clear navigation
* Have proper error handling
* Use reusable components
* Use TypeScript properly
* Avoid unnecessary duplication
* Keep secrets server-side
* Use environment variables
* Include setup documentation
* Include database schema/migrations
* Include seed/demo data
* Include a README
* Include a clear demo flow

Do not generate fake functionality where real functionality can reasonably be implemented.

For external services that cannot be safely configured during development, implement clean mock adapters so they can later be replaced by real integrations.

---

# 60. Final Hackathon Demo

The ideal final demonstration:

Student opens BiteQ.

Sees:

> 🟢 Canteen Open
> Queue: 18 orders
> Average wait: 11 min

Student selects Chicken Biriyani.

Adds it to cart.

Selects:

> Pickup: 1:05 PM

System recommends the time.

Student completes test payment.

Gets:

# B142

with QR.

Kitchen dashboard immediately receives B142.

Staff accepts.

Status changes to:

PREPARING

Student's screen updates in real time.

Staff marks:

READY

Student receives notification.

Staff scans QR.

Order becomes:

PICKED UP.

Student gives rating.

Admin dashboard automatically updates:

Orders
Revenue
Popular food
Average preparation time
Inventory

This complete flow should be the primary hackathon demonstration.

