# Bug Report - Bizon Admin

Tested on: 2026-04-26
Environment: Next.js 16.1.6, backend Rails 8.1.2 on localhost:3000
Browser: Chrome (via DevTools)

---

## HIGH Severity

### BUG-001: Order detail - Customer email overlaps with "Placed" date

- **Page:** `/orders/[id]`
- **Component:** `src/components/orders/order-info-card.tsx:41-54`
- **Description:** In the order info card, the customer email (e.g. `carlos.rodriguez@hotmail.com`) overflows its grid cell and collides visually with the "Placed" date/time in the adjacent column. The text becomes unreadable when emails are long.
- **Root cause:** `grid grid-cols-2 gap-4` layout without `overflow-hidden`, `truncate`, or `break-all` on the email text at line 49.
- **Fix suggestion:** Add `truncate` or `break-all` class to the email `<p>` tag, or restructure to stack vertically on smaller widths.

---

## MEDIUM Severity

### BUG-002: Mobile - Tables truncate critical columns without horizontal scroll

- **Pages:** `/products`, `/orders`, `/dashboard`
- **Description:** On mobile (375px), data tables lose critical columns:
  - **Products:** STATUS, CATEGORY, QTY, VARIANTS, ACTIONS all hidden
  - **Orders:** TOTAL and DATE columns hidden
  - **Dashboard Recent Orders:** DATE column hidden
- **Root cause:** Tables use `min-w-full` but the parent container clips overflow without providing a visible horizontal scroll indicator.
- **Fix suggestion:** Either add `overflow-x-auto` with visible scrollbar styling, or implement a responsive card layout for mobile that shows all critical fields.

### BUG-003: Mobile - Hamburger menu does not open sidebar

- **Page:** All pages on mobile viewport
- **Components:** `src/components/layout/header.tsx`, `src/components/layout/sidebar.tsx`, `src/components/layout/dashboard-layout.tsx`
- **Description:** Clicking the hamburger menu button ("Open menu") on mobile does not visually open the sidebar navigation. Users have no way to navigate between sections on mobile.
- **Note:** The code logic appears correct (`sidebarOpen` state toggles `translate-x-0` vs `-translate-x-full`). May be a CSS transition or z-index issue. Needs manual browser verification.
- **Fix suggestion:** Verify the mobile sidebar CSS transitions work. Check that `z-50` is sufficient and that no parent element has `overflow-hidden` clipping the sidebar.

### BUG-004: Dashboard - Recent Orders DATE column cut off on medium viewports

- **Page:** `/dashboard`
- **Component:** `src/components/dashboard/recent-orders-table.tsx`
- **Description:** At standard desktop viewport (~1280px with sidebar), the DATE column in the Recent Orders table is visually truncated. The column exists in the DOM but is not visible without scrolling.
- **Fix suggestion:** Either remove the DATE column on the dashboard summary (since it's a preview table), or add `overflow-x-auto` to the table container.

### BUG-005: Product edit form - No Cancel/Back navigation button

- **Page:** `/products/[id]/edit`
- **Component:** `src/components/forms/product-form.tsx`
- **Description:** The product edit form only has an "Update Product" button. There is no "Cancel" or "Back" button to return to the products list. Users must use the sidebar or browser back button.
- **Fix suggestion:** Add a "Cancel" button next to "Update Product" that navigates back to `/products`.

---

## LOW Severity

### BUG-006: Settings - Tax Rate displays with comma decimal separator

- **Page:** `/settings`
- **Component:** `src/components/forms/store-form.tsx:92-98`
- **Description:** The Tax Rate field shows "0,0" instead of "0.0". This is caused by the browser's locale (Spanish) formatting the `<input type="number">` with a comma as decimal separator.
- **Impact:** May confuse users or cause validation issues when entering values with dot notation.
- **Fix suggestion:** Consider using `type="text"` with `inputMode="decimal"` and manual validation, or add a note about the expected format.

### BUG-007: Login form - Not vertically centered on page

- **Page:** `/login`
- **Description:** The login card appears in the lower half of the page rather than being vertically centered. The card sits at approximately 60% from the top of the viewport.
- **Fix suggestion:** Ensure the parent container uses `min-h-screen flex items-center justify-center` for proper centering.

### BUG-008: Orders page - No search functionality

- **Page:** `/orders`
- **Component:** `src/app/(dashboard)/orders/page.tsx`
- **Description:** The orders list only has a status filter dropdown. There is no search input to find orders by order number, customer name, or email. This makes it difficult to locate specific orders in a large dataset.
- **Fix suggestion:** Add a `SearchInput` component similar to the Products and Customers pages, filtering by order number or customer name.

### BUG-009: Product form - Price inputs have incorrect `valuemax` HTML attribute

- **Page:** `/products/new`, `/products/[id]/edit`
- **Component:** `src/components/forms/product-form.tsx`
- **Description:** The Price and Quantity `<input type="number">` fields render with `valuemax="0"` in the accessibility tree, implying a maximum value of 0. This is likely a React/browser rendering artifact and doesn't block functionality, but could affect screen reader users.
- **Fix suggestion:** Explicitly set `min={0}` and remove or correct any `max` attribute on number inputs.

---

## Summary

| Severity | Count | Key Areas |
|----------|-------|-----------|
| HIGH     | 1     | Order detail layout |
| MEDIUM   | 4     | Mobile responsive, navigation |
| LOW      | 4     | UX polish, accessibility |

### Pages Tested
- [x] Login (validation, auth flow, error handling)
- [x] Dashboard (stats, chart, recent orders, navigation)
- [x] Products (list, search, filters, pagination, edit form, variants, images)
- [x] Categories (list, search, pagination, CRUD actions)
- [x] Orders (list, status filter, pagination, order detail, status actions)
- [x] Customers (list, search, detail view)
- [x] Settings (store form, all fields)

### Responsive Breakpoints Tested
- [x] Mobile (375x812)
- [x] Tablet (768x1024)
- [x] Desktop (1280x800)

### Console & Network
- No JavaScript errors on any page
- No failed network requests during normal operation
- All API calls return 200/304 as expected
