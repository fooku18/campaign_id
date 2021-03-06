SELECT tJ1.SHOP_ID,tJ1.EDIT_TIME_SUM,tJ1.EDIT_TIME_KS,tJ1.EDIT_TIME_HS,tJ1.CNT_SUM,tJ1.CNT_KS,tJ1.CNT_HS,tJ2.ertrag FROM 
	(SELECT t2.SHOP_ID,SUM(t2.EDIT_TIME) AS EDIT_TIME_SUM,SUM(IF(S='KS',t2.EDIT_TIME,0)) AS EDIT_TIME_KS, SUM(IF(S='HS',t2.EDIT_TIME,0)) AS EDIT_TIME_HS,COUNT(t2.TICKET_ID) AS CNT_SUM, SUM(IF(S='KS',1,0)) AS CNT_KS, SUM(IF(S='HS',1,0)) AS CNT_HS FROM
		(SELECT SHOP_ID,EDIT_TIME_IN_MS AS EDIT_TIME, 'KS' AS S, TICKET_ID
		FROM ks_eingang
		WHERE (DATE(RECEIVE_DATE) BETWEEN '2016-12-01' AND '2017-01-31')
		AND SHOP_ID <> 0 AND SHOP_ID IS NOT NULL 
		UNION ALL 
		SELECT SHOP_ID,EDIT_TIME_IN_MS AS EDIT_TIME, 'HS' AS S, TICKET_ID 
		FROM hs_reporting 
		WHERE (DATE(RECEIVE_DATE) BETWEEN '2016-12-01' AND '2017-01-31') 
		AND SHOP_ID <> 0 AND SHOP_ID IS NOT NULL) t2 
	GROUP BY t2.SHOP_ID) tJ1
INNER JOIN 
	(SELECT shopid AS SHOP_ID,haendlername,sum(ertrag) AS ertrag FROM kunden_bestellungen
	WHERE (datum BETWEEN '2016-12-01' AND '2017-01-31')
	GROUP BY shopid) tJ2
ON tJ1.SHOP_ID = tJ2.SHOP_ID
ORDER BY tJ1.CNT_SUM DESC;