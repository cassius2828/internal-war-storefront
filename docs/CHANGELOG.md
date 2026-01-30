# Changelog

All notable changes to the Internal War Storefront will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- **HeroBanner component** (`app/components/HeroBanner.tsx`) - Full-width immersive image banner
  - Edge-to-edge image grid with no gaps between photos
  - Dark tint overlay on images for text legibility
  - Centered slogan/text overlay with configurable messaging
  - Responsive design: 3-column on desktop, stacked on mobile
  - Subtle hover effects (image scale, tint darkening)
  - CTA button with hover animation
  - Alternative style variants (minimal, dark, gradient)
  - Newsreader serif typography for premium streetwear aesthetic
- Comprehensive documentation in `/docs` directory
- `TODOS.md` for project task tracking
- `DECISIONS.md` for architectural decision records
- `.nvmrc` file to pin Node.js version to v20
- Design tokens system (`app/styles/tokens.css`) with spacing, typography, colors, shadows, and transitions
- Layout utility classes (page-wrapper, section-spacing, section-title, divider)
- Thumbnail navigation strip for desktop product image gallery
- Swipe gestures for mobile product image carousel
- Loading spinner animation for add-to-cart button
- Section titles for homepage product grid and collections
- **New SearchModal component** (`app/components/SearchModal.tsx`) - Modern full-screen search experience
  - Full-screen modal with backdrop blur effect
  - Debounced search input (200ms) for better performance
  - Global keyboard shortcut (⌘K / Ctrl+K) to open search from anywhere
  - Keyboard navigation support (ESC to close, Enter to view all results)
  - Clean empty state with search icon and keyboard hint
  - Loading skeleton animations
  - No results state with helpful message
  - Product cards with images, titles, and prices in responsive grid
  - Collection, page, and article results sections
  - "View all results" CTA button
  - Mobile-optimized slide-up animation
- **Modernized Cart UI** - Complete overhaul of cart sidebar
  - Clean product cards with better image presentation
  - Modern quantity selector with +/- buttons
  - Variant options displayed as styled tags
  - In-stock/out-of-stock indicators with icons
  - Collapsible discount code section with animation
  - Order summary with subtotal, shipping, and total
  - Premium checkout button with hover effects
  - Security note with lock icon
  - Empty cart state with call-to-action
  - Optimistic UI feedback for cart updates
- **Redesigned Collections Page** - Premium collection browsing experience
  - Elegant page header with title and subtitle
  - Modern collection cards with 4:5 aspect ratio images
  - Gradient overlay for text legibility
  - Product count badges on each card
  - Hover effects with scale, shadow, and content reveal
  - Description and "Shop Collection" CTA appear on hover
  - Image swap on hover for collections with secondary images
  - Staggered entrance animations for cards
  - Collection metadata with descriptions
  - Responsive 3-column grid layout
- **Redesigned Individual Collection Pages** (Sweats, Hoodies, etc.)
  - Elegant page header with collection title and description
  - Collection descriptions for each category
  - Sticky toolbar with product count, sort dropdown, and view toggle
  - Sort dropdown with multiple options (Featured, Price, Newest)
  - Grid/List view toggle buttons
  - Improved responsive product grid (2-4 columns)
  - Staggered product card entrance animations
  - Better pagination styling

### Changed
- **Product Details & Shipping Accordions**: Improved styling while maintaining original layout
  - Added icon badges to accordion headers (tag icon for Product Details, truck icon for Shipping)
  - Icon backgrounds animate between states (neutral-100 when closed, neutral-900 when open)
  - Improved list styling with custom bullet points for product details
  - Green checkmark indicators for shipping details list items
  - Content indented to align with accordion title for better visual hierarchy
  - Maintains original border-based layout structure
- **Search UI**: Complete overhaul from basic aside panel to modern full-screen modal with premium e-commerce UX
- **Cart UI**: Complete redesign of CartMain, CartLineItem, and CartSummary components with modern styling
- **Collections Page**: Redesigned from basic grid to premium card layout with overlays, hover effects, and animations
- **Individual Collection Pages**: Complete overhaul with header, description, toolbar, and improved product grid
- **Header**: Added global ⌘K keyboard shortcut listener for search; improved spacing, typography with letter-spacing, refined dropdown animations with smooth fade/slide, hover states with underline animations
- **Homepage Hero**: Enhanced with gradient overlay for text legibility, larger typography, premium CTA button styling
- **Homepage Sections**: Added consistent section spacing using design tokens, section headers with proper hierarchy
- **Product Images Grid (Desktop)**: Larger gaps, thumbnail strip navigation, subtle hover effects with scale and overlay
- **Product Images Carousel (Mobile)**: Smooth slide transitions, premium minimal controls, image counter, line-style indicators
- **ProductForm/SizePicker**: Premium grid layout, visual states for active/unavailable sizes, size guide link, strikethrough for unavailable variants
- **AddToCartButton**: Full-width premium styling, uppercase tracking, loading state with spinner
- **Accordion/ShippingDetailsHTML**: Smooth height transitions, cleaner borders, better typography
- **ProductPrice**: Better typography hierarchy, inline discount display with proper styling
- **Product Page Layout**: Improved flex layout with sticky sidebar, better responsive spacing

### Fixed
- **Product card image consistency**: Fixed inconsistent product image heights across grids
  - Enforced consistent 1:1 aspect ratio on product card images using inline style
  - Added `object-center` to ensure images are centered when cropped
  - Fixed flex layout causing image container stretching
  - Updated list view product images with explicit aspect ratio
- Dev server startup issue caused by Node.js v22/v24 incompatibility with Shopify CLI
- Removed unused props from ProductImages and ProductImagesProps type
- Removed debug console.logs from homepage loader

### Deprecated
- None

### Removed
- Old SearchAside component from PageLayout (replaced by modern SearchModal)

### Security
- 36 npm vulnerabilities identified (to be addressed)

---

## [2024.7.9] - Previous Release

Initial Hydrogen storefront setup based on Shopify's skeleton template.

### Features
- Product browsing and detail pages
- Collection pages with pagination
- Shopping cart functionality
- Customer account management
- Search (regular and predictive)
- Blog/articles
- Static pages
- Policies

### Tech Stack
- Remix v2.14.0
- Hydrogen v2024.10.1
- Tailwind CSS v4.0.0-alpha.33
- TypeScript

---

<!-- 
Template for new versions:

## [X.X.X] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes in existing functionality

### Fixed
- Bug fixes

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Security
- Security fixes
-->
