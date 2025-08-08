# Jocco Changelog

A detailed history of the development of the Jocco project management tool.

---

### **v0.6: The Sentinel Update**

* **Feature:** Ticket Archiving: Never lose a ticket again! Deleted tickets are now sent to an archive, accessible from the main menu. From there, you can restore them to the board or delete them permanently.

* **Feature:** Smarter AI Descriptions: The Gen AI for ticket descriptions is now much more intelligent. It acts like a product manager, using the ticket title to generate a clear user story and a list of acceptance criteria, making descriptions far more useful.

* **Improvement:** UI Clarity: The "Delete" button in the ticket view has been replaced with a more accurate "Archive" button and icon. The new design uses neutral colors that work well in both light and dark modes.

* **Fix:** Ticket Restoration: Squashed a bug where restoring a ticket from a deleted column would leave it in limbo. All restored tickets now correctly appear in the "To Do" column.

### **Version 0.5: The Great UI Revamp**

This version introduced a powerful theme engine, allowing for a complete visual overhaul of the application and adding a new level of personalization.

#### **v0.5.2**
* **Feature:** A little easter egg :) find out.

#### **v0.5.1 (Latest)**
* **Feature:** Added a new **"Bento"** theme, featuring a high-contrast, neo-brutalist design with sharp corners and solid borders.
* **Feature:** Added the ability to **delete columns**. A confirmation modal appears if the column contains tickets, preventing accidental data loss.
* **Fix:** Corrected the "Bento" theme's ticket accent color to be a stark black (in light mode) or white (in dark mode) for a true brutalist aesthetic.
* **Fix:** Resolved a critical bug where the optimistic UI update for new tickets would occasionally leave a "ghost" ticket on the board. The creation process is now seamless and instant.

#### **v0.5.0**
* **Feature:** Implemented a **Theme Engine** to support multiple UI styles.
* **Feature:** Added a new **"Glass"** theme featuring a modern glassmorphism effect with a dynamic, animated gradient background and floating geometric shapes.
* **UI:** Forced all text to white when in "Glass" theme to ensure readability against the bright background.
* **UI:** The Dark Mode toggle is now automatically disabled when the "Glass" theme is active.
* **Fix:** Resolved a critical CSS layering issue where the hamburger menu would appear behind the board columns in "Glass" theme.

---

### **Version 0.4: Advanced Board Functionality**

This version focused on adding core features that make the board more powerful and easier to manage for larger projects.

#### **v0.4.2**
* **Feature:** Implemented **Draggable Columns**, allowing users to reorder their workflow by dragging and dropping columns.
* **Feature:** Added a **"Drag Mode"** toggle in the menu to switch between moving tickets and moving columns, preventing conflicts.
* **UI:** Added a subtle shadow to columns for a more 3D, tactile feel.

#### **v0.4.1**
* **Feature:** Added an **editable Board Name** in the header.
* **Feature:** Ticket ID prefixes now **update dynamically** based on the first two letters of the board name.

#### **v0.4.0**
* **Feature:** Implemented unique, sequential **Ticket IDs** (e.g., MY-001) for easy reference.
* **Feature:** Added a **keyword search bar** with a live dropdown that shows matching tickets by ID, title, or description.

---

### **Version 0.3: UI & UX Overhaul**

This major update focused on polishing the user experience, adding significant visual customization, and implementing core productivity features.

#### **v0.3.5**
* **Fix:** Restored the "Generate with AI" button which was accidentally removed.
* **Fix:** Fixed a critical bug where the comment feature would crash the app. Comments are now added safely.
* **Fix:** Comments now appear in the ticket details view in real-time without needing to close and reopen the modal.

#### **v0.3.4**
* **Feature:** Added **interactive checklists** to tickets, with a progress bar in the details view.
* **Feature:** Added a **comment thread** to tickets with automatic timestamps.

#### **v0.3.3**
* **Feature:** Added a **Links field** to tickets, allowing users to add multiple comma-separated URLs.
* **Feature:** Links are automatically hyperlinked in the ticket details view.
* **Feature:** Implemented a **right-click-to-rename** feature for links.
* **Fix:** Fixed an issue where links without `https://` would not redirect correctly.

#### **v0.3.2**
* **Feature:** Implemented a full **Dark Mode** with a sun/moon toggle button in the header.
* **Feature:** The user's theme choice (light/dark) is now saved and persists between sessions.

#### **v0.3.1**
* **Fix:** Fixed a bug where the column color picker was not saving the selected color.
* **Fix:** Replaced the limited ticket accent color palette with a function that generates a **truly random vibrant color** for every new ticket.

#### **v0.3.0**
* **UI:** New tickets are now created with a random accent color.
* **UI:** Columns (except "To Do") now have distinct pastel background colors.
* **Feature:** Added a **color picker** that appears when editing a column's title.

---

### **Version 0.2: Major Customization**

