-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Tempo de geração: 26/06/2026 às 03:57
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `bigchat`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `documentId` varchar(45) NOT NULL,
  `documentType` varchar(45) NOT NULL DEFAULT 'cpf',
  `planType` varchar(45) NOT NULL DEFAULT 'prepaid',
  `balance` decimal(10,2) DEFAULT NULL,
  `limit` decimal(10,2) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `client`
--

INSERT INTO `client` (`id`, `name`, `documentId`, `documentType`, `planType`, `balance`, `limit`, `active`) VALUES
(9, 'Gabriel Rosa', '13979948943', 'cpf', 'prepaid', 10.00, 0.00, 1),
(10, 'Isabella', '11111114122', 'cpf', 'postpaid', 0.00, 10.00, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `conversation`
--

CREATE TABLE `conversation` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `recipient_name` varchar(255) NOT NULL,
  `last_message` longtext DEFAULT NULL,
  `last_message_time` datetime DEFAULT NULL,
  `unread_ount` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `conversation`
--

INSERT INTO `conversation` (`id`, `client_id`, `recipient_id`, `recipient_name`, `last_message`, `last_message_time`, `unread_ount`) VALUES
(1, 9, 10, 'Isabella', 'Oi', '2026-06-25 22:21:36', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `content` longtext NOT NULL,
  `datetime` datetime NOT NULL,
  `priority` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL,
  `cost` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
