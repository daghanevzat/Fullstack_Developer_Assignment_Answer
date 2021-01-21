-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 21 Oca 2021, 17:22:54
-- Sunucu sürümü: 10.4.17-MariaDB
-- PHP Sürümü: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `dbkütüphane`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `book`
--

CREATE TABLE `book` (
  `bookid` int(50) NOT NULL,
  `bookname` varchar(50) NOT NULL,
  `author` varchar(50) NOT NULL,
  `pagenumber` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Tablo döküm verisi `book`
--

INSERT INTO `book` (`bookid`, `bookname`, `author`, `pagenumber`) VALUES
(44, 'Cesur Yeni Dünya', 'Aldous Huxley', 272),
(47, 'Küçük Prens', 'Antoine de Saint-Eupery', 112),
(46, 'Üç Silahşörler', 'Alexandre Dumas', 136),
(1, 'Veba', 'Albert Camus', 304),
(42, 'Yabancı', 'Albert Camus', 111),
(45, 'Yüzbaşının Kızı', 'Aleksandr Puşkin', 198);

--
-- Tetikleyiciler `book`
--
DELIMITER $$
CREATE TRIGGER `updateRest` BEFORE UPDATE ON `book` FOR EACH ROW IF (EXISTS(Select bookid FROM rent_rel WHERE bookid=NEW.bookid))
    THEN
    	SET NEW.bookid=-1;    	
    END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `rent_rel`
--

CREATE TABLE `rent_rel` (
  `userid` int(50) NOT NULL,
  `bookid` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Tablo döküm verisi `rent_rel`
--

INSERT INTO `rent_rel` (`userid`, `bookid`) VALUES
(2, 47),
(3, 45),
(5, 44);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `user_role` tinyint(1) NOT NULL DEFAULT 0,
  `userid` int(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_pass` varchar(50) NOT NULL,
  `user_phone` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`user_role`, `userid`, `username`, `user_email`, `user_pass`, `user_phone`) VALUES
(1, 2, 'Nevzat', 'nevzat@hotmail.com', '12345', 555555555),
(0, 3, 'Murat', 'murat@hotmail.com', '123456', 666666666),
(0, 5, 'mehmet', 'mehmet@hotmail.com', '112233', 7777777);

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`bookname`,`author`),
  ADD UNIQUE KEY `bookid` (`bookid`);

--
-- Tablo için indeksler `rent_rel`
--
ALTER TABLE `rent_rel`
  ADD PRIMARY KEY (`bookid`),
  ADD KEY `userid` (`userid`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `book`
--
ALTER TABLE `book`
  MODIFY `bookid` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `rent_rel`
--
ALTER TABLE `rent_rel`
  ADD CONSTRAINT `rent_rel_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  ADD CONSTRAINT `rent_rel_ibfk_2` FOREIGN KEY (`bookid`) REFERENCES `book` (`bookid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
