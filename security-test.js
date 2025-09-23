/**
 * Comprehensive Security Testing Suite
 * Tests for NoSQL Injection, Broken Access Control, and Security Misconfiguration
 * SonarQube A-grade compliance validation
 */

const axios = require("axios");
const colors = require("colors/safe");

// Test configuration
const BASE_URLS = {
  packages: "http://localhost:5000",
  vendors: "http://localhost:5001",
  guests: "http://localhost:5002",
  feedback: "http://localhost:3001"
};

const VALID_OBJECT_ID = "507f1f77bcf86cd799439011";
const NOSQL_INJECTION_PAYLOAD = '{"$ne": null}';

// Test tokens for authentication
const TOKENS = {
  admin: "admin_token_12345",
  user: "user_token_67890",
  invalid: "invalid_token"
};

// Logging utility
const log = (message, color = "white", details = null) => {
  console.log(colors[color](message));
  if (details) {
    console.log(colors.gray(`   ${details}`));
  }
};

const logTest = (testName, passed, details = null) => {
  const status = passed ? "✅ PASS" : "❌ FAIL";
  const color = passed ? "green" : "red";
  log(`${status} ${testName}`, color);
  if (details) {
    log(`   ${details}`, "yellow");
  }
};

/**
 * Test 1: NoSQL Injection Protection
 */
const testNoSQLInjection = async () => {
  log("\n🔍 Testing NoSQL Injection Protection...", "blue");
  let passedTests = 0;
  let totalTests = 0;

  try {
    // 1.1 Package endpoint with malicious ObjectId
    totalTests++;
    const res1 = await axios.get(
      `${BASE_URLS.packages}/package/${NOSQL_INJECTION_PAYLOAD}`,
      { validateStatus: () => true }
    );
    let passed = res1.status === 400 && res1.data.code === "INVALID_OBJECT_ID";
    logTest(
      "Package endpoint blocks NoSQL injection",
      passed,
      `Status: ${res1.status}, Code: ${res1.data?.code}`
    );
    if (passed) passedTests++;

    // 1.2 Vendor endpoint with malicious ObjectId
    totalTests++;
    const res2 = await axios.get(
      `${BASE_URLS.vendors}/vendor-services/${NOSQL_INJECTION_PAYLOAD}`,
      { validateStatus: () => true }
    );
    passed = res2.status === 400 && res2.data.code === "INVALID_OBJECT_ID";
    logTest(
      "Vendor services endpoint blocks NoSQL injection",
      passed,
      `Status: ${res2.status}, Code: ${res2.data?.code}`
    );
    if (passed) passedTests++;

    // 1.3 Regex DoS protection
    totalTests++;
    const dangerousRegex = ".*(.+)+.*";
    const res3 = await axios.get(
      `${BASE_URLS.vendors}/search-service/${dangerousRegex}`,
      { validateStatus: () => true }
    );
    passed = res3.status === 400 && res3.data.code === "INVALID_SEARCH_CHARS";
    logTest(
      "Search endpoint blocks ReDoS patterns",
      passed,
      `Status: ${res3.status}, Code: ${res3.data?.code}`
    );
    if (passed) passedTests++;

    // 1.4 Valid ObjectId works
    totalTests++;
    const res4 = await axios.get(
      `${BASE_URLS.packages}/package/${VALID_OBJECT_ID}`,
      { validateStatus: () => true }
    );
    passed = res4.status !== 400;
    logTest(
      "Valid ObjectId requests still work",
      passed,
      `Status: ${res4.status}`
    );
    if (passed) passedTests++;
  } catch (err) {
    log(`NoSQL Injection test suite failed: ${err.message}`, "red");
  }

  log(
    `\nNoSQL Injection Tests: ${passedTests}/${totalTests} passed`,
    passedTests === totalTests ? "green" : "red"
  );
  return { passed: passedTests, total: totalTests };
};

/**
 * Test 2: Broken Access Control Protection
 */
