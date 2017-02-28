function _qND(tN) {
	var id = tN == "ks_chat"? "ID" : "TICKET_ID";
	var date = tN == "ks_chat"? "CHAT_START" : "RECEIVE_DATE";
	return "DELETE FROM " + tN + " WHERE " + id + " IN ( " +
				"SELECT * FROM ( " + 
					"SELECT " + tN + "." + id + " FROM " + tN + " " + 
					"LEFT OUTER JOIN " + tN + "_temp " +
					"ON " + tN + "." + id + " = " + tN + "_temp." + id + " " +
					"WHERE (DATE(" + tN + "." + date + ") " +
					"BETWEEN " +
					"(SELECT MIN(DATE(" + date + ")) FROM " + tN + "_temp) " +
					"AND " +
					"(SELECT MAX(DATE(" + date + ")) FROM " + tN + "_temp) " + 
					") AND " + tN + "_temp." + id + " is null " +
				") AS t " + 
			");"
}
function _qNI(tN) {
	let _i = (tN == "ayn_bestellungen" || tN == "pp_bestellungen")? "tag" : (tN == "kunden_bestellungen")? "bestellnummer" : (tN == "ks_chat")? "ID" : "TICKET_ID";
	if(tN == "kunden_bestellungen") {
		return	"INSERT INTO " + tN + " SELECT tN.* FROM ( " + 
					"SELECT " + tN + "_temp.* FROM " + tN + " RIGHT OUTER JOIN " + tN + "_temp " + 
					"ON " + tN + ".bestellnummer = " + tN + "_temp.bestellnummer " +
					"WHERE " + tN + ".bestellnummer IS NULL " + 
				") AS tN;";
	} else {
		return "INSERT INTO " + tN + " SELECT tN.* FROM ( " +
					"SELECT " + tN + "_temp.* FROM " + tN + " " +  
					"RIGHT OUTER JOIN " + tN + "_temp " +
					"ON " + tN + "." + _i + " = " + tN + "_temp." + _i + " " + 
					"WHERE " + tN + "." + _i + " IS NULL " +
				") AS tN;";
	}
}
function _qNU(tN) {
	if(tN != "ks_chat") {
		return "UPDATE " + tN + " t1 " + 
			"INNER JOIN " + tN + "_temp t2 " +
			"ON t1.ticket_id = t2.ticket_id " + 
			"SET t1.TICKET_ID = t2.TICKET_ID, " + 
			"t1.PROCESS_ID = t2.PROCESS_ID, " +
			"t1.RECEIVE_DATE = t2.RECEIVE_DATE, " +
			"t1.LAST_DATE_PROCESSED = t2.LAST_DATE_PROCESSED, " +
			"t1.DATE_TOUCHED = t2.DATE_TOUCHED, " +
			"t1.CATEGORY = t2.CATEGORY, " +
			"t1.MANDATOR = t2.MANDATOR, " +
			"t1.TEMPLATE = t2.TEMPLATE, " +
			"t1.EDIT_TIME_IN_MS = t2.EDIT_TIME_IN_MS, " +
			"t1.RECATEGORIZED_TO = t2.RECATEGORIZED_TO, " +
			"t1.RECATEGORIZED_FROM = t2.RECATEGORIZED_FROM, " +
			"t1.TEMPLATE_OUT = t2.TEMPLATE_OUT, " +
			"t1.INCOMING_ADDRESS = t2.INCOMING_ADDRESS, " +
			"t1.INCOMING_ACCOUNT = t2.INCOMING_ACCOUNT, " +
			"t1.SENDER = t2.SENDER, " +
			"t1.LANGUAGE = t2.LANGUAGE, " +
			"t1.LOCATION = t2.LOCATION, " +
			"t1.STATUS = t2.STATUS, " +
			"t1.TRANSACTION_CODE = t2.TRANSACTION_CODE, " +
			"t1.SHOP_ID = t2.SHOP_ID, " +
			"t1.BESTELLNUMMER = t2.BESTELLNUMMER, " +
			"t1.KUNDENNUMMER = t2.KUNDENNUMMER  " +
			"WHERE t1.ticket_id = t2.ticket_id; ";
	} else {
		return "UPDATE " + tN + " t1 " + 
			"INNER JOIN " + tN + "_temp t2 " +
			"ON t1.ID = t2.ID " + 
			"SET t1.ID = t2.ID, " + 
			"t1.CATEGORY = t2.CATEGORY, " +
			"t1.CHAT_START = t2.CHAT_START, " +
			"t1.CHAT_END = t2.CHAT_END, " +
			"t1.DURATION_ROUTING = t2.DURATION_ROUTING, " +
			"t1.DURATION_REVIEW = t2.DURATION_REVIEW, " +
			"t1.TRANSACTIONCODE = t2.TRANSACTIONCODE " +
			"WHERE t1.ID = t2.ID;";
	}
}
function _qBU(tN) {
	if(tN.match(/pp/i)) {
		return "UPDATE " + tN + " t1 " + 
			"INNER JOIN " + tN + "_temp t2 " +
			"ON t1.tag = t2.tag " + 
			"SET t1.wochentag = t2.wochentag, " + 
			"t1.anzahl_kunden = t2.anzahl_kunden, " +
			"t1.anzahl_warenkoerbe = t2.anzahl_warenkoerbe, " +
			"t1.ds_anzahl_produkte = t2.ds_anzahl_produkte, " +
			"t1.umsatz = t2.umsatz, " +
			"t1.versandkosten = t2.versandkosten, " +
			"t1.gesamtumsatz = t2.gesamtumsatz, " +
			"t1.ds_warenkorbwert = t2.ds_warenkorbwert, " +
			"t1.stornierungsquote = t2.stornierungsquote, " +
			"t1.retourenquote = t2.retourenquote " +
			"WHERE t1.tag = t2.tag;";
	} else {
		if(tN == "kunden_bestellungen") {
			return "UPDATE " + tN + " t1 " +
				"INNER JOIN " + tN + "_temp t2 " +
				"ON t1.bestellnummer = t2.bestellnummer " + 
				"SET t1.datum = t2.datum, " + 
				"t1.shopid = t2.shopid, " + 
				"t1.haendlername = t2.haendlername, " + 
				"t1.status = t2.status, " + 
				"t1.stornogrund = t2.stornogrund, " + 
				"t1.anzahl_storno = t2.anzahl_storno, " + 
				"t1.storno_warenwert = t2.storno_warenwert, " + 
				"t1.storno_datum = t2.storno_datum, " + 
				"t1.stornogebuehren = t2.stornogebuehren, " + 
				"t1.retoure = t2.retoure, " + 
				"t1.retoure_datum = t2.retoure_datum, " + 
				"t1.anzahl_retoure = t2.anzahl_retoure, " + 
				"t1.retoure_warenwert = t2.retoure_warenwert, " + 
				"t1.retoure_gebuehr = t2.retoure_gebuehr, " + 
				"t1.anzahl = t2.anzahl, " + 
				"t1.preis = t2.preis, " + 
				"t1.zahlungsart = t2.zahlungsart, " + 
				"t1.versandkosten = t2.versandkosten, " + 
				"t1.ertrag = t2.ertrag, " + 
				"t1.usertype = t2.usertype;";
		} else {
			return "UPDATE " + tN + " t1 " + 
				"INNER JOIN " + tN + "_temp t2 " +
				"ON t1.tag = t2.tag " + 
				"SET t1.wochentag = t2.wochentag, " + 
				"t1.anzahl_kunden = t2.anzahl_kunden, " +
				"t1.anzahl_warenkoerbe = t2.anzahl_warenkoerbe, " +
				"t1.anzahl_bestellungen = t2.anzahl_bestellungen, " +
				"t1.anzahl_produkte = t2.anzahl_produkte, " +
				"t1.umsatz = t2.umsatz, " +
				"t1.versandkosten = t2.versandkosten, " +
				"t1.gesamtumsatz = t2.gesamtumsatz, " +
				"t1.ds_warenkorbwert = t2.ds_warenkorbwert, " +
				"t1.stornierungsquote = t2.stornierungsquote " +
				"WHERE t1.tag = t2.tag;";
		}
	}
}
function _qM(tN) {
	return 	"INSERT INTO kunden_bestellungen_temp ( " +
			"datum, " +
			"shopid, " +
			"haendlername, " +
			"bestellnummer, " +
			"status, " +
			"stornogrund, " +
			"anzahl_storno, " +
			"storno_warenwert, " +
			"storno_datum, " +
			"stornogebuehren, " +
			"retoure, " +
			"retoure_datum, " +
			"anzahl_retoure, " +
			"retoure_warenwert, " +
			"retoure_gebuehr, " +
			"anzahl, " +
			"preis, " +
			"zahlungsart, " +
			"versandkosten, " +
			"ertrag, " +
			"usertype) " +
		"SELECT datum, " +
			"shopid, " +
			"haendlername, " +
			"bestellnummer, " +
			"status, " +
			"stornogrund, " +
			"sum(anzahl_storno) AS anzahl_storno, " +
			"sum(storno_warenwert) AS storno_warenwert, " +
			"storno_datum, " +
			"sum(stornogebuehren) AS stornogebuehren, " +
			"retoure, " +
			"retoure_datum, " +
			"sum(anzahl_retoure) AS anzahl_retoure, " +
			"sum(retoure_warenwert) AS retoure_warenwert, " +
			"sum(retoure_gebuehr) AS retoure_gebuehr, " +
			"sum(anzahl) AS anzahl, " +
			"sum(preis) AS preis, " +
			"zahlungsart, " +
			"sum(versandkosten) AS versandkosten, " +
			"IF(status <> 'cancelled',sum(anzahl*preis*(aynmp_provision/100)),0) AS ertrag, " +
			"usertype  " +
		"FROM kunden_bestellungen_temp_f  " +
		"WHERE bestellnummer IS NOT NULL  " +
		"GROUP BY bestellnummer;";		
}

