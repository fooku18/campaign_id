SELECT tJ1.Y,tJ1.M,tJ1.SHOP_ID,tJ1.EDIT_TIME_SUM,tJ1.EDIT_TIME_KS,tJ1.EDIT_TIME_HS,tJ1.CNT_SUM,tJ1.CNT_KS,tJ1.CNT_HS,IFNULL(tJ2.ertrag,0) AS ERTRAG,IFNULL(tJ2.bestellungen,0) AS BESTELLUNGEN FROM 
	(SELECT t2.Y,t2.M,t2.SHOP_ID,SUM(t2.EDIT_TIME) AS EDIT_TIME_SUM,SUM(IF(S='KS',t2.EDIT_TIME,0)) AS EDIT_TIME_KS, SUM(IF(S='HS',t2.EDIT_TIME,0)) AS EDIT_TIME_HS,COUNT(t2.TICKET_ID) AS CNT_SUM, SUM(IF(S='KS',1,0)) AS CNT_KS, SUM(IF(S='HS',1,0)) AS CNT_HS FROM
		(SELECT YEAR(DATE(RECEIVE_DATE)) AS Y,MONTH(DATE(RECEIVE_DATE)) AS M,SHOP_ID,EDIT_TIME_IN_MS AS EDIT_TIME, 'KS' AS S, TICKET_ID
		FROM ks_eingang
		WHERE (DATE(RECEIVE_DATE) BETWEEN '2017-01-01' AND '2017-03-11')
		AND SHOP_ID <> 0 AND SHOP_ID IS NOT NULL 
		UNION ALL 
		SELECT YEAR(DATE(RECEIVE_DATE)) AS Y,MONTH(DATE(RECEIVE_DATE)) AS M,SHOP_ID,EDIT_TIME_IN_MS AS EDIT_TIME, 'HS' AS S, TICKET_ID 
		FROM hs_reporting 
		WHERE (DATE(RECEIVE_DATE) BETWEEN '2017-01-01' AND '2017-03-11') 
		AND SHOP_ID <> 0 AND SHOP_ID IS NOT NULL ) t2 
	GROUP BY t2.Y, t2.M, t2.SHOP_ID) tJ1
LEFT JOIN 
	(SELECT YEAR(datum) AS Y,MONTH(datum) AS M,shopid AS SHOP_ID,haendlername,sum(ertrag) AS ertrag,count(ertrag) AS bestellungen FROM kunden_bestellungen
	WHERE (datum BETWEEN '2017-01-01' AND '2017-03-11') 
	GROUP BY YEAR(datum),MONTH(datum),shopid) tJ2
ON tJ1.Y = tJ2.Y AND tJ1.M = tJ2.M AND tJ1.SHOP_ID = tJ2.SHOP_ID
ORDER BY tJ1.Y ASC, tJ1.M ASC, tJ1.CNT_SUM DESC;