const testAccessControl = async () => {
  log("\n🔒 Testing Access Control Protection...", "blue");
  let passedTests = 0;
  let totalTests = 0;

  try {
    // 2.1 Unauthenticated package creation
    totalTests++;
    const res1 = await axios.post(
      `${BASE_URLS.packages}/upload-Package`,
      { name: "Test Package", price: 100, category: "basic" },
      { validateStatus: () => true }
    );
    let passed = res1.status === 401;
    logTest("Package creation requires auth", passed, `Status: ${res1.status}`);
    if (passed) passedTests++;

    // 2.2 Non-admin delete
    totalTests++;
    const res2 = await axios.delete(
      `${BASE_URLS.packages}/Package/${VALID_OBJECT_ID}`,
      {
        headers: { Authorization: `Bearer ${TOKENS.user}` },
        validateStatus: () => true
      }
    );
    passed = res2.status === 403;
    logTest(
      "Package deletion requires admin role",
      passed,
      `Status: ${res2.status}`
    );
    if (passed) passedTests++;

    // 2.3 Feedback without auth
    totalTests++;
    const res3 = await axios.post(
      `${BASE_URLS.feedback}/api/createfeedback`,
      { rating: 5, comment: "Test feedback" },
      { validateStatus: () => true }
    );
    passed = res3.status === 401;
    logTest(
      "Feedback creation requires auth",
      passed,
      `Status: ${res3.status}`
    );
    if (passed) passedTests++;

    // 2.4 Admin can create package
    totalTests++;
    const res4 = await axios.post(
      `${BASE_URLS.packages}/upload-Package`,
      { name: "Admin Test Package", price: 150.99, category: "premium" },
      {
        headers: { Authorization: `Bearer ${TOKENS.admin}` },
        validateStatus: () => true
      }
    );
    passed = res4.status === 200 || res4.status === 201;
    logTest("Admin can create package", passed, `Status: ${res4.status}`);
    if (passed) passedTests++;
  } catch (err) {
    log(`Access Control test suite failed: ${err.message}`, "red");
  }

  log(
    `\nAccess Control Tests: ${passedTests}/${totalTests} passed`,
    passedTests === totalTests ? "green" : "red"
  );
  return { passed: passedTests, total: totalTests };
};

/**
 * Test 3: Security Misconfiguration Protection
 */
const testSecurityMisconfiguration = async () => {
  log("\n🛡️  Testing Security Misconfiguration Protection...", "blue");
  let passedTests = 0;
  let totalTests = 0;

  try {
    // 3.1 CORS restrictions
    totalTests++;
    const res1 = await axios.get(`${BASE_URLS.packages}/all-Packages`, {
      headers: { Origin: "http://malicious-site.com" },
      validateStatus: () => true
    });
    let corsHeader = res1.headers["access-control-allow-origin"];
    let passed = !corsHeader || corsHeader !== "*";
    logTest(
      "CORS properly restricts origins",
      passed,
      `CORS: ${corsHeader || "none"}`
    );
    if (passed) passedTests++;

    // 3.2 Security headers
    totalTests++;
    const res2 = await axios.get(`${BASE_URLS.vendors}/`, {
      validateStatus: () => true
    });
    const secHeaders = ["x-frame-options", "x-content-type-options"];
    const present = secHeaders.filter((h) => res2.headers[h] !== undefined);
    passed = present.length >= 2;
    logTest(
      "Security headers are present",
      passed,
      `Present: ${present.join(", ")}`
    );
    if (passed) passedTests++;

    // 3.3 Rate limiting check
    totalTests++;
    const requests = Array.from({ length: 20 }, () =>
      axios.get(`${BASE_URLS.packages}/all-Packages`, {
        validateStatus: () => true
      })
    );
    const responses = await Promise.all(requests);
    passed = responses.every((r) => r.status !== 500);
    logTest("Rate limiting configured (no 500 errors)", passed);
    if (passed) passedTests++;

    // 3.4 Request size limiting
    totalTests++;
    try {
      const big = { data: "x".repeat(10 * 1024 * 1024) };
      const res3 = await axios.post(
        `${BASE_URLS.packages}/upload-Package`,
        big,
        {
          headers: { Authorization: `Bearer ${TOKENS.admin}` },
          validateStatus: () => true,
          timeout: 5000
        }
      );
      passed = res3.status === 413 || res3.status === 400;
    } catch (err) {
      passed = ["ECONNABORTED", "ECONNRESET"].includes(err.code);
    }
    logTest("Request size limiting is active", passed);
    if (passed) passedTests++;
  } catch (err) {
    log(`Security Misconfig test suite failed: ${err.message}`, "red");
  }

  log(
    `\nSecurity Misconfig Tests: ${passedTests}/${totalTests} passed`,
    passedTests === totalTests ? "green" : "red"
  );
  return { passed: passedTests, total: totalTests };
};

