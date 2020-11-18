This document provides guidance on launching and using the LLR application.

1. Download the code to your machine and save it in an accessible location
2. Open up a command prompt and navigate to the project folder with 'cd :/[file path]'
3. Use the command 'npm install' to install the required modules to allow the application to run
3. Use the command 'npm start' to start the NodeJS server (you must have Node installed)
4. Open a browser and go to 'localhost:80'

A video of the application being downloaded and run can be found here: https://youtu.be/35hdOXb94To

By default, the application uses PostgreSQL as the DBMS. The connection details can be found and customised in the knexfile.js document. These will need to be set to whatever PSQL is configured to on your PC.
The database can be set up by calling the psqlpopulatetable.sql script, found in the ./app/db/ directory

Functionality provided by LLR:
1. View information related to lessons, projects, campaigns and conferences
2. Create new projects, recruitment campaigns and conferences
3. Create individual lessons (must be associated with one of the above project types)
4. Create actions (must be associated with a lesson)
5. Bulk upload lessons
6. Update existing lessons, projects, campaigns and conferences
7. Delete lessons, projects, campaigns and conferences. This is a soft-delete, meaning these entries still exist in the database but are not viewable by some users
8. Reinstate deleted lessons, projects, campaigns and conferences
