# 🎓 529 Max Tracker

A web application that helps students and families organize, track, and report qualified 529 education expenses. The app securely stores expenses in Firebase, provides analytics, and generates yearly reports to make tax season easier.

**Live Demo:** https://529-max-tracker.vercel.app

---

## Features

### Expense Management
- Add, edit, and delete expenses
- Categorize expenses (Tuition, Books, Housing, etc.)
- Mark expenses as **Qualified** or **Unqualified**
- Search and filter expenses
- Sort expenses by date or amount

### Receipt Scanning
- Upload receipt images
- Automatically extract information using OCR
- Edit extracted information before saving

### Reports & Analytics
- Annual expense reports
- Total qualified vs. unqualified expenses
- Category breakdown charts
- Monthly spending trends
- Budget tracking

### Authentication
- Secure Google Sign-In
- User-specific expense data
- Cloud synchronization using Firebase Firestore

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript (ES Modules)

### Backend / Cloud
- Firebase Authentication
- Cloud Firestore

### Libraries & APIs
- Chart.js
- OCR.space API

### Deployment
- Vercel

## Installation

Clone the repository.

```bash
git clone https://github.com/nlavey/529-max-tracker.git
```

Move into the project directory.

```bash
cd 529-max-tracker
```

Create a Firebase project and enable:

- Google Authentication
- Cloud Firestore

Update your Firebase configuration in `firebase.js`.

Deploy locally using a development server such as VS Code Live Server.

---

## Firebase Setup

1. Create a Firebase project.
2. Enable Google Authentication.
3. Enable Cloud Firestore.
4. Add your local domain and deployed domain to **Authorized Domains**.
5. Replace the Firebase configuration inside `firebase.js`.

Example:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

---

## Project Structure

```
529-max-tracker/
│
├── index.html
├── styles.css
├── script.js
├── firebase.js
├── firestore.js
├── reports.js
├── ocr.js
├── charts.js
├── screenshots/
└── README.md
```

---

## Future Improvements

- PDF report generation
- CSV export
- Receipt image storage with Firebase Storage
- Shared family accounts
- Mobile responsive redesign
- Spending forecasts
- Dark mode
- Budget notifications

---

## Why I Built This

I built 529 Max Tracker to solve a real problem families face when keeping track of qualified education expenses for 529 plans. My goal was to create a practical application while gaining experience with modern web development technologies such as Firebase Authentication, Firestore, cloud deployment, and data visualization.

---

## Author

**Noah Lavey**

Computer Science Student at UC Santa Cruz

GitHub: https://github.com/nlavey

LinkedIn: https://linkedin.com/in/noahlavey

---

## License

This project is licensed under the MIT License.
