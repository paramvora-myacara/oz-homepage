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

#### `promotional_card_clicked`
-   **Description**: Fired when a user clicks on a promotional card within the listings.
-   **Trigger**: User clicks on a `PromotionalCard` component.
-   **Metadata**:
    -   `cardType` (string): The type of promotional card (e.g., `'contact_us'`).
    -   `path` (string): The page URL where the event was triggered.
-   **Example**:
    ```json
    {
        "event_type": "promotional_card_clicked",
        "metadata": {
            "path": "/listings",
            "action": "redirect_to_schedule_call",
            "source": "listings_page",
            "timestamp": "2025-07-22T16:34:09.435Z"
        },
        "endpoint": "/listings",
        "created_at": "2025-07-22 16:34:09.53465+00"
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
-   **Description**: A user has successfully submitted an inquiry for a listing or a general inquiry.
-   **Trigger**: Successful submission of the contact form on the "Schedule a Call" page.
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
-   **Trigger**: User clicks the "Join the Community" button in the final panel of the homepage slideshow.
-   **Metadata**:
    -   `path` (string): The page URL where the event was triggered.
-   **Example**:
    ```json
    {
        "event_type": "community_interest_expressed",
        "metadata": {
            "path": "/"
        },
        "endpoint": "/",
        "created_at": "2025-07-21 21:50:28.93285+00"
    }
    ```

#### `schedule_call_page_view`
-   **Description**: A user has visited the "Schedule a Call" page.
-   **Trigger**: The `ScheduleCall` page component mounts.
-   **Metadata**:
    -   `source_endpoint` (string): The page the user was on before navigating to the schedule call page.
    -   `path` (string): The page URL where the event was triggered.
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

#### `request_vault_access`
-   **Description**: Fired when a user requests access to the vault.
-   **Trigger**: User clicks the "Request Access" button in the vault.
-   **Metadata**:
    -   `url` (string): The URL of the page where the event was triggered.
    -   `propertyId` (string): The ID of the property for which access is being requested.
-   **Example**:
    ```json
    {
        "event_type": "request_vault_access",
        "metadata": {
            "url": "https://oz-dev-dash-ten.vercel.app/sogood-dallas?uid=50a16973-aec8-43d4-b278-1168d56fe767",
            "propertyId": "sogood-dallas"
        },
        "endpoint": "/listings",
        "created_at": "2025-07-22 17:24:30.062883+00"
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

#### `page_view`
-   **Description**: Fired when a user views a page.
-   **Trigger**: User navigates to any page.
-   **Metadata**:
    -   `url` (string): The URL of the page being viewed.
    -   `propertyId` (string): The ID of the property being viewed (if applicable).
-   **Example**:
    ```json
    {
        "event_type": "page_view",
        "metadata": {
            "url": "http://localhost:3002/the-edge-on-main",
            "propertyId": "the-edge-on-main"
        },
        "endpoint": "/the-edge-on-main",
        "created_at": "2025-07-22 17:24:30.062883+00"
    }
    ```
---
### Content Interaction

#### `oz_check_button_clicked`
- **Description**: Triggered when a user clicks the button to check if a development is in an OZ. This event is deprecated and no longer in use.
- **Trigger**: Clicks on the "Check if your Development is in an OZ" button in the `ActionButtons` component.
- **Metadata**:
    - `source` (string): Always 'action_buttons'.
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
- **Description**: Triggered when a user clicks the button to navigate to the tax calculator.
- **Trigger**: Clicks on the "Check how much Tax you can save" button in the `ActionButtons` component.
- **Metadata**:
    - `source` (string): Always 'action_buttons'.
    - `destination_path` (string): The URL the button links to (`/tax-calculator`).
    - `screen_width` (number): The width of the user's screen.
    - `screen_height` (number): The height of the user's screen.
    - `user_agent` (string): The user's browser user agent.
    - `timestamp` (string): The ISO 8601 timestamp of the event.
- **Example**:
    ```json
    {
        "event_type": "tax_calculator_button_clicked",
        "metadata": {
            "path": "/dashboard",
            "source": "action_buttons",
            "destination_path": "/tax-calculator",
            "screen_width": 1920,
            "screen_height": 1080,
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",
            "timestamp": "2025-07-22T04:28:12.754762+00"
        },
        "endpoint": "/dashboard"
    }
    ``` 