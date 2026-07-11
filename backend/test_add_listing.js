import axios from "axios";
import FormData from "form-data";

const run = async () => {
  try {
    console.log("1. Logging in...");
    const loginRes = await axios.post("https://airbnb-app-backend-nine.vercel.app/api/auth/login", {
      email: "admin@airbnb.com",
      password: "Admin123"
    });

    const cookies = loginRes.headers["set-cookie"];
    if (!cookies || cookies.length === 0) {
      throw new Error("No cookies returned from login.");
    }

    const tokenCookie = cookies.find(c => c.startsWith("token="));
    if (!tokenCookie) {
      throw new Error("Token cookie not found.");
    }
    const tokenValue = tokenCookie.split(";")[0];

    console.log("\n2. Sending add listing request to production...");
    const form = new FormData();
    form.append("title", "Test Diagnostics Listing");
    form.append("description", "A test listing created to debug Vercel upload limits.");
    form.append("rent", "2500");
    form.append("city", "Test City");
    form.append("landMark", "Test Landmark");
    form.append("category", "villa");

    const dummyPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    form.append("image1", dummyPng, { filename: "test1.png", contentType: "image/png" });
    form.append("image2", dummyPng, { filename: "test2.png", contentType: "image/png" });
    form.append("image3", dummyPng, { filename: "test3.png", contentType: "image/png" });

    const addRes = await axios.post("https://airbnb-app-backend-nine.vercel.app/api/listing/add", form, {
      headers: {
        ...form.getHeaders(),
        Cookie: tokenValue
      }
    });

    console.log("Success! Status:", addRes.status);
    console.log("Response data:", addRes.data);

  } catch (error) {
    console.error("\nAPI Call Failed!");
    if (error.response) {
      console.error("Status Code:", error.response.status);
      console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error Message:", error.message);
    }
  }
};

run();
