SELECT CONCAT(month(tN.d),'/',year(tN.d)) AS d,COUNT(tN.C) AS CT,tN.S AS S,tN.Q AS Q 
FROM 
(
SELECT DATE(LAST_DATE_PROCESSED) AS d,
TRANSACTION_CODE AS C,
CASE WHEN INSTR(TRANSACTION_CODE,"AYN_") THEN "AYN" 
WHEN INCOMING_ADDRESS = "austria@postpay.de" THEN "PPAUT" 
WHEN INSTR(TRANSACTION_CODE,"PP_") THEN "PPDE" 
WHEN INSTR(INCOMING_ADDRESS,"meinpaket") THEN "AYN" 
WHEN INSTR(INCOMING_ADDRESS,"allyouneed") THEN "AYN" 
ELSE "PPDE" END AS S,
IF(INSTR(TEMPLATE,'CALL'),'CALL','MAIL') AS Q 
FROM ks_eingang 
WHERE CATEGORY IN ('2-KS_AYN_Gutschein','2-KS_AYN_Kulanzpruefung','2-KS_AYN_Kundenkonto','2-KS_AYN_PayPal_Konfliktfaelle','2-KS_AYN_Polizeianfragen','2-KS_AYN_Zahlung','2-KS_PP_Polizeianfrage','2-KS_PP_Zahlung','2-KS_PP_Zahlung_PayPal','BO_Anfrage_an_HaendlerSupport','BO_KS_Backoffice','BO_KS_Blacklist','BO_KS_Eskalation_Produktmanagement','BO_KS_Eskalation_SupportManagement','BO_KS_Quality_Gate','BO_KS_Zahlung_PayPal','KS_AYN_Allgemein','KS_AYN_Anmeldung_Registrierung','KS_AYN_Bestellung','KS_AYN_Eskalation','KS_AYN_Gutschein','KS_AYN_Kuendigung','KS_AYN_Kundenkonto','KS_AYN_Loeschungen','KS_AYN_Lieferung','KS_AYN_Marketing_SocialMedia','KS_AYN_Produktangebot','KS_AYN_Retoure','KS_AYN_Sicherheit','KS_AYN_Stornierung','KS_AYN_Zahlung_Giropay','KS_AYN_Zahlung_KaufAufRechnung','KS_AYN_Zahlung_KreditKarte','KS_AYN_Zahlung_Lastschrift','KS_AYN_Zahlung_PayPal','KS_AYN_Zahlung_SofortUeberweisung','KS_AYN_Zahlung_Vorkasse','KS_Loeschungen','KS_Mehrstufige_Vorgaenge','KS_PP_Allgemein','KS_PP_Anmeldung_Registrierung','KS_PP_eFiliale','KS_PP_Kuendigung','KS_PP_Kundenkonto','KS_PP_OF_autom','KS_PP_OnlineFrankierung','KS_PP_Sicherheit','KS_PP_Zahlung_Giropay','KS_PP_Zahlung_Kreditkarte','KS_PP_Zahlung_Lastschrift','KS_PP_Zahlung_PayPal','KS_PP_Zahlung_SofortUeberweisung') 
AND (DATE(LAST_DATE_PROCESSED) BETWEEN '2017-01-01' AND '2017-02-21') 
AND true 
AND TRANSACTION_CODE IS NOT NULL 
AND TRANSACTION_CODE <> '' 
UNION ALL 
SELECT DATE(CHAT_END) AS d,
TRANSACTIONCODE AS C,
IF(INSTR(TRANSACTIONCODE,"AYN_"),"AYN","PPDE") AS S,
"CHAT" AS Q 
FROM ks_chat 
WHERE CATEGORY IN ('Chat_KS_PP_Onlinefrankierung','Chat_KS_PP_Zahlung','Chat_KS_PP_Zahlung_PayPal','Chat_KS_PP_Anmeldung_Registrierung','Chat_KS_PP_Kundenkonto','Chat_KS_PP_eFiliale','Chat_KS_PP_Zahlung_Kreditkarte','Chat_KS_PP_Zahlung_Lastschrift','Chat_KS_PP_Zahlung_SofortUeberweisung','Chat_KS_PP_Allgemein','Chat_KS_PP_Zahlung_Giropay','Chat_KS_AYN_Kundenkonto','Chat_KS_AYN_Gutschein','Chat_KS_AYN_Bestellung','Chat_KS_AYN_Allgemein','Chat_KS_AYN_Lieferung','Chat_KS_AYN_Zahlung_PayPal','Chat_KS_AYN_Retoure','Chat_KS_AYN_Stornierung','Chat_KS_AYN_Zahlung_Lastschrift','Chat_KS_AYN_Zahlung_Vorkasse','Chat_KS_AYN_Zahlung_Kreditkarte','Chat_KS_AYN_Produktangebot','Chat_KS_AYN_Anmeldung_Registrierung','Chat_KS_AYN_Sicherheit','Chat_KS_AYN_Zahlung_KaufAufRechnung','Chat_KS_AYN_Zahlung_Giropay','Chat_KS_AYN_Zahlung_SofortUeberweisung','Chat_KS_PP_Sicherheit') 
AND (DATE(CHAT_END) BETWEEN '2017-01-01' AND '2017-02-21') 
AND true 
AND (TIME_TO_SEC(CHAT_END) BETWEEN TIME_TO_SEC('08:00:00') AND TIME_TO_SEC('20:00:00')) 
AND WEEKDAY(DATE(CHAT_END)) >= 0 AND WEEKDAY(DATE(CHAT_END)) < 5 
AND TRANSACTIONCODE IS NOT NULL 
AND TRANSACTIONCODE <> '' 
UNION ALL 
SELECT DATE(LAST_DATE_PROCESSED) AS d,
TRANSACTION_CODE AS C,
CASE WHEN INSTR(TRANSACTION_CODE,"AYN_") THEN "AYN" 
WHEN INCOMING_ADDRESS = "austria@postpay.de" THEN "PPAUT" 
WHEN INSTR(TRANSACTION_CODE,"PP_") THEN "PPDE" 
WHEN INSTR(INCOMING_ADDRESS,"meinpaket") THEN "AYN" 
WHEN INSTR(INCOMING_ADDRESS,"allyouneed") THEN "AYN" 
ELSE "PPDE" END AS S,
IF(INSTR(TEMPLATE,'CALL'),'CALL','MAIL') AS Q 
FROM hs_reporting 
WHERE CATEGORY IN ('HS_Haendleraufschaltung','HS_Abrechnung','HS_Haendleraccount','HS_CSV','HS_Allgemein','HS_Beschwerde_ueber_Haendler','HS_Multi','HS_Sonderaktionen','HS_Haendlervertrag','HS_PremiumPartner','HS_Kuendigung','HS_Inhaltskontrolle','HS_Sicherheit','HS_BUGs-Wiedervorlage','BO_HS_Vertragsmanagement','HS_API','HS_Englische_Mails','HS_HD_Verstoss','BO_HS_Quality_Gate','BO_HS_Eskalation_Produktmanagement','HS_Fulfillment','BO_HS_Haendlerkuendigungen','BO_Anfrage_an_HaendlerSupport','BO_HS_HaendlerManagement','BO_DPZ_Clearing','BO_HS_SetupConsultant','2-HS_CSV') 
AND (DATE(LAST_DATE_PROCESSED) BETWEEN '2017-01-01' AND '2017-02-21') 
AND false 
AND TRANSACTION_CODE IS NOT NULL AND TRANSACTION_CODE <> '' ) AS tN GROUP BY year(tN.d),month(tN.d),tN.S,tN.Q HAVING S = 'AYN' || S = 'PPDE' || S = 'PPAUT' ;