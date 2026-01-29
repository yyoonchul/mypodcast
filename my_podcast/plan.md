# My Podcast - Product Requirements Document

## Overview

My Podcast is a personalized podcast application that delivers daily news and career insights tailored to users' interests and professional needs. The application features a modern, responsive design optimized for both desktop and mobile devices. In this initial phase, the focus is on building a lean onboarding flow—from landing page through sign-up—with all user data and authentication managed via Firebase. Future complex functionalities (e.g., full podcast generation) can be implemented later using Python/FastAPI if needed.

---

## User Flow

1. Landing Page → Podcast Type Selection → Detailed Customization → Waitlist Signup

---

## Page Requirements

### 1. Landing Page

#### Functionality

- Display application logo and main value proposition.
- Present key features of the application.
- Provide a clear call-to-action to start the podcast selection process.
- Responsive design with different layouts for mobile and desktop.

#### UI Components

- **Header:** Application logo ("My Podcast").
- **Hero Section:**
  - **Main Heading:** "Turn Your Commute into a Power Hour"
  - **Subheading:** "Stay ahead with personalized news & career insights, delivered as daily podcasts designed for your commute."
- **Feature Cards:** Highlight key benefits:
  - **Real-time News**
    - Icon: Lightning bolt
    - Description: "Get the latest news updates delivered in real-time."
  - **Career Insights**
    - Icon: Briefcase
    - Description: "Expert insights to support your career growth."
  - **Custom Settings**
    - Icon: Sliders
    - Description: "Customize content based on your interests."
- **CTA Button:** "Get Started" (with arrow icon).
- **Footer:** Copyright information ("© 2024 My Podcast. All rights reserved.").

### 2. Podcast Selection Page

#### Functionality

- Display different podcast types (News, Career).
- Allow users to select one podcast type.
- Show "Coming Soon" status for unavailable options.
- Enable navigation to the customization page after selection.

#### UI Components

- **Header:** Application logo ("My Podcast").
- **Main Content Section:**
  - **Heading:** "Choose Your Podcast Type"
  - **Subheading:** "Select one podcast type to customize your experience"
- **Podcast Type Cards:**
  - **News Podcast**
    - Icon: 📰
    - Title: "News Podcast"
    - Description: "Stay updated with personalized news from your selected topics."
  - **Career Podcast**
    - Icon: 💼
    - Title: "Career Podcast"
    - Description: "Get industry insights and career development tips."
  - **[Coming Soon] Entertainment Podcast**
    - Icon: 🎮
    - Title: "Entertainment Podcast"
    - Description: "Daily entertainment news and updates"
    - Status: "Coming Soon"
- **CTA Button:** "Next Step" (disabled until a selection is made).
- **Footer:** Copyright information.

### 3. Customization Page

#### Functionality

- Display different customization options based on the selected podcast type.
- For **News Podcasts:**
  - Allow selection of multiple topics.
  - Display a list/grid of topics (e.g., Technology, Business, Science, Health, Politics, Entertainment, Sports, Education, Environment, Arts).
- For **Career Podcasts:**
  - Allow selection of job roles.
  - Display role options (e.g., Software Engineer, Product Manager, Data Scientist, UX/UI Designer, Marketing Manager, Business Analyst, DevOps Engineer, AI Engineer).
- Validate selections before proceeding.
- Enable navigation to the Waitlist Signup page.
- **Note:** The selections made here will be recorded and stored in the user profile.

#### UI Components

- **Header:** Application logo ("My Podcast").
- **Main Content Section:**
  - **Heading:** "Customize Your Experience"
  - **Dynamic Subheading:**
    - For News: "Choose the topics that matter to you, and we'll deliver daily news episodes curated just for your interests. Stay informed effortlessly."
    - For Career: "Select your profession, and we'll curate daily podcasts with industry news, expert insights, and key trends to help you stay ahead in your field."
- **Selection UI:**
  - For News: Topic selection grid.
  - For Career: Job role selection grid.
- **CTA Button:** "Next Step"
- **Footer:** Copyright information.

### 4. Waitlist Signup Page

#### Functionality

- Display a summary of the user's selections.
- Collect the user's email address.
- Handle form submission with loading state and success/error messaging.
- Ensure that users cannot access this page without completing previous steps.
- **Pro Plan Upsell:**
  - At the final part of onboarding, offer an advanced customization option (e.g., manually enter topics, mix multiple types).
  - If the user agrees, add them to a waitlist for the Pro Plan.

#### UI Components

- **Header:** Application logo ("My Podcast").
- **Main Content Section:**
  - **Heading:** "Join the Waitlist"
  - **Subheading:** "We're excited to have you join our waitlist! Enter your email below to be notified when we launch."
- **Summary Section:**
  - **Heading:** "Your Preferences"
  - **Dynamic Content:** Display chosen Podcast Type, Selected Topics (for News), or Selected Job Role (for Career).
- **Email Input Form:**
  - Label: "Email Address"
  - Placeholder: "Enter your email"
  - Validation: Required field.
- **Pro Plan Upsell Option:**
  - Additional section describing advanced customization features.
  - Checkbox: "I agree to be contacted when the Pro Plan is available."
- **Submit Button:** "Join Waitlist" (with loading state and spinner).
- **Message Display:** Show success ("Thank you for joining our waitlist! We'll be in touch soon.") or error messages.
- **Footer:** Copyright information.

---

## 4. Technology Stack

### **Frontend:**

- **Framework:** React.js (or Next.js for server-side rendering and SEO if needed)
- **Styling:** Tailwind CSS
- **State Management:** Redux or Context API (for managing multi-step onboarding flow)
- **Authentication:** Firebase Auth

### **Backend:**

- **Primary:** Firebase
  - **Authentication:** Firebase Auth
  - **Database:** Firestore
  - **Serverless Functions:** Firebase Cloud Functions (if needed for additional processing)

### **Deployment:**

- **Frontend Hosting:** Vercel or Netlify
- **Backend Hosting:** Firebase Hosting and Cloud Functions

---

## 6. Conclusion

The initial MVP focuses on a lean onboarding process—from the landing page through podcast type selection, detailed customization, and waitlist sign-up—with all user data and authentication managed by Firebase. This approach ensures rapid development and deployment while capturing critical user preferences. The Pro Plan upsell at the end of onboarding will enable us to gather interest for future premium features. This modular and streamlined plan is designed to quickly validate the core user experience before further scaling and integrating advanced functionalities.