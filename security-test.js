#!/usr/bin/env node

/**
 * Security Testing Script for Wedding Management System
 * Tests the 3 main vulnerabilities: NoSQL Injection, Access Control, Security Misconfiguration
 */

const axios = require("axios");

// Configuration
const BASE_URL = "http://localhost:8000"; // Adjust based on your server
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
};

// Helper functions
const log = (message, color = "reset") => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logTest = (testName, passed, details = "") => {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    log(`✅ ${testName}`, "green");
  } else {
    testResults.failed++;
    log(`❌ ${testName}`, "red");
    if (details) log(`   ${details}`, "yellow");
  }
};

// Test 1: NoSQL Injection Tests
const testNoSQLInjection = async () => {
  log("\n🔍 Testing NoSQL Injection Protection...", "blue");

  try {
    // Test 1.1: Basic injection attempt
    const maliciousId = '{"$ne": null}';
    const response1 = await axios.get(`${BASE_URL}/api/guests/${maliciousId}`, {
      validateStatus: () => true,
    });

    logTest(
      "NoSQL Injection in ID parameter blocked",
      response1.status === 400,
      `Status: ${response1.status}, Expected: 400`
    );

    // Test 1.2: Query parameter injection
    const response2 = await axios.get(`${BASE_URL}/api/guests/search`, {
      params: { search: '{"$where": "1==1"}' },
      validateStatus: () => true,
    });

    logTest(
      "Search query injection sanitized",
      !response2.data ||
        !Array.isArray(response2.data) ||
        response2.data.length === 0,
      `Response contained data: ${JSON.stringify(response2.data).substring(
        0,
        100
      )}`
    );

    // Test 1.3: Valid ObjectId should work
    const validId = "507f1f77bcf86cd799439011";
    const response3 = await axios.get(`${BASE_URL}/api/guests/${validId}`, {
      validateStatus: () => true,
    });

    logTest(
      "Valid ObjectId still works",
      response3.status !== 400,
      `Status: ${response3.status}`
    );
  } catch (error) {
    logTest("NoSQL Injection test failed", false, error.message);
  }
};

// Test 2: Access Control Tests
const testAccessControl = async () => {
  log("\n🔐 Testing Access Control...", "blue");

  try {
    // Test 2.1: Unauthenticated access to protected resource
    const response1 = await axios.delete(
      `${BASE_URL}/api/Package/507f1f77bcf86cd799439011`,
      {
        validateStatus: () => true,
      }
    );

    logTest(
      "Unauthenticated deletion blocked",
      response1.status === 401,
      `Status: ${response1.status}, Expected: 401`
    );

    // Test 2.2: Package creation without admin role
    const response2 = await axios.post(
      `${BASE_URL}/upload-Package`,
      {
        PackageName: "Test Package",
        PackageDescription: "Test Description",
        category: "Standard Package",
        packageprice: 1000,
        imageurl: "https://example.com/image.jpg",
      },
      {
        validateStatus: () => true,
      }
    );

    logTest(
      "Package creation requires authentication",
      response2.status === 401,
      `Status: ${response2.status}, Expected: 401`
    );

    // Test 2.3: Access to other user's resources
    const response3 = await axios.get(
      `${BASE_URL}/api/guests/another-users-event-id`,
      {
        headers: { Authorization: "Bearer fake-token" },
        validateStatus: () => true,
      }
    );

    logTest(
      "Cross-user resource access blocked",
      response3.status >= 401 && response3.status <= 403,
      `Status: ${response3.status}, Expected: 401-403`
    );
  } catch (error) {
    logTest("Access Control test failed", false, error.message);
  }
};

// Test 3: Security Misconfiguration Tests
const testSecurityHeaders = async () => {
  log("\n🛡️ Testing Security Headers...", "blue");

  try {
    const response = await axios.get(`${BASE_URL}/`, {
      validateStatus: () => true,
    });

    const headers = response.headers;

    // Test security headers
    logTest(
      "X-Frame-Options header present",
      !!headers["x-frame-options"],
      `Value: ${headers["x-frame-options"]}`
    );

    logTest(
      "X-Content-Type-Options header present",
      !!headers["x-content-type-options"],
      `Value: ${headers["x-content-type-options"]}`
    );

    logTest(
      "Content-Security-Policy header present",
      !!headers["content-security-policy"],
      `Present: ${!!headers["content-security-policy"]}`
    );

    logTest(
      "X-Powered-By header hidden",
      !headers["x-powered-by"],
      `X-Powered-By: ${headers["x-powered-by"] || "hidden"}`
    );

    logTest(
      "Strict-Transport-Security header present",
      !!headers["strict-transport-security"],
      `Value: ${headers["strict-transport-security"]}`
    );
  } catch (error) {
    logTest("Security Headers test failed", false, error.message);
  }
};

