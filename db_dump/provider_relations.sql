-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 14, 2025 at 03:48 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `provider_relations`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `FullName` varchar(100) DEFAULT NULL,
  `AdminEmail` varchar(120) DEFAULT NULL,
  `UserName` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `updationDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `FullName`, `AdminEmail`, `UserName`, `Password`, `updationDate`) VALUES
(1, 'victor', 'victorkeyabutita@gmail.com', 'admin', '81dc9bdb52d04dc20036dbd8313ed055', '2024-11-20 18:25:05');

-- --------------------------------------------------------

--
-- Table structure for table `provider_category`
--

CREATE TABLE `provider_category` (
  `id` int(11) NOT NULL,
  `CategoryName` varchar(150) DEFAULT NULL,
  `Status` int(1) DEFAULT NULL,
  `CreationDate` timestamp NULL DEFAULT current_timestamp(),
  `UpdationDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `provider_category`
--

INSERT INTO `provider_category` (`id`, `CategoryName`, `Status`, `CreationDate`, `UpdationDate`) VALUES
(15, 'Hospital', 1, '2024-11-08 19:11:36', '2024-11-10 13:17:33'),
(16, 'Specialist', 1, '2024-11-08 19:11:50', '2024-11-11 06:46:23'),
(17, 'Optical', 1, '2024-11-08 19:12:11', '0000-00-00 00:00:00'),
(19, 'Others', 1, '2024-11-08 19:12:33', '0000-00-00 00:00:00'),
(21, 'Dental', 1, '2024-11-13 06:06:03', '0000-00-00 00:00:00'),
(23, 'Radiology', 1, '2024-11-18 06:58:38', '0000-00-00 00:00:00'),
(24, 'Home Care', 1, '2024-11-18 07:51:06', '0000-00-00 00:00:00'),
(25, 'Orthopeadic', 1, '2024-11-19 19:06:56', '0000-00-00 00:00:00'),
(26, 'Physiotherapy', 1, '2024-11-21 14:08:28', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `provider_country`
--

CREATE TABLE `provider_country` (
  `id` int(11) NOT NULL,
  `country` varchar(255) DEFAULT NULL,
  `creationDate` timestamp NULL DEFAULT current_timestamp(),
  `UpdationDate` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `provider_country`
--

INSERT INTO `provider_country` (`id`, `country`, `creationDate`, `UpdationDate`) VALUES
(2, 'Kenya', '2017-07-08 14:30:23', '2024-11-08 19:20:05'),
(3, 'Uganda', '2017-07-08 14:35:08', '2024-11-08 19:20:13'),
(4, 'Tanzania', '2017-07-08 14:35:21', '2024-11-08 19:20:18');

-- --------------------------------------------------------

--
-- Table structure for table `provider_listing`
--

CREATE TABLE `provider_listing` (
  `id` int(11) NOT NULL,
  `meeting_date` date DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `visit_report` varchar(255) DEFAULT NULL,
  `provider_image` varchar(255) DEFAULT NULL,
  `ProviderName` varchar(255) DEFAULT NULL,
  `ProviderCategory` varchar(255) DEFAULT NULL,
  `Country` varchar(255) DEFAULT NULL,
  `Region` varchar(50) DEFAULT NULL,
  `ContractType` varchar(255) DEFAULT NULL,
  `RegDate` timestamp NULL DEFAULT current_timestamp(),
  `UpdationDate` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `TerminationDate` date DEFAULT NULL,
  `Status` varchar(255) DEFAULT 'under accreditation',
  `smart_activated` tinyint(1) DEFAULT 0,
  `slade_activated` tinyint(1) DEFAULT 0,
  `suspended_comment` text DEFAULT NULL,
  `terminated_comment` text DEFAULT NULL,
  `DocumentsAvailable` text DEFAULT NULL,
  `ProviderTier` varchar(10) DEFAULT NULL,
  `AverageCostAgreed` decimal(10,2) DEFAULT NULL,
  `AvgCostStartDate` date DEFAULT NULL,
  `AvgCostExpiryDate` date DEFAULT NULL,
  `LicenceNumber` varchar(50) DEFAULT NULL,
  `LicenceStartDate` date DEFAULT NULL,
  `LicenceExpiryDate` date DEFAULT NULL,
  `KMPDCLicencePath` varchar(255) DEFAULT NULL,
  `PPBLicencePath` varchar(255) DEFAULT NULL,
  `LABLicencePath` varchar(255) DEFAULT NULL,
  `KNRBLicencePath` varchar(255) DEFAULT NULL,
  `ProfessionalIndemnityPath` varchar(255) DEFAULT NULL,
  `CertificateOfRegistrationPath` varchar(255) DEFAULT NULL,
  `CR12Path` varchar(255) DEFAULT NULL,
  `ProfilePath` varchar(255) DEFAULT NULL,
  `PriceListPath` varchar(255) DEFAULT NULL,
  `KRAPath` varchar(255) DEFAULT NULL,
  `URAPath` varchar(255) DEFAULT NULL,
  `BankDetailsPath` varchar(255) DEFAULT NULL,
  `KYCPath` varchar(255) DEFAULT NULL,
  `CertificateOfIncorporationPath` varchar(255) DEFAULT NULL,
  `NHIFCompliancePath` varchar(255) DEFAULT NULL,
  `DataControllerPath` varchar(255) DEFAULT NULL,
  `ETIMPath` varchar(255) DEFAULT NULL,
  `SladeStatus` tinyint(1) DEFAULT 0,
  `SmartStatus` tinyint(1) DEFAULT 0,
  `SuspendedComment` text DEFAULT NULL,
  `TerminatedComment` text DEFAULT NULL,
  `actisure_status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `provider_listing`
--

INSERT INTO `provider_listing` (`id`, `meeting_date`, `comments`, `visit_report`, `provider_image`, `ProviderName`, `ProviderCategory`, `Country`, `Region`, `ContractType`, `RegDate`, `UpdationDate`, `TerminationDate`, `Status`, `smart_activated`, `slade_activated`, `suspended_comment`, `terminated_comment`, `DocumentsAvailable`, `ProviderTier`, `AverageCostAgreed`, `AvgCostStartDate`, `AvgCostExpiryDate`, `LicenceNumber`, `LicenceStartDate`, `LicenceExpiryDate`, `KMPDCLicencePath`, `PPBLicencePath`, `LABLicencePath`, `KNRBLicencePath`, `ProfessionalIndemnityPath`, `CertificateOfRegistrationPath`, `CR12Path`, `ProfilePath`, `PriceListPath`, `KRAPath`, `URAPath`, `BankDetailsPath`, `KYCPath`, `CertificateOfIncorporationPath`, `NHIFCompliancePath`, `DataControllerPath`, `ETIMPath`, `SladeStatus`, `SmartStatus`, `SuspendedComment`, `TerminatedComment`, `actisure_status`) VALUES
(181, NULL, NULL, NULL, NULL, 'test1', 'Hospital', 'Kenya', 'nai', 'open', '2024-12-07 08:33:39', '2024-12-13 15:37:07', NULL, 'pending_renewal', 1, 1, 'ggg', 'ggg', 'KMPDC LICENCE', '', 5555.00, '2024-12-12', '2025-12-12', '3434', '2024-12-18', '2025-12-18', 'availabledocuments/guideline111.docx', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 0, NULL, NULL, '0'),
(182, NULL, NULL, NULL, NULL, 'Moi Teaching and Referral Hospital ', 'Hospital', 'Kenya', 'Eldoret', 'yearly', '2024-12-07 08:36:50', '2025-07-14 11:58:10', '2024-12-26', 'under accreditation', 0, 0, NULL, NULL, 'KMPDC LICENCE', '', 43543.00, '2024-12-19', '2025-12-19', '34534', '2024-12-12', '2025-12-12', 'availabledocuments/receipt.pdf', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 0, NULL, NULL, NULL),
(185, NULL, NULL, NULL, NULL, 'Dental Suites', 'Dental', 'Kenya', 'Kakamega', 'open', '2024-12-10 17:11:12', '2024-12-27 19:19:10', NULL, 'terminated', 1, 1, NULL, 'Bad services', 'KMPDC LICENCE, PPB LICENCE, LAB LICENCE, KNRB LICENCE, PROFESSIONAL IDEMNITY, CERTIFICATE OF REGISTRATION, CR12, PROFILE, PRICE LIST', '', 3500.00, '2024-12-11', '2025-12-11', '54678', '2024-12-11', '2025-12-11', 'availabledocuments/DENTALPROVIDERSREPORT6thFridayDec.xlsx', 'availabledocuments/APASIGNEDDENTALRATES2024.pdf', 'availabledocuments/FlowchartsandpseudocodeSlides.pdf', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 0, NULL, NULL, '0'),
(186, NULL, NULL, NULL, NULL, 'Kagio Hospital', 'Optical', 'Kenya', 'Nairobi', 'yearly', '2025-07-14 06:08:21', '2025-07-14 11:58:56', '2025-09-16', 'under_accreditation', 1, 1, NULL, NULL, 'KMPDC LICENCE, PPB LICENCE, CR12', '', 3000.00, '2025-08-05', '2026-08-05', 'A2233334445', '2025-05-14', '2026-05-14', 'availabledocuments/receipt.pdf', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 0, NULL, NULL, '0');

-- --------------------------------------------------------

--
-- Table structure for table `provider_requests`
--

CREATE TABLE `provider_requests` (
  `id` int(11) NOT NULL,
  `provider_name` varchar(255) NOT NULL,
  `location_address` varchar(255) NOT NULL,
  `contacts` varchar(255) NOT NULL,
  `scheme` varchar(255) NOT NULL,
  `date_requested` date DEFAULT NULL,
  `query` text NOT NULL,
  `requested_by` varchar(255) NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `date_concluded` datetime DEFAULT NULL,
  `status` enum('In Progress','Accepted','Declined') DEFAULT 'In Progress',
  `action_by` varchar(255) DEFAULT NULL,
  `hod_comments` text DEFAULT NULL,
  `category` varchar(250) NOT NULL,
  `country` varchar(11) NOT NULL,
  `region` varchar(255) NOT NULL,
  `meeting_date` date DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `visit_report` varchar(255) DEFAULT NULL,
  `provider_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provider_requests`
--

INSERT INTO `provider_requests` (`id`, `provider_name`, `location_address`, `contacts`, `scheme`, `date_requested`, `query`, `requested_by`, `email_address`, `date_concluded`, `status`, `action_by`, `hod_comments`, `category`, `country`, `region`, `meeting_date`, `comments`, `visit_report`, `provider_image`) VALUES
(9, 'Mombasa Hospital', 'Mombasa, Kizingo', '0781716945', 'N/A', '2024-11-20', 'Adding a Branch', 'Self', 'mombasahospo@gmail.com', '2024-12-14 00:00:00', 'Declined', 'admin', 'dd', 'Hospital', 'Kenya', 'Mombasa', '2024-12-14', 'Up to standards', 'uploads/providers-list.xlsx', 'uploads/Malaria in Kenya.jpg'),
(11, 'Moi Teaching and Referral Hospital ', 'Eldoret', '0721438580', 'N/A', '2024-10-21', 'Addition of a  branch', 'Self', 'ceo@mtrh.go.ke', '2024-12-02 00:00:00', 'Accepted', 'admin', 'Request approved', 'Hospital', 'Kenya', 'Eldoret', '2024-11-27', 'The facility is up to standard ', 'uploads/guideline (1) (1) (2) (1).docx', 'uploads/hosp2.jpg'),
(12, 'Kenyatta National Hospital', 'Upper Hill', '0725908374', 'N/A', '2024-06-21', 'Addition of Services', 'Self', 'knhadmin@knh.or.ke', '2024-12-02 00:00:00', 'Accepted', 'admin', 'Request approved', 'Hospital', 'Kenya', 'Nairobi', '2024-11-28', 'The facility is impressive and can be able to accommodate new services', 'uploads/Current System State and Identified Gaps for Provider Loading Process (1) (1).docx', 'uploads/hosp3.jpg'),
(13, 'Langata hospital', 'Langata', '0725908374', 'N/A', '2024-06-14', 'Addition of Services', 'Self', 'langatahosp@gmail.com', '2024-12-02 00:00:00', 'Accepted', 'admin', 'Request approved', 'Hospital', 'Kenya', 'Nairobi', '2024-11-23', 'Facility up to standard', 'uploads/Current System State and Identified Gaps for Provider Loading Process (1) (1).docx', 'uploads/hosp5.jpg'),
(14, 'Dental Suites', 'Kakamega', '0725908374', 'Toothpick', '2024-11-21', 'Addition to panel', 'Self', 'dentalsuites@gmail.com', '2024-11-30 00:00:00', 'Accepted', 'admin', 'Approved', 'Dental', 'Kenya', 'Kakamega', '2024-11-19', 'Below standards', 'uploads/providers-list.pdf', 'uploads/hosp5.jpg'),
(16, 'Keah Hospital', 'kampala- xyz road', '0781438580', 'N/A', '2024-11-28', 'New Request', 'Self', 'keah@gmail.com', '2024-11-29 00:00:00', 'Accepted', 'admin', 'Approved', 'Hospital', 'Uganda', 'Kampala', '2024-11-28', 'Up to standards', 'uploads/Provider Management System Report.docx', 'uploads/screencapture-localhost-provider-panel-admin-view-php-2024-11-21-12_50_49.png'),
(19, 'test1', 'sdf', '0777777777', 'sdf', '2024-12-14', 'sda', 'sda', 'victorkeyabutita@gmail.com', '2024-12-21 00:00:00', 'Accepted', 'admin', 'das', 'Hospital', 'Kenya', 'nai', NULL, NULL, NULL, NULL),
(20, 'Kagio Hospital', 'Nairobi', '07111111111', 'Null', '2025-07-15', 'To be accredited', 'CEO', 'edelbertkipchumba@gmail.com', '2025-07-21 00:00:00', 'Accepted', 'admin', 'Accepted', 'Optical', 'Kenya', 'Nairobi', '2025-07-18', 'Approved', 'uploads/receipt.pdf', 'uploads/Screenshot 2025-06-24 220623.png');

-- --------------------------------------------------------

--
-- Table structure for table `visit_meetings`
--

CREATE TABLE `visit_meetings` (
  `id` int(11) NOT NULL,
  `visit_date` date NOT NULL,
  `visit_comments` text DEFAULT NULL,
  `visit_report` text DEFAULT NULL,
  `meeting_title` varchar(255) DEFAULT NULL,
  `meeting_date` date DEFAULT NULL,
  `meeting_comments` text DEFAULT NULL,
  `meeting_minutes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `provider_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `visit_meetings`
--

INSERT INTO `visit_meetings` (`id`, `visit_date`, `visit_comments`, `visit_report`, `meeting_title`, `meeting_date`, `meeting_comments`, `meeting_minutes`, `created_at`, `provider_id`) VALUES
(13, '2024-11-15', NULL, NULL, NULL, NULL, NULL, NULL, '2024-11-14 14:30:13', 154),
(14, '2024-11-15', NULL, NULL, NULL, NULL, NULL, NULL, '2024-11-14 14:41:10', 154),
(15, '2024-11-14', NULL, NULL, NULL, NULL, NULL, NULL, '2024-11-15 09:37:56', 154);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `provider_category`
--
ALTER TABLE `provider_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `provider_country`
--
ALTER TABLE `provider_country`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `provider_listing`
--
ALTER TABLE `provider_listing`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `provider_requests`
--
ALTER TABLE `provider_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `visit_meetings`
--
ALTER TABLE `visit_meetings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `provider_category`
--
ALTER TABLE `provider_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `provider_country`
--
ALTER TABLE `provider_country`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `provider_listing`
--
ALTER TABLE `provider_listing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=187;

--
-- AUTO_INCREMENT for table `provider_requests`
--
ALTER TABLE `provider_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `visit_meetings`
--
ALTER TABLE `visit_meetings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
