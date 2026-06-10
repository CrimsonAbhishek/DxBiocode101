# DX BIOCODE PROJECT CONTEXT

## PROJECT OVERVIEW

* **Project name**: DX BIOCODE
* **Company name**: DX BIOCODE
* **Industry**: Medical / Diagnostic Equipment
* **Business model**: B2B (Clinics, ICUs, Ambulances, Point-of-Care Facilities)
* **Main products**: DX 101 Immunofluorescence Quantitative Analyzer, Diagnostic Test Kits
* **Website purpose**: Product catalog, quote generation, service request, contact lead generation, and career application.
* **Target audience**: Doctors, clinics, hospitals, ICUs, ambulances, and laboratory directors.
* **Current project status**: Fully decoupled architecture completed. Frontend (React/Vite) is fully functional and deployed on Vercel. Backend (Node.js/Express) is fully built and ready for production hosting.

---

## TECHNOLOGY STACK

### Frontend

* **Languages used**: TypeScript, HTML5, CSS3
* **Frameworks used**: React 19, Vite 8
* **Libraries used**: `react-router-dom` (routing), `zustand` (global state/cart), `framer-motion` (animations), `axios` (API client), `lucide-react` (icons)
* **CSS architecture**: Vanilla CSS using modular component classes (`globals.css`, `index.css`, `App.css`) with CSS variables for theming.
* **JavaScript architecture**: React Single Page Application (SPA) using functional components and hooks.

### Backend

* **Current backend**: Node.js, Express.js
* **Planned backend**: Node.js, Express.js
* **APIs**: REST API implementation
* **Database**: MySQL

### Hosting

* **Domain provider**: TBD (Currently using Vercel default domain)
* **Hosting provider**: Vercel (Frontend)
* **Deployment strategy**: Vercel Monorepo deployment. A root-level `vercel.json` and `package.json` redirect builds to the `Frontend` directory while keeping the codebase unified.

---

## FILE STRUCTURE

```text
project-root/
├── package.json               # Root package for Vercel Monorepo routing
├── vercel.json                # Root Vercel config defining build/install commands
├── Backend/
│   ├── .env                   # Environment variables
│   ├── package.json           # Backend dependencies and scripts
│   ├── tsconfig.json          # TypeScript config for backend
│   └── src/
│       ├── server.ts          # Express server entry point
│       ├── controllers/       # Request handlers
│       │   ├── careerController.ts
│       │   ├── contactController.ts
│       │   ├── quoteController.ts
│       │   └── trainingController.ts
│       ├── db/                # Database connection & schema
│       │   ├── connection.ts  # MySQL connection pool
│       │   ├── migrate.ts     # Schema migration script
│       │   └── schema.sql     # Database table definitions
│       ├── routes/            # Express route definitions
│       │   ├── careers.ts
│       │   ├── contact.ts
│       │   ├── quotes.ts
│       │   └── training.ts
│       ├── services/          # External services
│       │   ├── emailService.ts # Resend email integration
│       │   └── r2Service.ts    # Cloudflare R2 / S3 file storage
│       └── types/             # TypeScript interfaces
│           └── index.ts
└── Frontend/
    ├── index.html             # HTML entry point
    ├── package.json           # Frontend dependencies
    ├── vite.config.ts         # Vite bundler config
    └── src/
        ├── App.tsx            # Main React component and Router
        ├── main.tsx           # React DOM render entry
        ├── App.css            # Base App styles
        ├── index.css          # Tailwind/Base styles
        ├── api/               
        │   └── client.ts      # Axios API client wrapper
        ├── components/        # Reusable UI components
        │   ├── CartDrawer.tsx # Slide-out cart
        │   ├── CertificationsSection.tsx 
        │   ├── CtaBanner.tsx  # Call to action block
        │   ├── FadeUp.tsx     # Framer-motion wrapper
        │   ├── Footer.tsx     
        │   ├── Navbar.tsx     # Main navigation
        │   ├── ScrollProgressBar.tsx 
        │   ├── StatCounter.tsx # Animated number counter
        │   ├── TiltCard.tsx   # Interactive hover card
        │   └── TopBar.tsx     # Top contact info bar
        ├── pages/             # Route-level components
        │   ├── About.tsx      
        │   ├── Careers.tsx    
        │   ├── Contact.tsx    
        │   ├── Home.tsx       
        │   ├── Products.tsx   
        │   ├── Quote.tsx      
        │   └── Service.tsx    
        ├── store/
        │   └── cartStore.ts   # Zustand cart state
        └── styles/
            └── globals.css    # Global CSS definitions
```

