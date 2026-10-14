-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 14, 2026 at 05:01 AM
-- Server version: 8.0.46-0ubuntu0.22.04.4
-- PHP Version: 8.1.2-1ubuntu2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `etfdb_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--

CREATE TABLE `audit_log` (
  `pk_audit_id` varchar(50) NOT NULL,
  `org_id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `details` varchar(500) DEFAULT NULL,
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `audit_log`
--

INSERT INTO `audit_log` (`pk_audit_id`, `org_id`, `user_id`, `user_name`, `action`, `details`, `created_datetime`) VALUES
('AUD00001', 'ORG001', 'USR001', 'Ravi Kumar', 'LOGIN', 'Ravi Kumar logged in', '2026-08-17 18:59:03'),
('AUD00002', 'ORG001', 'USR001', 'Ravi Kumar', 'LOGOUT', 'Ravi Kumar logged out', '2026-08-17 18:59:20'),
('AUD00003', 'ORG001', 'USR001', 'Ravi Kumar', 'LOGIN', 'Ravi Kumar logged in', '2026-08-25 19:08:58'),
('AUD00004', 'ORG001', 'USR001', 'Ravi Kumar', 'CREATE_USER', 'Auto-created customer Aravind S (USR021) from application MF-84725570', '2026-08-25 19:09:08'),
('AUD00005', 'ORG001', 'USR001', 'Ravi Kumar', 'APPROVE_APPLICATION', 'Approved application MF-84725570, created loan LOAN001 for Aravind S', '2026-08-25 19:09:08'),
('AUD00006', 'ORG001', 'USR001', 'Ravi Kumar', 'APPROVE_LOAN', 'Approved loan LOAN001', '2026-08-25 19:09:28'),
('AUD00007', 'ORG001', 'USR001', 'Ravi Kumar', 'DISBURSE_LOAN', 'Disbursed 500,000.00 for loan LOAN001', '2026-08-25 19:09:35'),
('AUD00008', 'ORG001', 'USR001', 'Ravi Kumar', 'LOGOUT', 'Ravi Kumar logged out', '2026-08-25 19:10:09'),
('AUD00009', 'ORG001', 'USR021', 'Aravind S', 'CUSTOMER_LOGIN', 'Aravind S logged in via Mobile & DOB/PAN', '2026-08-25 19:10:48'),
('AUD00010', 'ORG001', 'USR021', 'Aravind S', 'RECEIVE_LOAN', 'Aravind S acknowledged receipt of loan LOAN001', '2026-08-25 19:10:58'),
('AUD00011', 'ORG001', 'USR021', 'Aravind S', 'LOGOUT', 'Aravind S logged out', '2026-08-25 19:11:55'),
('AUD00012', 'ORG001', 'USR021', 'Aravind S', 'CUSTOMER_LOGIN', 'Aravind S logged in via Mobile & DOB/PAN', '2026-08-26 16:35:32'),
('AUD00013', 'ORG001', 'USR021', 'Aravind S', 'LOGOUT', 'Aravind S logged out', '2026-08-26 17:06:05'),
('AUD00014', 'ORG001', 'USR021', 'Aravind S', 'CUSTOMER_LOGIN', 'Aravind S logged in via Mobile & DOB/PAN', '2026-08-26 18:27:39'),
('AUD00015', 'ORG001', 'USR021', 'Aravind S', 'CUSTOMER_LOGIN', 'Aravind S logged in via Mobile & DOB/PAN', '2026-08-26 18:30:44'),
('AUD00016', 'ORG001', 'USR021', 'Aravind S', 'LOGOUT', 'Aravind S logged out', '2026-08-26 18:31:26'),
('AUD00017', 'ORG001', 'USR021', 'Aravind S', 'CUSTOMER_LOGIN', 'Aravind S logged in via Mobile & DOB/PAN', '2026-08-26 18:32:20'),
('AUD00018', 'ORG001', 'USR021', 'Aravind S', 'LOGOUT', 'Aravind S logged out', '2026-08-26 18:41:51'),
('AUD00019', 'ORG001', 'USR021', 'Aravind S', 'CUSTOMER_LOGIN', 'Aravind S logged in via Mobile & DOB/PAN', '2026-08-26 18:42:23'),
('AUD00020', 'ORG001', 'USR021', 'Aravind S', 'LOGOUT', 'Aravind S logged out', '2026-08-26 19:02:39'),
('AUD00021', 'ORG001', 'USR001', 'Ravi Kumar', 'LOGIN', 'Ravi Kumar logged in', '2026-08-26 19:36:10'),
('AUD00022', 'ORG001', 'USR001', 'Ravi Kumar', 'REJECT_APPLICATION', 'Rejected application MF-85569560 from Aravind S', '2026-08-26 19:36:42'),
('AUD00023', 'ORG001', 'USR001', 'Ravi Kumar', 'LOGOUT', 'Ravi Kumar logged out', '2026-08-26 19:37:30'),
('AUD00024', 'ORG001', 'USR002', 'Priya Devi', 'LOGIN', 'Priya Devi logged in', '2026-08-26 19:37:53'),
('AUD00025', 'ORG001', 'USR002', 'Priya Devi', 'COLLECT', 'Collected 100,000.00 against loan LOAN001 (CASH)', '2026-08-26 19:38:18'),
('AUD00026', 'ORG001', 'USR002', 'Priya Devi', 'LOGOUT', 'Priya Devi logged out', '2026-08-26 19:38:39'),
('AUD00027', 'ORG001', 'USR021', 'Aravind S', 'CUSTOMER_LOGIN', 'Aravind S logged in via Mobile & DOB/PAN', '2026-08-26 19:38:57'),
('AUD00028', 'ORG001', 'USR021', 'Aravind S', 'LOGOUT', 'Aravind S logged out', '2026-08-26 19:39:13'),
('AUD00029', 'ORG001', 'USR001', 'Ravi Kumar', 'LOGIN', 'Ravi Kumar logged in', '2026-08-26 19:39:53'),
('AUD00030', 'ORG001', 'USR021', 'Aravind S', 'CUSTOMER_LOGIN', 'Aravind S logged in via Mobile & DOB/PAN', '2026-08-31 18:13:06'),
('AUD00031', 'ORG001', 'USR021', 'Aravind S', 'LOGOUT', 'Aravind S logged out', '2026-08-31 18:13:49'),
('AUD00032', 'ORG001', 'USR001', 'Ravi Kumar', 'LOGIN', 'Ravi Kumar logged in', '2026-08-31 18:14:05'),
('AUD00033', 'ORG001', 'USR001', 'Ravi Kumar', 'LOGIN', 'Ravi Kumar logged in', '2026-10-05 14:41:17'),
('AUD00034', 'ORG001', 'USR001', 'Ravi Kumar', 'LOGOUT', 'Ravi Kumar logged out', '2026-10-05 14:42:00'),
('AUD00035', 'ORG001', 'USR021', 'Aravind S', 'CUSTOMER_LOGIN', 'Aravind S logged in via Mobile & DOB/PAN', '2026-10-05 14:45:11'),
('AUD00036', 'ORG001', 'USR021', 'Aravind S', 'LOGOUT', 'Aravind S logged out', '2026-10-05 14:45:17'),
('AUD00037', 'ORG001', 'USR021', 'Aravind S', 'CUSTOMER_LOGIN', 'Aravind S logged in via Mobile & DOB/PAN', '2026-10-05 14:45:30'),
('AUD00038', 'ORG001', 'USR021', 'Aravind S', 'LOGOUT', 'Aravind S logged out', '2026-10-05 14:45:34'),
('AUD00039', 'ORG001', 'USR001', 'Ravi Kumar', 'LOGIN', 'Ravi Kumar logged in', '2026-10-05 14:46:23'),
('AUD00040', 'ORG001', 'USR001', 'Ravi Kumar', 'LOGOUT', 'Ravi Kumar logged out', '2026-10-05 14:46:42'),
('AUD00041', 'ORG001', 'USR002', 'Priya Devi', 'LOGIN', 'Priya Devi logged in', '2026-10-05 14:47:09'),
('AUD00042', 'ORG001', 'USR002', 'Priya Devi', 'LOGOUT', 'Priya Devi logged out', '2026-10-05 14:47:35'),
('AUD00043', 'ORG001', 'USR021', 'Aravind S', 'CUSTOMER_LOGIN', 'Aravind S logged in via Mobile & DOB/PAN', '2026-10-05 15:06:19'),
('AUD00044', 'ORG001', 'USR021', 'Aravind S', 'LOGOUT', 'Aravind S logged out', '2026-10-05 15:08:37');

