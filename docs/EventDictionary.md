# User Event Dictionary

This document provides a comprehensive dictionary of all user events tracked on the OZListings.com platform. It serves as a reference for understanding what actions users are taking and what data is being collected for analytics and product improvement purposes.

## Event Tracking Schema

User events are tracked using the `trackUserEvent(eventType, metadata)` function.

-   `eventType` (string): A unique identifier for the event being tracked.
-   `metadata` (object): An optional object containing additional data relevant to the event. The current URL path is automatically included in the metadata for every event.

Events are stored in the `user_events` table in our Supabase database, which has the following key columns:
-   `user_id`: The ID of the logged-in user. Events are only tracked for authenticated users.
-   `event_type`: The name of the event.
-   `metadata`: A JSON object containing event-specific data.
-   `endpoint`: The URL path where the event occurred.

---

## Event Reference

### Opportunity Zone Checking

#### `oz_check_performed`
-   **Description**: Fired when a user initiates a check to see if a location is in an Opportunity Zone.
-   **Trigger**: User clicks the "Check" button on the [Check OZ tool](/check-oz).
-   **Metadata**:
    -   `type` (string): The method of checking. Either `'address'` or `'coordinates'`.
    -   `address` (string): The address being checked (only if `type` is `'address'`).
    -   `lat` (number): The latitude of the location (only if `type` is `'coordinates'`).
    -   `lng` (number): The longitude of the location (only if `type` is `'coordinates'`).
    -   `path` (string): The page URL where the event was triggered.
-   **Note**: The metadata for this event is currently malformed in the database.
-   **Example**:
    ```json
    {
      "event_type": "oz_check_performed",
      "metadata": {
        "path": "/check-oz",
        "type": "address",
        "address": "1600 Amphitheatre Parkway, Mountain View, CA"
      },
      "endpoint": "/check-oz",
      "created_at": "2025-07-21 23:42:04.55074+00"
    }
    ```

#### `oz_check_completed`
-   **Description**: Fired when an Opportunity Zone check is successfully completed and results are returned.
-   **Trigger**: After the backend returns a successful response for an OZ check.
-   **Metadata**:
    -   `type` (string): The method of checking. Either `'address'` or `'coordinates'`.
    -   `result` (object): The result of the OZ check from the backend.
        -   `isOZ` (boolean): Whether the location is in an Opportunity Zone.
        -   `message` (string): A descriptive message about the result.
        -   `data` (object): Additional data about the Opportunity Zone if applicable.
    -   `path` (string): The page URL where the event was triggered.
-   **Note**: The metadata for this event is currently malformed in the database.
-   **Example**:
    ```json
    {
        "event_type": "oz_check_completed",
        "metadata": {
            "path": "/check-oz",
            "result": {
                "isOZ": true,
                "message": "This address is in an Opportunity Zone.",
                "data": { "geoid": "06085503102" }
            }
        },
        "endpoint": "/check-oz",
        "created_at": "2025-07-21 23:42:10.584088+00"
    }
    ```

---

### Listings & Properties

#### `viewed_listings`
-   **Description**: Triggered when a user views the property listings page.
-   **Trigger**:
    1.  When the user navigates to the `/listings` page.
    2.  When the user scrolls to the listings section on the homepage.
-   **Metadata**:
    -   `filters` (object): The currently applied filters on the listings page.
        -   `priceRange` (array): `[min, max]` price.
        -   `propertyType` (array): Selected property types.
        -   `ozBonus` (boolean): Whether the OZ bonus filter is active.
    -   `path` (string): The page URL where the event was triggered.
-   **Example**:
    ```json
    {
        "event_type": "viewed_listings",
        "metadata": {
            "path": "/listings",
            "timestamp": "2025-07-22T17:24:25.181Z",
            "total_listings_shown": 3
        },
        "endpoint": "/listings",
        "created_at": "2025-07-22 17:24:25.227072+00"
    }
    ```

