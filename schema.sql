-- Cria a tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  image VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  demo_balance DECIMAL(15, 2) NOT NULL DEFAULT 10000.00,
  real_balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Informações pessoais
  cpf VARCHAR(20),
  birthdate DATE,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  
  -- Informações financeiras
  currency VARCHAR(10) DEFAULT 'BRL',
  pix_key_type VARCHAR(20),
  pix_key VARCHAR(255),
  
  -- Configurações
  payout DECIMAL(5, 2) DEFAULT 0.85,
  daily_limit DECIMAL(15, 2),
  deposit_limit DECIMAL(15, 2),
  withdraw_limit DECIMAL(15, 2),
  max_trade_amount DECIMAL(15, 2),
  min_trade_amount DECIMAL(15, 2),
  
  -- KYC
  kyc_status VARCHAR(20) DEFAULT 'not_submitted',
  kyc_rejection_reason TEXT,
  
  -- 2FA
  two_factor_enabled BOOLEAN DEFAULT FALSE
);

-- Cria a tabela de operações (trades)
CREATE TABLE IF NOT EXISTS operations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  asset VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  direction VARCHAR(10) NOT NULL,
  timeframe VARCHAR(50) NOT NULL,
  entry_price DECIMAL(15, 5) NOT NULL,
  exit_price DECIMAL(15, 5),
  result VARCHAR(20) NOT NULL DEFAULT 'pending',
  profit DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  account_type VARCHAR(10) NOT NULL DEFAULT 'demo',
  expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Cria a tabela de transações (depósitos e saques)
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  customer_id VARCHAR(255),
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  method VARCHAR(50) NOT NULL DEFAULT 'pix',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  account_type VARCHAR(10) NOT NULL DEFAULT 'real',
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  pix_code TEXT,
  transaction_details JSONB,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Cria a tabela de ativos
CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(50) NOT NULL UNIQUE,
  price DECIMAL(15, 5) NOT NULL,
  type VARCHAR(50) NOT NULL,
  icon VARCHAR(255),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  payout DECIMAL(5, 2) NOT NULL DEFAULT 0.85,
  trading_view_symbol VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cria a tabela de verificações KYC
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  identity_document VARCHAR(255),
  selfie VARCHAR(255),
  proof_of_address VARCHAR(255),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Cria a tabela de configurações da plataforma
CREATE TABLE IF NOT EXISTS platform_settings (
  id SERIAL PRIMARY KEY,
  default_payout DECIMAL(5, 2) NOT NULL DEFAULT 0.85,
  min_deposit DECIMAL(15, 2) NOT NULL DEFAULT 100.00,
  min_withdraw DECIMAL(15, 2) NOT NULL DEFAULT 50.00,
  maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
  allow_new_registrations BOOLEAN NOT NULL DEFAULT TRUE,
  allow_withdrawals BOOLEAN NOT NULL DEFAULT TRUE,
  default_currency VARCHAR(10) NOT NULL DEFAULT 'BRL',
  default_demo_balance DECIMAL(15, 2) NOT NULL DEFAULT 10000.00,
  withdrawal_fee DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  force_2fa BOOLEAN NOT NULL DEFAULT FALSE,
  force_kyc BOOLEAN NOT NULL DEFAULT FALSE,
  session_timeout INTEGER NOT NULL DEFAULT 10080, -- 7 dias em minutos
  max_login_attempts INTEGER NOT NULL DEFAULT 5,
  password_policy VARCHAR(20) NOT NULL DEFAULT 'medium',
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  trade_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  deposit_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  withdrawal_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  marketing_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cria a tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Inserir configurações padrão da plataforma
INSERT INTO platform_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Inserir ativos padrão
INSERT INTO assets (name, symbol, price, type, icon, trading_view_symbol) VALUES
('Bitcoin', 'BTC/USD', 50000, 'crypto', '/assets/crypto/btc.png', 'BINANCE:BTCUSDT'),
('Ethereum', 'ETH/USD', 3000, 'crypto', '/assets/crypto/eth.png', 'BINANCE:ETHUSDT'),
('Binance Coin', 'BNB/USD', 400, 'crypto', '/assets/crypto/bnb.png', 'BINANCE:BNBUSDT'),
('Cardano', 'ADA/USD', 1.2, 'crypto', '/assets/crypto/ada.png', 'BINANCE:ADAUSDT'),
('Solana', 'SOL/USD', 100, 'crypto', '/assets/crypto/sol.png', 'BINANCE:SOLUSDT'),
('Dogecoin', 'DOGE/USD', 0.15, 'crypto', '/assets/crypto/doge.png', 'BINANCE:DOGEUSDT'),
('XRP', 'XRP/USD', 0.75, 'crypto', '/assets/crypto/xrp.png', 'BINANCE:XRPUSDT'),
('EUR/USD', 'EUR/USD', 1.1, 'forex', '/assets/forex/eurusd.png', 'OANDA:EURUSD'),
('GBP/USD', 'GBP/USD', 1.3, 'forex', '/assets/forex/gbpusd.png', 'OANDA:GBPUSD'),
('USD/JPY', 'USD/JPY', 110, 'forex', '/assets/forex/usdjpy.png', 'OANDA:USDJPY'),
('AUD/USD', 'AUD/USD', 0.75, 'forex', '/assets/forex/audusd.png', 'OANDA:AUDUSD'),
('Apple', 'AAPL', 150, 'stock', '/assets/stocks/aapl.png', 'NASDAQ:AAPL'),
('Microsoft', 'MSFT', 300, 'stock', '/assets/stocks/msft.png', 'NASDAQ:MSFT'),
('Google', 'GOOGL', 2800, 'stock', '/assets/stocks/googl.png', 'NASDAQ:GOOGL'),
('Amazon', 'AMZN', 3400, 'stock', '/assets/stocks/amzn.png', 'NASDAQ:AMZN'),
('Tesla', 'TSLA', 900, 'stock', '/assets/stocks/tsla.png', 'NASDAQ:TSLA'),
('Meta', 'META', 330, 'stock', '/assets/stocks/meta.png', 'NASDAQ:META'),
('Netflix', 'NFLX', 600, 'stock', '/assets/stocks/nflx.png', 'NASDAQ:NFLX'),
('Gold', 'GOLD', 1800, 'commodity', '/assets/commodities/gold.png', 'OANDA:XAUUSD'),
('Silver', 'SILVER', 25, 'commodity', '/assets/commodities/silver.png', 'OANDA:XAGUSD'),
('Oil', 'OIL', 80, 'commodity', '/assets/commodities/oil.png', 'OANDA:BCOUSD')
ON CONFLICT (symbol) DO NOTHING;

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO users (name, email, password, role, demo_balance, real_balance)
VALUES ('Admin', 'admin@example.com', '$2a$10$JcmAHe5eUZ0q8yfpk.Rg8O4CyTKGd5Lq7Q.LXxRsK/9qM.JTvHmPK', 'admin', 100000, 10000)
ON CONFLICT (email) DO NOTHING;