function _qNT() {
	return "(" + 
		  "datum date DEFAULT NULL," + 
		  "shopid int(10) DEFAULT NULL," + 
		  "haendlername varchar(300) DEFAULT NULL," + 
		  "bestellnummer varchar(20) DEFAULT NULL," + 
		  "kategorie_code varchar(30) DEFAULT NULL," + 
		  "status varchar(40) DEFAULT NULL," + 
		  "stornogrund varchar(50) DEFAULT NULL," + 
		  "anzahl_storno int(5) DEFAULT NULL," + 
		  "storno_warenwert float(8,2) DEFAULT NULL," + 
		  "storno_datum date DEFAULT NULL," + 
		  "stornogebuehren float(8,2) DEFAULT NULL," + 
		  "retoure varchar(5) DEFAULT NULL," + 
		  "retoure_datum date DEFAULT NULL," + 
		  "anzahl_retoure int(5) DEFAULT NULL," + 
		  "retoure_warenwert float(8,2) DEFAULT NULL," + 
		  "retoure_gebuehr float(8,2) DEFAULT NULL," + 
		  "anzahl int(3) DEFAULT NULL," + 
		  "preis float(8,2) DEFAULT NULL," + 
		  "zahlungsart varchar(50) DEFAULT NULL," + 
		  "versandkosten float(8,2) DEFAULT NULL," + 
		  "aynmp_provision float(8,2) DEFAULT NULL," + 
		  "standard_provision float(8,2) DEFAULT NULL," + 
		  "voucher_wert float(8,2) DEFAULT NULL," + 
		  "usertype varchar(50) DEFAULT NULL" + 
		")";
}

module.exports = {
	_qND: _qND,
	_qNI: _qNI,
	_qNU: _qNU,
	_qBU: _qBU,
	_qM: _qM,
	_qNT: _qNT
}