#### `listing_clicked`
-   **Description**: Fired when a user clicks on an individual property listing.
-   **Trigger**: User clicks on a `ListingCard` component.
-   **Metadata**:
    -   `listingId` (string): The ID of the clicked listing.
    -   `path` (string): The page URL where the event was triggered.
    -   `user_agent` (string): The user's browser user agent.
    -   `listing_irr` (string): The internal rate of return for the listing.
    -   `dev_dash_url` (string): The URL to the development dashboard for the listing.
    -   `listing_state` (string): The state where the listing is located.
    -   `listing_title` (string): The title of the listing.
    -   `viewport_size` (string): The size of the user's viewport.
    -   `listing_featured` (boolean): Whether the listing is featured.
    -   `listing_fund_type` (string): The fund type of the listing.
    -   `screen_resolution` (string): The user's screen resolution.
    -   `listing_asset_type` (string): The asset type of the listing.
    -   `listing_min_investment` (string): The minimum investment for the listing.
    -   `listing_development_type` (string): The development type of the listing.
    -   `listing_ten_year_multiple` (string): The ten-year multiple for the listing.
-   **Example**:
    ```json
    {
        "event_type": "listing_clicked",
        "metadata": {
            "path": "/listings",
            "timestamp": "2025-07-22T17:24:30.032Z",
            "listing_id": "marshall-st-louis-001"
        },
        "endpoint": "/listings",
        "created_at": "2025-07-22 17:24:30.062883+00"
    }
    ```

#### `listing_inquiry_started`
-   **Description**: User has shown interest in a listing and initiated an inquiry.
-   **Trigger**: User clicks the "Inquire" button on a `PromotionalCard`.
-   **Metadata**:
    -   `source` (string): The source of the inquiry, e.g., `'promotional_card'`.
    -   `path` (string): The page URL where the event was triggered.
-   **Example**:
    ```json
    {
        "event_type": "listing_inquiry_started",
        "metadata": {
            "path": "/listings",
            "source": "promotional_card",
            "timestamp": "2025-07-22T16:34:09.513Z"
        },
        "endpoint": "/listings",
        "created_at": "2025-07-22 16:34:09.589009+00"
    }
    ```

#### `listing_inquiry_submitted`
-   **Description**: Fired when a user who clicked the "Your OZ Listing Here" promotional card successfully books a call. This event is highly specific and should not be interpreted as a general "booked a call" event.
-   **Trigger**: Successful submission of the contact form on the "Schedule a Call" page, but only if the user's `userType` is `'Developer'` and `advertise` is `'Yes'`.
-   **Metadata**:
    -   `source` (string): The source of the inquiry.
    -   `success` (boolean): Whether the inquiry was successful.
    -   `timestamp` (string): The ISO 8601 timestamp of the event.
    -   `user_email` (string): The email of the user submitting the inquiry.
    -   `path` (string): The page URL where the event was triggered.
-   **Example**:
    ```json
    {
        "event_type": "listing_inquiry_submitted",
        "metadata": {
            "path": "/schedule-a-call",
            "source": "promotional_card",
            "success": true,
            "timestamp": "2025-07-21T04:14:02.219Z",
            "user_email": "daryle@ozlistings.com"
        },
        "endpoint": "/schedule-a-call",
        "created_at": "2025-07-21 04:14:01.29496+00"
    }
    ```

---

### User Engagement & Conversion

#### `community_interest_expressed`
-   **Description**: Indicates a user is interested in joining the OZ community.
-   **Trigger**:
    1. User visits the `/community` page
    2. User clicks the "Join the Community" button on the community page
    3. User clicks the "Join Our VIP List" button in the exit popup
    4. User clicks the "Join Our Community" panel in the homepage slideshow
-   **Metadata**:
    -   `source` (string): The source of the community interest. Can be:
        - `"community_page_visit"` - User visited the community page
        - `"join_community_button"` - User clicked join button on community page
        - `"exit_popup_vip_list"` - User clicked VIP list button in exit popup
        - `"slideshow_panel"` - User clicked community panel in slideshow
    -   `timestamp` (string): The ISO 8601 timestamp of the event.
    -   `path` (string): The page URL where the event was triggered.
-   **Example**:
    ```json
    {
        "event_type": "community_interest_expressed",
        "metadata": {
            "path": "/community",
            "source": "community_page_visit",
            "timestamp": "2025-07-22T17:24:25.181Z"
        },
        "endpoint": "/community",
        "created_at": "2025-07-22 17:24:25.227072+00"
    }
    ```

