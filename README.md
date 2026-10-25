### Initialize
- GET /api/initialize

### Schedule
- POST /api/schedule [create new schedule]
- GET /api/schedules/:month/:year/:origin [filter by month]
- GET /api/schedules [get all schedules]
- GET /api/schedule/next [get next schedule]
- PUT /api/schedule/:id [update schedule]
- DELETE /api/schedule/:id [delete schedule]
- GET /api/schedule/personal/:name [find personal schedule]

### Invoice
- GET /api/download/invoice/:id [download data invoice]
- POST /api/invoice [create invoice]
- GET /api/invoices [get all invoice]
- GET /api/invoices/report [invoice report]
- GET /api/invoice/:id [get invoice data]
- GET /api/filter-month/invoice/:month/:year [filter invoice by month]
- GET /api/search/invoice/:name [find invoice by customer name]
- DELETE /api/delete/invoice/:id [delete invoice]