import { Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

export enum CacheStrategy {
  LRU = 'LRU',
  LFU = 'LFU',
  FIFO = 'FIFO',
  TTL = 'TTL',
}

@Injectable()
export class CachingStrategyService {
  private readonly logger = new Logger(CachingStrategyService.name);
  private readonly DEFAULT_TTL = 300; // 5 minutes
  private readonly MAX_ITEMS = 1000;

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async get<T>(key: string, strategy: CacheStrategy = CacheStrategy.LRU): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      if (value) {
        await this.updateCacheStats(key, strategy);
      }
      return value;
    } catch (error) {
      this.logger.error(`Cache get error: ${error.message}`, error.stack);
      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    strategy: CacheStrategy = CacheStrategy.LRU,
    ttl?: number,
  ): Promise<void> {
    try {
      const cacheOptions = this.getCacheOptions(strategy, ttl);
      await this.cacheManager.set(key, value, cacheOptions.ttl);
      await this.updateCacheStats(key, strategy);
      await this.cleanupCacheIfNeeded(strategy);
    } catch (error) {
      this.logger.error(`Cache set error: ${error.message}`, error.stack);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Cache delete error: ${error.message}`, error.stack);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.cacheManager.reset();
    } catch (error) {
      this.logger.error(`Cache clear error: ${error.message}`, error.stack);
    }
  }

  private getCacheOptions(strategy: CacheStrategy, ttl?: number) {
    switch (strategy) {
      case CacheStrategy.LRU:
        return { ttl: ttl || this.DEFAULT_TTL };
      case CacheStrategy.LFU:
        return { ttl: ttl || this.DEFAULT_TTL };
      case CacheStrategy.FIFO:
        return { ttl: ttl || this.DEFAULT_TTL };
      case CacheStrategy.TTL:
        return { ttl: ttl || this.DEFAULT_TTL };
      default:
        return { ttl: this.DEFAULT_TTL };
    }
  }

  private async updateCacheStats(key: string, strategy: CacheStrategy): Promise<void> {
    const statsKey = `cache_stats_${strategy}`;
    const stats = await this.cacheManager.get<Record<string, number>>(statsKey) || {};
    
    switch (strategy) {
      case CacheStrategy.LRU:
        stats[key] = Date.now();
        break;
      case CacheStrategy.LFU:
        stats[key] = (stats[key] || 0) + 1;
        break;
    }

    await this.cacheManager.set(statsKey, stats);
  }

  private async cleanupCacheIfNeeded(strategy: CacheStrategy): Promise<void> {
    const statsKey = `cache_stats_${strategy}`;
    const stats = await this.cacheManager.get<Record<string, number>>(statsKey) || {};
    
    if (Object.keys(stats).length > this.MAX_ITEMS) {
      switch (strategy) {
        case CacheStrategy.LRU:
          const lruKey = Object.entries(stats)
            .sort(([, a], [, b]) => a - b)[0][0];
          await this.delete(lruKey);
          delete stats[lruKey];
          break;
        case CacheStrategy.LFU:
          const lfuKey = Object.entries(stats)
            .sort(([, a], [, b]) => b - a)[0][0];
          await this.delete(lfuKey);
          delete stats[lfuKey];
          break;
      }
      await this.cacheManager.set(statsKey, stats);
    }
  }
} 