#### `schedule_call_page_view`
-   **Description**: A user has visited the "Schedule a Call" page. This event is tracked on page load, and the `source_endpoint` metadata field is populated from the `endpoint` URL parameter.
-   **Trigger**: The `ScheduleCall` page component mounts.
-   **Metadata**:
    -   `source_endpoint` (string): The page the user was on before navigating to the schedule call page. This is derived from the `endpoint` URL parameter.
    -   `path` (string): The page URL where the event was triggered.
-   **Note**: The `NEXT_PUBLIC_SCHEDULE_CALL_LINK` environment variable is used to construct the links to the schedule a call page.
-   **Source Links**:
    -   **Property Pages** (`/the-edge-on-main`, `/sogood-dallas`, `/marshall-st-louis`): The `endpoint` parameter is set to the property ID (e.g., `/the-edge-on-main`).
    -   **Portfolio Page** (`/`): The `endpoint` parameter is set to `/portfolio_page`.
    -   **Layout** (`/`): The "Powered by OZL" link sets the `endpoint` parameter to `dev_dash_powered_by_ozl` and also includes `userType=Developer` and `advertise=true`.
-   **Example**:
    ```json
    {
        "event_type": "schedule_call_page_view",
        "metadata": {
            "path": "/schedule-a-call",
            "source_endpoint": "dev_dash_powered_by_ozl"
        },
        "endpoint": "/schedule-a-call",
        "created_at": "2025-07-22 17:24:36.486533+00"
    }
    ```

---

### Investment Page

#### `viewed_invest_page`
- **Description**: Triggered when a user visits the invest page.
- **Trigger**: User navigates to the `/invest` page.
- **Metadata**: None.
- **Example**:
    ```json
    {
        "event_type": "viewed_invest_page",
        "metadata": {},
        "endpoint": "/invest",
        "created_at": "2025-07-22 17:24:25.227072+00"
    }
    ```

#### `invest_page_button_clicked`
- **Description**: Triggered when a user clicks the "Active Deals" button on the invest page hero section.
- **Trigger**: User clicks the "Active Deals" button on the invest page.
- **Metadata**:
    - `button` (string): Always `"see_oz_listings"`.
- **Note**: Page visits to `/invest` are tracked separately via `viewed_invest_page`. Navbar clicks to the invest page are not tracked separately as they result in a page view event.
- **Example**:
    ```json
    {
        "event_type": "invest_page_button_clicked",
        "metadata": {
            "button": "see_oz_listings"
        },
        "endpoint": "/invest",
        "created_at": "2025-07-22 17:24:30.062883+00"
    }
    ```

#### `invest_reason_clicked`
- **Description**: Triggered when a user clicks on investment reason cards.
- **Trigger**: User clicks on any of the investment reason cards (Social Impact, Tax Benefits, Economic Catalyst, Portfolio Diversification).
- **Metadata**:
    - `reason` (string): The ID of the reason card clicked. Can be:
        - `"social-impact"` - Social Impact card
        - `"tax-benefits"` - Tax Benefits card
        - `"economic-development"` - Economic Catalyst card
        - `"portfolio-diversification"` - Portfolio Diversification card
- **Example**:
    ```json
    {
        "event_type": "invest_reason_clicked",
        "metadata": {
            "reason": "tax-benefits"
        },
        "endpoint": "/invest",
        "created_at": "2025-07-22 17:24:40.062883+00"
    }
    ```

---

### Financial Tools

#### `tax_calculator_used`
-   **Description**: Triggered when a user interacts with the tax calculator.
-   **Trigger**: User adjusts an input field in the tax calculator.
-   **Metadata**:
    -   `eligible` (boolean): Whether the user is eligible for tax savings.
    -   `gainAmount` (number): The amount of capital gains.
    -   `gainTiming` (string): The timing of the capital gains.
    -   `totalSavings` (number): The total estimated tax savings.
    -   `capitalGainStatus` (boolean): The status of the capital gains.
    -   `path` (string): The page URL where the event was triggered.
-   **Example**:
    ```json
    {
        "event_type": "tax_calculator_used",
        "metadata": {
            "path": "/tax-calculator",
            "eligible": true,
            "gainAmount": 1500000,
            "gainTiming": "within-180",
            "totalSavings": 1117410,
            "capitalGainStatus": true
        },
        "endpoint": "/tax-calculator",
        "created_at": "2025-07-22 16:42:06.238908+00"
    }
    ```

