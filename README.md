# Pause: Take a break from fast fashion
PAUSE is a full-stack web application designed to connect people with spontaneous doorstep sales and vintage markets on a single platform. The app simplifies the process of discovering and participating in vintage shopping events, promoting sustainable fashion practices.

---

## Technology Stack

Our application leverages a robust technology stack to deliver a seamless experience for users creating and attending vintage markets:

- **Front-End**: 
  - **React** and **Vite** for a dynamic and fast user interface.
  - **Firebase** for secure user authentication (signup/login).

- **Back-End**:
  - **Flask** for handling HTTP requests and backend logic.
  - **PostgreSQL** for storing and managing data.

- **Data Scraping and AI**:
  - **InstaLoader** for scraping Instagram data.
  - **OpenAI** for processing scraped data and generating insights.

### Workflow:
1. Users interact with the front-end.
2. Firebase manages authentication.
3. Front-end communicates with the Flask backend.
4. Flask queries PostgreSQL as needed.
5. InstaLoader scrapes Instagram data, processed by OpenAI.
6. Data is returned to the front-end for display.

---
