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

INSERT INTO project_details (project_tp_num, project_name, project_type, start_date, srm, status, portfolio)
VALUES
	('proj1', 'Test Project 1', 'project', '2012-02-12', 'James Smith', 'Open', '5'),
	('proj2', 'Test Project 2', 'project', '2013-02-12', 'Andrew Jones', 'Open', '4'),
	('proj3', 'Test Project 3', 'campaign', '2015-02-12', 'Frank Hunter', 'Open', '3'),
	('proj4', 'Test Project 4', 'project', '2016-02-12', 'Georgina Potter', 'Open', '10'),
	('proj5', 'Test Project 5', 'conference', '2019-02-12', 'Lesley McWilliams', 'Open', '17'),
	('proj6', 'Test Project 6', 'conference', '2019-02-12', 'Patrick McKenzie', 'Open', '17');
	
INSERT INTO lesson_details (project_tp_num, date_added, category, www_ebi, identified_by, identifiers_area, how_identified, uploaded_by, completion_date, summary, description)
VALUES
	('proj1', '2012-02-12', 17, 'www', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User2', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User2', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User2', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User2', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User2', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User2', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User3', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User3', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User3', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User3', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User3', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User3', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User3', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User2', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User2', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User2', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User2', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User2', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User2', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User2', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User4', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User4', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User4', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User4', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'ebi', 'Test User4', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
	('proj1', '2012-02-12', 17, 'www', 'Test User4', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')