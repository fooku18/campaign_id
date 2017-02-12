SELECT tN.TC, COUNT(tN.TC) FROM
(SELECT TRANSACTION_CODE AS TC, IF(INSTR(TEMPLATE,'CALL'),'CALL','MAIL') AS SER
  FROM ks_eingang
  WHERE MONTH(DATE(RECEIVE_DATE)) = 1 AND YEAR(DATE(RECEIVE_DATE)) = 2017
  AND CATEGORY = 'KS_AYN_Kuendigung'
  UNION ALL
  SELECT TRANSACTION_CODE, IF(INSTR(TEMPLATE,'CALL'),'CALL','MAIL')
  FROM hs_reporting
  WHERE MONTH(DATE(RECEIVE_DATE)) = 1 AND YEAR(DATE(RECEIVE_DATE)) = 2017
  AND CATEGORY = 'KS_AYN_Kuendigung'
  UNION ALL
  SELECT TRANSACTIONCODE, 'CHAT'
  FROM ks_chat
  WHERE MONTH(DATE(CHAT_START)) = 1
  AND YEAR(DATE(CHAT_START)) = 2017
  AND CATEGORY = 'KS_AYN_Kuendigung') AS tN
  WHERE SER = 'MAIL'
  GROUP BY tN.TC ORDER BY COUNT(tN.TC) DESC;
