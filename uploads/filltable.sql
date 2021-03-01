\i createtable.sql

INSERT INTO portfolioDetails (portfolioName, directorName)
VALUES
	('Azure', 'Neil Carne'),
	('Blue', ''),
	('Chrome', 'Chris Hider'),
	('Coral', 'Andrew Park'),
	('Enablers', 'Lynette Williams'),
	('Indigo', 'Patrick Owens'),
	('Platinum', 'Jonathan Vaughan'),
	('Sapphire', 'Jim Cosgrove'),
	('Teal', 'Graham Roberts'),
	('TOM', 'Graham Roberts'),
	('Pre-portfolio', 'Colin Foley'),
	('TBCT', 'Michelle Wilson'),
	('BAU', 'TBC'),
	('BCM', 'Michelle Wilson'),
	('PM', 'Andrew Park'),
	('CAT', 'Tim Green');

UPDATE portfolioDetails SET active = false WHERE portfolioName = 'Blue';

INSERT INTO categoryDetails (categoryName)
VALUES
	(''),
	('Assurance'),
	('BAU'),
	('Commercial'),
	('Communications'),           
	('Deployment'),
	('Design'),
	('Development'),
	('Estates'),
	('Financial'),
	('Governance'),
	('Management'),
	('Regulatory'),
	('Resources'),
	('Scope/Requirements'),
	('Schedule'),
	('Security'),
	('Stakeholders'),
	('Strategy'),
	('Technology'),
	('Testing'),
	('Training');

\COPY projectDetails(projectTpNum, projectName, projectType, startDate, closureDate, srm, status, portfolio) FROM 'C:/Users/Dougie/Documents/llrep/Project_data.csv' WITH (FORMAT csv);

\COPY lessonDetails(projectTpNum, dateAdded, category, wwwEbi, identifiedBy, identifiersArea, howIdentified, uploadedBy, completionDate, summary, description, recommendations) FROM 'C:/Users/Dougie/Documents/llrep/Lessons_data.csv' WITH (FORMAT csv);

\COPY actionDetails(lessonId, actionDetails, actionOwner, targetDate) FROM 'C:/Users/Dougie/Documents/llrep/action_details.csv' WITH (FORMAT csv);

\COPY userDetails(UserID, UserName, UserAlias, UserActive, UserAdmin, UserImport, UserViewProjects, UserEditProject, UserAddProjects, UserViewLessons, UserEditLessons, UserAddLessons, UserDeleteRecords, UserEditUsers, EditLists) FROM 'C:/Users/Dougie/Documents/llrep/user_data.csv' WITH (FORMAT csv);