---

## COMPLETE SITE MAP

Home
├── Products
│   ├── DX 101 Immunofluorescence Quantitative Analyzer
│   └── Diagnostic Test Kits (Planned)
├── Service
├── Careers
├── Contact
├── About
└── Quote

---

## NAVIGATION STRUCTURE

* **Header navigation**: TopBar (Contact phone/email), Navbar (Logo, Home, Products, Service, About, Contact, Careers, Cart Toggle, Request Quote CTA)
* **Footer navigation**: Quick Links (replicating Navbar), Products links, Contact details, Social links
* **Internal links**: Homepage Hero -> Products, Homepage Featured -> Products, Service Cards -> Contact
* **Conversion paths**: Product Page -> Add to Cart -> Cart Drawer -> Request Quote -> Quote Submission Form
* **CTA paths**: Global header "Request Quote" button, "Add to Cart" buttons on products, "Request Demo" buttons linking to contact form.

---

## PRODUCT ARCHITECTURE

### Primary Product

DX 101 Immunofluorescence Quantitative Analyzer

* **Description**: India's first portable and handheld multi-parameter POCT device.
* **Purpose**: Provide rapid quantitative IVD results at the point of care.
* **Technical specifications**: Compact size, Android OS, long battery life, universal Lims Connectivity HL7 interface, 50,000 results storage.
* **Applications**: Clinics, ICUs, ambulances, and remote diagnostic camps.
* **Related products**: Specific diagnostic test kits.

### Secondary Products

Diagnostic Test Kits

* **Hierarchy**: Listed under the main Products page.
* **Document Relationships**: Tests directly pair with the DX 101 Analyzer. Currently categorized in tabs (Cardiac, Infection, etc.) but physical sub-pages are planned.

---

## PAGE INVENTORY

### Home
* **File Name**: `Home.tsx`
* **URL**: `/`
* **Purpose**: Main landing page introducing the brand and flagship analyzer.
* **Sections**: Hero, Stat Bar, Key Features, Featured Product, Application Scenarios.
* **Components**: `Navbar`, `Footer`, `FadeUp`, `TiltCard`, `StatCounter`.
* **Forms**: None.
* **Buttons**: Shop Products, Specifications, Add to Cart, View Details.
* **CTAs**: Add to Cart, Request Quote.
* **Interactive Features**: Animated counters, tilt hover effects on cards, cart slide-out.
* **Dependencies**: `framer-motion`, `zustand` (cart).
* **Business Goal**: Brand awareness and direct funneling to the Products/Quote pages.

### Products
* **File Name**: `Products.tsx`
* **URL**: `/products`
* **Purpose**: Showcase the DX 101 and available test parameters.
* **Sections**: Hero, Product Hero Card, Tabbed Information (Overview, Applications, Specifications).
* **Components**: `CtaBanner`.
* **Forms**: None.
* **Buttons**: Add to Cart, Request Demo, Brochure Download.
* **CTAs**: Request Quote, Add to Cart.
* **Interactive Features**: Tab switching for technical specifications.
* **Dependencies**: `zustand`.
* **Business Goal**: Educate on product capabilities and initiate the quote flow.

