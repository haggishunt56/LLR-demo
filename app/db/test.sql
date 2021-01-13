SELECT lesson_id, project_name, www_ebi, category_name, portfolio_name, date_added
FROM lesson_details
JOIN project_details ON lesson_details.project_tp_num = project_details.project_tp_num
JOIN category_details ON lesson_details.category = category_details.category_id
JOIN portfolio_details ON project_details.portfolio = portfolio_details.portfolio_id
WHERE project_details.project_name LIKE '%project%'