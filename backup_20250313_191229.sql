-- MySQL dump 10.13  Distrib 9.2.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: knowledge_graph
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('c239e1f6-eedb-41e6-ad48-e4cd39e80672','fa1100ad3147685a829478019aa557fe1bab921100c4c7f82d8564c1132c8e8c','2025-03-13 08:08:28.041','20250313044023_add_user_knowledge_progress',NULL,NULL,'2025-03-13 08:08:28.025',1),('ecb1ba51-7449-4d5a-859b-becdaf6ff6af','e11613315fa36dc8ffbd5d7fcebadd9861128e24cfaca2f08e116c7b66517fa3','2025-03-13 08:08:28.024','20250311163446_init',NULL,NULL,'2025-03-13 08:08:27.995',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knowledge_categories`
--

DROP TABLE IF EXISTS `knowledge_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `knowledge_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `knowledge_categories_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knowledge_categories`
--

LOCK TABLES `knowledge_categories` WRITE;
/*!40000 ALTER TABLE `knowledge_categories` DISABLE KEYS */;
INSERT INTO `knowledge_categories` VALUES (26,'图形与几何'),(25,'数与代数'),(27,'统计与概率'),(28,'综合与实践');
/*!40000 ALTER TABLE `knowledge_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knowledge_points`
--

DROP TABLE IF EXISTS `knowledge_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `knowledge_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` int NOT NULL,
  `grade` int NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_index` int NOT NULL,
  `category_id` int NOT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `knowledge_points_category_id_fkey` (`category_id`),
  KEY `knowledge_points_parent_id_fkey` (`parent_id`),
  CONSTRAINT `knowledge_points_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `knowledge_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `knowledge_points_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `knowledge_points` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=640 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knowledge_points`
--

LOCK TABLES `knowledge_points` WRITE;
/*!40000 ALTER TABLE `knowledge_points` DISABLE KEYS */;
INSERT INTO `knowledge_points` VALUES (520,'自然数',1,0,'自然数的认识与运算',1,25,NULL),(521,'整数',1,0,'整数的认识与运算',2,25,NULL),(522,'分数',1,0,'分数的认识与运算',3,25,NULL),(523,'小数',1,0,'小数的认识与运算',4,25,NULL),(524,'代数初步',1,0,'运算定律与简单方程',5,25,NULL),(525,'基本图形',1,0,'基本图形的认识',1,26,NULL),(526,'平面图形',1,0,'平面图形的性质与计算',2,26,NULL),(527,'立体图形',1,0,'立体图形的认识与计算',3,26,NULL),(528,'位置与方向',1,0,'空间与平面位置关系',4,26,NULL),(529,'图形测量',1,0,'图形的测量与计算',5,26,NULL),(530,'数据收集',1,0,'数据的收集方法与应用',1,27,NULL),(531,'数据整理',1,0,'数据的分类与表示',2,27,NULL),(532,'数据分析',1,0,'数据的分析与应用',3,27,NULL),(533,'概率初步',1,0,'随机事件与概率',4,27,NULL),(534,'生活应用',1,0,'数学在生活中的应用',1,28,NULL),(535,'实践探索',1,0,'数学探索与实践活动',2,28,NULL),(536,'数学建模',1,0,'简单的数学建模',3,28,NULL),(537,'数学思维',1,0,'数学思维方法训练',4,28,NULL),(538,'20以内数的认识',2,1,'20以内数的认识和数数',1,25,520),(539,'100以内数的认识',2,2,'100以内数的组成与比较',2,25,520),(540,'1000以内数的认识',2,2,'1000以内数的读写与比较',3,25,520),(541,'万以内数的认识',2,3,'万以内数的读写与比较',4,25,520),(542,'20以内的加减法',2,1,'20以内数的加法和减法',1,25,521),(543,'100以内的加减法',2,2,'100以内的加减法计算',2,25,521),(544,'表内乘法',2,2,'乘法表的记忆和应用',3,25,521),(545,'整数除法',2,3,'整数除法的计算',4,25,521),(546,'分数的认识',2,3,'分数的基本概念',1,25,522),(547,'真分数与假分数',2,4,'真分数、假分数和带分数',2,25,522),(548,'分数的基本性质',2,5,'分数的约分与通分',3,25,522),(549,'分数四则运算',2,6,'分数的加减乘除',4,25,522),(550,'小数的认识',2,4,'小数的意义和记法',1,25,523),(551,'小数的读写',2,4,'小数的读法和写法',2,25,523),(552,'小数的加减',2,5,'小数的加法和减法',3,25,523),(553,'小数的乘除',2,5,'小数的乘法和除法',4,25,523),(554,'运算定律',2,3,'加法和乘法运算定律',1,25,524),(555,'简单方程',2,6,'简单方程的解法',2,25,524),(556,'比和比例',2,6,'比和比例的应用',3,25,524),(557,'基本平面图形',2,1,'点、线、面的认识',1,26,525),(558,'线段与直线',2,2,'线段、直线的认识和度量',2,26,525),(559,'角的认识',2,3,'角的概念和度量',3,26,525),(560,'平行与垂直',2,4,'平行线和垂直线',4,26,525),(561,'三角形',2,2,'三角形的认识和分类',1,26,526),(562,'四边形',2,3,'四边形的认识和分类',2,26,526),(563,'正方形和长方形',2,4,'正方形和长方形的性质',3,26,526),(564,'平行四边形',2,5,'平行四边形的性质',4,26,526),(565,'圆',2,6,'圆的认识和性质',5,26,526),(566,'立体图形认识',2,1,'常见立体图形的认识',1,26,527),(567,'长方体和正方体',2,5,'长方体和正方体的认识',2,26,527),(568,'圆柱和圆锥',2,6,'圆柱和圆锥的认识',3,26,527),(569,'空间方位',2,1,'上下左右前后的位置',1,26,528),(570,'平面位置',2,2,'平面上的位置关系',2,26,528),(571,'方向与路线',2,3,'方向识别和路线设计',3,26,528),(572,'长度测量',2,2,'长度单位及测量',1,26,529),(573,'周长',2,3,'周长的计算',2,26,529),(574,'面积',2,4,'面积的计算',3,26,529),(575,'体积',2,5,'体积的计算',4,26,529),(576,'调查内容的设计',2,3,'调查内容和方法的设计',1,27,530),(577,'数据采集方法',2,4,'数据收集的基本方法',2,27,530),(578,'数据收集工具',2,5,'数据收集工具的使用',3,27,530),(579,'数据分类',2,3,'数据的分类方法',1,27,531),(580,'统计表',2,4,'统计表的制作',2,27,531),(581,'统计图',2,5,'统计图的绘制',3,27,531),(582,'数据特征',2,4,'数据的基本特征',1,27,532),(583,'数据分析方法',2,5,'数据分析的基本方法',2,27,532),(584,'数据分析应用',2,6,'数据分析在实际中的应用',3,27,532),(585,'可能性认识',2,4,'事件发生的可能性',1,27,533),(586,'可能性大小比较',2,5,'可能性大小的比较',2,27,533),(587,'简单概率计算',2,6,'简单事件的概率计算',3,27,533),(588,'认识钟表',2,1,'时间的认识和计算',1,28,534),(589,'认识人民币',2,2,'人民币的认识和计算',2,28,534),(590,'简单购物',2,3,'购物中的应用题',3,28,534),(591,'实际应用',2,4,'数学在生活中的综合应用',4,28,534),(592,'数学游戏',2,1,'趣味数学游戏',1,28,535),(593,'测量活动',2,2,'简单的测量实践',2,28,535),(594,'动手操作',2,3,'数学实践活动',3,28,535),(595,'实地考察',2,4,'数学实地考察活动',4,28,535),(596,'数学抽象',2,4,'从实际问题中抽象数学模型',1,28,536),(597,'模型建立',2,5,'简单数学模型的建立',2,28,536),(598,'模型应用',2,6,'数学模型的实际应用',3,28,536),(599,'观察比较',2,1,'观察和比较的方法',1,28,537),(600,'分类归纳',2,2,'分类和归纳的方法',2,28,537),(601,'推理论证',2,5,'简单的推理和论证',3,28,537),(602,'综合应用',2,6,'数学思维方法的综合运用',4,28,537),(603,'数量关系',2,5,'数量关系的认识和应用',4,25,524),(604,'简单几何体的展开图',2,5,'长方体和正方体的展开图',4,26,527),(605,'路线图与位置表示',2,4,'路线图的绘制与位置的表示方法',4,26,528),(606,'生活中的数据收集',2,3,'从生活实际中收集数据的方法',4,27,530),(607,'复式统计表',2,5,'复式统计表的制作和使用',4,27,531),(608,'数据分析报告',2,6,'简单的数据分析报告的撰写',4,27,532),(609,'生活中的概率应用',2,6,'概率在生活中的简单应用',4,27,533),(610,'数学建模实践',2,6,'简单的数学建模实践活动',4,28,536),(611,'万以内的加减法',2,3,'万以内数的加减法计算',5,25,521),(612,'多位数乘一位数',2,3,'多位数乘一位数的计算方法',6,25,521),(613,'同分母分数加减',2,4,'同分母分数的加减法',5,25,522),(614,'异分母分数加减',2,5,'异分母分数的加减法',6,25,522),(615,'图形的轴对称',2,4,'轴对称图形的特征和性质',6,26,526),(616,'图形的平移',2,5,'图形平移的概念和应用',7,26,526),(617,'时间的测量',2,2,'时间单位及计算',5,26,529),(618,'质量的测量',2,3,'质量单位及计算',6,26,529),(619,'条形统计图',2,4,'条形统计图的绘制和读取',4,27,531),(620,'折线统计图',2,5,'折线统计图的绘制和分析',5,27,531),(621,'长度和距离',2,2,'日常生活中的长度和距离应用',5,28,534),(622,'行程问题',2,5,'简单的行程应用题',6,28,534),(623,'估测活动',2,3,'量的大小估测活动',5,28,535),(624,'设计活动',2,4,'简单的数学设计活动',6,28,535),(625,'多位数乘多位数',2,4,'多位数乘法的计算方法',7,25,521),(626,'多位数除法',2,4,'多位数除法的计算方法',8,25,521),(627,'分数乘法',2,5,'分数乘法的计算方法',7,25,522),(628,'分数除法',2,6,'分数除法的计算方法',8,25,522),(629,'小数的近似数',2,5,'小数的四舍五入和近似值',5,25,523),(630,'小数四则混合运算',2,6,'小数的四则混合运算及应用',6,25,523),(631,'百分数',2,5,'百分数的认识和应用',5,25,524),(632,'方程应用',2,6,'方程在实际问题中的应用',6,25,524),(633,'曲线和直线',2,3,'曲线和直线的认识与区分',5,26,525),(634,'梯形',2,5,'梯形的性质和面积计算',8,26,526),(635,'扇形',2,6,'扇形的认识和面积计算',9,26,526),(636,'棱锥和球体',2,6,'棱锥和球体的认识',5,26,527),(637,'坐标方格',2,4,'平面直角坐标系的初步认识',5,26,528),(638,'容积',2,5,'容积的概念和计算',7,26,529),(639,'面积单位换算',2,4,'面积单位间的换算',8,26,529);
/*!40000 ALTER TABLE `knowledge_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_knowledge_progress`
--

DROP TABLE IF EXISTS `user_knowledge_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_knowledge_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `knowledge_point_id` int NOT NULL,
  `completed_times` int NOT NULL DEFAULT '0',
  `last_completed_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_knowledge_progress_user_id_knowledge_point_id_key` (`user_id`,`knowledge_point_id`),
  KEY `user_knowledge_progress_knowledge_point_id_fkey` (`knowledge_point_id`),
  CONSTRAINT `user_knowledge_progress_knowledge_point_id_fkey` FOREIGN KEY (`knowledge_point_id`) REFERENCES `knowledge_points` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_knowledge_progress`
--

LOCK TABLES `user_knowledge_progress` WRITE;
/*!40000 ALTER TABLE `user_knowledge_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_knowledge_progress` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-13 19:12:29
