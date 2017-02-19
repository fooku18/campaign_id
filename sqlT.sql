LOAD DATA LOCAL INFILE "/home/jakob/node/private/ccdb/Datenexport/csv/AYN_Bestellungen.csv" INTO TABLE ayn_bestellungen_temp
FIELDS TERMINATED BY ";" OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
IGNORE 1 LINES
(@tag,
  @wochentag,
  @anzahl_kunden,
  @anzahl_warenkoerbe,
  @anzahl_bestellungen,
  @anzahl_produkte,
  @ds_anzahl_produkte,
  @umsatz,
  @versandkosten,
  @gesamtumsatz,
  @ds_warenkorbwert,
  @stornierungsquote)
SET
  tag = @tag,
  wochentag = @wochentag,
  anzahl_kunden = REPLACE(REPLACE(@anzahl_kunden,".",""),",","."),
  anzahl_warenkoerbe = REPLACE(REPLACE(@anzahl_warenkoerbe,".",""),",","."),
  anzahl_bestellungen = REPLACE(REPLACE(@anzahl_bestellungen,".",""),",","."),
  anzahl_produkte = REPLACE(REPLACE(@anzahl_produkte,".",""),",","."),
  ds_anzahl_produkte = REPLACE(REPLACE(@ds_anzahl_produkte,".",""),",","."),
  umsatz = REPLACE(REPLACE(@umsatz,".",""),",","."),
  versandkosten = REPLACE(REPLACE(@versandkosten,".",""),",","."),
  gesamtumsatz = REPLACE(REPLACE(@gesamtumsatz,".",""),",","."),
  ds_warenkorbwert = REPLACE(REPLACE(@ds_warenkorbwert,".",""),",","."),
  stornierungsquote = REPLACE(REPLACE(@stornierungsquote,".",""),",",".")