### Service
* **File Name**: `Service.tsx`
* **URL**: `/service`
* **Purpose**: Explain after-sales support and training.
* **Sections**: Hero, Service Pillars (Installation, Maintenance, Training), CTA.
* **Components**: `FadeUp`, `CtaBanner`.
* **Forms**: None.
* **Buttons**: Contact Service Team.
* **Business Goal**: Build trust and handle support inquiries.

### Contact
* **File Name**: `Contact.tsx`
* **URL**: `/contact`
* **Purpose**: General inquiries and demo requests.
* **Sections**: Contact Details, Map Placeholder, Contact Form.
* **Forms**: Contact Form (Name, Email, Phone, Subject, Message).
* **Buttons**: Send Message.
* **Interactive Features**: Form validation and API submission.
* **Dependencies**: `axios`.
* **Business Goal**: Direct lead generation.

### About
* **File Name**: `About.tsx`
* **URL**: `/about`
* **Purpose**: Company history, mission, and vision.
* **Sections**: Hero, Mission/Vision blocks, Company Timeline.
* **Forms**: None.
* **Business Goal**: Corporate credibility.

### Careers
* **File Name**: `Careers.tsx`
* **URL**: `/careers`
* **Purpose**: Job listings and application intake.
* **Sections**: Hero, Benefits, Job Listings, Application Form.
* **Forms**: Career Application Form (Includes file upload for Resume).
* **Interactive Features**: Form submission with multipart/form-data.
* **Business Goal**: Talent acquisition.

### Quote
* **File Name**: `Quote.tsx`
* **URL**: `/quote`
* **Purpose**: Checkout-style flow for requesting pricing on cart items.
* **Sections**: Cart Summary, Customer Information Form.
* **Forms**: Quote Request Form.
* **Buttons**: Submit Request, Remove Item.
* **Interactive Features**: Cart modification, API form submission.
* **Dependencies**: `zustand`, `axios`.
* **Business Goal**: Conversion of product interest into direct sales negotiations.

---

## FEATURE INVENTORY

* **Cart**: Allows users to save products of interest globally. Uses `zustand` and Local Storage. Status: Completed.
* **Quote Workflow**: Consolidates cart items into a form submission. Posts to `/api/quotes`. Backend sends email via Resend and saves to MySQL. Status: Completed.
* **Contact Workflow**: Direct inquiry submission. Posts to `/api/contact`. Status: Completed.
* **Careers Workflow**: Job application with file upload. Posts to `/api/careers`. Backend uploads resume to S3/R2 and saves reference in DB. Status: Completed.
* **Test Menu**: Tabbed interface in `Products.tsx` showing supported assays. Status: Completed.
* **Mobile Navigation**: Hamburger menu in `Navbar.tsx` for responsive routing. Status: Completed.
* **Statistics Counters**: Animated number counters via `StatCounter.tsx`. Status: Completed.
* **3D Effects**: Interactive mouse-tracking tilt effect via `TiltCard.tsx`. Status: Completed.

---

## DATA FLOW

### Add To Cart Flow
1. User clicks "Add to Cart" on a product.
2. `cartStore.ts` `addToCart()` is called.
3. Zustand updates global state and syncs to `localStorage`.
4. `CartDrawer.tsx` opens automatically displaying the newly added item.

### Request Quote Flow
1. User navigates to `/quote` (via Cart Drawer or header CTA).
2. `Quote.tsx` reads items from `cartStore.ts`.
3. User fills out customer details and submits.
4. Frontend `api/client.ts` sends POST request to Backend `/api/quotes`.
5. Backend `quoteController.ts` validates payload, saves to `quotes` and `quote_items` tables.
6. `emailService.ts` fires a notification email to admins.
7. Frontend displays success message and clears the cart.

### Contact Form Flow
1. User submits form on `/contact`.
2. Frontend sends POST request to `/api/contact`.
3. Backend saves to `contacts` table and sends notification email.

