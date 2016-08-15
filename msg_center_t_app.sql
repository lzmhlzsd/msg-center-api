-- MySQL dump 10.13  Distrib 5.7.12, for osx10.9 (x86_64)
--
-- Host: localhost    Database: msg_center
-- ------------------------------------------------------
-- Server version	5.7.12

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
-- Table structure for table `t_app`
--

DROP TABLE IF EXISTS `t_app`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_app` (
  `app_id` int(11) NOT NULL AUTO_INCREMENT,
  `app_name` varchar(45) DEFAULT NULL,
  `app_key` varchar(45) DEFAULT NULL,
  `app_screct` varchar(45) DEFAULT NULL,
  `app_status` int(11) DEFAULT '1',
  `app_creattime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `app_memo` varchar(45) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`app_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_app`
--

LOCK TABLES `t_app` WRITE;
/*!40000 ALTER TABLE `t_app` DISABLE KEYS */;
INSERT INTO `t_app` VALUES (3,'我的应用1',NULL,NULL,1,'2016-07-30 03:49:58','上海XX',NULL),(4,'我的应用2','6ycxhnc','txwbxxxfnmjqttmfdtby',1,'2016-07-30 04:31:07','上海XX',NULL),(5,'我的应用3','hwcwd8f','dcgp2e5t8rarjypcxqre',1,'2016-07-30 04:32:13','上海XX',2),(6,'我的应用4','jBaTa7A','T4KskpYXxjKs3P3asyQc',1,'2016-07-30 04:35:23','上海XX',2),(7,'我的应用5','NMBRkQw','nXWNRfAZWsSmPibbcPfW',1,'2016-07-30 14:59:36','上海XX',2),(8,'我的应用6','myzNS8h','cGasQ36Cej7eRzHHRNa2',1,'2016-07-30 14:59:41','上海XX',2),(9,'我的应用7','yXbp2YM','w2kzK2RszjeXiTxTZJXk',1,'2016-07-30 14:59:45','上海XX',2),(10,'我的应用8','PDJrJNT','pDXiCE5itKHA5BDWdxec',1,'2016-07-30 14:59:51','上海XX',2),(11,'我的应用9','RCxA2aS','ZZScZH66jcftn2aWfhMH',1,'2016-07-30 14:59:55','上海XX',2),(13,'我的应用10','EZ5zejk','X6D5RP2Y3wFyZnmtenry',1,'2016-07-30 15:00:08','上海XX',2),(14,'我的应用11','HNKTZMB','sDExdHBnrD8XyTBBkMkt',1,'2016-07-30 15:00:12','上海XX',2),(18,'我的应用12','3BQyw5F','Y6tQeyMhabr72HbhTftC',1,'2016-07-31 03:04:47','上海XX',2),(19,'我的应用13','QrxMyK6','8wywXbGMnEwAzrSaMwie',1,'2016-07-31 03:05:55','上海XX',2),(20,'我的应用14','TZn484a','MXtYP77SHyryrH6HspY4',1,'2016-07-31 03:06:56','上海XX',2),(21,'我的应用15','stBWhcD','WzFEfmBEeChcP6csEJyx',1,'2016-07-31 03:22:08','上海XX',2),(22,'我的应用16','QhSCfw4','2w6bnxEGmcHSEP4hFDXs',1,'2016-07-31 03:45:17','上海XX',2),(23,'我的应用18778778','hei3HsJ','y5ttG7FJDCczJTr45eKE',1,'2016-07-31 04:38:21','上海XX1231',2);
/*!40000 ALTER TABLE `t_app` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-08-05 18:01:48
