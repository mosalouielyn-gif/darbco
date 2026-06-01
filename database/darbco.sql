-- =============================================================
-- DARBCO Agri Workflow & Financial Processing System
-- MySQL / MariaDB schema for XAMPP phpMyAdmin
-- Davao Abaca Banana Cooperative — Panabo City, Davao del Norte
-- =============================================================

DROP DATABASE IF EXISTS darbco;
CREATE DATABASE darbco CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE darbco;

-- -------------------------------------------------------------
-- Authentication / users
-- -------------------------------------------------------------
CREATE TABLE roles (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(40) NOT NULL UNIQUE,
  label       VARCHAR(80) NOT NULL
) ENGINE=InnoDB;

INSERT INTO roles (code, label) VALUES
  ('manager_admin',        'Manager / Admin'),
  ('production_clerk',     'Production Clerk'),
  ('inventory_bookkeeper', 'Inventory Bookkeeper'),
  ('payroll_personnel',    'Payroll Personnel'),
  ('finance_officer',      'Finance Officer');

CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(120) NOT NULL,
  username      VARCHAR(60)  NOT NULL UNIQUE,
  email         VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id       INT UNSIGNED NOT NULL,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  last_login_at DATETIME     NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

-- Test user accounts - All passwords are: password
-- Password hash generated with: bcrypt.hash('password', 10)
INSERT INTO users (full_name, username, email, password_hash, role_id, is_active) VALUES
  ('DARBCO Administrator',   'admin',       'admin@darbco.local',       '$2b$10$eb.2zhwpWBr7lu2L6XGHjOXuX27LnftQtFbX990PNIpleBoqGHb5C', 1, 1),
  ('Production Clerk',       'production',  'production@darbco.local',  '$2b$10$eb.2zhwpWBr7lu2L6XGHjOXuX27LnftQtFbX990PNIpleBoqGHb5C', 2, 1),
  ('Inventory Bookkeeper',   'inventory',   'inventory@darbco.local',   '$2b$10$eb.2zhwpWBr7lu2L6XGHjOXuX27LnftQtFbX990PNIpleBoqGHb5C', 3, 1),
  ('Payroll Personnel',      'payroll',     'payroll@darbco.local',     '$2b$10$eb.2zhwpWBr7lu2L6XGHjOXuX27LnftQtFbX990PNIpleBoqGHb5C', 4, 1),
  ('Finance Officer',        'finance',     'finance@darbco.local',     '$2b$10$eb.2zhwpWBr7lu2L6XGHjOXuX27LnftQtFbX990PNIpleBoqGHb5C', 5, 1);

