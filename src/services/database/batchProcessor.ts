import { supabase } from './supabaseClient';
import PQueue from 'p-queue';

export interface BatchConfig {
  batchSize: number;
  maxConcurrency: number;
  retryAttempts: number;
  retryDelay: number;
}

export const defaultBatchConfig: BatchConfig = {
  batchSize: 100, // Process 100 records at a time
  maxConcurrency: 5, // Max 5 concurrent operations
  retryAttempts: 3,
  retryDelay: 1000 // 1 second delay between retries
};

export class BatchProcessor {
  private queue: PQueue;
  private config: BatchConfig;

  constructor(config: BatchConfig = defaultBatchConfig) {
    this.config = config;
    this.queue = new PQueue({ 
      concurrency: config.maxConcurrency,
      interval: 1000, // Rate limiting: max operations per second
      intervalCap: config.maxConcurrency
    });
  }

  // Batch insert data into Supabase with optimized performance
  async batchInsert(data: any[], tableName: string = 'changes_data'): Promise<{
    success: boolean;
    inserted: number;
    failed: number;
    errors: string[];
  }> {
    const results = {
      success: true,
      inserted: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Split data into batches
    const batches = this.createBatches(data, this.config.batchSize);
    console.log(`Processing ${data.length} records in ${batches.length} batches of ${this.config.batchSize}`);

    // Process batches with queue management
    const batchPromises = batches.map((batch, index) => 
      this.queue.add(() => this.processBatch(batch, tableName, index))
    );

    const batchResults = await Promise.allSettled(batchPromises);

    // Aggregate results
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.inserted += result.value.inserted;
        results.failed += result.value.failed;
        results.errors.push(...result.value.errors);
      } else {
        results.failed += batches[index].length;
        results.errors.push(`Batch ${index} failed: ${result.reason}`);
        results.success = false;
      }
    });

    console.log(`Batch processing complete: ${results.inserted} inserted, ${results.failed} failed`);
    return results;
  }

  // Process individual batch with retry logic
  private async processBatch(batch: any[], tableName: string, batchIndex: number): Promise<{
    inserted: number;
    failed: number;
    errors: string[];
  }> {
    const result = { inserted: 0, failed: 0, errors: [] as string[] };

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        if (!supabase) {
          throw new Error('Supabase client not configured');
        }

        const { data, error } = await supabase
          .from(tableName)
          .insert(batch)
          .select('id');

        if (error) {
          throw error;
        }

        result.inserted = data?.length || batch.length;
        console.log(`✓ Batch ${batchIndex} (${batch.length} records) - Attempt ${attempt}`);
        return result;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`✗ Batch ${batchIndex} failed (Attempt ${attempt}/${this.config.retryAttempts}):`, errorMessage);

        if (attempt === this.config.retryAttempts) {
          result.failed = batch.length;
          result.errors.push(`Batch ${batchIndex}: ${errorMessage}`);
          return result;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
      }
    }

    return result;
  }

  // Create batches from array
  private createBatches<T>(array: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  // Get queue statistics
  getQueueStats() {
    return {
      size: this.queue.size,
      pending: this.queue.pending,
      isPaused: this.queue.isPaused
    };
  }

  // Clear queue
  clear() {
    this.queue.clear();
  }

  // Pause processing
  pause() {
    this.queue.pause();
  }

  // Resume processing
  start() {
    this.queue.start();
  }
}

// Singleton instance for global use
export const batchProcessor = new BatchProcessor();
