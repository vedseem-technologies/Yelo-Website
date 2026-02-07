# Campaign Admin Form Implementation Guide

This guide outlines the structure and UI components required to build a form that supports the high-fidelity, dynamic campaign system.

## 1. Form Sections

### A. General Information
- **Campaign Name**: String (Internal use)
- **Slug**: String (URL identifier, e.g., `valentine-edit`)
- **Status**: Toggle (Active / Inactive)
- **Start Date**: DateTime Picker
- **End Date**: DateTime Picker

### B. Global Theming
- **Primary Theme Color**: Color Picker (Hex)
- **Accent Color**: Color Picker (Hex)
- **Secondary Background**: Color Picker (Hex)
- **Font Family**: Select (e.g., Serif, Sans, Display)

### C. Hero Section Configuration
- **Title**: String (Main Headline)
- **Subtitle**: Textarea (Description)
- **Banner Image**: Image Upload or URL Input
- **Overlay Opacity**: Slider (0 to 1)
- **Title Alignment**: Radio (Left / Center)

## 2. Dynamic Layout Builder (The "Heart" of the Form)

The most important part is the `layout` array. In the Admin UI, this should be represented as a **Dynamic List** where users can add, remove, and reorder components.

### Recommended UI Approach:
Use a library like `react-beautiful-dnd` or a simple array-based state with "Up" and "Down" buttons for each item.

### Layout Item Types & Fields:

1.  **Product Row (Horizontal)**
    - `title`: String
    - `subtitle`: String
    - `shopSlug`: Select (Dropdown of active shops: `affordable`, `luxury`, etc.)
    - `limit`: Number (Slider/Input, 4 to 20)

2.  **Product Grid (Vertical)**
    - `title`: String
    - `subtitle`: String
    - `shopSlug`: Select
    - `limit`: Number
    - `cols`: Select (2, 3, or 4)

3.  **Marquee Banner**
    - `text`: String (The scrolling message)
    - `bgColor`: Color Picker
    - `textColor`: Color Picker

4.  **Image Banner (Full Width)**
    - `image`: Image Upload or URL
    - `link`: String (Optional redirect URL)
    - `height`: Select (e.g., 300px, 450px, 600px)

5.  **Countdown Timer**
    - `title`: String
    - `bgColor`: Color Picker (Defaults to Secondary Background)

6.  **Spacer**
    - `height`: Select (e.g., 40px, 80px, 120px)

## 3. Implementation Tips

- **Live Preview**: If possible, render a "Mini Preview" of the campaign page next to the form as fields change.
- **Form State**: Use `react-hook-form` or Formik to manage the nested `layout` array.
- **Shop Validation**: Ensure the `shopSlug` selected actually exists in the database.