This version marked the first major expansion of Jocco's core feature set, moving from a static board to a more flexible and detailed system.

* **Branding:** Renamed the app from "Project Phoenix" to **"Jocco"**.
* **UI:** Changed the app's font to **"Bitcount Prop Double"** for the logo and **"Roboto"** for the UI.
* **Feature:** Implemented **customizable columns**, allowing users to add new columns (up to 7) and edit the titles of existing ones.
* **Feature:** Added new fields to tickets: **Priority**, **Story Points**, **Start Date**, and **End Date**.

---

### **Version 0.1: The Foundation**

The initial versions focused on establishing the core functionality and integrating AI features.

#### **v0.1.2**
* **Fix:** Refined the Gemini API prompts to prevent conversational filler in generated text.
* **Fix:** Fixed a bug where the "Create Ticket" modal would not clear the text from the previously created ticket.

#### **v0.1.1**
* **Feature:** Integrated the Gemini API to add an **AI-Generated Description** button.
* **Feature:** Added an AI-powered **"Suggest Sub-tasks"** feature to the ticket details view.

#### **v0.1.0**

* **Initial Release:** Jocco is born as a functional Jira clone.
* **Core Features:**
  * Dynamic Kanban board with "To Do," "In Progress," and "Done" columns.
  * Ability to create, view, and edit tickets.
  * Drag-and-drop functionality for tickets.
  * Real-time data persistence with a Firebase Firestore backend.
 
  Here is the `README.md` file detailing the setup process.


# Jocco - Local Development Setup Guide

This guide provides step-by-step instructions to set up and run the Jocco application on your local machine, starting from the `app.js` source file.

---

### Prerequisites

Before you begin, ensure you have **Node.js** and **npm** installed on your system. You can download them from the official [Node.js website](https://nodejs.org/).

---

### Step 1: Create the React Project

A React application requires a specific folder structure and build tools. The easiest way to create this is with `create-react-app`.

1.  Open your terminal or command prompt.
2.  Navigate to the directory where you want to store the project.
3.  Run the following command to create the project folder and all necessary files:
    ```bash
    npx create-react-app jocco-app
    ```
4.  Once it's finished, navigate into the new project directory:
    ```bash
    cd jocco-app
    ```

---

### Step 2: Integrate Your Code & Install Dependencies

Now, we'll replace the template code with your application logic and install the required libraries.

1.  **Replace `App.js`**: Delete the contents of the file located at `src/App.js` and paste the entire code from your original Jocco `app.js` file into it.

2.  **Install Firebase**: The app uses Firebase for its backend. Install it with this command:
    ```bash
    npm install firebase
    ```

3.  **Install Tailwind CSS**: The app's styling is handled by Tailwind CSS. Install the compatible versions for Create React App:
    ```bash
    npm install -D tailwindcss@^3.0.0 postcss@^8.0.0 autoprefixer@^10.0.0
    ```

---

### Step 3: Configure Tailwind CSS

You need to configure Tailwind to scan your code and include its styles in the project.

1.  **Generate Config Files**: Run this command to create `tailwind.config.js` and `postcss.config.js`:
    ```bash
    npx tailwindcss init -p
    ```

2.  **Configure Template Paths**: Open the newly created `tailwind.config.js` file and replace its contents with the following to tell Tailwind which files to scan for classes:
    ```javascript
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

3.  **Add Tailwind to CSS**: Open the `src/index.css` file. Delete all of its content and replace it with these three lines:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

---

### Step 4: Firebase Project Setup

This is the most critical part. You need to create and configure a Firebase project to act as the backend.

1.  **Create a Firebase Project**:
    * Go to the [Firebase Console](https://console.firebase.google.com/).
    * Click "Add project" and give it a name (e.g., "jocco-app").
    * Follow the on-screen steps to create the project.

2.  **Create a Web App & Get Config**:
    * Inside your new project, click the Web icon (`</>`) to create a new web application.
    * Give it a nickname and register the app.
    * Firebase will provide you with a `firebaseConfig` object. Copy this entire object.
    * In your `src/App.js` file, find the line that starts with `const firebaseConfig = ...` and **replace the entire line** with the object you just copied.

3.  **Enable Authentication**:
    * In the Firebase Console, go to the **Build** > **Authentication** section.
    * Click the **Sign-in method** tab.
    * Find **Anonymous** in the list, click the pencil icon, enable it, and save.

4.  **Set Up Firestore Database**:
    * In the Firebase Console, go to the **Build** > **Firestore Database** section.
    * Click "Create database".
    * Choose to start in **Test mode**. This will set the security rules to allow reads and writes while you're developing.
    * Select a location for your database and click "Enable".

---

### Step 5: Run the Application

With everything configured, you can now start the local development server.

1.  In your terminal (still inside the `jocco-app` folder), run:
    ```bash
    npm start
    ```
2.  This will automatically open the Jocco app in your web browser, running at `http://localhost:3000`. The app is now fully functional.


