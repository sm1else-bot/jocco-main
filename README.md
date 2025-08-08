Jocco Changelog
A detailed history of the development of the Jocco project management tool.

Version 0.5: The Great UI Revamp
This version introduced a powerful theme engine, allowing for a complete visual overhaul of the application and adding a new level of personalization.

v0.5.1 (Latest)
Feature: Added a new "Bento" theme, featuring a high-contrast, neo-brutalist design with sharp corners and solid borders.

Feature: Added the ability to delete columns. A confirmation modal appears if the column contains tickets, preventing accidental data loss.

Fix: Corrected the "Bento" theme's ticket accent color to be a stark black (in light mode) or white (in dark mode) for a true brutalist aesthetic.

Fix: Resolved a critical bug where the optimistic UI update for new tickets would occasionally leave a "ghost" ticket on the board. The creation process is now seamless and instant.

v0.5.0
Feature: Implemented a Theme Engine to support multiple UI styles.

Feature: Added a new "Glass" theme featuring a modern glassmorphism effect with a dynamic, animated gradient background and floating geometric shapes.

UI: Forced all text to white when in "Glass" theme to ensure readability against the bright background.

UI: The Dark Mode toggle is now automatically disabled when the "Glass" theme is active.

Fix: Resolved a critical CSS layering issue where the hamburger menu would appear behind the board columns in "Glass" theme.

Version 0.4: Advanced Board Functionality
This version focused on adding core features that make the board more powerful and easier to manage for larger projects.

v0.4.2
Feature: Implemented Draggable Columns, allowing users to reorder their workflow by dragging and dropping columns.

Feature: Added a "Drag Mode" toggle in the menu to switch between moving tickets and moving columns, preventing conflicts.

UI: Added a subtle shadow to columns for a more 3D, tactile feel.

v0.4.1
Feature: Added an editable Board Name in the header.

Feature: Ticket ID prefixes now update dynamically based on the first two letters of the board name.

v0.4.0
Feature: Implemented unique, sequential Ticket IDs (e.g., MY-001) for easy reference.

Feature: Added a keyword search bar with a live dropdown that shows matching tickets by ID, title, or description.

Version 0.3: UI & UX Overhaul
This major update focused on polishing the user experience, adding significant visual customization, and implementing core productivity features.

v0.3.5
Fix: Restored the "Generate with AI" button which was accidentally removed.

Fix: Fixed a critical bug where the comment feature would crash the app. Comments are now added safely.

Fix: Comments now appear in the ticket details view in real-time without needing to close and reopen the modal.

v0.3.4
Feature: Added interactive checklists to tickets, with a progress bar in the details view.

Feature: Added a comment thread to tickets with automatic timestamps.

v0.3.3
Feature: Added a Links field to tickets, allowing users to add multiple comma-separated URLs.

Feature: Links are automatically hyperlinked in the ticket details view.

Feature: Implemented a right-click-to-rename feature for links.

Fix: Fixed an issue where links without https:// would not redirect correctly.

v0.3.2
Feature: Implemented a full Dark Mode with a sun/moon toggle button in the header.

Feature: The user's theme choice (light/dark) is now saved and persists between sessions.

v0.3.1
Fix: Fixed a bug where the column color picker was not saving the selected color.

Fix: Replaced the limited ticket accent color palette with a function that generates a truly random vibrant color for every new ticket.

v0.3.0
UI: New tickets are now created with a random accent color.

UI: Columns (except "To Do") now have distinct pastel background colors.

Feature: Added a color picker that appears when editing a column's title.

Version 0.2: Major Customization
This version marked the first major expansion of Jocco's core feature set, moving from a static board to a more flexible and detailed system.

Branding: Renamed the app from "Project Phoenix" to "Jocco".

UI: Changed the app's font to "Bitcount Prop Double" for the logo and "Roboto" for the UI.

Feature: Implemented customizable columns, allowing users to add new columns (up to 7) and edit the titles of existing ones.

Feature: Added new fields to tickets: Priority, Story Points, Start Date, and End Date.

Version 0.1: The Foundation
The initial versions focused on establishing the core functionality and integrating AI features.

v0.1.2
Fix: Refined the Gemini API prompts to prevent conversational filler in generated text.

Fix: Fixed a bug where the "Create Ticket" modal would not clear the text from the previously created ticket.

v0.1.1
Feature: Integrated the Gemini API to add an AI-Generated Description button.

Feature: Added an AI-powered "Suggest Sub-tasks" feature to the ticket details view.

v0.1.0
Initial Release: Jocco is born as a functional Jira clone.

Core Features:

Dynamic Kanban board with "To Do," "In Progress," and "Done" columns.

Ability to create, view, and edit tickets.

Drag-and-drop functionality for tickets.

Real-time data persistence with a Firebase Firestore backend.