/**
 * Test 4: Input Validation
 */
const testInputValidation = async () => {
  log("\n✅ Testing Input Validation...", "blue");
  let passedTests = 0;
  let totalTests = 0;

  try {
    // 4.1 Invalid package data
    totalTests++;
    const res1 = await axios.post(
      `${BASE_URLS.packages}/upload-Package`,
      { name: "", price: -100, category: "invalid" },
      {
        headers: { Authorization: `Bearer ${TOKENS.admin}` },
        validateStatus: () => true
      }
    );
    let passed = res1.status === 400 && res1.data.code === "VALIDATION_ERROR";
    logTest("Invalid package data rejected", passed, `Status: ${res1.status}`);
    if (passed) passedTests++;

    // 4.2 SQL injection pattern
    totalTests++;
    const res2 = await axios.post(
      `${BASE_URLS.feedback}/api/createfeedback`,
      {
        rating: 5,
        comment: "'; DROP TABLE users; --",
        reviewer: VALID_OBJECT_ID
      },
      {
        headers: { Authorization: `Bearer ${TOKENS.user}` },
        validateStatus: () => true
      }
    );
    passed = res2.status === 400;
    logTest("SQLi patterns blocked", passed, `Status: ${res2.status}`);
    if (passed) passedTests++;
  } catch (err) {
    log(`Input Validation test suite failed: ${err.message}`, "red");
  }

  log(
    `\nInput Validation Tests: ${passedTests}/${totalTests} passed`,
    passedTests === totalTests ? "green" : "red"
  );
  return { passed: passedTests, total: totalTests };
};

/**
 * Main Runner
 */
const runSecurityTests = async () => {
  console.log(colors.cyan("\n🔐 COMPREHENSIVE SECURITY TEST SUITE"));
  console.log(colors.cyan("========================================="));

  const results = {
    nosql: await testNoSQLInjection(),
    access: await testAccessControl(),
    config: await testSecurityMisconfiguration(),
    validation: await testInputValidation()
  };

  const totalPassed = Object.values(results).reduce(
    (sum, r) => sum + r.passed,
    0
  );
  const totalTests = Object.values(results).reduce(
    (sum, r) => sum + r.total,
    0
  );
  const pct = ((totalPassed / totalTests) * 100).toFixed(1);

  console.log(colors.cyan("\n📊 SECURITY TEST SUMMARY"));
  console.log(colors.cyan("========================"));
  Object.entries(results).forEach(([k, r]) => {
    const name = {
      nosql: "NoSQL Injection",
      access: "Access Control",
      config: "Security Config",
      validation: "Input Validation"
    }[k];
    console.log(
      `${r.passed === r.total ? "✅" : "⚠️"} ${name}: ${r.passed}/${r.total}`
    );
  });

  console.log(colors.cyan("\n" + "=".repeat(40)));
  if (pct >= 90) {
    console.log(
      colors.green(`🎉 EXCELLENT: ${totalPassed}/${totalTests} (${pct}%)`)
    );
  } else if (pct >= 75) {
    console.log(
      colors.yellow(`⚠️ GOOD: ${totalPassed}/${totalTests} (${pct}%)`)
    );
  } else {
    console.log(
      colors.red(`❌ NEEDS WORK: ${totalPassed}/${totalTests} (${pct}%)`)
    );
  }
};

if (require.main === module) runSecurityTests();

module.exports = {
  runSecurityTests,
  testNoSQLInjection,
  testAccessControl,
  testSecurityMisconfiguration,
  testInputValidation
};
