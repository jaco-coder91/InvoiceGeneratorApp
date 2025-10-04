Invoice Generator App

This project is a responsive Invoice Generator built with React
, TypeScript
, Vite
 and Tailwind CSS
. The application lets you enter your business information, client details, invoice items and settings, preview a professional‑looking invoice in real‑time and export the result to a PDF.

Features

Business & client forms – capture your business name, logo, address and contact information as well as the client’s name, company, address and contact details.

Dynamic line items – add, edit or remove as many line items as needed. Each line item includes a description, quantity and unit price; the component automatically calculates subtotals for each row.

Invoice settings – configure the invoice number, issue date, due date, tax rate (percentage), notes, terms & conditions and payment instructions.

Real‑time preview – as you fill in the forms, the invoice preview updates instantly. Subtotals, tax and totals are calculated automatically based on your line items and tax rate.

Logo support – upload your company logo (PNG/JPEG) to include it in the invoice header.

PDF export – click Export to PDF to generate a PDF of the invoice preview. This uses html2canvas and jspdf under the hood to capture the preview and save it as an A4 PDF with a filename such as invoice-<invoiceNumber>.pdf
raw.githubusercontent.com
.

Toast notifications – success and error messages are displayed using a custom toast hook when exporting the PDF.

How it works

Root setup – App.tsx sets up the React Router and wraps the application in QueryClientProvider and a tooltip provider. It defines the / route for the home page and a catch‑all NotFound route. The home page simply renders the InvoiceForm component.

Forms and state – InvoiceForm.tsx manages the entire invoice state using the useState hook. It supplies initial values for business details, client details, line items and settings and passes change handlers down to each form component. When you type in a field, the corresponding change handler updates the invoice state.

BusinessForm.tsx – collects your company name, logo (uploaded with a file input and converted to a Data URI using FileReader
raw.githubusercontent.com
), address and contact information. Changes are passed back up via the onChange prop.

ClientForm.tsx – collects the client’s name, company, address and contact information
raw.githubusercontent.com
.

LineItemsForm.tsx – lets you add and remove line items. Each item has a unique ID (generated with crypto.randomUUID()), description, quantity and unit price. The form shows the amount (quantity × unit price) for each line and a button to remove the row
raw.githubusercontent.com
. A separate button adds a new blank row
raw.githubusercontent.com
.

InvoiceSettings.tsx – collects the invoice number, issue date, due date, tax rate, notes, terms and payment instructions. Dates are displayed and updated as ISO strings split at the T character for the date inputs
raw.githubusercontent.com
. Tax rate, notes and terms are plain inputs or textareas.

InvoicePreview.tsx – calculates the subtotal by summing quantity × unit price for each line item
raw.githubusercontent.com
, computes tax as subtotal * (taxRate / 100), and calculates the total. It displays the business details, logo, invoice number, client details, dates, a table of line items, the computed totals and any notes/terms/payment instructions
raw.githubusercontent.com
. This component has an id="invoice-preview" used by the PDF export function to capture the preview.

PDF export – the exportToPDF function in src/utils/pdfExport.ts uses html2canvas to render the invoice preview as a canvas, converts it to a PNG and then uses jspdf to insert the image into a PDF and save it
raw.githubusercontent.com
. The export is triggered by the Export to PDF button in InvoiceForm and wrapped in a try…catch block with toast notifications.

Getting started

These instructions assume you have Node.js
 installed (version 16+ recommended).

# install dependencies
npm install

# start a development server on http://localhost:5173
npm run dev

# build for production
npm run build

# preview the production build
npm run preview


When you run the development server, open your browser to http://localhost:5173 to use the app. As you edit components, Vite provides hot‑module reloading.

Usage

Launch the development server and navigate to the root page. You’ll see a two‑column layout: forms on the left and an invoice preview on the right.

Fill in Your Business Details with your company name, upload a logo (optional), enter your address and contact information.

Fill in Client Details with the recipient’s name, company, address and contact information.

Use the Line Items section to add invoice items. Click Add Item to create a new row and fill in the description, quantity and unit price. Remove any row using the trash‑can icon.

Under Invoice Settings, set the invoice number, issue and due dates, tax rate and optional notes, terms and payment instructions.

As you type, the invoice preview updates automatically with your entries, showing subtotals, tax and the total amount.

Once satisfied, click Export to PDF. A toast message will confirm that the PDF has been created and downloaded with a filename like invoice-INV‑12345.pdf.

Project structure (simplified)
├── public/               # static assets and the HTML entry point
├── src/
│   ├── components/
│   │   ├── BusinessForm.tsx
│   │   ├── ClientForm.tsx
│   │   ├── InvoiceForm.tsx    # orchestrates forms, preview and PDF export
│   │   ├── InvoicePreview.tsx # renders the invoice preview and totals
│   │   ├── InvoiceSettings.tsx
│   │   └── LineItemsForm.tsx
│   ├── pages/
│   │   ├── Index.tsx          # home page route
│   │   └── NotFound.tsx       # 404 page
│   ├── hooks/
│   │   └── use-toast.ts       # toast state management
│   ├── types/
│   │   └── invoice.ts         # TypeScript interfaces for invoice data
│   └── utils/
│       └── pdfExport.ts       # function to capture preview and export to PDF
├── package.json             # scripts and dependencies
└── tailwind.config.ts       # Tailwind CSS configuration

Technologies used

React & Vite – the application uses React 18 with Vite for fast development and builds.

TypeScript – provides static typing for components and data models.

Tailwind CSS – utility‑first styling for responsive layouts and consistent design.

Radix UI & shadcn UI – accessible UI primitives (@radix-ui/react-*) used via the shadcn component wrappers (button, card, input, label, etc.).

lucide‑react – icon library used for the add/remove item buttons.

html2canvas & jsPDF – used to capture the DOM preview and generate a downloadable PDF
raw.githubusercontent.com
.

React Router – client‑side routing between the home and 404 pages.

@tanstack/react-query – included and configured in App.tsx; ready for server state management if extended.

Contributing

Contributions are welcome! If you notice a bug or want to propose an enhancement, feel free to open an issue or create a pull request.

License

This project currently does not specify a license. If you intend to contribute, please discuss licensing with the repository owner.
