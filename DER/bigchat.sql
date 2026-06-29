-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Tempo de geração: 30/06/2026 às 01:10
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
  `document_id` varchar(45) NOT NULL,
  `document_type` varchar(45) NOT NULL DEFAULT 'cpf',
  `plan_type` varchar(45) NOT NULL DEFAULT 'prepaid',
  `balance` decimal(10,2) DEFAULT NULL,
  `limit` decimal(10,2) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `client`
--

INSERT INTO `client` (`id`, `name`, `document_id`, `document_type`, `plan_type`, `balance`, `limit`, `active`) VALUES
(9, 'Gabriel Rosa', '11111111111', 'cpf', 'prepaid', 9.50, 0.00, 1),
(11, 'Irrah Tech', '22222222222222', 'cnpj', 'postpaid', 0.50, 10.00, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `conversation`
--

CREATE TABLE `conversation` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `recipient_name` varchar(255) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `last_message` longtext DEFAULT NULL,
  `last_message_time` datetime DEFAULT NULL,
  `unread_count` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `conversation`
--

INSERT INTO `conversation` (`id`, `client_id`, `recipient_id`, `recipient_name`, `client_name`, `last_message`, `last_message_time`, `unread_count`) VALUES
(2, 11, 9, 'Gabriel Rosa', 'Irrah Tech', 'Ola gabriel', NULL, 0);

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
-- Despejando dados para a tabela `message`
--

INSERT INTO `message` (`id`, `conversation_id`, `sender_id`, `recipient_id`, `content`, `datetime`, `priority`, `status`, `cost`) VALUES
(3, 2, 9, 11, 'Olá Irrah', '0000-00-00 00:00:00', 'normal', 'read', 0.25),
(4, 2, 11, 9, 'Ola gabriel', '0000-00-00 00:00:00', 'normal', 'read', 0.25);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
