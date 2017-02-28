/*SELECT tN.SHOP_ID, COUNT(PROCESS_ID) FROM 
(
	SELECT SHOP_ID, PROCESS_ID
	FROM ks_eingang 
	WHERE (DATE(RECEIVE_DATE) BETWEEN '2016-12-01' AND '2017-01-31')
	UNION ALL 
	SELECT SHOP_ID, PROCESS_ID
	FROM hs_reporting 
	WHERE (DATE(RECEIVE_DATE) BETWEEN '2016-12-01' AND '2017-01-31')
) AS tN
GROUP BY tN.SHOP_ID 
HAVING tN.SHOP_ID <> 0 
ORDER BY COUNT(PROCESS_ID) DESC;*/
/*INSERT INTO kunden_bestellungen_temp (  
			datum,  
			shopid,  
			haendlername,  
			bestellnummer,  
			status,  
			stornogrund,  
			anzahl_storno,  
			storno_warenwert,  
			storno_datum,  
			stornogebuehren,  
			retoure,  
			retoure_datum,  
			anzahl_retoure,  
			retoure_warenwert,  
			retoure_gebuehr,  
			anzahl,  
			preis,  
			zahlungsart,  
			versandkosten,  
			ertrag,  
			usertype)  
		SELECT datum,  
			shopid,  
			haendlername,  
			bestellnummer,  
			status,  
			stornogrund,  
			sum(anzahl_storno) AS anzahl_storno,  
			sum(storno_warenwert) AS storno_warenwert,  
			storno_datum,  
			sum(stornogebuehren) AS stornogebuehren,  
			retoure,  
			retoure_datum,  
			sum(anzahl_retoure) AS anzahl_retoure,  
			sum(retoure_warenwert) AS retoure_warenwert,  
			sum(retoure_gebuehr) AS retoure_gebuehr,  
			sum(anzahl) AS anzahl,  
			sum(preis) AS preis,  
			zahlungsart,  
			sum(versandkosten) AS versandkosten,  
			IF(status <> 'cancelled',sum(anzahl*preis*(aynmp_provision/100)),0) AS ertrag,  
			usertype   
		FROM kunden_bestellungen_temp_f   
		WHERE bestellnummer IS NOT NULL   
		GROUP BY bestellnummer;*/
	
SELECT kunden_bestellungen_temp.* FROM kunden_bestellungen RIGHT OUTER JOIN kunden_bestellungen_temp 
ON kunden_bestellungen.bestellnummer = kunden_bestellungen_temp.bestellnummer 
WHERE kunden_bestellungen.bestellnummer IS NULL;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	