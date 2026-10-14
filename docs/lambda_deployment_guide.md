# FinEdge — AWS Lambda Deployment Guide

## Overview

The FinEdge backend is built as a standard Spring Boot 3 web application that runs **both** as a traditional standalone server (for local development) **and** as an AWS Lambda function behind API Gateway (for production).

This dual-mode capability is powered by [aws-serverless-java-container-springboot3](https://github.com/awslabs/aws-serverless-java-container), which translates API Gateway proxy events into Spring MVC `HttpServletRequest`/`HttpServletResponse` objects.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    AWS Cloud                              │
│                                                          │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────┐   │
│  │ API      │───>│ Lambda       │───>│ RDS MySQL     │   │
│  │ Gateway  │    │ (Spring Boot)│    │ (finedgedb)   │   │
│  │ REST API │<───│ StreamLambda │<───│               │   │
│  │          │    │ Handler      │    │               │   │
│  └──────────┘    └──────────────┘    └───────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `backend/src/main/java/com/finedge/lambda/StreamLambdaHandler.java` | Lambda entry point — adapts API Gateway requests to Spring Boot |
| `backend/src/main/resources/application-lambda.yml` | Lambda-specific config (reduced pool, SSL, CloudWatch logging) |
| `backend/pom.xml` (profile: `lambda`) | Shade plugin to build an uber-JAR excluding Tomcat |
| `infrastructure/template.yaml` | AWS SAM template defining Lambda, API Gateway, and parameters |
| `infrastructure/samconfig.json` | SAM CLI deployment configuration |

## Build Modes

### 1. Local Development (Spring Boot standalone)

```bash
# From backend/ directory
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
# Runs on http://localhost:8080 with MySQL
```

Or with the default H2 in-memory database:
```bash
mvnw.cmd spring-boot:run
# Runs on http://localhost:8080 with H2 (zero-setup)
```

### 2. Lambda Uber-JAR Build

```bash
# From backend/ directory
mvnw.cmd clean package -Plambda -DskipTests
# Output: target/finedge-backend-1.0.0-SNAPSHOT.jar (shaded uber-JAR)
```

The `lambda` Maven profile:
- **Skips** `spring-boot-maven-plugin` (no nested Boot JAR)
- **Activates** `maven-shade-plugin` to produce a flat uber-JAR
- **Excludes** `org.apache.tomcat.embed:*` (Lambda doesn't need an embedded server)
- **Merges** Spring META-INF service files correctly

## Deployment with AWS SAM

### Prerequisites

1. [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) installed
2. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) configured with credentials
3. An existing MySQL/RDS instance accessible from Lambda's VPC

### Deploy Steps

```bash
# 1. Build the Lambda JAR
cd backend
mvnw.cmd clean package -Plambda -DskipTests

# 2. Deploy with SAM
cd ../infrastructure
sam deploy --guided \
  --parameter-overrides \
    StageName=dev \
    DbHost=your-rds-endpoint.amazonaws.com \
    DbPort=3306 \
    DbName=finedgedb \
    DbUsername=admin \
    DbPassword=YourSecurePassword
```

### SnapStart (Cold-Start Optimization)

The SAM template enables [Lambda SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html) which:
- Takes a snapshot of the initialized JVM after Spring Boot starts
- Restores from snapshot on subsequent cold starts
- Reduces cold-start latency from ~8-15 seconds to ~1-2 seconds

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Spring profile to activate | `lambda` |
| `DB_HOST` | MySQL/RDS hostname | (required) |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database name | `finedgedb` |
| `DB_USERNAME` | Database username | (required) |
| `DB_PASSWORD` | Database password | (required) |
| `FINEDGE_CORS_ALLOWED_ORIGINS` | CORS origins | `http://localhost:4200` |

## Testing the Lambda Handler Locally

### Unit Tests

```bash
cd backend
mvnw.cmd test
# Includes StreamLambdaHandlerTest — validates handler initialization and proxy routing
```

### SAM Local Invoke (requires Docker + SAM CLI)

```bash
cd infrastructure

# Invoke with a sample API Gateway event
sam local invoke FinEdgeLambdaFunction \
  --event events/api-gateway-get-dashboard.json \
  --parameter-overrides DbHost=host.docker.internal DbPort=3306 DbName=finedgedb DbUsername=root DbPassword=rootpassword

# Start a local API Gateway proxy
sam local start-api \
  --parameter-overrides DbHost=host.docker.internal DbPort=3306 DbName=finedgedb DbUsername=root DbPassword=rootpassword
# Then: curl http://127.0.0.1:3000/api/dashboard/summary
```

## Connection Pool Tuning for Lambda

The `application-lambda.yml` profile uses aggressive connection pool settings appropriate for Lambda's ephemeral lifecycle:

| Setting | Value | Rationale |
|---------|-------|-----------|
| `maximum-pool-size` | 5 | Lambda instances are single-request; small pool prevents RDS connection exhaustion |
| `minimum-idle` | 1 | Keep one warm connection ready |
| `idle-timeout` | 120s | Reclaim idle connections quickly |
| `max-lifetime` | 600s | Align with Lambda's freeze/thaw cycle |
| `connection-timeout` | 10s | Fail fast if RDS is unreachable |
