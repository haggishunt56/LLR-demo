INSERT INTO portfolio_details (portfolio_name, director_name, active)
VALUES
	('Azure', 'Neil Carne', 'true'),
	('Blue', '', 'false'),
	('Chrome', 'Chris Hider', 'true'),
	('Coral', 'Andrew Park', 'true'),
	('Enablers', 'Lynette Williams', 'true'),
	('Indigo', 'Patrick Owens', 'true'),
	('Platinum', 'Jonathan Vaughan', 'true'),
	('Sapphire', 'Jim Cosgrove', 'true'),
	('Teal', 'Graham Roberts', 'true'),
	('TOM', 'Graham Roberts', 'true'),
	('Pre-portfolio', 'Colin Foley', 'true'),
	('TBCT', 'Michelle Wilson', 'true'),
	('BAU', 'TBC', 'true'),
	('BCM', 'Michelle Wilson', 'true'),
	('PM', 'Andrew Park', 'true'),
	('CAT', 'Tim Green', 'true');

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
	('ScopeRequirements'),
	('Schedule'),
	('Security'),
	('Stakeholders'),
	('Strategy'),
	('Technology'),
	('Testing'),
	('Training');

INSERT INTO project_details (project_tp_num, project_name, project_type, start_date, srm, status, portfolio, description)
VALUES
	('proj1', 'Test Project 1', 'project', '2012-02-12', 'James Smith', 'Open', '5', 'A test project'),
	('proj2', 'Test Project 2', 'project', '2013-02-12', 'Andrew Jones', 'Open', '4', 'A second test project'),
	('proj3', 'Test Project 3', 'campaign', '2015-02-12', 'Frank Hunter', 'Open', '3', 'Another test project'),
	('proj4', 'Test Project 4', 'project', '2016-02-12', 'Georgina Potter', 'Open', '10', 'Test project 4'),
	('proj5', 'Test Project 5', 'conference', '2019-02-12', 'Lesley McWilliams', 'Open', '16', 'Test project the 5th'),
	('proj6', 'Test Project 6', 'conference', '2019-02-12', 'Patrick McKenzie', 'Open', '16', 'The final test project');