#### `dashboard_accessed`
-   **Description**: Fired when a user accesses the dashboard.
-   **Trigger**: User navigates to the `/dashboard` page.
-   **Metadata**: None.
-   **Example**:
    ```json
    {
        "event_type": "dashboard_accessed",
        "metadata": {},
        "endpoint": "/dashboard",
        "created_at": "2025-07-22 17:24:25.227072+00"
    }
    ```

#### `investor_qualification_submitted`
-   **Description**: Fired when a user submits the investor qualification form.
-   **Trigger**: User submits the form on the `/check-investor-eligibility` page.
-   **Metadata**:
    -   `path` (string): The page URL where the event was triggered.
-   **Note**: The metadata for this event is currently malformed in the database.
-   **Example**:
    ```json
    {
        "event_type": "investor_qualification_submitted",
        "metadata": {
            "path": "/check-investor-eligibility"
        },
        "endpoint": "/check-investor-eligibility",
        "created_at": "2025-07-22 17:24:30.062883+00"
    }
    ```

### Developer Page

#### `developers_page_cta_clicked`
- **Description**: Triggered when a user clicks a call-to-action button on the developers page.
- **Trigger**: Clicks on various CTA buttons in the `DeveloperHero` component on the developers page.
- **Metadata**:
    - `button` (string): The specific button that was clicked. Can be:
        - `"schedule_call"` — Schedule a Call button
        - `"view_pricing"` — View Pricing button
    - `location` (string): The location of the button. Currently always `"hero"`.
- **Example**:
    ```json
    {
        "event_type": "developers_page_cta_clicked",
        "metadata": {
            "path": "/developers",
            "button": "schedule_call",
            "location": "hero"
        },
        "endpoint": "/developers",
        "created_at": "2025-07-22 17:24:30.062883+00"
    }
    ```

---
### Content Interaction

#### `oz_check_button_clicked`
- **Description**: Triggered when a user clicks the button to check if a development is in an OZ.
- **Trigger**: Clicks on the "Check if your Development is in an OZ" button in the `HowItWorks` component on the developers page.
- **Metadata**:
    - `source` (string): Origin of the click. Can be:
        - `"developers_page_how_it_works"` — Clicked from the How It Works section on the developers page
        - `"action_buttons"` — Clicked from the ActionButtons component (legacy)
    - `destination_path` (string): The URL the button links to (`/check-oz`).
    - `screen_width` (number): The width of the user's screen.
    - `screen_height` (number): The height of the user's screen.
    - `user_agent` (string): The user's browser user agent.
    - `timestamp` (string): The ISO 8601 timestamp of the event.
- **Example**:
    ```json
    {
        "event_type": "oz_check_button_clicked",
        "metadata": {
            "path": "/dashboard",
            "source": "action_buttons",
            "destination_path": "/check-oz",
            "screen_width": 1920,
            "screen_height": 1080,
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",
            "timestamp": "2025-07-22T04:28:12.754762+00"
        },
        "endpoint": "/dashboard"
    }
    ```

#### `tax_calculator_button_clicked`
- **Description**: Triggered when a user clicks a button to navigate to the tax calculator.
- **Trigger**: 
    - Clicks on the "Check how much Tax you can save" button in the `ActionButtons` component.
    - Clicks on the "Calculate Tax Savings" button on the invest page.
- **Metadata**:
    - `source` (string): The source of the click. Can be:
        - `"action_buttons"` - Clicked from the ActionButtons component
        - `"invest_page"` - Clicked from the invest page hero section
    - `destination_path` (string): The URL the button links to (`/tax-calculator`).
    - `screen_width` (number): The width of the user's screen (only for invest_page source).
    - `screen_height` (number): The height of the user's screen (only for invest_page source).
    - `user_agent` (string): The user's browser user agent (only for invest_page source).
    - `timestamp` (string): The ISO 8601 timestamp of the event (only for invest_page source).
- **Example**:
    ```json
    {
        "event_type": "tax_calculator_button_clicked",
        "metadata": {
            "path": "/invest",
            "source": "invest_page",
            "destination_path": "/tax-calculator",
            "screen_width": 1920,
            "screen_height": 1080,
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",
            "timestamp": "2025-07-22T04:28:12.754762+00"
        },
        "endpoint": "/invest"
    }
    ```

---

## Dev Dash & Partner Events