-- -------------------------------------------------------------
-- Beneficiaries / Agrarian Reform Beneficiaries (ARBs)
-- -------------------------------------------------------------
CREATE TABLE beneficiaries (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(20)  NOT NULL UNIQUE,    -- e.g. B-001
  full_name   VARCHAR(120) NOT NULL,
  block_no    VARCHAR(20)  NULL,
  contact_no  VARCHAR(40)  NULL,
  address     VARCHAR(255) NULL,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Sample beneficiaries
INSERT INTO beneficiaries (code, full_name, block_no, contact_no, address) VALUES
  ('B-001', 'Roberto Cruz',       'Block 1', '09123456701', 'Panabo City, Davao del Norte'),
  ('B-002', 'Liza Mariano',       'Block 1', '09123456702', 'Panabo City, Davao del Norte'),
  ('B-003', 'Antonio Villanueva', 'Block 2', '09123456703', 'Panabo City, Davao del Norte'),
  ('B-004', 'Helena Pascual',     'Block 2', '09123456704', 'Panabo City, Davao del Norte'),
  ('B-005', 'Ferdinand Lopez',    'Block 3', '09123456705', 'Panabo City, Davao del Norte'),
  ('B-006', 'Gloria Santos',      'Block 3', '09123456706', 'Panabo City, Davao del Norte'),
  ('B-007', 'Manuel Tan',         'Block 4', '09123456707', 'Panabo City, Davao del Norte'),
  ('B-008', 'Beatrice Ong',       'Block 4', '09123456708', 'Panabo City, Davao del Norte');

-- -------------------------------------------------------------
-- Inventory
-- -------------------------------------------------------------
CREATE TABLE inventory_categories (
  id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code  VARCHAR(8)  NOT NULL UNIQUE,    -- FERT, CHEM, FARM, PACK
  label VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO inventory_categories (code, label) VALUES
  ('FERT', 'Fertilizers & Soil Inputs'),
  ('CHEM', 'Chemicals & Crop Protection'),
  ('FARM', 'Farm Materials'),
  ('PACK', 'Packaging Materials'),
  ('TOOL', 'Tools & Equipment'),
  ('SEED', 'Seeds & Planting Materials'),
  ('SUPP', 'General Supplies');

CREATE TABLE inventory_items (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  material_id   VARCHAR(20)  NOT NULL UNIQUE,   -- e.g. FERT-001
  item_name     VARCHAR(120) NOT NULL,
  category_id   INT UNSIGNED NOT NULL,
  unit          ENUM('kg','pcs','liter','pair','roll','bag','box') NOT NULL DEFAULT 'kg',
  on_hand       DECIMAL(12,2) NOT NULL DEFAULT 0,
  unit_cost     DECIMAL(12,2) NOT NULL DEFAULT 0,
  expiry_date   DATE         NULL,
  stock_date    DATE         NULL,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_inv_cat FOREIGN KEY (category_id) REFERENCES inventory_categories(id)
) ENGINE=InnoDB;

-- Audit trail for every stock movement
CREATE TABLE stock_transactions (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference_no    VARCHAR(40) NOT NULL UNIQUE,        -- RC-2025-0042, CR-2025-0007, ...
  txn_type        ENUM('Stock In','Cash Purchase','Credit Issued','Adjustment','Stock Out (Expired)') NOT NULL,
  item_id         INT UNSIGNED NOT NULL,
  quantity        DECIMAL(12,2) NOT NULL,             -- positive = +, negative = -
  unit_cost       DECIMAL(12,2) NOT NULL DEFAULT 0,
  supplier_name   VARCHAR(120) NULL,
  beneficiary_id  INT UNSIGNED NULL,
  reason          VARCHAR(255) NULL,
  recorded_by     INT UNSIGNED NOT NULL,              -- bookkeeper user id
  txn_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_txn_item FOREIGN KEY (item_id) REFERENCES inventory_items(id),
  CONSTRAINT fk_txn_ben  FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
  CONSTRAINT fk_txn_user FOREIGN KEY (recorded_by) REFERENCES users(id),
  INDEX idx_txn_at (txn_at),
  INDEX idx_txn_type (txn_type)
) ENGINE=InnoDB;

-- Outstanding credit balances (Credit Issued reductions tracked here)
CREATE TABLE credit_balances (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  receipt_no        VARCHAR(40)  NOT NULL UNIQUE,
  beneficiary_id    INT UNSIGNED NOT NULL,
  item_id           INT UNSIGNED NOT NULL,
  quantity          DECIMAL(12,2) NOT NULL,
  unit_cost         DECIMAL(12,2) NOT NULL,
  amount            DECIMAL(12,2) NOT NULL,
  remaining_balance DECIMAL(12,2) NOT NULL,
  status            ENUM('Outstanding','Partially Paid','Paid') NOT NULL DEFAULT 'Outstanding',
  payroll_batch     VARCHAR(40)  NULL,
  issued_by         INT UNSIGNED NOT NULL,
  issued_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cb_ben  FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
  CONSTRAINT fk_cb_item FOREIGN KEY (item_id) REFERENCES inventory_items(id),
  CONSTRAINT fk_cb_user FOREIGN KEY (issued_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Production records (Daily Production per Beneficiary,
-- Daily Boxes, Stem-Cut, ARB Logs)
-- -------------------------------------------------------------
CREATE TABLE production_records (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  record_no       VARCHAR(40) NULL UNIQUE,
  harvest_date    DATE NULL,
  packing_date    DATE NOT NULL,
  beneficiary_id  INT UNSIGNED NOT NULL,
  harvester_name  VARCHAR(120) NULL,
  sub_code        VARCHAR(20)  NULL,
  stems_cut       INT UNSIGNED NOT NULL DEFAULT 0,
  buligs_total    INT UNSIGNED NOT NULL DEFAULT 0,
  buligs_11w      INT UNSIGNED NOT NULL DEFAULT 0,
  buligs_12w      INT UNSIGNED NOT NULL DEFAULT 0,
  buligs_13w      INT UNSIGNED NOT NULL DEFAULT 0,
  buligs_14w      INT UNSIGNED NOT NULL DEFAULT 0,
  -- Class A
  class_a_hands   INT UNSIGNED NOT NULL DEFAULT 0,
  class_a_big_hands INT UNSIGNED NOT NULL DEFAULT 0,
  class_a_small_hands INT UNSIGNED NOT NULL DEFAULT 0,
  class_a_cps     INT UNSIGNED NOT NULL DEFAULT 0,
  class_a_sh      INT UNSIGNED NOT NULL DEFAULT 0,
  class_a_fp      INT UNSIGNED NOT NULL DEFAULT 0,
  -- Class B
  class_b_total   INT UNSIGNED NOT NULL DEFAULT 0,
  class_b_big_hands INT UNSIGNED NOT NULL DEFAULT 0,
  class_b_small_hands INT UNSIGNED NOT NULL DEFAULT 0,
  class_b_cps     INT UNSIGNED NOT NULL DEFAULT 0,
  class_b_clb     INT UNSIGNED NOT NULL DEFAULT 0,
  class_b_h       INT UNSIGNED NOT NULL DEFAULT 0,
  class_b_i       INT UNSIGNED NOT NULL DEFAULT 0,
  class_b_d       INT UNSIGNED NOT NULL DEFAULT 0,
  special_total   INT UNSIGNED NOT NULL DEFAULT 0,
  defects_11w     INT UNSIGNED NOT NULL DEFAULT 0,
  defects_12w     INT UNSIGNED NOT NULL DEFAULT 0,
  defects_13w     INT UNSIGNED NOT NULL DEFAULT 0,
  defects_14w     INT UNSIGNED NOT NULL DEFAULT 0,
  rejects_11w     INT UNSIGNED NOT NULL DEFAULT 0,
  rejects_12w     INT UNSIGNED NOT NULL DEFAULT 0,
  rejects_13w     INT UNSIGNED NOT NULL DEFAULT 0,
  rejects_14w     INT UNSIGNED NOT NULL DEFAULT 0,
  status          ENUM('Draft','Submitted','Returned','Verified','Used in Payroll') NOT NULL DEFAULT 'Submitted',
  recorded_by     INT UNSIGNED NOT NULL,
  recorded_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pr_ben  FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
  CONSTRAINT fk_pr_user FOREIGN KEY (recorded_by) REFERENCES users(id),
  INDEX idx_pr_date (packing_date)
) ENGINE=InnoDB;

CREATE TABLE daily_boxes (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  packing_date    DATE NOT NULL,
  first_box_at    TIME NULL,
  last_box_at     TIME NULL,
  class_a_total   INT UNSIGNED NOT NULL DEFAULT 0,
  class_b_total   INT UNSIGNED NOT NULL DEFAULT 0,
  special_total   INT UNSIGNED NOT NULL DEFAULT 0,
  recorded_by     INT UNSIGNED NOT NULL,
  recorded_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_db_user FOREIGN KEY (recorded_by) REFERENCES users(id),
  INDEX idx_db_date (packing_date)
) ENGINE=InnoDB;

CREATE TABLE arb_logs (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  packing_date    DATE NOT NULL,
  beneficiary_id  INT UNSIGNED NOT NULL,
  block_no        VARCHAR(20) NULL,
  recorded_by     INT UNSIGNED NOT NULL,
  recorded_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_arb_ben  FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
  CONSTRAINT fk_arb_user FOREIGN KEY (recorded_by) REFERENCES users(id),
  INDEX idx_arb_date (packing_date)
) ENGINE=InnoDB;

CREATE TABLE arb_log_carreros (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  arb_log_id    BIGINT UNSIGNED NOT NULL,
  carrero_name  VARCHAR(120) NOT NULL,
  time_arrival  TIME NULL,
  w11           INT UNSIGNED NOT NULL DEFAULT 0,
  w12           INT UNSIGNED NOT NULL DEFAULT 0,
  w13           INT UNSIGNED NOT NULL DEFAULT 0,
  w14           INT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT fk_arbc_log FOREIGN KEY (arb_log_id) REFERENCES arb_logs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Payroll
-- -------------------------------------------------------------
CREATE TABLE payroll_batches (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  batch_no        VARCHAR(40)  NOT NULL UNIQUE,
  period_start    DATE NOT NULL,
  period_end      DATE NOT NULL,
  status          ENUM('Draft','Submitted','Validated','Returned','Approved','Rejected','Released') NOT NULL DEFAULT 'Draft',
  prepared_by     INT UNSIGNED NOT NULL,
  validated_by    INT UNSIGNED NULL,
  validated_at    DATETIME NULL,
  approved_by     INT UNSIGNED NULL,
  approved_at     DATETIME NULL,
  return_reason   VARCHAR(255) NULL,
  total_amount    DECIMAL(14,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_pb_prep FOREIGN KEY (prepared_by) REFERENCES users(id),
  CONSTRAINT fk_pb_val  FOREIGN KEY (validated_by) REFERENCES users(id),
  CONSTRAINT fk_pb_app  FOREIGN KEY (approved_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE payroll_slips (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slip_no           VARCHAR(40) NULL UNIQUE,
  batch_id          BIGINT UNSIGNED NOT NULL,
  beneficiary_id    INT UNSIGNED NOT NULL,
  production_record_id BIGINT UNSIGNED NULL,
  payroll_period    VARCHAR(80) NULL,
  harvest_date      DATE NULL,
  class_a_boxes     INT UNSIGNED NOT NULL DEFAULT 0,
  class_b_boxes     INT UNSIGNED NOT NULL DEFAULT 0,
  special_boxes     INT UNSIGNED NOT NULL DEFAULT 0,
  class_a_price     DECIMAL(12,2) NOT NULL DEFAULT 0,
  class_b_price     DECIMAL(12,2) NOT NULL DEFAULT 0,
  special_price     DECIMAL(12,2) NOT NULL DEFAULT 0,
  material_deduction DECIMAL(12,2) NOT NULL DEFAULT 0,
  previous_balance  DECIMAL(12,2) NOT NULL DEFAULT 0,
  labor_cost        DECIMAL(12,2) NOT NULL DEFAULT 0,
  other_deductions  DECIMAL(12,2) NOT NULL DEFAULT 0,
  gross_amount      DECIMAL(12,2) NOT NULL DEFAULT 0,
  credit_deduction  DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_deductions  DECIMAL(12,2) NOT NULL DEFAULT 0,
  net_amount        DECIMAL(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_ps_batch FOREIGN KEY (batch_id) REFERENCES payroll_batches(id) ON DELETE CASCADE,
  CONSTRAINT fk_ps_ben   FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
  CONSTRAINT fk_ps_prod  FOREIGN KEY (production_record_id) REFERENCES production_records(id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Finance / approvals / restock
-- -------------------------------------------------------------
CREATE TABLE finance_transactions (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference_no  VARCHAR(40) NOT NULL UNIQUE,
  txn_date      DATE NOT NULL,
  category      VARCHAR(80) NOT NULL,
  description   VARCHAR(255) NOT NULL,
  amount        DECIMAL(14,2) NOT NULL,
  direction     ENUM('IN','OUT') NOT NULL,
  recorded_by   INT UNSIGNED NOT NULL,
  CONSTRAINT fk_ft_user FOREIGN KEY (recorded_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE restock_requests (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  request_no      VARCHAR(40) NOT NULL UNIQUE,
  item_id         INT UNSIGNED NOT NULL,
  quantity        DECIMAL(12,2) NOT NULL,
  requested_by    INT UNSIGNED NOT NULL,
  status          ENUM('Pending','Approved','Rejected','Fulfilled') NOT NULL DEFAULT 'Pending',
  reviewed_by     INT UNSIGNED NULL,
  requested_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at     DATETIME NULL,
  notes           VARCHAR(255) NULL,
  CONSTRAINT fk_rr_item FOREIGN KEY (item_id) REFERENCES inventory_items(id),
  CONSTRAINT fk_rr_req  FOREIGN KEY (requested_by) REFERENCES users(id),
  CONSTRAINT fk_rr_rev  FOREIGN KEY (reviewed_by)  REFERENCES users(id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- System audit log (every write action)
-- -------------------------------------------------------------
CREATE TABLE audit_logs (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  module      VARCHAR(60)  NOT NULL,         -- Inventory, Payroll, Production, ...
  action      VARCHAR(60)  NOT NULL,         -- CREATE, UPDATE, DELETE, APPROVE, ...
  target_type VARCHAR(60)  NULL,
  target_id   VARCHAR(60)  NULL,
  details     TEXT         NULL,
  ip_address  VARCHAR(45)  NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_al_user FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_al_created (created_at)
) ENGINE=InnoDB;

-- =============================================================
-- End of schema
--
-- TEST ACCOUNTS - All passwords are: password
-- ============================================================
-- Email: admin@darbco.local       - Password: password - Role: Manager / Admin
-- Email: production@darbco.local  - Password: password - Role: Production Clerk
-- Email: inventory@darbco.local   - Password: password - Role: Inventory Bookkeeper
-- Email: payroll@darbco.local     - Password: password - Role: Payroll Personnel
-- Email: finance@darbco.local     - Password: password - Role: Finance Officer
-- =============================================================
