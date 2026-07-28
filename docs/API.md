# ApnaBridge API

Backend endpoints required by the frontend in `src/`. Mock data currently lives in
`src/data/businesses.js`, `categories.js` and `testimonials.js` — these endpoints
replace that data with the same shapes.

All list endpoints return `{ "data": [...], "meta": {...} }`. All single-resource
endpoints return the resource directly. Errors return
`{ "error": { "message": "...", "code": "..." } }` with an appropriate HTTP status.

## Business object

```json
{
  "id": "saffron-spice-kitchen",
  "name": "Saffron Spice Kitchen",
  "ownerName": "Priya Nair",
  "category": "restaurants",
  "country": "USA",
  "state": "New Jersey",
  "city": "Edison",
  "phone": "+1 732 555 0142",
  "whatsapp": "+1 732 555 0142",
  "email": "hello@saffronspicekitchen.com",
  "website": "https://saffronspicekitchen.com",
  "about": "Family-run South Indian kitchen serving dosas, thalis and filter coffee since 2016.",
  "logoUrl": "https://cdn.apnabridge.com/logos/saffron-spice-kitchen.jpg",
  "coverUrl": "https://cdn.apnabridge.com/covers/saffron-spice-kitchen.jpg",
  "gallery": ["https://cdn.apnabridge.com/gallery/1.jpg"],
  "instagram": "saffronspicekitchen",
  "facebook": "saffronspicekitchen",
  "featured": true,
  "promoted": true,
  "status": "approved",
  "createdAt": "2026-07-20T00:00:00Z"
}
```

`category` is one of the category slugs (see below). `country` is `"USA"` or
`"India"`. `status` is `"pending" | "approved" | "rejected"` — only `approved`
businesses should be returned by public list/detail endpoints.
`logoUrl`/`coverUrl`/`gallery` may be `null`/`[]` until media is uploaded; the
frontend falls back to a generated initials placeholder in that case.

---

## Businesses

### `GET /api/businesses`

List businesses. Backs the Businesses page (filters) and Home (featured / latest
sections).

**Query params**

| Param | Type | Notes |
|---|---|---|
| `q` | string | Free-text match against name, about, city, state |
| `country` | `USA` \| `India` | |
| `state` | string | |
| `city` | string | |
| `category` | string | Category slug |
| `featured` | boolean | |
| `sort` | `latest` \| `relevance` | Default `relevance` |
| `page` | number | Default `1` |
| `limit` | number | Default `20` |

**Response**

```json
{
  "data": [ /* Business objects */ ],
  "meta": { "total": 14, "page": 1, "limit": 20, "totalPages": 1 }
}
```

### `GET /api/businesses/:id`

Single business. Backs the Business Profile page. Returns `404` if not found or
not `approved`.

**Response:** a Business object.

### `POST /api/businesses`

Submit a new listing. Backs the Promote Your Business form. Created businesses
start as `status: "pending"` until reviewed.

**Request**

```json
{
  "businessName": "Test Biz",
  "ownerName": "Jane Doe",
  "category": "restaurants",
  "city": "Edison, New Jersey",
  "phone": "+1 732 555 0000",
  "email": "jane@testbiz.com",
  "plan": "free"
}
```

`plan` is one of `free` | `premium` | `featured` | `video` | `social` (see Promote
page plan cards; `premium` is not yet available for purchase).

**Response:** `201` with the created Business object (`status: "pending"`).

### `POST /api/businesses/:id/media`

Upload logo, cover or gallery images for a listing.

**Request:** `multipart/form-data`

| Field | Type | Notes |
|---|---|---|
| `type` | `logo` \| `cover` \| `gallery` | |
| `file` | file | |

**Response**

```json
{ "url": "https://cdn.apnabridge.com/logos/saffron-spice-kitchen.jpg" }
```

---

## Categories

### `GET /api/categories`

Powers the category chips on Home and the full grid on the Categories page, with
live counts.

**Response**

```json
{
  "data": [
    { "slug": "restaurants", "name": "Restaurants", "icon": "🍽️", "count": 1 },
    { "slug": "grocery", "name": "Grocery", "icon": "🛒", "count": 1 }
  ]
}
```

Fixed set of slugs (from `src/data/categories.js`): `restaurants`, `grocery`,
`real-estate`, `insurance`, `healthcare`, `beauty-salon`, `photography`,
`digital-marketing`, `it-services`, `education`, `logistics`, `construction`,
`travel`, `legal`, `fashion`, `home-services`, `others`.

---

## Filter metadata

### `GET /api/locations`

Populates the state/city filter dropdowns without shipping the full business list
to the client.

**Query params:** `state` (optional, scopes `cities` to that state)

**Response**

```json
{ "states": ["California", "New Jersey", "Texas"], "cities": ["Edison", "Fremont", "Irving"] }
```

---

## Testimonials

### `GET /api/testimonials`

**Response**

```json
{
  "data": [
    { "id": "t1", "quote": "We listed our restaurant...", "name": "Priya Nair", "business": "Saffron Spice Kitchen" }
  ]
}
```

---

## Contact

### `POST /api/contact`

Backs the Contact page form.

**Request**

```json
{ "name": "Jane Doe", "email": "jane@example.com", "message": "..." }
```

**Response**

```json
{ "success": true, "id": "msg_123" }
```

---

## Not yet needed, worth planning for

- **Auth for business owners** — editing a listing after submission requires
  knowing who owns it. Not needed while listings are submit-once via the Promote
  form.
- **Admin moderation** — `GET /api/admin/businesses?status=pending` and
  `POST /api/admin/businesses/:id/approve` / `reject`, gating what `POST
  /api/businesses` creates before it becomes publicly visible.