-- --------------------------------------------------------

--
-- Table structure for table `loan_activity_status`
--

CREATE TABLE `loan_activity_status` (
  `pk_las_id` varchar(50) NOT NULL,
  `las_user_id` varchar(50) NOT NULL COMMENT 'User who triggered this stage',
  `fk_loan_id` varchar(50) NOT NULL COMMENT 'FK → loan_info.pk_loan_id',
  `las_activity_id` varchar(50) NOT NULL COMMENT 'Stage activity code: BDE=Applied, PDOC=Financier Approved, DID=Disbursed, FINISH=Finished, REJ=Rejected',
  `las_status_id` char(1) NOT NULL COMMENT 'A=Applied, C=Checked/Approved, D=Disbursed, S=Finished, R=Rejected',
  `las_updated_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `loan_activity_status`
--

INSERT INTO `loan_activity_status` (`pk_las_id`, `las_user_id`, `fk_loan_id`, `las_activity_id`, `las_status_id`, `las_updated_on`) VALUES
('39952162', 'USR001', 'LOAN001', 'PDOC', 'C', '2026-08-25 19:09:28'),
('58315912', 'USR021', 'LOAN001', 'FINISH', 'S', '2026-08-25 19:10:58'),
('76574237', 'USR001', 'LOAN001', 'DID', 'D', '2026-08-25 19:09:35'),
('89110464', 'USR001', 'LOAN001', 'BDE', 'A', '2026-08-25 19:09:08');

-- --------------------------------------------------------

--
-- Table structure for table `loan_applications`
--

CREATE TABLE `loan_applications` (
  `id` int NOT NULL,
  `ref` varchar(50) NOT NULL,
  `cust_name` varchar(100) NOT NULL,
  `cust_phone` varchar(15) NOT NULL,
  `cust_email` varchar(100) NOT NULL,
  `cust_dob` date DEFAULT NULL,
  `cust_pan` varchar(20) DEFAULT NULL,
  `cust_city` varchar(100) NOT NULL,
  `cust_address` varchar(255) NOT NULL,
  `financier_key` varchar(50) NOT NULL,
  `financier_label` varchar(100) NOT NULL,
  `loan_amount` decimal(15,2) NOT NULL,
  `tenure_months` int NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL,
  `emi` decimal(15,2) NOT NULL,
  `total_interest` decimal(15,2) NOT NULL,
  `total_payable` decimal(15,2) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'Pending Review',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `loan_applications`
--

INSERT INTO `loan_applications` (`id`, `ref`, `cust_name`, `cust_phone`, `cust_email`, `cust_dob`, `cust_pan`, `cust_city`, `cust_address`, `financier_key`, `financier_label`, `loan_amount`, `tenure_months`, `interest_rate`, `emi`, `total_interest`, `total_payable`, `status`, `created_at`) VALUES
(1, 'MF-84725570', 'Aravind S', '9385644889', 'aravind11201004@gmail.com', '2001-01-01', 'EGCPA0034H', 'Ambasamudaram', '1/59B, South Street, Mannarkovil', 'mf_coop', 'Madurai Finance', '500000.00', 24, '13.25', '23829.67', '71912.01', '571912.01', 'Approved', '2026-08-25 19:05:25'),
(2, 'MF-85569560', 'Aravind S', '8072757409', 'suriyakannan@gmail.com', '2001-01-01', 'EGCPA0067K', 'Chennai', '1/49b, South Street, Chennai', 'mf_coop', 'Madurai Finance', '500000.00', 24, '13.25', '23829.67', '71912.01', '571912.01', 'Rejected', '2026-08-25 19:19:29'),
(3, 'MF-99868625', 'Ara', '6369067385', 'aravind1120ty@gmail.com', '2001-01-08', 'ADDPE4567H', 'dryttgh', 'fftrtgg', 'mf_coop', 'Madurai Finance', '50000.00', 12, '13.00', '4465.86', '3590.37', '53590.37', 'Pending Review', '2026-08-31 18:11:08');

-- --------------------------------------------------------

--
-- Table structure for table `loan_collection`
--

CREATE TABLE `loan_collection` (
  `pk_collection_id` varchar(50) NOT NULL,
  `collection_org_id` varchar(50) NOT NULL,
  `collection_loan_id` varchar(50) NOT NULL,
  `collection_user_id` varchar(50) NOT NULL,
  `collection_amount` decimal(15,2) NOT NULL,
  `collection_date` date NOT NULL DEFAULT (curdate()),
  `payment_mode` varchar(20) NOT NULL DEFAULT 'CASH',
  `reference_no` varchar(100) DEFAULT NULL,
  `collected_by_user_id` varchar(50) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'SUCCESS',
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_user` varchar(50) DEFAULT NULL,
  `updated_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `loan_collection`
--

INSERT INTO `loan_collection` (`pk_collection_id`, `collection_org_id`, `collection_loan_id`, `collection_user_id`, `collection_amount`, `collection_date`, `payment_mode`, `reference_no`, `collected_by_user_id`, `remarks`, `status`, `created_datetime`, `created_user`, `updated_datetime`, `updated_user`) VALUES
('COLL001', 'ORG001', 'LOAN001', 'USR021', '100000.00', '2026-08-27', 'CASH', '44366445', 'USR002', NULL, 'SUCCESS', '2026-08-26 19:38:18', 'USR002', '2026-08-26 19:38:18', 'USR002');

-- --------------------------------------------------------

--
-- Table structure for table `loan_info`
--

CREATE TABLE `loan_info` (
  `pk_loan_id` varchar(50) NOT NULL,
  `loan_org_id` varchar(50) NOT NULL,
  `loan_user_id` varchar(50) NOT NULL,
  `loan_amount` decimal(15,2) NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `tenure_months` int NOT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `application_date` date NOT NULL DEFAULT (curdate()),
  `approval_date` date DEFAULT NULL,
  `disbursement_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `outstanding_amount` decimal(15,2) DEFAULT NULL,
  `received` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(20) NOT NULL DEFAULT 'PENDING',
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_user` varchar(50) DEFAULT NULL,
  `updated_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `loan_info`
--

INSERT INTO `loan_info` (`pk_loan_id`, `loan_org_id`, `loan_user_id`, `loan_amount`, `interest_rate`, `tenure_months`, `purpose`, `application_date`, `approval_date`, `disbursement_date`, `due_date`, `outstanding_amount`, `received`, `status`, `created_datetime`, `created_user`, `updated_datetime`, `updated_user`) VALUES
('LOAN001', 'ORG001', 'USR021', '500000.00', '13.25', 24, 'Madurai Finance - Ambasamudaram', '2026-08-26', '2026-08-26', '2026-08-26', '2028-08-26', NULL, 1, 'DISBURSED', '2026-08-25 19:09:08', 'USR001', '2026-08-25 19:10:58', 'USR021');

-- --------------------------------------------------------

--
-- Table structure for table `module_master`
--

CREATE TABLE `module_master` (
  `pk_module_id` varchar(50) NOT NULL,
  `module_name` varchar(50) NOT NULL,
  `module_code` varchar(50) NOT NULL,
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_user` varchar(50) DEFAULT NULL,
  `updated_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `module_master`
--

INSERT INTO `module_master` (`pk_module_id`, `module_name`, `module_code`, `created_datetime`, `created_user`, `updated_datetime`, `updated_user`) VALUES
('MOD001', 'Loan Disbursement', 'LOAN_DISBURSEMENT', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MOD002', 'Collection', 'COLLECTION', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MOD003', 'Audit', 'AUDIT', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM');

-- --------------------------------------------------------

--
-- Table structure for table `org_info`
--

CREATE TABLE `org_info` (
  `pk_org_id` varchar(50) NOT NULL,
  `org_name` varchar(100) NOT NULL,
  `org_email` varchar(50) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'ACTIVE',
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_user` varchar(50) DEFAULT NULL,
  `updated_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `org_info`
--

INSERT INTO `org_info` (`pk_org_id`, `org_name`, `org_email`, `status`, `created_datetime`, `created_user`, `updated_datetime`, `updated_user`) VALUES
('ORG001', 'Madurai Finance', 'admin@maduraifinance.com', 'ACTIVE', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM');

-- --------------------------------------------------------

--
-- Table structure for table `permission_master`
--

CREATE TABLE `permission_master` (
  `pk_permission_id` varchar(50) NOT NULL,
  `permission_name` varchar(50) NOT NULL,
  `permission_code` varchar(50) NOT NULL,
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_user` varchar(50) DEFAULT NULL,
  `updated_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `permission_master`
--

INSERT INTO `permission_master` (`pk_permission_id`, `permission_name`, `permission_code`, `created_datetime`, `created_user`, `updated_datetime`, `updated_user`) VALUES
('PERM001', 'View', 'VIEW', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('PERM002', 'Create', 'CREATE', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('PERM003', 'Approve', 'APPROVE', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('PERM004', 'Disburse', 'DISBURSE', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('PERM005', 'Collect', 'COLLECT', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('PERM006', 'Receive', 'RECEIVE', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('PERM007', 'Monitor', 'MONITOR', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM');

-- --------------------------------------------------------

--
-- Table structure for table `repayment_details`
--

CREATE TABLE `repayment_details` (
  `pk_repayment_id` varchar(50) NOT NULL COMMENT '8-digit unique ID',
  `fk_loan_id` varchar(50) NOT NULL COMMENT 'FK → loan_info.pk_loan_id',
  `instl_num` int NOT NULL COMMENT 'Installment sequence number (1..N)',
  `due_date` date NOT NULL COMMENT 'Due date of installment',
  `opening_principal` decimal(15,2) NOT NULL COMMENT 'Opening principal balance',
  `inst_amt` decimal(15,2) NOT NULL COMMENT 'Installment EMI amount',
  `principal` decimal(15,2) NOT NULL COMMENT 'Principal component',
  `interest` decimal(15,2) NOT NULL COMMENT 'Interest component',
  `adv_flag` char(1) NOT NULL DEFAULT 'N' COMMENT 'Advance payment flag (Y/N)',
  `closing_principal` decimal(15,2) NOT NULL COMMENT 'Closing principal balance',
  `rate` decimal(5,2) NOT NULL COMMENT 'Annual interest rate (%)',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `repayment_details`
--

INSERT INTO `repayment_details` (`pk_repayment_id`, `fk_loan_id`, `instl_num`, `due_date`, `opening_principal`, `inst_amt`, `principal`, `interest`, `adv_flag`, `closing_principal`, `rate`, `created_at`) VALUES
('13709168', 'LOAN001', 9, '2027-05-26', '347742.06', '23829.67', '19990.02', '3839.65', 'N', '327752.04', '13.25', '2026-08-25 19:09:28'),
('19768757', 'LOAN001', 20, '2028-04-26', '115300.94', '23829.67', '22556.56', '1273.11', 'N', '92744.38', '13.25', '2026-08-25 19:09:28'),
('25656972', 'LOAN001', 1, '2026-09-26', '500000.00', '23829.67', '18308.84', '5520.83', 'N', '481691.16', '13.25', '2026-08-25 19:09:28'),
('38062770', 'LOAN001', 8, '2027-04-26', '367513.77', '23829.67', '19771.71', '4057.96', 'N', '347742.06', '13.25', '2026-08-25 19:09:28'),
('41798765', 'LOAN001', 7, '2027-03-26', '387069.55', '23829.67', '19555.78', '4273.89', 'N', '367513.77', '13.25', '2026-08-25 19:09:28'),
('42230436', 'LOAN001', 3, '2026-11-26', '463180.16', '23829.67', '18715.39', '5114.28', 'N', '444464.77', '13.25', '2026-08-25 19:09:28'),
('43063489', 'LOAN001', 24, '2028-08-26', '23569.31', '23829.55', '23569.31', '260.24', 'N', '0.00', '13.25', '2026-08-25 19:09:28'),
('54627291', 'LOAN001', 14, '2027-10-26', '245560.23', '23829.67', '21118.28', '2711.39', 'N', '224441.95', '13.25', '2026-08-25 19:09:28'),
('57598544', 'LOAN001', 13, '2027-09-26', '266447.87', '23829.67', '20887.64', '2942.03', 'N', '245560.23', '13.25', '2026-08-25 19:09:28'),
('58204362', 'LOAN001', 6, '2027-02-26', '406411.76', '23829.67', '19342.21', '4487.46', 'N', '387069.55', '13.25', '2026-08-25 19:09:28'),
('62514698', 'LOAN001', 15, '2027-11-26', '224441.95', '23829.67', '21351.46', '2478.21', 'N', '203090.49', '13.25', '2026-08-25 19:09:28'),
('63452321', 'LOAN001', 19, '2028-03-26', '137611.15', '23829.67', '22310.21', '1519.46', 'N', '115300.94', '13.25', '2026-08-25 19:09:28'),
('64589971', 'LOAN001', 2, '2026-10-26', '481691.16', '23829.67', '18511.00', '5318.67', 'N', '463180.16', '13.25', '2026-08-25 19:09:28'),
('71644481', 'LOAN001', 10, '2027-06-26', '327752.04', '23829.67', '20210.74', '3618.93', 'N', '307541.30', '13.25', '2026-08-25 19:09:28'),
('72675736', 'LOAN001', 5, '2027-01-26', '425542.73', '23829.67', '19130.97', '4698.70', 'N', '406411.76', '13.25', '2026-08-25 19:09:28'),
('78707066', 'LOAN001', 18, '2028-02-26', '159677.71', '23829.67', '22066.56', '1763.11', 'N', '137611.15', '13.25', '2026-08-25 19:09:28'),
('79300614', 'LOAN001', 17, '2028-01-26', '181503.28', '23829.67', '21825.57', '2004.10', 'N', '159677.71', '13.25', '2026-08-25 19:09:28'),
('80419318', 'LOAN001', 16, '2027-12-26', '203090.49', '23829.67', '21587.21', '2242.46', 'N', '181503.28', '13.25', '2026-08-25 19:09:28'),
('80882348', 'LOAN001', 11, '2027-07-26', '307541.30', '23829.67', '20433.90', '3395.77', 'N', '287107.40', '13.25', '2026-08-25 19:09:28'),
('85944260', 'LOAN001', 4, '2026-12-26', '444464.77', '23829.67', '18922.04', '4907.63', 'N', '425542.73', '13.25', '2026-08-25 19:09:28'),
('85949257', 'LOAN001', 23, '2028-07-26', '46881.33', '23829.67', '23312.02', '517.65', 'N', '23569.31', '13.25', '2026-08-25 19:09:28'),
('87123461', 'LOAN001', 21, '2028-05-26', '92744.38', '23829.67', '22805.62', '1024.05', 'N', '69938.76', '13.25', '2026-08-25 19:09:28'),
('89656251', 'LOAN001', 22, '2028-06-26', '69938.76', '23829.67', '23057.43', '772.24', 'N', '46881.33', '13.25', '2026-08-25 19:09:28'),
('92448790', 'LOAN001', 12, '2027-08-26', '287107.40', '23829.67', '20659.53', '3170.14', 'N', '266447.87', '13.25', '2026-08-25 19:09:28');

-- --------------------------------------------------------

--
-- Table structure for table `role_master`
--

CREATE TABLE `role_master` (
  `pk_role_id` varchar(50) NOT NULL,
  `role_org_id` varchar(50) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `role_description` varchar(255) DEFAULT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'ACTIVE',
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_user` varchar(50) DEFAULT NULL,
  `updated_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `role_master`
--

INSERT INTO `role_master` (`pk_role_id`, `role_org_id`, `role_name`, `role_description`, `status`, `created_datetime`, `created_user`, `updated_datetime`, `updated_user`) VALUES
('ROLE001', 'ORG001', 'Financier', 'Approves and disburses loans to customers', 'ACTIVE', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('ROLE002', 'ORG001', 'Collection Agent', 'Collects repayments from customers', 'ACTIVE', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('ROLE003', 'ORG001', 'Customer', 'Receives loan amount from Financier', 'ACTIVE', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('ROLE004', 'ORG001', 'Security', 'Monitors legal and illegal financial activities', 'ACTIVE', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('ROLE060', 'ORG001', 'Data Entry Operator', 'Registers new customers and submits loan applications for review', 'ACTIVE', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM');

-- --------------------------------------------------------

--
-- Table structure for table `role_permission_mapping`
--

CREATE TABLE `role_permission_mapping` (
  `pk_mapping_id` varchar(50) NOT NULL,
  `map_org_id` varchar(50) NOT NULL,
  `map_role_id` varchar(50) NOT NULL,
  `map_module_id` varchar(50) NOT NULL,
  `map_permission_id` varchar(50) NOT NULL,
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_user` varchar(50) DEFAULT NULL,
  `updated_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `role_permission_mapping`
--

INSERT INTO `role_permission_mapping` (`pk_mapping_id`, `map_org_id`, `map_role_id`, `map_module_id`, `map_permission_id`, `created_datetime`, `created_user`, `updated_datetime`, `updated_user`) VALUES
('MAP001', 'ORG001', 'ROLE001', 'MOD001', 'PERM001', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP002', 'ORG001', 'ROLE001', 'MOD001', 'PERM002', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP003', 'ORG001', 'ROLE001', 'MOD001', 'PERM003', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP004', 'ORG001', 'ROLE001', 'MOD001', 'PERM004', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP005', 'ORG001', 'ROLE001', 'MOD003', 'PERM001', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP006', 'ORG001', 'ROLE002', 'MOD002', 'PERM001', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP007', 'ORG001', 'ROLE002', 'MOD002', 'PERM005', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP008', 'ORG001', 'ROLE002', 'MOD003', 'PERM001', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP009', 'ORG001', 'ROLE003', 'MOD001', 'PERM001', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP010', 'ORG001', 'ROLE003', 'MOD001', 'PERM006', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP011', 'ORG001', 'ROLE003', 'MOD002', 'PERM001', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP012', 'ORG001', 'ROLE004', 'MOD001', 'PERM001', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP013', 'ORG001', 'ROLE004', 'MOD001', 'PERM007', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP014', 'ORG001', 'ROLE004', 'MOD002', 'PERM001', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP015', 'ORG001', 'ROLE004', 'MOD002', 'PERM007', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP016', 'ORG001', 'ROLE004', 'MOD003', 'PERM001', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP017', 'ORG001', 'ROLE004', 'MOD003', 'PERM007', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP018', 'ORG001', 'ROLE060', 'MOD001', 'PERM001', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM'),
('MAP019', 'ORG001', 'ROLE060', 'MOD001', 'PERM002', '2026-08-17 18:57:08', 'SYSTEM', '2026-08-17 18:57:08', 'SYSTEM');

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `pk_user_id` varchar(50) NOT NULL,
  `user_org_id` varchar(50) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `dob` date DEFAULT NULL,
  `pan_no` varchar(20) DEFAULT NULL,
  `user_role_id` varchar(50) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'ACTIVE',
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_user` varchar(50) DEFAULT NULL,
  `updated_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`pk_user_id`, `user_org_id`, `user_name`, `password`, `user_email`, `dob`, `pan_no`, `user_role_id`, `status`, `created_datetime`, `created_user`, `updated_datetime`, `updated_user`) VALUES
('USR001', 'ORG001', 'Ravi Kumar', '$2b$10$4pT6zknbmvU1rzBEDf8orOwwlcLH6t5obc5WR30neV1vYxPT1jgaG', 'ravi.kumar@maduraifinance.com', '1985-05-15', 'ABCDE1234F', 'ROLE001', 'ACTIVE', '2026-08-17 18:57:09', 'SYSTEM', '2026-08-17 18:57:09', 'SYSTEM'),
('USR002', 'ORG001', 'Priya Devi', '$2b$10$4pT6zknbmvU1rzBEDf8orOwwlcLH6t5obc5WR30neV1vYxPT1jgaG', 'priya.devi@maduraifinance.com', '1990-08-20', 'FGHIJ5678K', 'ROLE002', 'ACTIVE', '2026-08-17 18:57:09', 'SYSTEM', '2026-08-17 18:57:09', 'SYSTEM'),
('USR003', 'ORG001', 'Murugan K', '$2b$10$4pT6zknbmvU1rzBEDf8orOwwlcLH6t5obc5WR30neV1vYxPT1jgaG', 'murugan.k@maduraifinance.com', '1992-12-10', 'LMNOP9012Q', 'ROLE003', 'ACTIVE', '2026-08-17 18:57:09', 'SYSTEM', '2026-08-17 18:57:09', 'SYSTEM'),
('USR004', 'ORG001', 'Suresh V', '$2b$10$4pT6zknbmvU1rzBEDf8orOwwlcLH6t5obc5WR30neV1vYxPT1jgaG', 'suresh.v@maduraifinance.com', '1988-03-25', 'RSTUV3456W', 'ROLE004', 'ACTIVE', '2026-08-17 18:57:09', 'SYSTEM', '2026-08-17 18:57:09', 'SYSTEM'),
('USR020', 'ORG001', 'Kavitha M', '$2b$10$4pT6zknbmvU1rzBEDf8orOwwlcLH6t5obc5WR30neV1vYxPT1jgaG', 'kavitha.m@maduraifinance.com', '1994-07-18', 'XYZAB7890C', 'ROLE060', 'ACTIVE', '2026-08-17 18:57:09', 'SYSTEM', '2026-08-17 18:57:09', 'SYSTEM'),
('USR021', 'ORG001', 'Aravind S', '$2y$10$PxcORY8QeusEumIOay7iOuBeRR0.ui/9ZnM1GR9AbcGTGUXKhfZiy', 'aravind11201004@gmail.com', '2001-01-01', 'EGCPA0034H', 'ROLE003', 'ACTIVE', '2026-08-25 19:09:08', 'USR001', '2026-08-25 19:09:08', 'USR001');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`pk_audit_id`),
  ADD KEY `fk_audit_org_id` (`org_id`),
  ADD KEY `fk_audit_user_id` (`user_id`),
  ADD KEY `idx_audit_datetime` (`created_datetime`);

--
-- Indexes for table `loan_activity_status`
--
ALTER TABLE `loan_activity_status`
  ADD PRIMARY KEY (`pk_las_id`),
  ADD KEY `idx_las_loan` (`fk_loan_id`),
  ADD KEY `idx_las_user` (`las_user_id`),
  ADD KEY `idx_las_status` (`las_status_id`);

--
-- Indexes for table `loan_applications`
--
ALTER TABLE `loan_applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_ref` (`ref`);

--
-- Indexes for table `loan_collection`
--
ALTER TABLE `loan_collection`
  ADD PRIMARY KEY (`pk_collection_id`),
  ADD KEY `fk_collection_org_id` (`collection_org_id`),
  ADD KEY `fk_collection_loan_id` (`collection_loan_id`),
  ADD KEY `fk_collection_user_id` (`collection_user_id`),
  ADD KEY `fk_collected_by_user_id` (`collected_by_user_id`),
  ADD KEY `idx_collection_status` (`status`),
  ADD KEY `idx_collection_date` (`collection_date`);

--
-- Indexes for table `loan_info`
--
ALTER TABLE `loan_info`
  ADD PRIMARY KEY (`pk_loan_id`),
  ADD KEY `fk_loan_org_id` (`loan_org_id`),
  ADD KEY `fk_loan_user_id` (`loan_user_id`),
  ADD KEY `idx_loan_status` (`status`);

--
-- Indexes for table `module_master`
--
ALTER TABLE `module_master`
  ADD PRIMARY KEY (`pk_module_id`),
  ADD UNIQUE KEY `module_code` (`module_code`);

--
-- Indexes for table `org_info`
--
ALTER TABLE `org_info`
  ADD PRIMARY KEY (`pk_org_id`);

--
-- Indexes for table `permission_master`
--
ALTER TABLE `permission_master`
  ADD PRIMARY KEY (`pk_permission_id`),
  ADD UNIQUE KEY `permission_code` (`permission_code`);

--
-- Indexes for table `repayment_details`
--
ALTER TABLE `repayment_details`
  ADD PRIMARY KEY (`pk_repayment_id`),
  ADD KEY `idx_rep_loan` (`fk_loan_id`),
  ADD KEY `idx_rep_due` (`due_date`);

--
-- Indexes for table `role_master`
--
ALTER TABLE `role_master`
  ADD PRIMARY KEY (`pk_role_id`),
  ADD KEY `fk_role_org_id` (`role_org_id`);

--
-- Indexes for table `role_permission_mapping`
--
ALTER TABLE `role_permission_mapping`
  ADD PRIMARY KEY (`pk_mapping_id`),
  ADD UNIQUE KEY `uk_tenant_security` (`map_org_id`,`map_role_id`,`map_module_id`,`map_permission_id`),
  ADD KEY `fk_map_role_id` (`map_role_id`),
  ADD KEY `fk_map_module_id` (`map_module_id`),
  ADD KEY `fk_map_permission_id` (`map_permission_id`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`pk_user_id`),
  ADD UNIQUE KEY `user_email` (`user_email`),
  ADD KEY `fk_user_org_id` (`user_org_id`),
  ADD KEY `fk_user_role_id` (`user_role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `loan_applications`
--
ALTER TABLE `loan_applications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD CONSTRAINT `fk_audit_org_id` FOREIGN KEY (`org_id`) REFERENCES `org_info` (`pk_org_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_audit_user_id` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`pk_user_id`) ON DELETE CASCADE;

--
-- Constraints for table `loan_activity_status`
--
ALTER TABLE `loan_activity_status`
  ADD CONSTRAINT `fk_las_loan_id` FOREIGN KEY (`fk_loan_id`) REFERENCES `loan_info` (`pk_loan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_las_user_id` FOREIGN KEY (`las_user_id`) REFERENCES `user_info` (`pk_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `loan_collection`
--
ALTER TABLE `loan_collection`
  ADD CONSTRAINT `fk_collected_by_user_id` FOREIGN KEY (`collected_by_user_id`) REFERENCES `user_info` (`pk_user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_collection_loan_id` FOREIGN KEY (`collection_loan_id`) REFERENCES `loan_info` (`pk_loan_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_collection_org_id` FOREIGN KEY (`collection_org_id`) REFERENCES `org_info` (`pk_org_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_collection_user_id` FOREIGN KEY (`collection_user_id`) REFERENCES `user_info` (`pk_user_id`) ON DELETE CASCADE;

--
-- Constraints for table `loan_info`
--
ALTER TABLE `loan_info`
  ADD CONSTRAINT `fk_loan_org_id` FOREIGN KEY (`loan_org_id`) REFERENCES `org_info` (`pk_org_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_loan_user_id` FOREIGN KEY (`loan_user_id`) REFERENCES `user_info` (`pk_user_id`) ON DELETE CASCADE;

--
-- Constraints for table `repayment_details`
--
ALTER TABLE `repayment_details`
  ADD CONSTRAINT `fk_rep_loan_id` FOREIGN KEY (`fk_loan_id`) REFERENCES `loan_info` (`pk_loan_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_master`
--
ALTER TABLE `role_master`
  ADD CONSTRAINT `fk_role_org_id` FOREIGN KEY (`role_org_id`) REFERENCES `org_info` (`pk_org_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_permission_mapping`
--
ALTER TABLE `role_permission_mapping`
  ADD CONSTRAINT `fk_map_module_id` FOREIGN KEY (`map_module_id`) REFERENCES `module_master` (`pk_module_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_map_org_id` FOREIGN KEY (`map_org_id`) REFERENCES `org_info` (`pk_org_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_map_permission_id` FOREIGN KEY (`map_permission_id`) REFERENCES `permission_master` (`pk_permission_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_map_role_id` FOREIGN KEY (`map_role_id`) REFERENCES `role_master` (`pk_role_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_info`
--
ALTER TABLE `user_info`
  ADD CONSTRAINT `fk_user_org_id` FOREIGN KEY (`user_org_id`) REFERENCES `org_info` (`pk_org_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_role_id` FOREIGN KEY (`user_role_id`) REFERENCES `role_master` (`pk_role_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
