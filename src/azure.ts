// Azure service configuration types
// Defines types for Azure service integration

export interface AzureKeyVaultConfig {
  vaultName: string;
  vaultUri: string;
  tenantId?: string;
}

export interface AzureServiceBusConfig {
  namespace: string;
  endpoint: string;
  connectionString?: string;
  queues: string[];
  topics?: string[];
}

export interface AzureRedisConfig {
  host: string;
  port: number;
  ssl: boolean;
  password?: string;
  database?: number;
}

export interface AzureCognitiveSearchConfig {
  serviceName: string;
  endpoint: string;
  adminKey?: string;
  queryKey?: string;
  apiVersion?: string;
}

export interface AzureOpenAIConfig {
  endpoint: string;
  apiKey?: string;
  deploymentName: string;
  embeddingDeployment?: string;
  apiVersion?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AzureContainerRegistryConfig {
  loginServer: string;
  name: string;
  username?: string;
  password?: string;
}

export interface AzureStaticWebAppConfig {
  url: string;
  name: string;
  repositoryToken?: string;
}

export interface AzureApplicationInsightsConfig {
  connectionString: string;
  instrumentationKey?: string;
}

export interface AzureConfiguration {
  resourceGroup: string;
  region: string;
  environment: 'development' | 'staging' | 'production';
  keyVault: AzureKeyVaultConfig;
  serviceBus: AzureServiceBusConfig;
  redis: AzureRedisConfig;
  cognitiveSearch: AzureCognitiveSearchConfig;
  openAI: AzureOpenAIConfig;
  containerRegistry: AzureContainerRegistryConfig;
  staticWebApp: AzureStaticWebAppConfig;
  applicationInsights: AzureApplicationInsightsConfig;
}

// Azure Service Bus message types
export interface ServiceBusMessage<T = any> {
  id: string;
  messageId: string;
  correlationId: string;
  sessionId: string;
  subject: string;
  body: T;
  contentType: string;
  timeToLive?: number;
  scheduledEnqueueTime?: Date;
  properties: Record<string, any>;
}

export interface ServiceBusQueueClient {
  sendMessage(message: ServiceBusMessage): Promise<void>;
  sendMessages(messages: ServiceBusMessage[]): Promise<void>;
  receiveMessages(maxMessageCount?: number): Promise<ServiceBusMessage[]>;
  completeMessage(message: ServiceBusMessage): Promise<void>;
  abandonMessage(message: ServiceBusMessage): Promise<void>;
  deadLetterMessage(message: ServiceBusMessage, reason?: string): Promise<void>;
}

// Azure Redis cache operations
export interface AzureRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  del(key: string): Promise<number>;
  exists(key: string): Promise<boolean>;
  expire(key: string, seconds: number): Promise<boolean>;
  hget(key: string, field: string): Promise<string | null>;
  hset(key: string, field: string, value: string): Promise<void>;
  hdel(key: string, ...fields: string[]): Promise<number>;
  lpush(key: string, ...values: string[]): Promise<number>;
  rpop(key: string): Promise<string | null>;
  sadd(key: string, ...members: string[]): Promise<number>;
  smembers(key: string): Promise<string[]>;
}

// Azure Cognitive Search types
export interface SearchIndex {
  name: string;
  fields: SearchField[];
}

export interface SearchField {
  name: string;
  type: 'Edm.String' | 'Edm.Int32' | 'Edm.Double' | 'Edm.Boolean' | 'Edm.DateTimeOffset' | 'Collection(Edm.String)';
  key?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  facetable?: boolean;
  retrievable?: boolean;
}

export interface SearchDocument {
  '@search.action'?: 'upload' | 'merge' | 'mergeOrUpload' | 'delete';
  [key: string]: any;
}

export interface SearchResult<T = any> {
  '@search.score': number;
  '@search.highlights'?: Record<string, string[]>;
  value: T;
}

export interface SearchResponse<T = any> {
  '@odata.count'?: number;
  '@search.coverage'?: number;
  '@search.facets'?: Record<string, any[]>;
  value: SearchResult<T>[];
}

// Azure OpenAI types
export interface OpenAICompletionRequest {
  messages: OpenAIMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
  stream?: boolean;
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

export interface OpenAICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAIChoice {
  index: number;
  message: OpenAIMessage;
  finish_reason: 'stop' | 'length' | 'content_filter' | null;
}

export interface OpenAIEmbeddingRequest {
  input: string | string[];
  model?: string;
  encoding_format?: 'float' | 'base64';
  dimensions?: number;
}

export interface OpenAIEmbeddingResponse {
  object: string;
  data: OpenAIEmbedding[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAIEmbedding {
  object: string;
  index: number;
  embedding: number[];
}

// Azure Key Vault secret reference
export interface KeyVaultSecretReference {
  secretName: string;
  vaultUri: string;
  version?: string;
}

// Environment configuration with Azure secrets
export interface AzureEnvironmentConfig {
  NODE_ENV: string;
  AZURE_TENANT_ID: string;
  AZURE_SUBSCRIPTION_ID: string;
  AZURE_RESOURCE_GROUP: string;
  AZURE_REGION: string;
  
  // Key Vault
  AZURE_KEY_VAULT_NAME: string;
  AZURE_KEY_VAULT_URI: string;
  
  // Service Bus
  AZURE_SERVICE_BUS_NAMESPACE: string;
  AZURE_SERVICE_BUS_CONNECTION_STRING: KeyVaultSecretReference;
  
  // Redis
  AZURE_REDIS_HOST: string;
  AZURE_REDIS_PORT: number;
  AZURE_REDIS_CONNECTION_STRING: KeyVaultSecretReference;
  
  // Cognitive Search
  AZURE_SEARCH_SERVICE_NAME: string;
  AZURE_SEARCH_ENDPOINT: string;
  AZURE_SEARCH_ADMIN_KEY: KeyVaultSecretReference;
  
  // OpenAI
  AZURE_OPENAI_ENDPOINT: string;
  AZURE_OPENAI_API_KEY: KeyVaultSecretReference;
  AZURE_OPENAI_DEPLOYMENT_NAME: string;
  AZURE_OPENAI_EMBEDDING_DEPLOYMENT: string;
  
  // Application Insights
  APPLICATIONINSIGHTS_CONNECTION_STRING: string;
  
  // Container Registry
  AZURE_CONTAINER_REGISTRY_SERVER: string;
  AZURE_CONTAINER_REGISTRY_USERNAME: KeyVaultSecretReference;
  AZURE_CONTAINER_REGISTRY_PASSWORD: KeyVaultSecretReference;
}