This section outlines events tracked in the developer dashboard and partner-facing applications.

### `page_view`

- **Description**: This event is fired when a user signs in.
- **Trigger**: The `onAuthStateChange` event listener in `useAuth.ts` detects a `SIGNED_IN` event.
- **Example**:
    ```json
    {
        "user_id": "8956ddd1-59bb-4e98-86c0-62fe7145575d",
        "event_type": "page_view",
        "metadata": {
            "url": "http://localhost:3002/the-edge-on-main",
            "propertyId": "the-edge-on-main"
        },
        "endpoint": "/the-edge-on-main",
        "created_at": "2025-07-22 04:22:25.348562+00"
    }
    ```

### `request_vault_access`

- **Description**: This event is fired when a user requests access to the vault.
- **Trigger**:
    1. An authenticated user clicks the "Request Access" button.
    2. A new or unauthenticated user signs in or signs up via the vault access flow.
- **Example**:
    ```json
    {
        "user_id": "50a16973-aec8-43d4-b278-1168d56fe767",
        "event_type": "request_vault_access",
        "metadata": {
            "url": "https://oz-dev-dash-ten.vercel.app/sogood-dallas?uid=50a16973-aec8-43d4-b278-1168d56fe767",
            "propertyId": "sogood-dallas"
        },
        "endpoint": "/sogood-dallas",
        "created_at": "2025-07-22 16:34:17.915769+00"
    }
    ```

### Book Purchase

#### `book_purchase_click`
- **Description**: Triggered when a user clicks a button to purchase the OZ Investor's Guide book on Amazon from the book landing page.
- **Trigger**: User clicks either the top or bottom Amazon CTA button on the `/book` page.
- **Metadata**:
  - `source` (string): The source of the click. Can be:
    - `"book_landing_page_top_cta"` — Top "Buy on Amazon" button
    - `"book_landing_page_bottom_cta"` — Bottom "Get Your Copy Now" button
  - `destination` (string): Always `"amazon"` for this event.
  - `timestamp` (string): The ISO 8601 timestamp of the event.
- **Example**:
    ```json
    {
      "event_type": "book_purchase_click",
      "metadata": {
        "source": "book_landing_page_top_cta",
        "destination": "amazon",
        "timestamp": "2025-09-11T18:00:00.000Z"
      },
      "endpoint": "/book",
      "created_at": "2025-09-11 18:00:00.000000+00"
    }
    ```

#### `book_secondary_cta_click`
- **Description**: Triggered when a user clicks one of the secondary CTA buttons at the bottom of the book landing page.
- **Trigger**: User clicks "Join Community", "View Listings", or "Start Investing" button in the bottom CTA section of the `/book` page.
- **Metadata**:
  - `cta` (string): Which secondary CTA was clicked. Can be:
    - `"community"` — Join Community button
    - `"listings"` — View Listings button
    - `"invest"` — Start Investing button
  - `timestamp` (string): The ISO 8601 timestamp of the event.
- **Example**:
    ```json
    {
      "event_type": "book_secondary_cta_click",
      "metadata": {
        "cta": "community",
        "timestamp": "2025-09-11T18:05:00.000Z"
      },
      "endpoint": "/book",
      "created_at": "2025-09-11 18:05:00.000000+00"
    }
    ```

---

### Webinar Events

#### `webinar_navigation`
- **Description**: Fired when a user clicks a webinar CTA on the community page to navigate to the webinar landing page.
- **Trigger**: User clicks the banner image or the primary CTA button linking to `/webinar` on the `/community` page.
- **Metadata**:
  - `source` (string): Origin of the navigation. Can be:
    - `"banner"` — Clicked the hero/banner image on the community page
    - `"cta"` — Clicked the primary CTA button below the banner
  - `from_page` (string): Always `"community"` for this event
  - `timestamp` (string): ISO 8601 timestamp
  - `path` (string): Auto-injected current page path (e.g., `/community`)
- **Example**:
```json
{
  "event_type": "webinar_navigation",
  "metadata": {
    "path": "/community",
    "source": "cta",
    "from_page": "community",
    "timestamp": "2025-09-24T18:30:00.000Z"
  },
  "endpoint": "/community"
}
```

