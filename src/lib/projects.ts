/** A bolded lead-in followed by its explanation, e.g. "State pattern: ..." */
export type Point = { title: string; text: string };

/** A headed block of the detailed write-up in the pop-up */
export type Section = { heading: string; body?: string[]; points?: Point[] };

export type Project = {
  name: string;
  /** Where it was made, e.g. a course or event */
  context?: string;
  /** Web app, mobile app, ... */
  type: string;
  /** One-liner shown on the card */
  description: string;
  /** Longer explanation shown in the project detail pop-up, one string per paragraph */
  overview: string | string[];
  /** My role in the team, shown under the title in the pop-up */
  role?: string;
  /** Key features of the project, shown as a list in the pop-up */
  highlights: string[];
  /** Optional detailed write-up, shown after the highlights */
  sections?: Section[];
  /** What I personally worked on, shown in a box above "Built with" in the pop-up */
  contributions: (string | Point)[];
  tech?: string[];
  /** Repository / project page and live demo, shown as links in the pop-up */
  projectUrl: string;
  demoUrl: string;
  /** Optional award, shown as a small badge in the pop-up */
  award?: string;
  /** Cover image in /public/projects */
  image: string;
};

// Placeholder until my contributions for this project are written up
const CONTRIBUTIONS_TBA = "To be added";

// Placeholder until the real project and demo links are ready
const PLACEHOLDER_URL = "http://localhost:3000";

