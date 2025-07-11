# Name Rating Cache System

This document describes the caching system implemented to minimize LLM requests and improve performance.

## Overview

The cache system provides a global, long-running cache for name ratings that:

- Reduces LLM API calls and associated costs
- Improves response times for frequently requested names
- Maintains access statistics for cache optimization
- Automatically cleans up old entries

## Database Schema

### NameCache Table

```sql
model NameCache {
  id          String   @id @default(cuid())
  firstName   String
  lastName    String
  fullName    String
  origin      String?
  popularity  String?
  feedback    String?
  middleNames String[]
  similarNames String[]
  createdAt   DateTime @default(now())
  lastAccessed DateTime @default(now())
  accessCount Int      @default(0)

  @@unique([firstName, lastName], name: "firstName_lastName")
  @@index([firstName, lastName])
  @@index([lastAccessed])
  @@index([accessCount])
}
```

## API Endpoints

### 1. Cache Name Endpoint (`/api/cache-name`)

**POST** - Get name rating with caching

- **Authentication**: None required
- **Parameters**: `{ firstName, lastName, refresh? }`
- **Response**: Name rating data with cache status

**GET** - Check cache only

- **Authentication**: None required
- **Parameters**: `firstName`, `lastName` (query params)
- **Response**: Cached data if available, 404 if not found

### 2. Admin Cache Endpoint (`/api/admin/cache`)

**GET** - Get cache statistics

- **Authentication**: Required
- **Response**: Cache stats including total entries, oldest entry, most accessed

**DELETE** - Clean up old cache entries

- **Authentication**: Required
- **Parameters**: `olderThanDays` (query param, default: 30)
- **Response**: Number of deleted entries

## Cache Priority

The system checks for cached data in this order:

1. **Global Cache** (`NameCache` table) - No user association
2. **User Saved Names** (`SavedName` table) - User-specific saved names
3. **LLM Request** - Fresh API call if not cached

## Usage Examples

### Basic Cache Request

```javascript
// Check cache first, fallback to LLM
const response = await fetch("/api/cache-name", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ firstName: "Emma", lastName: "Smith" }),
});

const result = await response.json();
// result.source: "cache" | "llm"
// result.cached: boolean
```

### Force Refresh

```javascript
// Always get fresh LLM response
const response = await fetch("/api/cache-name", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    firstName: "Emma",
    lastName: "Smith",
    refresh: true,
  }),
});
```

### Check Cache Only

```javascript
// Only check cache, don't call LLM
const response = await fetch("/api/cache-name?firstName=Emma&lastName=Smith");
if (response.status === 404) {
  // Not in cache
}
```

### Admin Operations

```javascript
// Get cache stats
const stats = await fetch("/api/admin/cache");
const { totalEntries, oldestEntry, mostAccessed } = await stats.json();

// Clean old entries
const cleanup = await fetch("/api/admin/cache?olderThanDays=7", {
  method: "DELETE",
});
const { deletedCount } = await cleanup.json();
```

## Cache Management

### Automatic Features

- **Access Tracking**: Each cache hit updates `lastAccessed` and `accessCount`
- **Statistics**: Track most accessed names and cache efficiency
- **Cleanup**: Remove entries older than specified days

### Manual Management

- **Cache Warming**: Pre-populate cache with popular names
- **Performance Testing**: Measure cache hit rates and response times
- **Statistics Monitoring**: Track cache efficiency and usage patterns

## Benefits

1. **Cost Reduction**: Minimize expensive LLM API calls
2. **Performance**: Faster responses for cached names
3. **Scalability**: Handle more requests without increasing LLM costs
4. **Analytics**: Track popular names and usage patterns
5. **Flexibility**: Separate from user data, can be shared across users

## Configuration

### Cache TTL

- Default cleanup: 30 days
- Configurable via `olderThanDays` parameter
- Access-based retention (frequently accessed names stay longer)

### Performance Optimization

- Database indexes on `firstName`, `lastName`, `lastAccessed`, `accessCount`
- Unique constraint prevents duplicate entries
- Efficient lookups via composite key

## Monitoring

Use the admin endpoints to monitor:

- Total cache entries
- Most frequently accessed names
- Cache hit rates
- Storage usage
- Cleanup effectiveness

## Future Enhancements

1. **Redis Integration**: Add Redis for even faster cache access
2. **Cache Warming**: Automatically populate cache with trending names
3. **Analytics Dashboard**: Web interface for cache management
4. **Rate Limiting**: Prevent cache abuse
5. **Compression**: Compress cache data for storage efficiency
