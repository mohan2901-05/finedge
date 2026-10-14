package com.finedge.lambda;

import com.amazonaws.serverless.proxy.model.ApiGatewayRequestIdentity;
import com.amazonaws.serverless.proxy.model.AwsProxyRequest;
import com.amazonaws.serverless.proxy.model.AwsProxyRequestContext;
import com.amazonaws.serverless.proxy.model.AwsProxyResponse;
import com.amazonaws.serverless.proxy.model.SingleValueHeaders;
import com.amazonaws.serverless.proxy.spring.SpringBootLambdaContainerHandler;
import com.amazonaws.services.lambda.runtime.ClientContext;
import com.amazonaws.services.lambda.runtime.CognitoIdentity;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for {@link StreamLambdaHandler}.
 * Verifies that the Spring Boot Lambda container handler initializes successfully
 * and can process a direct proxy request to the dashboard endpoint.
 */
class StreamLambdaHandlerTest {

    private static final Context mockContext = new DummyContext();

    @Test
    @DisplayName("Handler should initialize without error")
    void testHandlerInitialization() {
        SpringBootLambdaContainerHandler<AwsProxyRequest, AwsProxyResponse> handler =
                StreamLambdaHandler.getHandler();
        assertNotNull(handler, "Handler should not be null after static initialization");
    }

    @Test
    @DisplayName("Proxy GET /api/dashboard/summary returns 200 with JSON body")
    void testDirectProxy() {
        SpringBootLambdaContainerHandler<AwsProxyRequest, AwsProxyResponse> handler =
                StreamLambdaHandler.getHandler();
        assertNotNull(handler, "Handler should not be null");

        AwsProxyRequest request = new AwsProxyRequest();
        request.setHttpMethod("GET");
        request.setPath("/api/dashboard/summary");

        // Set headers — SingleValueHeaders extends TreeMap<String, String>
        SingleValueHeaders headers = new SingleValueHeaders();
        headers.put("Accept", "application/json");
        headers.put("Host", "localhost");
        request.setHeaders(headers);

        // Build a fully-populated AwsProxyRequestContext to avoid NPEs
        // in the AWS serverless container's internal filter chain.
        AwsProxyRequestContext rc = new AwsProxyRequestContext();
        rc.setHttpMethod("GET");
        rc.setPath("/api/dashboard/summary");
        rc.setStage("dev");
        rc.setAccountId("123456789012");
        rc.setResourceId("abc123");
        rc.setResourcePath("/api/dashboard/summary");
        rc.setRequestId("test-request-id");
        rc.setApiId("testapi");

        // The identity object is REQUIRED — doFilter calls getIdentity().getAccessKey()
        ApiGatewayRequestIdentity identity = new ApiGatewayRequestIdentity();
        identity.setAccessKey(null);
        identity.setAccountId("123456789012");
        identity.setApiKey(null);
        identity.setCaller(null);
        identity.setSourceIp("127.0.0.1");
        identity.setUser(null);
        identity.setUserAgent("JUnit/5");
        identity.setUserArn(null);
        rc.setIdentity(identity);

        request.setRequestContext(rc);

        AwsProxyResponse response = handler.proxy(request, mockContext);
        System.out.println("PROXY_STATUS = " + response.getStatusCode());
        System.out.println("PROXY_BODY = " + response.getBody());

        assertEquals(200, response.getStatusCode(), "Expected 200 OK from /api/dashboard/summary");
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("totalCustomers"));
    }

    /**
     * Minimal AWS Lambda Context stub for testing.
     */
    private static class DummyContext implements Context {
        @Override public String getAwsRequestId() { return "req-test-001"; }
        @Override public String getLogGroupName() { return "/aws/lambda/finedge-backend"; }
        @Override public String getLogStreamName() { return "test-log-stream"; }
        @Override public String getFunctionName() { return "finedge-backend"; }
        @Override public String getFunctionVersion() { return "$LATEST"; }
        @Override public String getInvokedFunctionArn() { return "arn:aws:lambda:us-east-1:123456789:function:finedge-backend"; }
        @Override public CognitoIdentity getIdentity() { return null; }
        @Override public ClientContext getClientContext() { return null; }
        @Override public int getRemainingTimeInMillis() { return 300000; }
        @Override public int getMemoryLimitInMB() { return 512; }
        @Override public LambdaLogger getLogger() {
            return new LambdaLogger() {
                @Override public void log(String s) { System.out.println("LAMBDA_LOG: " + s); }
                @Override public void log(byte[] bytes) { System.out.println("LAMBDA_LOG: " + new String(bytes)); }
            };
        }
    }
}
