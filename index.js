// server.js
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors package

const app = express();
const PORT = 9000;

// Enable CORS for all routes
app.use(
  cors({
    origin: "https://storied-naiad-4fe8c6.netlify.app", // Allow requests from your React app
  })
);

app.use(bodyParser.json());

// Your LinkedIn app credentials
const CLIENT_ID = "860d5bd232a4cu";
const CLIENT_SECRET = "WPL_AP1.TJmiU3pqdbrttvtG.ajVYpg==";
const REDIRECT_URI = "https://storied-naiad-4fe8c6.netlify.app/auth/callback";

// Route to get access token
app.post("/api/linkedin/access-token", async (req, res) => {
  const { code } = req.body;
  try {
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return res.json({ access_token: tokenResponse.data.access_token });
  } catch (error) {
    console.error("Error fetching access token:", error.response.data);
    return res.status(500).json({ error: "Error fetching access token" });
  }
});

// Route to fetch LinkedIn profile data
app.get("/api/linkedin/profile", async (req, res) => {
  const { accessToken } = req.query;

  try {
    const profileResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // s
    return res.json({
      profile: profileResponse.data,
    });
  } catch (error) {
    console.error("Error fetching LinkedIn profile:", error.response.data);
    return res.status(500).json({ error: error.response.data.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