// Test 4: CORS Configuration Tests
const testCORS = async () => {
  log("\n🌐 Testing CORS Configuration...", "blue");

  try {
    // Test CORS preflight request
    const response = await axios.options(`${BASE_URL}/api/guests`, {
      headers: {
        Origin: "https://malicious-site.com",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Content-Type",
      },
      validateStatus: () => true,
    });

    const corsHeader = response.headers["access-control-allow-origin"];

    logTest(
      "CORS blocks unauthorized origins",
      !corsHeader || corsHeader !== "*",
      `Access-Control-Allow-Origin: ${corsHeader || "not set"}`
    );

    // Test allowed origin
    const response2 = await axios.options(`${BASE_URL}/api/guests`, {
      headers: {
        Origin: "http://localhost:3000",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Content-Type",
      },
      validateStatus: () => true,
    });

    logTest(
      "CORS allows legitimate origins",
      response2.status < 400,
      `Status: ${response2.status}`
    );
  } catch (error) {
    logTest("CORS test failed", false, error.message);
  }
};

// Test 5: Input Validation Tests
const testInputValidation = async () => {
  log("\n✅ Testing Input Validation...", "blue");

  try {
    // Test invalid package data
    const response1 = await axios.post(
      `${BASE_URL}/upload-Package`,
      {
        PackageName: "a", // Too short
        PackageDescription: "short", // Too short
        category: "Invalid Category", // Not allowed
        packageprice: -100, // Negative price
        imageurl: "not-a-url", // Invalid URL
      },
      {
        validateStatus: () => true,
      }
    );

    logTest(
      "Invalid input data rejected",
      response1.status === 400,
      `Status: ${response1.status}, Expected: 400`
    );

    // Test XSS attempt
    const response2 = await axios.post(
      `${BASE_URL}/upload-Package`,
      {
        PackageName: '<script>alert("xss")</script>',
        PackageDescription: '<img src=x onerror=alert("xss")>',
        category: "Standard Package",
        packageprice: 1000,
        imageurl: "https://example.com/image.jpg",
      },
      {
        validateStatus: () => true,
      }
    );

    logTest(
      "XSS payloads in input handled",
      response2.status >= 400,
      `Status: ${response2.status}`
    );
  } catch (error) {
    logTest("Input Validation test failed", false, error.message);
  }
};

// Main test runner
const runSecurityTests = async () => {
  log("🔒 Wedding Management System Security Test Suite", "blue");
  log("=".repeat(50), "blue");

  // Check if server is running
  try {
    await axios.get(`${BASE_URL}/`, { timeout: 5000 });
    log("✅ Server is running", "green");
  } catch (error) {
    log("❌ Server is not accessible. Please start the server first.", "red");
    log(`   Trying to connect to: ${BASE_URL}`, "yellow");
    process.exit(1);
  }

  // Run all tests
  await testNoSQLInjection();
  await testAccessControl();
  await testSecurityHeaders();
  await testCORS();
  await testInputValidation();

  // Summary
  log("\n📊 Test Results Summary", "blue");
  log("=".repeat(50), "blue");
  log(`Total Tests: ${testResults.total}`, "blue");
  log(`Passed: ${testResults.passed}`, "green");
  log(`Failed: ${testResults.failed}`, "red");

  const percentage = ((testResults.passed / testResults.total) * 100).toFixed(
    1
  );
  log(`Success Rate: ${percentage}%`, percentage > 80 ? "green" : "yellow");

  if (testResults.failed === 0) {
    log(
      "\n🎉 All security tests passed! Your application is well protected.",
      "green"
    );
  } else {
    log(
      `\n⚠️  ${testResults.failed} test(s) failed. Please review the security issues above.`,
      "yellow"
    );
  }
};

// Run tests if this script is executed directly
if (require.main === module) {
  runSecurityTests().catch((error) => {
    log(`\n💥 Test suite failed: ${error.message}`, "red");
    process.exit(1);
  });
}

module.exports = { runSecurityTests };
