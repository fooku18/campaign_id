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
-- Table structure for table `kosten`
--

DROP TABLE IF EXISTS `kosten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kosten` (
  `jahr` int(4) DEFAULT NULL,
  `monat` int(2) DEFAULT NULL,
  `kosten` float(10,2) DEFAULT NULL,
  `service` varchar(20) DEFAULT NULL,
  `tickets` int(10) DEFAULT NULL,
  `edit_time` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kosten`
--

LOCK TABLES `kosten` WRITE;
/*!40000 ALTER TABLE `kosten` DISABLE KEYS */;
INSERT INTO `kosten` VALUES (2017,1,15000.00,'ks',5547,5721434640),(2017,2,10000.00,'ks',186,59327363),(2017,3,10000.00,'ks',0,NULL),(2017,1,10000.00,'hs',2826,2259451412),(2017,2,10000.00,'hs',128,76511505),(2017,3,10000.00,'hs',0,NULL),(2016,1,5000.00,'ks',5547,NULL),(2016,1,5000.00,'hs',5547,NULL),(2017,4,5000.00,'ks',0,NULL),(2017,4,5000.00,'hs',0,NULL),(2017,5,0.00,'ks',0,NULL),(2017,5,0.00,'hs',0,NULL),(2017,6,0.00,'ks',0,NULL),(2017,6,0.00,'hs',0,NULL),(2017,7,0.00,'ks',0,NULL),(2017,7,0.00,'hs',0,NULL),(2017,8,0.00,'ks',0,NULL),(2017,8,0.00,'hs',0,NULL),(2017,9,0.00,'ks',0,NULL),(2017,9,0.00,'hs',0,NULL),(2017,10,0.00,'ks',5547,NULL),(2017,10,0.00,'hs',5547,NULL),(2017,11,0.00,'ks',5547,NULL),(2017,11,0.00,'hs',5547,NULL),(2017,12,0.00,'ks',0,NULL),(2017,12,0.00,'hs',0,NULL),(2016,2,0.00,'ks',NULL,NULL),(2016,2,0.00,'hs',NULL,NULL),(2016,3,0.00,'ks',NULL,NULL),(2016,3,0.00,'hs',NULL,NULL),(2016,4,0.00,'ks',NULL,NULL),(2016,4,0.00,'hs',NULL,NULL),(2016,5,0.00,'ks',NULL,NULL),(2016,5,0.00,'hs',NULL,NULL),(2016,6,0.00,'ks',NULL,NULL),(2016,6,0.00,'hs',NULL,NULL),(2016,7,0.00,'ks',NULL,NULL),(2016,7,0.00,'hs',NULL,NULL),(2016,8,0.00,'ks',NULL,NULL),(2016,8,0.00,'hs',NULL,NULL),(2016,9,0.00,'ks',NULL,NULL),(2016,9,0.00,'hs',NULL,NULL),(2016,10,0.00,'ks',5552,5827292023),(2016,10,0.00,'hs',2206,2329962870),(2016,11,0.00,'ks',7308,6640234354),(2016,11,0.00,'hs',2921,2544652165),(2016,12,0.00,'ks',NULL,NULL),(2016,12,0.00,'hs',NULL,NULL);
/*!40000 ALTER TABLE `kosten` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-03-07  0:28:41
