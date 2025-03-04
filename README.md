# Playwright Google Smoke Tests  

![CI/CD Status](https://github.com/aston-cook/Playwrite/actions/workflows/playwright-tests.yml/badge.svg?branch=develop)

This project automates smoke tests for Google.com using **Playwright** with the **Page Object Model (POM)**. It includes automated tests for **Google Search, Google Images, and Google Maps**, ensuring core functionalities work correctly.  

## 🚀 Features  
✅ **Playwright for automation** – Fast and reliable browser testing.  
✅ **Page Object Model (POM)** – Structured, maintainable, and reusable test code.  
✅ **CI/CD with GitHub Actions** – Automatically runs tests on every push and pull request.  
✅ **Test Reports** – Generates HTML reports for debugging test results.  

---

## 📂 Project Structure  

```
playwright-google-smoke-tests/
│── tests/                  # Test files using Playwright
│   ├── search.test.ts       # Google Search test
│   ├── images.test.ts       # Google Images test
│   ├── maps.test.ts         # Google Maps test
│── pages/                  # Page Objects for POM structure
│   ├── GoogleHomePage.ts    
│   ├── GoogleImagesPage.ts  
│   ├── GoogleMapsPage.ts    
│── utils/                  # Utility files for config values
│   ├── testConfig.ts        
│── .github/workflows/       # GitHub Actions CI/CD workflow
│   ├── playwright-tests.yml  
│── playwright.config.ts     # Playwright configuration
│── package.json            # Dependencies and scripts
│── README.md               # Project documentation
│── .gitignore              # Ignored files
```

---

## 🔧 Setup & Installation  

### **1️⃣ Prerequisites**  
Ensure you have the following installed:  
- [Node.js (LTS)](https://nodejs.org/)  
- [Playwright](https://playwright.dev/)  

### **2️⃣ Clone the Repository**  
```sh
git clone https://github.com/yourusername/playwright-google-smoke-tests.git
cd playwright-google-smoke-tests
```

### **3️⃣ Install Dependencies**  
```sh
npm install
```

### **4️⃣ Install Playwright Browsers**  
```sh
npx playwright install --with-deps
```

---

## ▶️ Running the Tests  

### **Run All Tests**
```sh
npx playwright test
```

### **Run a Specific Test**
```sh
npx playwright test tests/search.test.ts
```

### **View Test Reports**  
Playwright generates an HTML test report that you can view:  
```sh
npx playwright show-report
```

---

## 🧪 Test Cases  

### **1. Google Search Smoke Test** (`tests/search.test.ts`)  
✅ Navigates to [Google.com](https://www.google.com)  
✅ Searches for "Playwright automation"  
✅ Verifies that search results appear  

### **2. Google Images Smoke Test** (`tests/images.test.ts`)  
✅ Navigates to [Google Images](https://images.google.com)  
✅ Searches for "Playwright automation"  
✅ Verifies that image results load  

### **3. Google Maps Smoke Test** (`tests/maps.test.ts`)  
✅ Navigates to [Google Maps](https://maps.google.com)  
✅ Searches for "New York"  
✅ Verifies that the location appears on the map  

---

## ⚙️ CI/CD Integration with GitHub Actions  

This project includes **GitHub Actions CI/CD**, automatically running tests on every push or pull request.  

### **Workflow File: `.github/workflows/playwright-tests.yml`**
- **Runs tests** on every push to `main`
- **Uploads reports** as an artifact for debugging

### **Check Test Status**  
- Go to **GitHub → Actions**  
- Select the latest workflow run  
- Download the **Playwright report** from "Artifacts"  

---

## 📜 License  
This project is open-source and free to use under the **MIT License**.  

---

## 👨‍💻 Author  
**Aston Cook** – [LinkedIn Profile](https://www.linkedin.com/in/aston-cook/)  

---

