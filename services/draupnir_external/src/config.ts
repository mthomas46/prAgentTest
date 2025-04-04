import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  services: {
    bifrost: string;
    heimdal: string;
  };
  rateLimit: {
    windowMs: number;
    max: number;
    message: string;
  };
  proxy: {
    timeout: number;
    secure: boolean;
    logLevel: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  services: {
    bifrost: process.env.BIFROST_URL || 'http://bifrost:3000',
    heimdal: process.env.HEIMDAL_URL || 'http://heimdal:3000'
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later'
  },
  proxy: {
    timeout: 30000,
    secure: false,
    logLevel: 'debug'
  }
};

export default config; 