const path = require('path');
const __dir = path.dirname(module.filename);
var _p = __dir.match(/.*\\/)[0] + "private\\ccdb\\Datenexport\\csv\\";
var __p = _p.replace(/\\/g,"/");

function _loader(t,q) {
	switch(t) {
		case "ayn_bestellungen": 
			return "USE ccdb;" + 
				"LOAD DATA LOCAL INFILE '" + __p + "AYN_Bestellungen.csv' INTO TABLE ayn_bestellungen_temp " + 
				"FIELDS TERMINATED BY '" + q + "' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\n' " +
				"IGNORE 1 LINES " +
				"(@tag, " +
				  "@wochentag, " +
				  "@anzahl_kunden, " +
				  "@anzahl_warenkoerbe, " +
				  "@anzahl_bestellungen, " +
				  "@anzahl_produkte, " +
				  "@ds_anzahl_produkte, " +
				  "@umsatz, " +
				  "@versandkosten, " +
				  "@gesamtumsatz, " +
				  "@ds_warenkorbwert, " +
				  "@stornierungsquote) " +
				"SET " +
				  "tag = @tag, " +
				  "wochentag = @wochentag, " +
				  "anzahl_kunden = REPLACE(REPLACE(@anzahl_kunden,'.',''),',','.'), " +
				  "anzahl_warenkoerbe = REPLACE(REPLACE(@anzahl_warenkoerbe,'.',''),',','.'), " +
				  "anzahl_bestellungen = REPLACE(REPLACE(@anzahl_bestellungen,'.',''),',','.'), " +
				  "anzahl_produkte = REPLACE(REPLACE(@anzahl_produkte,'.',''),',','.'), " +
				  "ds_anzahl_produkte = REPLACE(REPLACE(@ds_anzahl_produkte,'.',''),',','.'), " +
				  "umsatz = REPLACE(REPLACE(@umsatz,'.',''),',','.'), " +
				  "versandkosten = REPLACE(REPLACE(@versandkosten,'.',''),',','.'), " +
				  "gesamtumsatz = REPLACE(REPLACE(@gesamtumsatz,'.',''),',','.'), " +
				  "ds_warenkorbwert = REPLACE(REPLACE(@ds_warenkorbwert,'.',''),',','.'), " +
				  "stornierungsquote = REPLACE(REPLACE(@stornierungsquote,'.',''),',','.');";
			break;
		case "pp_bestellungen":
			return "USE ccdb;" + 
				"LOAD DATA LOCAL INFILE '" + __p + "PP_Bestellungen.csv' INTO TABLE pp_bestellungen_temp " + 
				"FIELDS TERMINATED BY '" + q + "' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\n' " +
				"IGNORE 1 LINES " +
				"(@tag, " +
				  "@wochentag, " +
				  "@anzahl_kunden, " +
				  "@anzahl_warenkoerbe, " +
				  "@anzahl_produkte, " +
				  "@ds_anzahl_produkte, " +
				  "@umsatz, " +
				  "@versandkosten, " +
				  "@gesamtumsatz, " +
				  "@ds_warenkorbwert, " +
				  "@stornierungsquote, " +
				  "@retourenquote) " +
				"SET " +
				  "tag = @tag, " +
				  "wochentag = @wochentag, " +
				  "anzahl_kunden = REPLACE(REPLACE(@anzahl_kunden,'.',''),',','.'), " +
				  "anzahl_warenkoerbe = REPLACE(REPLACE(@anzahl_warenkoerbe,'.',''),',','.'), " +
				  "anzahl_produkte = REPLACE(REPLACE(@anzahl_produkte,'.',''),',','.'), " +
				  "ds_anzahl_produkte = REPLACE(REPLACE(@ds_anzahl_produkte,'.',''),',','.'), " +
				  "umsatz = REPLACE(REPLACE(@umsatz,'.',''),',','.'), " +
				  "versandkosten = REPLACE(REPLACE(@versandkosten,'.',''),',','.'), " +
				  "gesamtumsatz = REPLACE(REPLACE(@gesamtumsatz,'.',''),',','.'), " +
				  "ds_warenkorbwert = REPLACE(REPLACE(@ds_warenkorbwert,'.',''),',','.'), " +
				  "stornierungsquote = REPLACE(REPLACE(@stornierungsquote,'.',''),',','.'), " +
				  "retourenquote = REPLACE(REPLACE(@retourenquote,'.',''),',','.');";
			break;
		case "ks_eingang": 
			return "USE ccdb;" + 
				"LOAD DATA LOCAL INFILE '" + __p + "KS_Eingang.csv' INTO TABLE ks_eingang_temp " + 
				"FIELDS TERMINATED BY '" + q + "' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\n' " +
				"IGNORE 1 LINES " +
				"(@TICKET_ID, " +
				  "@PROCESS_ID, " +
				  "@RECEIVE_DATE, " +
				  "@LAST_DATE_PROCESSED, " +
				  "@DATE_TOUCHED, " +
				  "@CATEGORY, " +
				  "@MANDATOR, " +
				  "@TEMPLATE, " +
				  "@EDIT_TIME_IN_MS, " +
				  "@RECATEGORIZED_TO, " +
				  "@RECATEGORIZED_FROM, " +
				  "@TEMPLATE_OUT, " +
				  "@INCOMING_ADDRESS, " +
				  "@INCOMING_ACCOUNT, " +
				  "@OUTGOING_ADDRESS, " +
				  "@SENDER, " +
				  "@LANGUAGE, " +
				  "@LOCATION, " +
				  "@STATUS, " +
				  "@TRANSACTION_CODE, " +
				  "@SHOP_ID, " +
				  "@BESTELLNUMMER, " +
				  "@KUNDENNUMMER) " +
				"SET " +
				  "TICKET_ID = @TICKET_ID, " +
				  "PROCESS_ID = @PROCESS_ID, " +
				  "RECEIVE_DATE = DATE(@RECEIVE_DATE), " +
				  "LAST_DATE_PROCESSED = DATE(@LAST_DATE_PROCESSED), " +
				  "DATE_TOUCHED = DATE(@DATE_TOUCHED), " +
				  "CATEGORY = @CATEGORY, " +
				  "MANDATOR = @MANDATOR, " +
				  "TEMPLATE = @TEMPLATE, " +
				  "EDIT_TIME_IN_MS = @EDIT_TIME_IN_MS, " +
				  "RECATEGORIZED_TO = @RECATEGORIZED_TO, " +
				  "RECATEGORIZED_FROM = @RECATEGORIZED_FROM, " +
				  "TEMPLATE_OUT = @TEMPLATE_OUT, " + 
				  "INCOMING_ADDRESS = @INCOMING_ADDRESS, " + 
				  "INCOMING_ACCOUNT = @INCOMING_ACCOUNT, " + 
				  "OUTGOING_ADDRESS = @OUTGOING_ADDRESS, " + 
				  "SENDER = @SENDER, " + 
				  "LANGUAGE = @LANGUAGE, " + 
				  "LOCATION = @LOCATION, " + 
				  "STATUS = @STATUS, " + 
				  "TRANSACTION_CODE = @TRANSACTION_CODE, " + 
				  "SHOP_ID = @SHOP_ID, " + 
				  "BESTELLNUMMER = @BESTELLNUMMER, " + 
				  "KUNDENNUMMER = @KUNDENNUMMER;";
			break;
		case "hs_reporting": 
			return "USE ccdb;" + 
				"LOAD DATA LOCAL INFILE '" + __p + "HS_Reporting.csv' INTO TABLE hs_reporting_temp " + 
				"FIELDS TERMINATED BY '" + q + "' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\n' " +
				"IGNORE 1 LINES " +
				"(@TICKET_ID, " +
				  "@PROCESS_ID, " +
				  "@RECEIVE_DATE, " +
				  "@LAST_DATE_PROCESSED, " +
				  "@DATE_TOUCHED, " +
				  "@CATEGORY, " +
				  "@MANDATOR, " +
				  "@TEMPLATE, " +
				  "@EDIT_TIME_IN_MS, " +
				  "@RECATEGORIZED_TO, " +
				  "@RECATEGORIZED_FROM, " +
				  "@TEMPLATE_OUT, " +
				  "@INCOMING_ADDRESS, " +
				  "@INCOMING_ACCOUNT, " +
				  "@OUTGOING_ADDRESS, " +
				  "@SENDER, " +
				  "@LANGUAGE, " +
				  "@LOCATION, " +
				  "@STATUS, " +
				  "@TRANSACTION_CODE, " +
				  "@SHOP_ID, " +
				  "@BESTELLNUMMER, " +
				  "@KUNDENNUMMER) " +
				"SET " +
				  "TICKET_ID = @TICKET_ID, " +
				  "PROCESS_ID = @PROCESS_ID, " +
				  "RECEIVE_DATE = DATE(@RECEIVE_DATE), " +
				  "LAST_DATE_PROCESSED = DATE(@LAST_DATE_PROCESSED), " +
				  "DATE_TOUCHED = DATE(@DATE_TOUCHED), " +
				  "CATEGORY = @CATEGORY, " +
				  "MANDATOR = @MANDATOR, " +
				  "TEMPLATE = @TEMPLATE, " +
				  "EDIT_TIME_IN_MS = @EDIT_TIME_IN_MS, " +
				  "RECATEGORIZED_TO = @RECATEGORIZED_TO, " +
				  "RECATEGORIZED_FROM = @RECATEGORIZED_FROM, " +
				  "TEMPLATE_OUT = @TEMPLATE_OUT, " + 
				  "INCOMING_ADDRESS = @INCOMING_ADDRESS, " + 
				  "INCOMING_ACCOUNT = @INCOMING_ACCOUNT, " + 
				  "OUTGOING_ADDRESS = @OUTGOING_ADDRESS, " + 
				  "SENDER = @SENDER, " + 
				  "LANGUAGE = @LANGUAGE, " + 
				  "LOCATION = @LOCATION, " + 
				  "STATUS = @STATUS, " + 
				  "TRANSACTION_CODE = @TRANSACTION_CODE, " + 
				  "SHOP_ID = @SHOP_ID, " + 
				  "BESTELLNUMMER = @BESTELLNUMMER, " + 
				  "KUNDENNUMMER = @KUNDENNUMMER;";
			break;
		case "ks_chat": 
			return "USE ccdb;" + 
				"LOAD DATA LOCAL INFILE '" + __p + "KS_Chat.csv' INTO TABLE ks_chat_temp " + 
				"FIELDS TERMINATED BY '" + q + "' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\n' " +
				"IGNORE 1 LINES " +
				"(@ID, " +
				  "@CATEGORY, " +
				  "@CHAT_START, " +
				  "@CHAT_END, " +
				  "@DURATION_ROUTING, " +
				  "@DURATION_REVIEW, " +
				  "@TRANSACTIONCODE) " +
				"SET " +
				  "CATEGORY = @CATEGORY, " +
				  "CHAT_START = DATE(@CHAT_START), " +
				  "CHAT_END = DATE(@CHAT_END), " +
				  "DURATION_ROUTING = @DURATION_ROUTING, " +
				  "DURATION_REVIEW = @DURATION_REVIEW, " +
				  "TRANSACTIONCODE = @TRANSACTIONCODE;";
			break;
	}
}

module.exports._loader = _loader;