INSERT INTO lesson_details (project_tp_num, date_added, category, www_ebi, identified_by, identifiers_area, how_identified, uploaded_by, completion_date, summary, description)
VALUES
	('proj1', '2013-05-31', 3, 'www', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'This is project 1 lesson 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
	('proj1', '2017-05-16', 13, 'www', 'Test User', 'SPDS', 'Sprint Retrospective', 1, NULL, 'This is lesson 2', 'Ssed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
	('proj1', '2019-06-15', 20, 'www', 'Test User', 'SPDS', 'Sprint Retrospective', 1, NULL, 'This is lesson 5', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
	('proj1', '2020-11-11', 6, 'www', 'Test User', 'SPDS', 'Sprint Retrospective', 1, NULL, 'Summary of lesson', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non provident.'),
	('proj1', '2012-10-12', 11, 'www', 'Test User', 'SPDS', 'Sprint Retro', 1, NULL, 'This is lesson 5', 'Sunt in culpa qui officia deserunt mollit anim id est laborum.'),
	('proj2', '2018-07-17', 15, 'www', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'This is lesson 6', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam'),
	('proj2', '2012-03-18', 14, 'ebi', 'Test User2', 'TEaL Portfolio', 'Lessons Learned Review', 1, NULL, 'This is lesson 7', 'Eeaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'),
	('proj2', '2016-01-19', 20, 'ebi', 'Test User2', 'TEaL Portfolio', 'Lessons Learned Review', 1, NULL, 'This is lesson 8', 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur'),
	('proj2', '2011-02-19', 6, 'ebi', 'Test User2', 'TEaL Portfolio', 'Sprint Retro', 1, NULL, 'This is lesson 9', 'Aaut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.'),
	('proj2', '2009-08-12', 11, 'ebi', 'Test User2', 'TEaL Portfolio', 'Sprint Retro', 1, NULL, 'This is lesson 10', 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora'),
	('proj2', '2019-09-30', 20, 'ebi', 'Test User2', 'TEaL Portfolio', 'Sprint Retro', 1, NULL, 'Summary of lesson 11', 'Iincidunt ut labore et dolore magnam aliquam quaerat voluptatem.'),
	('proj2', '2018-02-13', 11, 'www', 'Test User2', 'TEaL Portfolio', 'Lessons Learned Review', 1, NULL, 'This is lesson 12', 'Ut enim ad minima veniam, quis nostrum exercitationem'),
	('proj2', '2012-12-12', 15, 'www', 'Test User3', 'Sapphire', 'Lessons Learned Review', 1, NULL, 'Summary of lesson 13', 'Ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?'),
	('proj2', '2016-02-30', 12, 'www', 'Test User3', 'Sapphire', 'Lessons Learned Review', 1, NULL, 'This is lesson 14', 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse'),
	('proj2', '2017-05-11', 6, 'www', 'Test User3', 'Sapphire', 'Lessons Learned Review', 1, NULL, 'This is lesson 15', 'Quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur'),
	('proj2', '2015-07-19', 20, 'www', 'Test User3', 'Sapphire', 'Sprint Retro', 1, NULL, 'This is lesson 16', 'LMorbi iaculis ligula viverra, bibendum justo sit amet, faucibus tellus.'),
	('proj3', '2012-09-13', 7, 'www', 'Test User3', 'Sapphire', 'Lessons Learned Review', 1, NULL, 'Summary of lesson 17', 'Nulla risus purus, elementum nec enim ut, sagittis venenatis nisi.'),
	('proj3', '2013-02-18', 8, 'www', 'Test User3', 'Sapphire', 'Sprint Retro', 1, NULL, 'This is lesson 18', 'Duis vel lacus placerat, tempus sapien nec, volutpat nunc.'),
	('proj3', '2012-07-18', 11, 'www', 'Test User3', 'Sapphire', 'Sprint Retro', 1, NULL, 'This is lesson 19', 'Fusce dui nunc, egestas vel ultrices sit amet, pulvinar nec velit. Excepteur sint occaecat cupidatat non provident.'),
	('proj3', '2011-07-31', 13, 'www', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'This is lesson 20', 'Quisque vitae nibh quis sapien porttitor interdum.'),
	('proj3', '2012-08-22', 21, 'ebi', 'Test User', 'SPDS', 'Retro', 1, NULL, 'This is lesson 21', 'Sonec ligula diam, condimentum vel convallis ut, ullamcorper at augue.'),
	('proj3', '2017-06-27', 8, 'ebi', 'Test User', 'SPDS', 'Retro', 1, NULL, 'This is lesson 22', ' Aenean iaculis aliquet erat, a condimentum ante lacinia ac.'),
	('proj3', '2018-06-27', 16, 'ebi', 'Test User', 'SPDS', ' Retro', 1, NULL, 'Summary of lesson 23', 'Donec sit amet massa molestie, varius ex sed, maximus velit.'),
	('proj3', '2012-06-23', 5, 'ebi', 'Test User', 'SPDS', ' Retro', 1, NULL, 'This is lesson 24', 'Proin dignissim dictum velit, eget mollis tellus aliquam eu.'),
	('proj3', '2019-06-29', 9, 'www', 'Test User2', 'TEaL Portfolio', 'Lessons Learned Review', 1, NULL, 'Not added', 'Phasellus sem urna, fringilla ut luctus et, tincidunt id tellus.'),
	('proj3', '2011-07-27', 8, 'ebi', 'Test User2', 'TEaL Portfolio', 'Lessons Learned Review', 1, NULL, 'Not added', 'Quisque at tellus ac justo semper feugiat.'),
	('proj3', '2010-02-25', 7, 'ebi', 'Test User2', 'TEaL Portfolio', 'Lessons Learned Review', 1, NULL, 'Not added', 'Vivamus scelerisque pulvinar sollicitudin.'),
	('proj3', '2012-03-24', 2, 'www', 'Test User2', 'TEaL Portfolio', 'Sprint Retro', 1, NULL, 'Not added', 'Sed rhoncus condimentum dui, sed feugiat arcu pellentesque eu.'),
	('proj5', '2009-03-01', 8, 'www', 'Test User2', 'TEaL Portfolio', 'Sprint Retro', 1, NULL, 'Not added', 'Donec varius nunc ut neque ultricies, faucibus tincidunt est consectetur.'),
	('proj5', '2013-04-02', 11, 'www', 'Test User2', 'TEaL Portfolio', 'Sprint Retro', 1, NULL, 'Not added', 'Duis interdum ex nisi, ultricies placerat purus tincidunt at.'),
	('proj5', '2019-04-04', 16, 'www', 'Test User2', 'TEaL Portfolio', 'Sprint Retro', 1, NULL, 'Not added', 'Morbi quis arcu varius mi molestie ullamcorper non at nisl.'),
	('proj5', '2018-07-09', 2, 'ebi', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Aliquam dolor ex, tincidunt fermentum lacinia non, interdum quis quam.'),
	('proj5', '2016-12-05', 21, 'ebi', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Integer arcu libero, auctor nec mi eu, eleifend cursus orci.'),
	('proj5', '2014-12-01', 6, 'www', 'Test User', 'SPDS', 'Lessons Learned Review', 1, NULL, 'Not added', 'Nunc dapibus, massa vitae varius commodo, neque nunc laoreet augue, eget cursus justo sem in nulla. Sed placerat lectus ac justo congue tincidunt.'),
	('proj5', '2015-12-15', 6, 'www', 'Test User4', 'Globe Counter', 'Observation', 1, NULL, 'Not added', 'Nunc hendrerit est eu sollicitudin aliquet.'),
	('proj5', '2011-11-14', 6, 'www', 'Test User4', 'Globe Counter', 'Observation', 1, NULL, 'Not added', 'Nam vitae sapien cursus, vulputate ligula sed, mattis magna. Vestibulum sit amet est aliquet, sagittis nibh quis, pulvinar felis.'),
	('proj5', '2017-01-13', 13, 'www', 'Test User4', 'Globe Counter', 'Observation', 1, NULL, 'Not added', 'Nulla tempor massa ante, viverra eleifend augue tristique at.'),
	('proj6', '2016-10-19', 18, 'ebi', 'Test User4', 'Globe Counter', 'Observation', 1, NULL, 'Not added', 'Aliquam ut egestas tellus. Curabitur sit amet elementum nunc.'),
	('proj6', '2019-10-18', 14, 'ebi', 'Test User4', 'Globe Counter', 'Observation', 1, NULL, 'Not added', 'Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed interdum in arcu sit amet posuere.'),
	('proj6', '2019-07-11', 9, 'www', 'Test User4', 'Globe Counter', 'Observation', 1, NULL, 'Not added', 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus condimentum tortor sit amet mauris rhoncus iaculis.');


INSERT INTO action_details (lesson_id, action_details, action_owner, target_date)
VALUES
	(1, 'Add Lorem ipsum to all future demo lessons', 'David Dramen', '2012-02-12')
