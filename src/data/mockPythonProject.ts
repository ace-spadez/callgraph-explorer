export interface Location {
  file: string;
  start_line: number;
  end_line: number;
  character_start: number;
  character_end: number;
}

export interface Parameter {
  name: string;
  type: string;
  default?: string;
  kind: string;
}

export interface Signature {
  parameters: Parameter[];
  return_type: string;
}

export interface Call {
  function_id: string;
  called_at_location: Location;
  context: string;
}

export interface ExternalVariable {
  name: string;
  type: string;
  line: number;
}

export interface Function {
  id: string;
  name: string;
  module_id: string;
  class_id?: string;
  location: Location;
  signature: Signature;
  calls: Call[];
  is_classmethod: boolean;
  is_property: boolean;
  external_variables_used: ExternalVariable[];
  code: string;
  references: Call[]; // Who calls this function
}

// Mock Python project: E-commerce Data Analysis Platform
export const mockFunctions: Record<string, Function> = {
  "main": {
    id: "main",
    name: "main",
    module_id: "app.main",
    location: { file: "app/main.py", start_line: 1, end_line: 25, character_start: 0, character_end: 600 },
    signature: {
      parameters: [],
      return_type: "None"
    },
    calls: [
      { function_id: "initialize_database", called_at_location: { file: "app/main.py", start_line: 8, end_line: 8, character_start: 4, character_end: 23 }, context: "initialize_database()" },
      { function_id: "load_configuration", called_at_location: { file: "app/main.py", start_line: 10, end_line: 10, character_start: 11, character_end: 29 }, context: "config = load_configuration()" },
      { function_id: "start_analysis_pipeline", called_at_location: { file: "app/main.py", start_line: 12, end_line: 12, character_start: 4, character_end: 29 }, context: "start_analysis_pipeline(config)" },
      { function_id: "generate_reports", called_at_location: { file: "app/main.py", start_line: 14, end_line: 14, character_start: 4, character_end: 19 }, context: "generate_reports()" }
    ],
    is_classmethod: false,
    is_property: false,
    external_variables_used: [
      { name: "logging", type: "module", line: 2 },
      { name: "os", type: "module", line: 3 }
    ],
    references: [],
    code: `"""
E-commerce Data Analysis Platform
Main entry point for the application
"""
import logging
import os
from config import load_configuration
from database import initialize_database
from pipeline import start_analysis_pipeline
from reports import generate_reports

def main():
    """Main application entry point"""
    logging.info("Starting E-commerce Analysis Platform")
    
    # Initialize database connection
    initialize_database()
    
    # Load application configuration
    config = load_configuration()
    
    # Start the analysis pipeline
    start_analysis_pipeline(config)
    
    # Generate final reports
    generate_reports()
    
    logging.info("Analysis completed successfully")

if __name__ == "__main__":
    main()`
  },

  "initialize_database": {
    id: "initialize_database", 
    name: "initialize_database",
    module_id: "database.connection",
    location: { file: "database/connection.py", start_line: 15, end_line: 30, character_start: 0, character_end: 450 },
    signature: {
      parameters: [],
      return_type: "bool"
    },
    calls: [
      { function_id: "create_connection_pool", called_at_location: { file: "database/connection.py", start_line: 20, end_line: 20, character_start: 9, character_end: 31 }, context: "pool = create_connection_pool()" },
      { function_id: "validate_schema", called_at_location: { file: "database/connection.py", start_line: 22, end_line: 22, character_start: 4, character_end: 19 }, context: "validate_schema(pool)" },
      { function_id: "setup_migrations", called_at_location: { file: "database/connection.py", start_line: 24, end_line: 24, character_start: 4, character_end: 20 }, context: "setup_migrations()" }
    ],
    is_classmethod: false,
    is_property: false,
    external_variables_used: [
      { name: "DATABASE_URL", type: "str", line: 5 },
      { name: "logger", type: "Logger", line: 18 }
    ],
    references: [
      { function_id: "main", called_at_location: { file: "app/main.py", start_line: 8, end_line: 8, character_start: 4, character_end: 23 }, context: "initialize_database()" }
    ],
    code: `"""Database connection management"""
import os
import logging
from sqlalchemy import create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/ecommerce")
logger = logging.getLogger(__name__)

def initialize_database():
    """Initialize database connections and setup"""
    logger.info("Initializing database connection")
    
    try:
        # Create connection pool
        pool = create_connection_pool()
        
        # Validate database schema
        validate_schema(pool)
        
        # Setup any pending migrations
        setup_migrations()
        
        logger.info("Database initialized successfully")
        return True
        
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        return False`
  },

  "create_connection_pool": {
    id: "create_connection_pool",
    name: "create_connection_pool", 
    module_id: "database.connection",
    location: { file: "database/connection.py", start_line: 35, end_line: 50, character_start: 0, character_end: 400 },
    signature: {
      parameters: [
        { name: "pool_size", type: "int", default: "10", kind: "keyword" },
        { name: "max_overflow", type: "int", default: "20", kind: "keyword" }
      ],
      return_type: "sqlalchemy.pool.QueuePool"
    },
    calls: [
      { function_id: "get_database_url", called_at_location: { file: "database/connection.py", start_line: 40, end_line: 40, character_start: 15, character_end: 32 }, context: "db_url = get_database_url()" },
      { function_id: "configure_ssl", called_at_location: { file: "database/connection.py", start_line: 42, end_line: 42, character_start: 4, character_end: 18 }, context: "configure_ssl(engine)" }
    ],
    is_classmethod: false,
    is_property: false,
    external_variables_used: [
      { name: "logger", type: "Logger", line: 38 }
    ],
    references: [
      { function_id: "initialize_database", called_at_location: { file: "database/connection.py", start_line: 20, end_line: 20, character_start: 9, character_end: 31 }, context: "pool = create_connection_pool()" }
    ],
    code: `def create_connection_pool(pool_size=10, max_overflow=20):
    """Create database connection pool with specified parameters"""
    logger.info(f"Creating connection pool (size: {pool_size})")
    
    # Get database URL with credentials
    db_url = get_database_url()
    
    # Configure SSL settings
    configure_ssl(engine)
    
    # Create connection pool
    engine = create_engine(
        db_url,
        pool_size=pool_size,
        max_overflow=max_overflow,
        pool_pre_ping=True
    )
    
    return engine`
  },

  "get_database_url": {
    id: "get_database_url",
    name: "get_database_url",
    module_id: "database.config",
    location: { file: "database/config.py", start_line: 10, end_line: 25, character_start: 0, character_end: 350 },
    signature: {
      parameters: [],
      return_type: "str"
    },
    calls: [
      { function_id: "decrypt_credentials", called_at_location: { file: "database/config.py", start_line: 15, end_line: 15, character_start: 20, character_end: 39 }, context: "password = decrypt_credentials(encrypted_pass)" },
      { function_id: "validate_connection_string", called_at_location: { file: "database/config.py", start_line: 20, end_line: 20, character_start: 4, character_end: 31 }, context: "validate_connection_string(url)" }
    ],
    is_classmethod: false,
    is_property: false,
    external_variables_used: [
      { name: "os", type: "module", line: 2 },
      { name: "DB_HOST", type: "str", line: 12 },
      { name: "DB_PORT", type: "str", line: 13 }
    ],
    references: [
      { function_id: "create_connection_pool", called_at_location: { file: "database/connection.py", start_line: 40, end_line: 40, character_start: 15, character_end: 32 }, context: "db_url = get_database_url()" }
    ],
    code: `"""Database configuration utilities"""
import os
from security import decrypt_credentials
from validators import validate_connection_string

def get_database_url():
    """Construct database URL from environment variables"""
    
    # Get connection parameters
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("DB_NAME", "ecommerce")
    DB_USER = os.getenv("DB_USER", "postgres")
    encrypted_pass = os.getenv("DB_PASS_ENCRYPTED")
    
    # Decrypt password
    password = decrypt_credentials(encrypted_pass)
    
    # Construct URL
    url = f"postgresql://{DB_USER}:{password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    # Validate connection string format
    validate_connection_string(url)
    
    return url`
  },

  "decrypt_credentials": {
    id: "decrypt_credentials",
    name: "decrypt_credentials",
    module_id: "security.crypto",
    location: { file: "security/crypto.py", start_line: 25, end_line: 40, character_start: 0, character_end: 380 },
    signature: {
      parameters: [
        { name: "encrypted_data", type: "str", kind: "positional" },
        { name: "key_path", type: "str", default: "'/etc/keys/db.key'", kind: "keyword" }
      ],
      return_type: "str"
    },
    calls: [
      { function_id: "load_encryption_key", called_at_location: { file: "security/crypto.py", start_line: 30, end_line: 30, character_start: 10, character_end: 29 }, context: "key = load_encryption_key(key_path)" },
      { function_id: "aes_decrypt", called_at_location: { file: "security/crypto.py", start_line: 32, end_line: 32, character_start: 15, character_end: 27 }, context: "result = aes_decrypt(encrypted_data, key)" }
    ],
    is_classmethod: false,
    is_property: false,
    external_variables_used: [
      { name: "base64", type: "module", line: 3 },
      { name: "logger", type: "Logger", line: 28 }
    ],
    references: [
      { function_id: "get_database_url", called_at_location: { file: "database/config.py", start_line: 15, end_line: 15, character_start: 20, character_end: 39 }, context: "password = decrypt_credentials(encrypted_pass)" }
    ],
    code: `"""Cryptographic utilities for secure credential management"""
import os
import base64
import logging
from cryptography.fernet import Fernet

logger = logging.getLogger(__name__)

def decrypt_credentials(encrypted_data, key_path="/etc/keys/db.key"):
    """Decrypt credentials using AES encryption"""
    logger.debug("Decrypting database credentials")
    
    try:
        # Load encryption key from secure location
        key = load_encryption_key(key_path)
        
        # Decrypt the data
        result = aes_decrypt(encrypted_data, key)
        
        logger.info("Credentials decrypted successfully")
        return result
        
    except Exception as e:
        logger.error(f"Failed to decrypt credentials: {e}")
        raise SecurityException("Credential decryption failed")`
  },

  "load_encryption_key": {
    id: "load_encryption_key", 
    name: "load_encryption_key",
    module_id: "security.crypto",
    location: { file: "security/crypto.py", start_line: 45, end_line: 55, character_start: 0, character_end: 250 },
    signature: {
      parameters: [
        { name: "key_path", type: "str", kind: "positional" }
      ],
      return_type: "bytes"
    },
    calls: [
      { function_id: "verify_file_permissions", called_at_location: { file: "security/crypto.py", start_line: 48, end_line: 48, character_start: 4, character_end: 28 }, context: "verify_file_permissions(key_path)" }
    ],
    is_classmethod: false,
    is_property: false,
    external_variables_used: [
      { name: "os", type: "module", line: 2 }
    ],
    references: [
      { function_id: "decrypt_credentials", called_at_location: { file: "security/crypto.py", start_line: 30, end_line: 30, character_start: 10, character_end: 29 }, context: "key = load_encryption_key(key_path)" }
    ],
    code: `def load_encryption_key(key_path):
    """Load encryption key from secure file location"""
    
    # Verify file has correct permissions (600)
    verify_file_permissions(key_path)
    
    # Read key file
    with open(key_path, 'rb') as key_file:
        key = key_file.read()
    
    return key`
  },

  "start_analysis_pipeline": {
    id: "start_analysis_pipeline",
    name: "start_analysis_pipeline", 
    module_id: "pipeline.analyzer",
    location: { file: "pipeline/analyzer.py", start_line: 20, end_line: 45, character_start: 0, character_end: 600 },
    signature: {
      parameters: [
        { name: "config", type: "dict", kind: "positional" }
      ],
      return_type: "dict"
    },
    calls: [
      { function_id: "extract_sales_data", called_at_location: { file: "pipeline/analyzer.py", start_line: 28, end_line: 28, character_start: 15, character_end: 33 }, context: "sales_data = extract_sales_data(config)" },
      { function_id: "process_customer_data", called_at_location: { file: "pipeline/analyzer.py", start_line: 30, end_line: 30, character_start: 19, character_end: 40 }, context: "customer_data = process_customer_data(config)" },
      { function_id: "analyze_trends", called_at_location: { file: "pipeline/analyzer.py", start_line: 32, end_line: 32, character_start: 12, character_end: 26 }, context: "trends = analyze_trends(sales_data, customer_data)" }
    ],
    is_classmethod: false,
    is_property: false,
    external_variables_used: [
      { name: "pandas", type: "module", line: 3 },
      { name: "logger", type: "Logger", line: 25 }
    ],
    references: [
      { function_id: "main", called_at_location: { file: "app/main.py", start_line: 12, end_line: 12, character_start: 4, character_end: 29 }, context: "start_analysis_pipeline(config)" }
    ],
    code: `"""Main data analysis pipeline"""
import logging
import pandas as pd
from data import extract_sales_data, process_customer_data
from analytics import analyze_trends

logger = logging.getLogger(__name__)

def start_analysis_pipeline(config):
    """Execute the complete data analysis pipeline"""
    logger.info("Starting analysis pipeline")
    
    pipeline_results = {}
    
    try:
        # Extract sales data from multiple sources
        sales_data = extract_sales_data(config)
        
        # Process customer demographics and behavior
        customer_data = process_customer_data(config)
        
        # Perform trend analysis
        trends = analyze_trends(sales_data, customer_data)
        
        pipeline_results = {
            'sales_data': sales_data,
            'customer_data': customer_data,
            'trends': trends,
            'status': 'completed'
        }
        
        logger.info("Pipeline execution completed successfully")
        return pipeline_results
        
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        raise`
  }
};

export const currentFunctionId = "main";