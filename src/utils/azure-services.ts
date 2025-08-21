// Azure service utility classes
// Provides standardized interfaces for Azure services

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { ServiceBusClient, ServiceBusSender, ServiceBusReceiver } from '@azure/service-bus';
import { createClient as createRedisClient, RedisClientType } from 'redis';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';
import { OpenAIClient } from '@azure/openai';
import {
  AzureConfiguration,
  AzureKeyVaultConfig,
  AzureRedisConfig,
  AzureCognitiveSearchConfig,
  AzureOpenAIConfig,
  ServiceBusMessage,
  KeyVaultSecretReference
} from '../types/azure';

/**
 * Azure Key Vault client wrapper
 */
export class AzureKeyVaultService {
  private client: SecretClient;
  private cache: Map<string, { value: string; expiry: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(config: AzureKeyVaultConfig) {
    const credential = new DefaultAzureCredential();
    this.client = new SecretClient(config.vaultUri, credential);
  }

  async getSecret(secretName: string): Promise<string | null> {
    try {
      // Check cache first
      const cached = this.cache.get(secretName);
      if (cached && cached.expiry > Date.now()) {
        return cached.value;
      }

      const secret = await this.client.getSecret(secretName);
      const value = secret.value || null;

      // Cache the result
      if (value) {
        this.cache.set(secretName, {
          value,
          expiry: Date.now() + this.cacheTimeout
        });
      }

      return value;
    } catch (error) {
      console.error(`Failed to get secret ${secretName}:`, error);
      return null;
    }
  }

  async setSecret(secretName: string, value: string): Promise<void> {
    try {
      await this.client.setSecret(secretName, value);
      // Update cache
      this.cache.set(secretName, {
        value,
        expiry: Date.now() + this.cacheTimeout
      });
    } catch (error) {
      console.error(`Failed to set secret ${secretName}:`, error);
      throw error;
    }
  }

  async deleteSecret(secretName: string): Promise<void> {
    try {
      await this.client.beginDeleteSecret(secretName);
      this.cache.delete(secretName);
    } catch (error) {
      console.error(`Failed to delete secret ${secretName}:`, error);
      throw error;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Azure Service Bus client wrapper
 */
export class AzureServiceBusService {
  private client: ServiceBusClient;
  private senders: Map<string, ServiceBusSender> = new Map();
  private receivers: Map<string, ServiceBusReceiver> = new Map();

  constructor(connectionString: string) {
    this.client = new ServiceBusClient(connectionString);
  }

  async sendMessage<T = any>(queueName: string, message: ServiceBusMessage<T>): Promise<void> {
    try {
      let sender = this.senders.get(queueName);
      if (!sender) {
        sender = this.client.createSender(queueName);
        this.senders.set(queueName, sender);
      }

      const serviceBusMessage: any = {
        messageId: message.messageId,
        correlationId: message.correlationId || '',
        sessionId: message.sessionId || '',
        subject: message.subject,
        body: message.body,
        contentType: message.contentType || 'application/json'
      };
      
      if (message.timeToLive !== undefined) {
        serviceBusMessage.timeToLive = message.timeToLive;
      }
      if (message.scheduledEnqueueTime !== undefined) {
        serviceBusMessage.scheduledEnqueueTimeUtc = message.scheduledEnqueueTime;
      }
      if (message.properties !== undefined) {
        serviceBusMessage.applicationProperties = message.properties;
      }
      
      await sender.sendMessages(serviceBusMessage);
    } catch (error) {
      console.error(`Failed to send message to queue ${queueName}:`, error);
      throw error;
    }
  }

  async receiveMessages<T = any>(queueName: string, maxMessageCount: number = 1): Promise<ServiceBusMessage<T>[]> {
    try {
      let receiver = this.receivers.get(queueName);
      if (!receiver) {
        receiver = this.client.createReceiver(queueName);
        this.receivers.set(queueName, receiver);
      }

      const messages = await receiver.receiveMessages(maxMessageCount, { maxWaitTimeInMs: 5000 });
      
      return messages.map(msg => ({
        id: String(msg.messageId || ''),
        messageId: String(msg.messageId || ''),
        correlationId: String(msg.correlationId || ''),
        sessionId: String(msg.sessionId || ''),
        subject: String(msg.subject || ''),
        body: msg.body,
        contentType: String(msg.contentType || 'application/json'),
        properties: msg.applicationProperties || {}
      }));
    } catch (error) {
      console.error(`Failed to receive messages from queue ${queueName}:`, error);
      throw error;
    }
  }

  async completeMessage(): Promise<void> {
    // Implementation would depend on message tracking
    // This is a simplified version
  }

  async close(): Promise<void> {
    try {
      // Close all senders
      for (const [, sender] of this.senders) {
        await sender.close();
      }
      this.senders.clear();

      // Close all receivers
      for (const [, receiver] of this.receivers) {
        await receiver.close();
      }
      this.receivers.clear();

      // Close client
      await this.client.close();
    } catch (error) {
      console.error('Failed to close Service Bus client:', error);
    }
  }
}

/**
 * Azure Redis cache client wrapper
 */
export class AzureRedisService {
  private client: RedisClientType | null = null;
  private config: AzureRedisConfig;

  constructor(config: AzureRedisConfig) {
    this.config = config;
  }

  async connect(password: string): Promise<void> {
    try {
      this.client = createRedisClient({
        socket: {
          host: this.config.host,
          port: this.config.port,
          tls: this.config.ssl
        },
        password: password,
        database: this.config.database || 0
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) throw new Error('Redis client not connected');
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Failed to get key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.client) throw new Error('Redis client not connected');
    try {
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error(`Failed to set key ${key}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    if (!this.client) throw new Error('Redis client not connected');
    try {
      return await this.client.del(key);
    } catch (error) {
      console.error(`Failed to delete key ${key}:`, error);
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) throw new Error('Redis client not connected');
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Failed to check existence of key ${key}:`, error);
      return false;
    }
  }

  async hget(key: string, field: string): Promise<string | null> {
    if (!this.client) throw new Error('Redis client not connected');
    try {
      return (await this.client.hGet(key, field)) || null;
    } catch (error) {
      console.error(`Failed to hget ${key}.${field}:`, error);
      return null;
    }
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    if (!this.client) throw new Error('Redis client not connected');
    try {
      await this.client.hSet(key, field, value);
    } catch (error) {
      console.error(`Failed to hset ${key}.${field}:`, error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
    }
  }
}

/**
 * Azure Cognitive Search client wrapper
 */
export class AzureCognitiveSearchService {
  private client: SearchClient<any>;

  constructor(config: AzureCognitiveSearchConfig, adminKey: string) {
    const credential = new AzureKeyCredential(adminKey);
    this.client = new SearchClient(config.endpoint, 'htma-index', credential);
  }

  async search<T = any>(searchText: string, options?: any): Promise<T[]> {
    try {
      const results = await this.client.search(searchText, options);
      const documents: T[] = [];
      
      for await (const result of results.results) {
        documents.push(result.document);
      }
      
      return documents;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }

  async uploadDocuments<T = any>(documents: T[]): Promise<void> {
    try {
      await this.client.uploadDocuments(documents);
    } catch (error) {
      console.error('Document upload failed:', error);
      throw error;
    }
  }

  async deleteDocuments(keys: string[]): Promise<void> {
    try {
      const deleteDocuments = keys.map(key => ({ key }));
      await this.client.deleteDocuments(deleteDocuments);
    } catch (error) {
      console.error('Document deletion failed:', error);
      throw error;
    }
  }
}

/**
 * Azure OpenAI client wrapper
 */
export class AzureOpenAIService {
  private client: OpenAIClient;
  private config: AzureOpenAIConfig;

  constructor(config: AzureOpenAIConfig, apiKey: string) {
    this.config = config;
    const credential = new AzureKeyCredential(apiKey);
    this.client = new OpenAIClient(config.endpoint, credential);
  }

  async createCompletion(messages: any[], options?: any): Promise<any> {
    try {
      const result = await this.client.getChatCompletions(
        this.config.deploymentName,
        messages,
        {
          maxTokens: options?.maxTokens || this.config.maxTokens || 1000,
          temperature: options?.temperature || this.config.temperature || 0.7,
          ...options
        }
      );
      
      return result;
    } catch (error) {
      console.error('OpenAI completion failed:', error);
      throw error;
    }
  }

  async createEmbedding(input: string | string[]): Promise<number[][]> {
    try {
      const result = await this.client.getEmbeddings(
        this.config.embeddingDeployment || 'text-embedding-3-large',
        Array.isArray(input) ? input : [input]
      );
      
      return result.data.map(item => item.embedding);
    } catch (error) {
      console.error('OpenAI embedding failed:', error);
      throw error;
    }
  }
}

/**
 * Configuration resolver for Azure services
 */
export class AzureConfigurationResolver {
  private keyVaultService: AzureKeyVaultService;

  constructor(keyVaultConfig: AzureKeyVaultConfig) {
    this.keyVaultService = new AzureKeyVaultService(keyVaultConfig);
  }

  async resolveSecretReference(reference: KeyVaultSecretReference): Promise<string> {
    const secret = await this.keyVaultService.getSecret(reference.secretName);
    if (!secret) {
      throw new Error(`Failed to resolve secret: ${reference.secretName}`);
    }
    return secret;
  }

  async resolveConfiguration(config: Partial<AzureConfiguration>): Promise<AzureConfiguration> {
    // Resolve all secret references in the configuration
    const resolved = { ...config } as AzureConfiguration;

    // This would be extended to resolve all KeyVaultSecretReference objects
    // in the configuration recursively

    return resolved;
  }
}

/**
 * Azure services factory
 */
export class AzureServicesFactory {
  private config: AzureConfiguration;
  private keyVaultService: AzureKeyVaultService;
  // private _configResolver: AzureConfigurationResolver;

  constructor(config: AzureConfiguration) {
    this.config = config;
    this.keyVaultService = new AzureKeyVaultService(config.keyVault);
    // this._configResolver = new AzureConfigurationResolver(config.keyVault);
  }

  async createServiceBusService(): Promise<AzureServiceBusService> {
    const connectionString = await this.keyVaultService.getSecret('servicebus-connection');
    if (!connectionString) {
      throw new Error('Service Bus connection string not found in Key Vault');
    }
    return new AzureServiceBusService(connectionString);
  }

  async createRedisService(): Promise<AzureRedisService> {
    const redisService = new AzureRedisService(this.config.redis);
    const password = await this.keyVaultService.getSecret('redis-connection');
    if (!password) {
      throw new Error('Redis password not found in Key Vault');
    }
    // Extract password from connection string
    const passwordMatch = password.match(/password=([^,]+)/);
    const redisPassword = passwordMatch ? passwordMatch[1] : password;
    await redisService.connect(redisPassword || '');
    return redisService;
  }

  async createSearchService(): Promise<AzureCognitiveSearchService> {
    const adminKey = await this.keyVaultService.getSecret('search-admin-key');
    if (!adminKey) {
      throw new Error('Search admin key not found in Key Vault');
    }
    return new AzureCognitiveSearchService(this.config.cognitiveSearch, adminKey);
  }

  async createOpenAIService(): Promise<AzureOpenAIService> {
    const apiKey = await this.keyVaultService.getSecret('openai-api-key');
    if (!apiKey) {
      throw new Error('OpenAI API key not found in Key Vault');
    }
    return new AzureOpenAIService(this.config.openAI, apiKey);
  }

  getKeyVaultService(): AzureKeyVaultService {
    return this.keyVaultService;
  }
}
