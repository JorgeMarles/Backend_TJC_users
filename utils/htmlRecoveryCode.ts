export const emailTemplate = (code: number) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #f9f9f9;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #d32f2f;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      color: #333333;
    }
    .content p {
      margin: 10px 0;
    }
    .content .code {
      font-size: 24px;
      font-weight: bold;
      color: #d32f2f;
      text-align: center;
      margin: 20px 0;
    }
    .footer {
      background-color: #f2f2f2;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #888888;
    }
    .red-text {
  		color: #d32f2f;
	}
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Password Recovery</h1>
    </div>
    <div class="content">
      <p>Dear User,</p>
      <p>Your recovery code is:</p>
      <div class="code">${code}</div>
      <p>This code is valid for <strong>10 minutes</strong>. Please use it to recover your account.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>Thank you,</p>
      <p class="red-text">Training & Judge Center</p>
    </div>
  </div>
</body>
</html>
`;