#### `webinar_scroll_to_final_cta`
- **Description**: Captures when a user clicks a CTA on the webinar page that scrolls to the final registration section.
- **Trigger**: User clicks any scroll CTA on `/webinar` that navigates to `#final-cta`.
- **Metadata**:
  - `source` (string): The UI origin. Possible values:
    - `"hero-image-cta"` — Button below hero image
    - `"hero-urgency-badge"` — Urgency badge at top of hero content
    - `"hero-primary-cta"` — Primary hero CTA button
    - `"who-should-attend-cta"` — CTA in the "Who Should Attend" section
  - `action` (string): Always `"scroll_to_final_cta"`
  - `timestamp` (string): ISO 8601 timestamp
  - `path` (string): Auto-injected (e.g., `/webinar`)
- **Example**:
```json
{
  "event_type": "webinar_scroll_to_final_cta",
  "metadata": {
    "path": "/webinar",
    "source": "hero-primary-cta",
    "action": "scroll_to_final_cta",
    "timestamp": "2025-09-24T18:31:00.000Z"
  },
  "endpoint": "/webinar"
}
```

#### `webinar_registration_click`
- **Description**: Fired when a user confirms their webinar registration intent on the final CTA. This event now only records the intent and updates the UI; it does not redirect to Eventbrite.
- **Trigger**:
  - Signed-in user clicks the final CTA button in `#final-cta` on `/webinar` (fires immediately and button turns green with “You're in!”)
  - Unsigned user clicks the final CTA, completes auth, and returns to `/webinar` (fires automatically on return; button turns green)
- **Metadata**:
  - `source` (string): The CTA origin. Current value:
    - `"final-cta"`
  - `action` (string): Always `"register_for_webinar"`
  - `timestamp` (string): ISO 8601 timestamp
  - `path` (string): Auto-injected (e.g., `/webinar`)
- **Notes**:
  - No external navigation occurs. The button state updates inline to confirm registration intent.
  - For unsigned users, an intent flag is temporarily stored in session storage to fire the event after authentication.
- **Example**:
```json
{
  "event_type": "webinar_registration_click",
  "metadata": {
    "path": "/webinar",
    "source": "final-cta",
    "action": "register_for_webinar",
    "timestamp": "2025-09-24T18:32:00.000Z"
  },
  "endpoint": "/webinar"
}
```

#### `webinar_signup`
- **Description**: Indicates a user completed the webinar signup intent within the community slideshow flow.
- **Triggers**:
  1. Signed-in user clicks "Sign Up Now" on the `UpcomingEvents` webinar slide within `/community`.
  2. User completes auth and is redirected back to `/community?webinar_signup=true` while signed in.
- **Metadata**:
  - `userId` (string): The authenticated user ID
  - `source` (string): Origin of the signup intent. Can be:
    - `"community_slideshow_button"` — Clicked "Sign Up Now" while signed in
    - `"auth_redirect_webinar_signup"` — Returned via `?webinar_signup=true` after auth
  - `timestamp` (string): ISO 8601 timestamp
  - `path` (string): Auto-injected (e.g., `/community`)
- **Notes**: This event is tracked only when a session is present.
- **Example**:
```json
{
  "event_type": "webinar_signup",
  "metadata": {
    "path": "/community",
    "userId": "50a16973-aec8-43d4-b278-1168d56fe767",
    "source": "community_slideshow_button",
    "timestamp": "2025-09-24T18:33:00.000Z"
  },
  "endpoint": "/community"
}
```

---

### Book Landing Page

#### `book_lead_magnet_click`
- **Description**: Fired when a user clicks to download the free chapter (lead magnet) from the book landing page.
- **Trigger**: User clicks the "Get Free Chapter" button (which may open an auth modal if not signed in) on `/book`.
- **Metadata**:
  - `source` (string): Origin of the click. Current value:
    - `"book_landing_page"` — Default source for lead magnet clicks
    - (Optional future variants could include specific section/button IDs)
  - `action` (string): Always `"download_free_chapter"`
  - `timestamp` (string): ISO 8601 timestamp
  - `path` (string): Auto-injected (e.g., `/book`)
- **Example**:
```json
{
  "event_type": "book_lead_magnet_click",
  "metadata": {
    "path": "/book",
    "source": "book_landing_page",
    "action": "download_free_chapter",
    "timestamp": "2025-09-24T18:34:00.000Z"
  },
  "endpoint": "/book"
} 