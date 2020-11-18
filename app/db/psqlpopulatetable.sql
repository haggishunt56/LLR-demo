\i psqltablesetup.sql

INSERT INTO portfolio_details (portfolio_name, director_name)
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

UPDATE portfolio_details SET active = false WHERE portfolio_name = 'Blue';

INSERT INTO category_details (category_name)
VALUES
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

\COPY project_details(project_tp_num, project_name, project_type, start_date, closure_date, srm, status, portfolio) FROM './Project_data.csv' WITH (FORMAT csv);

\COPY lesson_details(project_tp_num, date_added, category, www_ebi, identified_by, identifiers_area, how_identified, uploaded_by, completion_date, summary, description, recommendations) FROM './Lessons_data.csv' WITH (FORMAT csv);

\COPY action_details(lesson_id, action_details, action_owner, target_date) FROM './action_details.csv' WITH (FORMAT csv);

\COPY user_details(UserID, UserName, UserAlias, UserActive, UserAdmin, UserImport, UserViewProjects, UserEditProject, UserAddProjects, UserViewLessons, UserEditLessons, UserAddLessons, UserDeleteRecords, UserEditUsers, EditLists) FROM './user_data.csv' WITH (FORMAT csv);
