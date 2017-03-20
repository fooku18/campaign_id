const path = require('path');
const __dir = path.dirname(module.filename);
const __parent = path.join(__dir,"../","/");
var _p = __parent.match(/.*\\/)? __parent.match(/.*\\/)[0] + "private\\ccdb\\Datenexport\\csv\\" : __parent + "private/ccdb/Datenexport/csv/";
var __p = _p.match(/\\/g)? _p.replace(/\\/g,"/") : _p;
function _loader(t,q) {
	switch(t) {
		case "ayn_bestellungen": 
			return "USE ccdb;" + 
				"LOAD DATA LOCAL INFILE '" + __p + "AYN_Bestellungen.csv' INTO TABLE ayn_bestellungen_temp " + 
				"CHARACTER SET UTF8 " + 
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
				"CHARACTER SET UTF8 " + 
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
				"CHARACTER SET UTF8 " + 
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
				"CHARACTER SET UTF8 " + 
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
				"CHARACTER SET UTF8 " + 
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
				  "ID = @ID," +
				  "CATEGORY = @CATEGORY, " +
				  "CHAT_START = @CHAT_START, " +
				  "CHAT_END = @CHAT_END, " +
				  "DURATION_ROUTING = @DURATION_ROUTING, " +
				  "DURATION_REVIEW = @DURATION_REVIEW, " +
				  "TRANSACTIONCODE = @TRANSACTIONCODE;";
			break;
		case "kunden_bestellungen": 
			return "USE ccdb; " + 
				"LOAD DATA LOCAL INFILE '" + __p + "kunden_bestellungen.csv' INTO TABLE kunden_bestellungen_temp_f " + 
				"CHARACTER SET UTF8 " + 
				"FIELDS TERMINATED BY '" + q + "' OPTIONALLY ENCLOSED BY '\"' " +
				"LINES TERMINATED BY '\n' " +
				"IGNORE 1 LINES " +
				"( " +
					"@datum, " +
					"@shopid, " +
					"@haendlername, " +
					"@bestellnummer, " +
					"@kategorie_code, " +
					"@status, " +
					"@stornogrund, " +
					"@anzahl_storno, " +
					"@storno_warenwert, " +
					"@storno_datum, " +
					"@stornogebuehren, " +
					"@retoure, " +
					"@retoure_datum, " +
					"@anzahl_retoure, " +
					"@retoure_warenwert, " +
					"@retoure_gebuehr, " +
					"@anzahl, " +
					"@preis, " +
					"@zahlungsart, " +
					"@versandkosten, " +
					"@aynmp_provision, " +
					"@standard_provision, " +
					"@voucher_wert, " +
					"@usertype " +
				") " +
				"SET " +
					"datum = DATE(concat('20',mid(@datum,7,2),'-',mid(@datum,4,2),'-',left(@datum,2))), " +
					"shopid = @shopid, " +
					"haendlername = @haendlername, " +
					"bestellnummer = @bestellnummer, " +
					"kategorie_code = @kategorie_code, " +
					"status = @status, " +
					"stornogrund = @stornogrund, " +
					"anzahl_storno = @anzahl_storno, " +
					"storno_warenwert = REPLACE(REPLACE(@storno_warenwert,'.',''),',','.'), " +
					"storno_datum = IF(@storno_datum = '-',DATE('0000-00-00'),DATE(concat('20',mid(@storno_datum,7,2),'-',mid(@storno_datum,4,2),'-',left(@storno_datum,2)))), " +
					"stornogebuehren = REPLACE(REPLACE(@stornogebuehren,'.',''),',','.'), " +
					"retoure = @retoure, " +
					"retoure_datum = IF(@retoure_datum = '-',DATE('0000-00-00'),DATE(concat('20',mid(@retoure_datum,7,2),'-',mid(@retoure_datum,4,2),'-',left(@retoure_datum,2)))), " +
					"anzahl_retoure = @anzahl_retoure, " +
					"retoure_warenwert = REPLACE(REPLACE(@retoure_warenwert,'.',''),',','.'), " +
					"retoure_gebuehr = REPLACE(REPLACE(@retoure_gebuehr,'.',''),',','.'), " +
					"anzahl = @anzahl, " +
					"preis = REPLACE(REPLACE(@preis,'.',''),',','.'), " +
					"zahlungsart = @zahlungsart, " +
					"versandkosten = REPLACE(REPLACE(@versandkosten,'.',''),',','.'), " +
					"aynmp_provision = REPLACE(REPLACE(@aynmp_provision,'.',''),',','.'), " +
					"standard_provision = REPLACE(REPLACE(@standard_provision,'.',''),',','.'), " +
					"voucher_wert = REPLACE(REPLACE(@voucher_wert,'.',''),',','.'), " +
					"usertype = @usertype;";
			break;
	}
}

module.exports._loader = _loader;
