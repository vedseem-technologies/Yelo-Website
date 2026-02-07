# Campaign Backend Schema Design

To support the high-end, dynamic layout demonstrated in the frontend, your backend `Campaign` model should include the following fields:

## 1. Core Identification
- `slug` (String, Unique): e.g., "valentine-special"
- `active` (Boolean): Master toggle for the campaign
- `startDate` (Date)
- `endDate` (Date)
- `layout` (Array of Objects): The ordered sequence of components to render on the page.

## 2. Layout Component Types

### a. `product-row` (Horizontal Scroll)
- `title` (String)
- `subtitle` (String)
- `shopSlug` (String): Source of products
- `limit` (Number)

### b. `product-grid` (Vertical Layout)
- `title` (String)
- `subtitle` (String)
- `shopSlug` (String): Source of products
- `limit` (Number)
- `cols` (Number, default 4)

### c. `banner-marquee`
- `text` (String): Scrolling message
- `bgColor` (Hex)
- `textColor` (Hex)

### c. `image-banner`
- `image` (URL)
- `link` (URL): Optional click-through
- `height` (String): e.g., "400px"

### d. `countdown`
- `title` (String)
- `bgColor` (Hex)

### d. `spacer`
- `height` (String, e.g., "100px")

## 3. Hero Section (Global Config)
- `title` (String): Main headline
- `subtitle` (String)
- `bannerImage` (String/URL)
- `heroOverlayOpacity` (Number)
- `titleAlignment` (Enum: "left", "center")

## 4. Theming
- `themeColor` (Hex): Primary accent
- `accentColor` (Hex): Secondary accent
- `fontFamily` (String)

## 5. Metadata (Optional)
- `priority` (Number): For sorting campaigns on a list page
- `tags` (Array of Strings)
