-- MySQL dump 10.13  Distrib 5.7.17, for Linux (i686)
--
-- Host: localhost    Database: ccdb
-- ------------------------------------------------------
-- Server version	5.7.17-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `kunden_bestellungen_temp`
--

DROP TABLE IF EXISTS `kunden_bestellungen_temp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kunden_bestellungen_temp_f` (
  `datum` date DEFAULT NULL,
  `shopid` int(10) DEFAULT NULL,
  `haendlername` varchar(300) DEFAULT NULL,
  `bestellnummer` varchar(20) DEFAULT NULL,
  `kategorie_code` varchar(30) DEFAULT NULL,
  `status` varchar(40) DEFAULT NULL,
  `stornogrund` varchar(50) DEFAULT NULL,
  `anzahl_storno` int(5) DEFAULT NULL,
  `storno_warenwert` float(8,2) DEFAULT NULL,
  `storno_datum` date DEFAULT NULL,
  `stornogebuehren` float(8,2) DEFAULT NULL,
  `retoure` varchar(5) DEFAULT NULL,
  `retoure_datum` date DEFAULT NULL,
  `anzahl_retoure` int(5) DEFAULT NULL,
  `retoure_warenwert` float(8,2) DEFAULT NULL,
  `retoure_gebuehr` float(8,2) DEFAULT NULL,
  `anzahl` int(3) DEFAULT NULL,
  `preis` float(8,2) DEFAULT NULL,
  `zahlungsart` varchar(50) DEFAULT NULL,
  `versandkosten` float(8,2) DEFAULT NULL,
  `aynmp_provision` float(8,2) DEFAULT NULL,
  `standard_provision` float(8,2) DEFAULT NULL,
  `voucher_wert` float(8,2) DEFAULT NULL,
  `usertype` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-02-27 22:49:56