// Shown in this order in the Projects carousel
export const PROJECTS: Project[] = [
  {
    name: "LigaPass",
    type: "Web & mobile app",
    description: "Football ticketing platform where fans buy match tickets and read the latest news.",
    overview: [
      "LigaPass brings football match ticketing and a football news portal into one place. Fans browse the match schedule (upcoming, ongoing and past), pick a seat category (VVIP, VIP or Regular), pay, and get a digital ticket with a barcode. They can also read and comment on news, rate and review matches, and see their own spending and attendance analytics.",
      "It was built by a team of five for the Platform-Based Programming course at Universitas Indonesia, as a Django web app and a Flutter mobile app that share the same backend. Match data comes from an English Premier League dataset on Kaggle and scraped fixtures, cleaned and standardized before being loaded.",
      "I owned the Profile Management module, from the data models and access control to the JSON APIs, the pages and the tests. Here is a look at what went into it.",
    ],
    role: "Full-stack Developer, Profile Management",
    highlights: [
      "Three roles (user, admin and journalist), each with its own pages and permissions",
      "Ticket booking by seat category, with payment and a digital barcode ticket",
      "News portal with comments, plus match reviews and spending analytics",
      "Web app and Flutter mobile app running on the same Django backend",
    ],
    sections: [
      {
        heading: "One Profile Module, Three Roles",
        body: ["Each role gets its own profile page, built with Django templates, Tailwind and AJAX so the pages update without reloading:"],
        points: [
          {
            title: "User",
            text: "A profile setup step right after registration, then full editing of profile picture, first and last name, username, email, phone number and date of birth. Users can also delete their own account.",
          },
          {
            title: "Admin",
            text: "A dashboard that lists every user, with live search by username and filtering by account status. From a user's profile, the admin can change the account status or delete the account.",
          },
          {
            title: "Journalist",
            text: "A summary of how many articles they have published and the total views across all of them.",
          },
          {
            title: "Navbar dropdown",
            text: "A shared profile menu that loads over AJAX and changes by role: Profile, My Tickets and Analytics for users, Analytics for admins, and Profile for journalists.",
          },
        ],
      },
      {
        heading: "Data Modeling",
        points: [
          {
            title: "Profile",
            text: "Linked one-to-one to the custom User model, storing the profile picture, date of birth and account status (active, suspended or banned).",
          },
          {
            title: "AdminJournalistProfile",
            text: "A separate model for the privileged roles. Journalist metrics (news_count and total_news_views) are aggregated in the database with Sum instead of being added up in Python.",
          },
          {
            title: "Seeded privileged accounts",
            text: "The admin and journalist accounts are created by a startup hook that is idempotent, so it never creates duplicates, and reads passwords from environment variables, so no credentials live in the code.",
          },
        ],
      },
      {
        heading: "Account Moderation Across Modules",
        body: [
          "I built the account status system that other modules depend on. Banned users cannot log in. Suspended users can log in with a warning, but cannot post comments on news. A shared get_user_status helper exposes the status to the rest of the app, and I wired it into the News module to block comments from suspended users.",
        ],
      },
      {
        heading: "Security and Validation",
        points: [
          {
            title: "Server-side access control",
            text: "Users can only edit their own profile, only admins can change an account's status, and only the owner or an admin can delete a profile. Every check returns the right HTTP status code (403, 404 or 405).",
          },
          {
            title: "Validation",
            text: "Phone numbers are validated on the server (10 to 15 digits), and duplicate profiles are rejected.",
          },
        ],
      },
      {
        heading: "Mobile Support and Testing",
        points: [
          {
            title: "JSON APIs",
            text: "Endpoints for profiles, the admin and journalist summaries, search and filtering, and the current session user.",
          },
          {
            title: "Flutter endpoints",
            text: "Create, edit (with multipart image upload), status change and delete endpoints, so the team's Flutter app could reuse the same backend.",
          },
          {
            title: "36 unit tests",
            text: "Covering views, permissions, the seeding logic and model properties, for both success and error cases.",
          },
        ],
      },
      {
        heading: "The Wider Stack",
        points: [
          {
            title: "Web",
            text: "Django 5 with PostgreSQL, Django REST Framework, Django Channels and Redis for real-time match updates, Tailwind CSS, Chart.js dashboards, Google Sign-In and the Midtrans payment gateway. Deployed to PWS with Gunicorn and WhiteNoise through GitHub Actions on every push to main.",
          },
          {
            title: "Mobile",
            text: "Flutter with Provider, session login through pbp_django_auth, Google Sign-In, fl_chart for analytics and a Gemini-powered assistant. GitHub Actions builds a signed release APK on every push to main, and Bitrise handles distribution.",
          },
        ],
      },
    ],
    contributions: [
      {
        title: "Profile Management owner",
        text: "Designed and built the profiles app end to end: data models, views and access control, JSON APIs, Tailwind and AJAX pages, and unit tests.",
      },
      {
        title: "Account moderation",
        text: "Built the active, suspended and banned status system that the Authentication module uses at login and the News module uses to block comments.",
      },
      {
        title: "Mobile support",
        text: "Exposed the profile endpoints the team's Flutter app uses, including multipart image upload for profile pictures.",
      },
      {
        title: "Testing and teamwork",
        text: "Wrote 36 unit tests for views, permissions, seeding and models, and worked in a 5-person team with feature branches, pull requests and Figma designs.",
      },
    ],
    tech: [
      "Python",
      "Django",
      "PostgreSQL",
      "Tailwind CSS",
      "JavaScript",
      "Redis",
      "Flutter",
      "Dart",
      "GitHub Actions",
      "Bitrise",
    ],
    award: "Best Application & Favorite App, PBP Awards 2025",
    projectUrl: PLACEHOLDER_URL,
    demoUrl: "https://jaysen-lestari-ligapass.pbp.cs.ui.ac.id/",
    image: "/projects/ligapass.png",
  },
  {
    name: "MySawit",
    type: "Web app",
    description: "Operations platform for palm oil plantations, from the field to the mill.",
    overview: [
      "MySawit is a web-based platform that brings palm oil plantation operations into one integrated system. It tracks the full commodity flow, from harvesting in the field and foreman (mandor) validation to truck delivery to the processing mill and payroll for every worker involved.",
      "It supports four roles (harvester, foreman, truck driver and admin) with role-based access control, and is built as loosely coupled microservices that communicate through well-defined interfaces instead of shared state. That keeps data consistent and makes each module easier to extend.",
      "I owned the Harvest Service, the microservice behind daily harvest logging. Here is a look at how it works and what went into it.",
    ],
    role: "Backend Engineer, Harvest Service",
    highlights: [
      "Four roles (harvester, foreman, truck driver and admin) with role-based access control",
      "Daily harvest logging with photo evidence and foreman approval",
      "Truck delivery tracking to the mill and payroll for every worker",
    ],
    sections: [
      {
        heading: "The Harvest Service: From Field Log to Payroll Event",
        body: [
          "Harvesters log their daily harvest with photo evidence, and foremen review each submission to approve or reject it. When a harvest is approved, the service sends an event downstream so payroll can be calculated. It runs as an event-driven microservice with its own PostgreSQL database, a local copy of user data synced from other services, and stateless JWT authentication instead of a shared session layer.",
          "I built five REST endpoints, all secured with a Bearer JWT and documented in an OpenAPI 3.0 spec:",
        ],
        points: [
          { title: "Log a harvest", text: "POST /harvests lets harvesters submit weight, notes and plantation with one or more photos in a multipart upload." },
          { title: "Personal history", text: "GET /harvests/my shows harvesters their own harvests, filtered by date range and status." },
          { title: "Team view", text: "GET /harvests gives foremen their team's harvests, with case-insensitive name search and date filtering." },
          { title: "Harvest detail", text: "GET /harvests/{id} returns a single harvest, with ownership checks for both the harvester and the foreman." },
          { title: "Review", text: "PATCH /harvests/update lets foremen approve or reject a harvest. A rejection must include a reason." },
        ],
      },
      {
        heading: "Business Rules Built Into the Flow",
        points: [
          { title: "One harvest per day", text: "A harvester can log only one harvest per day." },
          {
            title: "Assignment checks",
            text: "Only harvesters assigned to a foreman can log a harvest, and only foremen assigned to a plantation can review.",
          },
          {
            title: "Strict status transitions",
            text: "PENDING moves to either APPROVED or REJECTED, and both are final. A rejection must include a reason, and an approval must not have one.",
          },
          { title: "Team boundaries", text: "Foremen can only see and update harvests from their own harvesters." },
        ],
      },
      {
        heading: "Design Patterns That Keep the Logic Clean",
        body: ["To keep these rules from piling up in one service class, I split them across three patterns, each documented with UML diagrams:"],
        points: [
          {
            title: "State pattern",
            text: "PendingState, ApprovedState and RejectedState replace long if-else chains for status transitions, so a new status such as CANCELLED only needs a new class.",
          },
          {
            title: "Chain of Responsibility",
            text: "Harvest-log validation runs through AlreadyLoggedTodayHandler → HarvesterAssignedHandler → HarvestDataHandler, single-purpose handlers that are easy to extend and test.",
          },
          {
            title: "Proxy pattern",
            text: "HarvestServiceProxy is a role-based authorization layer in front of the core service, which keeps permission checks out of the business logic.",
          },
        ],
      },
      {
        heading: "Event-Driven Integration with RabbitMQ",
        body: ["Instead of calling other services synchronously, the Harvest Service talks to the rest of the platform through RabbitMQ topic exchanges."],
        points: [
          {
            title: "Payroll events",
            text: "When a harvest is approved, the service publishes a HarvestPayrollEvent to the payroll queue and to the harvest.exchange topic exchange (harvest.approved) for downstream services.",
          },
          {
            title: "Local user replica",
            text: "It consumes user.registered, user.assignment.*, user.deleted and plantation.assignment.* events from the Identity and Plantation services to keep a UserReplica table in sync. It can then validate harvesters and foremen without synchronous calls, which reduces coupling and latency.",
          },
          {
            title: "Defensive message handling",
            text: "A custom type-ID mapping lets events from other services deserialize correctly, and invalid payloads are logged and skipped instead of crashing the service.",
          },
        ],
      },
      {
        heading: "Security, Storage and Error Handling",
        points: [
          {
            title: "Stateless JWT auth",
            text: "The service verifies each token's HMAC signature with a shared secret and reads its userId and role claims, then applies role-based access and ownership checks on every resource.",
          },
          {
            title: "Photo storage",
            text: "Photos go to Supabase Storage through its S3-compatible API, each with a UUID filename, and their public URLs are stored in a PostgreSQL array column. Upload failures map to a custom StorageUploadException.",
          },
          {
            title: "Consistent errors",
            text: "A global @RestControllerAdvice turns domain exceptions such as ALREADY_LOGGED_TODAY, STATUS_ALREADY_UPDATED and UNAUTHORIZED_ACCESS into consistent JSON errors with the right HTTP code (400, 403, 404 or 409), plus field-level messages for validation errors.",
          },
        ],
      },
      {
        heading: "Testing, Delivery and Monitoring",
        points: [
          {
            title: "205 tests at 100% coverage",
            text: "Unit and integration tests cover controllers, services, the proxy, state classes, validation handlers, event consumers and publishers, mappers, repositories and config. A JaCoCo rule fails the build if line coverage drops, and SonarCloud runs a Quality Gate check on main.",
          },
          {
            title: "CI/CD to AWS EC2",
            text: "GitHub Actions builds, tests and scans every push and PR. Deployment copies the JAR to EC2, builds a multi-stage Docker image on an Alpine-based JRE 21, injects secrets as environment variables, restarts the container and runs a health check on /actuator/health with retries.",
          },
          {
            title: "Observability",
            text: "Actuator and Micrometer expose Prometheus metrics with HTTP latency histograms, feeding a Grafana dashboard provisioned as code (uptime, request rate, 5xx ratio, p95 latency, JVM memory, CPU, DB connections and threads). Production monitoring showed a p95 latency of 102 ms and a 0% 5xx error rate.",
          },
          {
            title: "Load testing",
            text: "JMeter runs at 300 concurrent users (1,500 requests per endpoint) kept a 100% success rate. The harvester history endpoint averaged 48 ms (P99 161 ms) and the foreman view averaged 831 ms (P99 1.39 s). I profiled the critical endpoints with IntelliJ Profiler to find bottlenecks.",
          },
        ],
      },
    ],
    contributions: [
      {
        title: "Harvest Service owner",
        text: "Designed and built the harvest logging and approval microservice end to end, from the REST API and business rules to photo storage, messaging and deployment.",
      },
      {
        title: "Clean architecture",
        text: "Applied the State, Chain of Responsibility and Proxy patterns to separate status transitions, validation and authorization from the core business logic.",
      },
      {
        title: "Event-driven integration",
        text: "Kept a local user replica in sync through RabbitMQ events from the Identity and Plantation services, removing synchronous calls between services.",
      },
      {
        title: "Quality and DevOps",
        text: "Wrote 205 tests at 100% line coverage enforced in CI, automated Docker deployment to AWS EC2 with health checks, and set up Prometheus and Grafana monitoring.",
      },
    ],
    tech: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Supabase",
      "RabbitMQ",
      "Docker",
      "AWS",
      "GitHub Actions",
      "JUnit",
      "SonarQube Cloud",
      "Prometheus",
      "Grafana",
      "JMeter",
    ],
    projectUrl: PLACEHOLDER_URL,
    demoUrl: PLACEHOLDER_URL,
    image: "/projects/mysawit.png",
  },
  {
    name: "Blusukan",
    context: "BytesFest 2026",
    type: "Mobile app",
    description: "A mobile app that guides tourists in Solo to hidden-gem local merchants during events.",
    overview: [
      "Blusukan is a mobile app for Solo Raya, Indonesia, that connects tourists with small local merchants during big events like festivals and concerts. It has two modes. Dolan Mode is for tourists: they describe what they want in plain language and get a walking route to hidden-gem merchants. Bakul Mode is for merchants: they set up a store and catalog, get stock recommendations, and record sales. An admin layer reviews events and monitors activity.",
      "The app was built by a team of 4 from the Faculty of Computer Science, Universitas Indonesia, for BytesFest 2026 (theme: Decent Work and Economic Growth). The frontend is an Expo React Native app built as an Android APK. The backend is a FastAPI service on PostgreSQL with PostGIS. It uses the Gemini API for language and image parsing, OSRM for routing, and Celery with Redis for scheduled stock calculations. The backend is deployed on Railway.",
      "I worked on product and the frontend. I built the auth flow, the tourist-facing Dolan Mode screens, the shared UI kit and the merchant catalog screens.",
    ],
    role: "Product & Frontend Developer",
    highlights: [
      "Tourists type a request like \"batik and lunch near Pasar Klewer\". Gemini parses it, the backend scores nearby merchants, and OSRM builds a walking route",
      "Merchants photograph their menu and Gemini Vision turns it into draft catalog items to review",
      "A daily Celery job gives merchants stock recommendations based on upcoming events and weather",
      "Purchases linked to an itinerary earn stamps, which tourists trade for promos using a one-time code that lasts 15 minutes",
    ],
    sections: [
      {
        heading: "Authentication and Session Handling",
        body: [
          "Blusukan has one login for 3 roles: tourist (wisatawan), merchant (pedagang) and admin. The backend issues JWT access and refresh tokens. Each refresh replaces the old refresh token, and if an old one is ever reused, the backend ends the whole session. The app then sends each user to the screens for their role.",
        ],
        points: [
          {
            title: "API client",
            text: "Built a shared Axios client that adds the bearer token to every request. If a request gets a 401, it calls /api/auth/refresh once, saves the new tokens and retries the original request.",
          },
          {
            title: "Secure token storage",
            text: "Wrote helpers that keep access tokens, refresh tokens and user data in Expo SecureStore instead of plain storage.",
          },
          {
            title: "Auth store",
            text: "Built a Zustand store for login, register, logout and session restore. On login or restore it also fetches the merchant ID for merchant accounts, so Bakul screens have it ready.",
          },
        ],
      },
      {
        heading: "Onboarding and Sign-up Flow",
        body: [
          "Every account starts as a tourist. A user who registers a store is upgraded to merchant by the backend, which returns a new token with the merchant role. The store's name, category, address and coordinates are saved so it can show up in tourists' routes.",
        ],
        points: [
          { title: "Onboarding", text: "Built a 3-slide onboarding carousel using the Blusukan mascot illustrations." },
          {
            title: "Two-step registration",
            text: "Built the register screen, which passes the user's details to a role selection screen. Choosing a role and confirming in a modal creates the account and opens either Dolan Mode or the store setup form.",
          },
          {
            title: "Form validation",
            text: "Added checks on the client before any API call: required fields, a minimum password length of 8 characters, matching password confirmation, and required store name, description, category and address.",
          },
        ],
      },
      {
        heading: "Itinerary Generation and Live Route",
        body: [
          "This is the core of Dolan Mode. A tourist types a request in plain language. Gemini turns it into constraints: time limit, budget, search radius, interests, and whether to avoid crowds. The backend then ranks nearby merchants using location (PostGIS), how well they match the interests (pgvector), a hidden-gem score and ratings. OSRM builds a walking route that avoids main roads. Generating a route takes about 3 to 8 seconds.",
        ],
        points: [
          {
            title: "Request screen",
            text: "Built a free-text input that asks for location permission and sends the query with the user's coordinates to POST /api/itineraries. If no location is available, it uses a default point in central Solo, so the screen doesn't freeze.",
          },
          {
            title: "Route map",
            text: "Rendered the route in a WebView running Leaflet 1.9.4, drawing the backend's route GeoJSON and numbered markers for each stop in order.",
          },
          {
            title: "Step-by-step progress",
            text: "Built a progress screen that moves through the stops one at a time and pans the map to the next stop by running map.flyTo inside the WebView.",
          },
          {
            title: "History",
            text: "Added a list of past itineraries with time filters (week, month, 6 months, year) and pages of 5 items each.",
          },
        ],
      },
      {
        heading: "Stamps and Promo Redemption",
        body: [
          "Stamps connect the two modes. When a merchant records a sale linked to a tourist's itinerary, the backend gives that tourist a stamp, and the same sale can't award a stamp twice. Tourists trade stamps for merchant promos. Each redemption creates an 8-character code that expires after 15 minutes, and the merchant's cashier confirms it.",
        ],
        points: [
          {
            title: "Stamp collection",
            text: "Built a screen that loads stamps and promos in parallel and lists collected stamps, with the same time filters and paging.",
          },
          {
            title: "Promo eligibility",
            text: "Each promo is labelled \"ready\" or \"not ready\" by comparing the user's stamp count with the stamps it requires, and the list can be filtered by that label.",
          },
          {
            title: "Redemption",
            text: "Redeeming a promo shows the code in a modal with a live countdown based on the server's expiry time, plus a copy-to-clipboard button.",
          },
        ],
      },
      {
        heading: "Merchant Catalog Ingestion",
        body: [
          "Merchants don't type their whole menu by hand. They upload a photo (JPG or PNG, up to 10 MB), the image is stored in Supabase Storage, and Gemini Vision pulls out item names and prices as drafts. Items are saved to the public catalog only after the merchant confirms them.",
        ],
        points: [
          {
            title: "Photo upload",
            text: "Built a screen that takes a menu photo from the camera or gallery and uploads it as multipart form data to the catalog ingest endpoint.",
          },
          {
            title: "Draft editor",
            text: "Displayed the AI-extracted items as editable rows. Merchants can add or remove rows, and price fields accept digits only.",
          },
          {
            title: "Confirmation checks",
            text: "The catalog is saved through the confirm endpoint only if every item has a name and a price. I also built the store catalog list and a catalog view for tourists.",
          },
        ],
      },
      {
        heading: "Design System and UI Kit",
        body: [
          "The app has 3 areas, one per role: Dolan for tourists, Bakul for merchants, and Admin. They share one visual style based on Solo's batik culture, with navy and sogan (batik brown) colors, batik patterns and a mascot.",
        ],
        points: [
          {
            title: "Theme",
            text: "Set up NativeWind with a custom Tailwind theme (navy, sogan and status colors) and 4 font families: Plus Jakarta Sans, Inter, Playfair Display and Grand Hotel.",
          },
          {
            title: "Shared components",
            text: "Built Button, Card, Chip, Badge, Input, Stamp, Alert and ConfirmationModal, plus the bottom navigation and top bar, and a developer-only UI kit screen for previewing components.",
          },
          {
            title: "Admin restyle",
            text: "Restyled the admin dashboard, events list and monitoring screens built by teammates, without changing how they work.",
          },
        ],
      },
    ],
    contributions: [
      {
        title: "Auth Layer",
        text: "Built the Axios client, the secure token helpers and the Zustand store that handle login, registration, session restore and token refresh.",
      },
      {
        title: "Onboarding Flow",
        text: "Built the onboarding, login, register, role selection and store registration screens, with validation on the client.",
      },
      {
        title: "Dolan Mode",
        text: "Built the tourist home, itinerary generator, route map, progress view, stamp, promo redemption and profile screens.",
      },
      {
        title: "UI Kit and Catalog",
        text: "Set up the NativeWind theme and shared components, and built the merchant catalog and menu photo upload screens.",
      },
    ],
    tech: [
      "React Native",
      "Expo",
      "TypeScript",
      "Tailwind CSS",
      "FastAPI",
      "PostgreSQL",
      "GitHub Actions",
    ],
    projectUrl: "https://github.com/pandoruy-pingin-menang-pls/blusukan-fe",
    demoUrl: PLACEHOLDER_URL,
    image: "/projects/blusukan.png",
  },
  {
    name: "EventEase",
    context: "iFest 2026",
    type: "Web app",
    description: "Helps people with mobility needs check if a public event's facilities fit them.",
    overview: [
      "EventEase is a web app for people with mobility access needs, such as wheelchair and crutch users, older people, pregnant people and stroller users. Attendees set their needs with a checklist of seven physical accessibility attributes, with no medical labels. Each event then shows a personal 0 to 100 match score with a breakdown for each attribute. Organizers publish events with facility claims, answer accessibility requests and build a reliability score from attendee verifications.",
      "The team built it at iFest 2026 as a 24-hour hackathon project, following a proposal from the qualifying round. The frontend is a Next.js App Router app written in TypeScript and Tailwind CSS. It only displays results: scoring, data and state changes all live in a separate FastAPI backend, reached through a REST API contract with 19 documented endpoints.",
      "I worked on product and built the whole frontend. Here is a closer look at some of the pages I built.",
    ],
    role: "Product & Frontend Developer",
    highlights: [
      "Personal match score from 0 to 100 over seven accessibility attributes, with a breakdown for each attribute and a version label marking the weights as provisional",
      "Unknown organizer claims are labeled as unknown, and each claim shows its source and the date it was recorded",
      "Accessibility requests: the attendee asks, the organizer answers \"can fulfill\", \"partially fulfill\" or \"cannot fulfill\", and the attendee accepts it as a commitment",
      "After an event, attendees verify each commitment, which updates the organizer's reliability score",
    ],
    sections: [
      {
        heading: "Organizer Dashboard",
        points: [
          {
            title: "Live data loading",
            text: "Loads pending requests, responded requests, upcoming events, the reliability score and recent requests in parallel with Promise.all. This replaced the mock data in my first layout.",
          },
          {
            title: "Summary cards",
            text: "Maps API totals to three status cards (Baru, Proses, Aktif). The reliability score card shows a status label such as \"Sangat Baik\" or \"Cukup\".",
          },
          {
            title: "Request response flow",
            text: "Organizers open a modal, choose one of three decisions and write a note, which is sent to POST /api/requests/{id}/response. I also fixed the decision value so it matched the API spec.",
          },
          {
            title: "Loading and empty states",
            text: "Shows a spinner while data loads and an empty state when there are no requests. Request snapshot booleans become readable Indonesian facility labels.",
          },
        ],
      },
      {
        heading: "Event Publishing With Accessibility Claims",
        points: [
          {
            title: "Unified create modal",
            text: "Moved event details and the accessibility claim form into one modal on the events page and removed the old standalone registration page.",
          },
          {
            title: "Claim form",
            text: "Organizers rate six facility claims and enter a walking distance in meters, sent in the claim shape defined in the API contract.",
          },
          {
            title: "API validation fix",
            text: "Fixed a 422 error from the backend by converting dates to ISO strings and removing fields the API did not accept.",
          },
          { title: "Photo upload", text: "Uploads several event photos to /api/events/{id}/media once the event has been created." },
          { title: "Event list", text: "Built a filtered, paginated list of the organizer's own events using limit and offset." },
        ],
      },
      {
        heading: "Organizer Profile and Reliability",
        points: [
          {
            title: "Profile data",
            text: "Loads the organizer profile from /api/organizers/{id} and the organizer's events from /api/events?mine=true.",
          },
          { title: "Reliability display", text: "Shows the reliability score returned by the backend, or a placeholder when there is no score yet." },
          { title: "Role guard", text: "Sends attendees elsewhere, so only organizers see this page." },
        ],
      },
      {
        heading: "Authentication and Role-Based Navigation",
        points: [
          {
            title: "Login and register",
            text: "Built animated split-screen login and register pages connected to the auth API. The register page has a role picker for attendee or organizer.",
          },
          { title: "Role routing", text: "After login, organizers go to the dashboard and attendees go to the home page." },
          {
            title: "Role-aware navbar",
            text: "The navbar shows different Indonesian-language links for visitors, attendees and organizers, and the logo goes to the right home page for each role.",
          },
          { title: "Demo cleanup", text: "Removed the demo login and demo register options, so the final app uses real accounts only." },
        ],
      },
      {
        heading: "Landing Page",
        points: [
          {
            title: "Sections",
            text: "Built the hero with a typing animation, animated stats using CountUp, an accessibility needs showcase, a \"Cara Kerja\" (how it works) section, 3D testimonials, a CTA, an FAQ with morphing icons and the footer.",
          },
          { title: "Map visual", text: "Added an SVG dotted map of Indonesia with a location marker." },
        ],
      },
    ],
    contributions: [
      {
        title: "Organizer Dashboard",
        text: "Built the organizer dashboard, with live API data and a modal for answering accessibility requests.",
      },
      {
        title: "Event Publishing",
        text: "Built the event management page and the create-event modal with accessibility claims, photo upload and fixes for API validation errors.",
      },
      {
        title: "Auth and Navigation",
        text: "Built the login and register pages and a navbar that changes based on the user's role.",
      },
      {
        title: "Landing Page",
        text: "Built every section of the landing page, including the animated hero, stats, how-it-works steps, testimonials and FAQ.",
      },
    ],
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "FastAPI",
    ],
    projectUrl: PLACEHOLDER_URL,
    demoUrl: PLACEHOLDER_URL,
    image: "/projects/eventease.png",
  },
  {
    name: "CloudNap",
    type: "Mobile app",
    description: "Simple, personal sleep tracker with a nightly sleep score.",
    overview:
      "A simple and personal sleep-tracking app. It turns each night into a sleep score and summaries that make it easier to see your sleep patterns and build better habits.",
    highlights: [
      "Nightly sleep score with last night's duration, bedtime and wake time",
      "Daily and monthly sleep summaries with trends",
      "Sleep tracker and bedtime reminders",
    ],
    contributions: [CONTRIBUTIONS_TBA],
    projectUrl: PLACEHOLDER_URL,
    demoUrl: PLACEHOLDER_URL,
    image: "/projects/cloudnap.png",
  },
  {
    name: "HerRoute",
    context: "SISTECH by RISTEK 2026",
    type: "Web app",
    description: "Safe route app that predicts location risk around transit stations to help women travel safely.",
    overview: [
      "HerRoute is a safety app that helps women move around the city more safely, day or night. It shows how risky a location is at a given hour, suggests a safer route between two points, finds nearby safe places such as police posts, pharmacies and minimarkets, and lets users report incidents anonymously.",
      "It was built by a team of two for the SISTECH by RISTEK 2026 MLOps final project. There was no public crime data for Jakarta, so the model was trained on Chicago crime data, with Chicago's CTA rail stations standing in for Jakarta's MRT stations. Jakarta coordinates are then mapped onto the Chicago grid for the demo. The system has two parts: a machine learning pipeline in Jupyter notebooks, and a FastAPI backend that serves the model and uses Supabase for auth and data.",
      "I owned the machine learning pipeline and the backend.",
    ],
    role: "Machine Learning & Backend Engineer",
    highlights: [
      "Visual risk indicator: shows a green, yellow or red risk level for any location and hour",
      "Safe route recommendation: compares the safest route with the fastest route between two points",
      "Safe place locator: finds the 5 nearest safe places (police, hospitals, pharmacies, minimarkets, stations)",
      "Anonymous incident reports and trusted emergency contacts for each user",
    ],
    sections: [
      {
        heading: "Data Pipeline and Risk Labels",
        body: ["There was no ground-truth \"risk\" label, so I built one from raw crime records and checked each step against the data."],
        points: [
          {
            title: "Data scoping",
            text: "Cut 8,534,663 Chicago crime records down to 2024 to 2026, then to the 152,769 incidents within 600 m of the 108 CTA stations.",
          },
          {
            title: "Spatial grid",
            text: "Rounded coordinates into cells of about 110 m, which gave 6,485 cells. I chose this size after testing it against a coarser grid of about 1.1 km.",
          },
          {
            title: "Severity scoring",
            text: "Gave each crime type a base score and adjusted it with keyword modifiers such as \"ARMED\" or \"ATTEMPT\". A check confirmed which modifiers actually fired in the data.",
          },
          {
            title: "Leakage prevention",
            text: "Built features from a historical window and labels from a separate 180-day window with a 90-day half-life, so no incident appears on both sides.",
          },
          {
            title: "Full unit grid",
            text: "Built every cell, day and hour combination (1,089,480 rows), including slots with no crime, so the model has real examples of safe areas.",
          },
        ],
      },
      {
        heading: "Model Training and Evaluation",
        points: [
          {
            title: "Baselines first",
            text: "Compared the models against six non-ML baselines. The strongest baseline, the average per cell and hour, reached MAE 2.888 and R² 0.768.",
          },
          {
            title: "Model choice",
            text: "Trained Linear Regression, Random Forest and Gradient Boosting. Gradient Boosting won with MAE 2.649, RMSE 4.246 and R² 0.803 on the test set.",
          },
          {
            title: "Grouped splitting",
            text: "Split train and test data by cell, because many features are constant within a cell and a random split would inflate the scores.",
          },
          {
            title: "Error by segment",
            text: "Measured MAE by risk range. Error was 2.40 for scores 0 to 20 and 34.96 for scores 80 to 100, which shows the model is weakest in high-risk areas.",
          },
        ],
      },
      {
        heading: "Continual Learning and Drift Detection",
        points: [
          {
            title: "Real time batches",
            text: "Used 6 real time periods as 5 training batches plus 1 holdout, so drift came from the data itself and was not injected.",
          },
          {
            title: "Three drift checks",
            text: "Combined a Kolmogorov-Smirnov test, Population Stability Index and a concept drift check on the correlation between crime count and risk score. KS flagged every batch, while PSI and concept drift stayed below their thresholds.",
          },
          {
            title: "Champion vs challenger",
            text: "A new model was promoted only if it beat the current model's MAE by at least 0.02 and did not lower R².",
          },
          {
            title: "Strategy comparison",
            text: "Compared cumulative, sliding window and fine-tuning retraining across 15 versions in a CSV registry. Cumulative did best (holdout MAE 2.004) and was chosen for deployment.",
          },
        ],
      },
      {
        heading: "Model Serving API",
        points: [
          {
            title: "Startup loading",
            text: "The backend loads the exported model, a prebuilt risk graph and spatial indexes into memory once, when FastAPI starts.",
          },
          {
            title: "Risk endpoint",
            text: "Maps a Jakarta coordinate onto the Chicago grid, snaps it to the nearest known cell with a haversine BallTree, predicts the score and returns the tier.",
          },
          {
            title: "Safe route",
            text: "Runs a shortest path search on the risk graph. There are two edge weights: distance only for \"fast\", and distance scaled up by risk for \"safe\".",
          },
          {
            title: "Mock labeling",
            text: "Every ML response includes an is_mock flag and a note, so the frontend can tell users the scores are a simulation from Chicago data.",
          },
        ],
      },
      {
        heading: "Auth, Data and Monitoring",
        points: [
          {
            title: "Endpoints",
            text: "Built 15 REST endpoints across auth, trusted contacts, ML features, reports and monitoring, documented with Swagger.",
          },
          {
            title: "Auth and access",
            text: "Used Supabase Auth for email and Google sign-in. Trusted contact routes check a bearer token and only return or delete the caller's own contacts.",
          },
          {
            title: "Background logging",
            text: "Logs each prediction's input, output and latency to Supabase as a FastAPI background task, so the response is not delayed.",
          },
          {
            title: "KPI dashboard API",
            text: "Built endpoints that report error rate, average latency, risk tier counts and the latest drift flag, plus model metrics read from the registry.",
          },
        ],
      },
    ],
    contributions: [
      {
        title: "Risk label pipeline",
        text: "Built the full data pipeline that turns raw crime records into a 0 to 100 risk score per cell, day and hour.",
      },
      {
        title: "Model and retraining",
        text: "Trained and evaluated the Gradient Boosting risk model and built the drift detection and champion vs challenger retraining loop.",
      },
      {
        title: "Backend API",
        text: "Built the FastAPI backend that serves risk scores, safe routes and safe places, plus Supabase auth, trusted contacts and anonymous reports.",
      },
      {
        title: "Monitoring",
        text: "Added background prediction logging and monitoring endpoints for error rate, latency and data drift.",
      },
    ],
    tech: [
      "Python",
      "scikit-learn",
      "FastAPI",
      "Supabase",
      "PostgreSQL",
      "Google Colab",
    ],
    projectUrl: "https://github.com/SISTECH26-FINPRO5/BE-HerRoute",
    demoUrl: PLACEHOLDER_URL,
    image: "/projects/herroute.png",
  },
];