### Career Application Flow
1. User fills form and attaches PDF resume on `/careers`.
2. Frontend sends `multipart/form-data` POST request to `/api/careers`.
3. Backend middleware `multer` parses the file.
4. `r2Service.ts` uploads file to S3/R2 bucket.
5. `careerController.ts` saves applicant details and resume URL to `careers` table.

---

## DATABASE ARCHITECTURE

* **Current implementation**: MySQL (using `mysql2` package).
* **Planned implementation**: Same.
* **Tables**:
  * `contacts`: General inquiries.
  * `quotes`: Parent table for quote requests.
  * `quote_items`: Child table linking products to quotes.
  * `careers`: Job applications and resume links.
  * `training`: Support and installation requests.
* **Relationships**: `quotes` -> `quote_items` (One-to-Many).
* **APIs**: Built with Express, interacting via raw SQL queries in controllers.
* **Storage strategy**: Relational data in MySQL; unstructured files (resumes) in S3/Cloudflare R2.

---

## DEPLOYMENT ARCHITECTURE

* **Domain**: Vercel generated domain currently.
* **Hosting**: Frontend on Vercel.
* **Backend hosting**: TBD (AWS/Render/DigitalOcean).
* **Database hosting**: TBD (PlanetScale/RDS/Aiven).
* **File storage**: Cloudflare R2 (S3 compatible).
* **Email provider**: Resend API.

---

## CURRENT PROJECT STATUS

### Completed
* Frontend UI/UX, routing, and global state (Cart).
* Frontend API client integration.
* Backend Express API, Controllers, and Database Schema.
* Email Service (Resend) and Storage Service (S3/R2) integrations.
* Vercel Monorepo configuration.

### In Progress
* Production deployment of the Node.js Backend.

### Planned
* Production MySQL Database provisioning.
* Custom Domain attachment.

### Blocked
* None.

---

## KNOWN LIMITATIONS

* **Technical limitations**: State is currently bound to local storage; cart does not persist across different devices for the same user without accounts.
* **Missing features**: User accounts/Authentication. E-commerce checkout (currently operating as a Quote engine only).
* **Security limitations**: File upload size limits must be strictly enforced via Nginx/Backend once hosted to prevent storage abuse.

---

## FUTURE ROADMAP

* **Phase 1**: Finalize backend hosting, provision MySQL production database, and attach custom domain.
* **Phase 2**: Implement User Authentication for clinics to log in and view their historical quotes and active orders.
* **Phase 3**: Add full E-commerce payment gateways to transition from a Quote model to a direct Purchase model.
* **Phase 4**: Build an Admin Dashboard for managing products, viewing quotes, and handling career applications directly from the website.

---

## DEVELOPER CHEAT SHEET

* **Important files**:
  * `Frontend/src/store/cartStore.ts` - Core state manager.
  * `Frontend/src/api/client.ts` - All frontend API calls.
  * `Backend/src/db/schema.sql` - Database truth.
  * `Backend/src/server.ts` - Backend entry point and route definitions.
* **Important functions**:
  * `addToCart` / `removeFromCart` inside `cartStore.ts`.
  * `uploadFile` inside `Backend/src/services/r2Service.ts`.
* **Important workflows**: Quote generation (Frontend `Quote.tsx` -> Backend `quoteController.ts`).
* **Important routes**:
  * Frontend: `/products`, `/quote`
  * Backend: `/api/quotes` (POST), `/api/careers` (POST)

---

## AI MEMORY PACK

DX BIOCODE is a B2B React/Vite (Frontend) + Node/Express/MySQL (Backend) monorepo project deployed on Vercel. Flagship product: DX 101 POCT Analyzer. Main conversion flow: Users add products to a Zustand-managed cart, proceed to `/quote`, and submit a payload to the backend which stores it in MySQL and emails admins via Resend. The architecture is fully decoupled. All UI uses vanilla CSS (`globals.css`) with framer-motion animations. Backend handles multipart form uploads (resumes) via multer and S3/R2. Currently, frontend is production-ready on Vercel; backend deployment and MySQL production provisioning are the immediate next steps.
