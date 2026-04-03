const baseUrl = "http://localhost:3000/api/auth";

async function runTests() {
  console.log("Starting Auth Tests...");

  try {
    // 1. Register
    console.log("\n1. Testing Registration...");
    const regRes = await fetch(`${baseUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `test_${Date.now()}@example.com`,
        password: "password123",
      }),
    });
    const regData = await regRes.json();
    console.log("Registration Status:", regRes.status);
    console.log("Registration Data:", regData);

    const cookie = regRes.headers.get("set-cookie");
    console.log("Session Cookie received:", cookie ? "Yes" : "No");

    // 2. Get Current User (should work because regRes set-cookie)
    // In a real test we'd need to pass the cookie back
    console.log("\n2. Testing Get Current User (with cookie)...");
    const meRes = await fetch(`${baseUrl}/me`, {
      headers: {
        cookie: cookie || "",
      },
    });
    const meData = await meRes.json();
    console.log("Get Me Status:", meRes.status);
    console.log("Get Me Data:", meData);

    // 3. Logout
    console.log("\n3. Testing Logout...");
    const logoutRes = await fetch(`${baseUrl}/logout`, {
      method: "POST",
      headers: {
        cookie: cookie || "",
      },
    });
    console.log("Logout Status:", logoutRes.status);

    // 4. Get Me again (should fail)
    console.log("\n4. Testing Get Me after logout...");
    const meRes2 = await fetch(`${baseUrl}/me`, {
      headers: {
        cookie: cookie || "",
      },
    });
    console.log("Get Me (after logout) Status:", meRes2.status);
    
    if (meRes2.status === 401) {
      console.log("✅ Session-based auth working correctly!");
    } else {
      console.log("❌ Auth verification failed.");
    }

  } catch (error) {
    console.error("Test failed:", error);
  }
}

runTests();
