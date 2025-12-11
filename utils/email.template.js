export const generateEmailTemplate = ({
    userName,
    subscriptionName,
    renewalDate,
    planName,
    price,
    paymentMethod,
    accountSettingsLink,
    supportLink,
    daysLeft
}) => `
<div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:white; padding:24px; border-radius:8px;">

    <h2 style="color:#333; margin-top:0;">
      Hi ${userName},
    </h2>

    <p style="font-size:15px; color:#444;">
      This is a reminder that your subscription to
      <strong>${subscriptionName}</strong> will renew
      <strong>${daysLeft === 0 ? "today" : `in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`}</strong>.
    </p>

    <div style="margin:20px 0; padding:16px; background:#fafafa; border:1px solid #eee; border-radius:6px;">
      <h3 style="margin-top:0; color:#333;">Subscription Details</h3>
      <p style="margin:6px 0;"><strong>Plan:</strong> ${planName}</p>
      <p style="margin:6px 0;"><strong>Price:</strong> ${price}</p>
      <p style="margin:6px 0;"><strong>Payment Method:</strong> ${paymentMethod}</p>
      <p style="margin:6px 0;"><strong>Renewal Date:</strong> ${renewalDate}</p>
    </div>

    <p style="font-size:14px; color:#555;">
      If you'd like to manage or cancel this subscription, you can do so here:
    </p>

    <a href="${accountSettingsLink}"
       style="display:inline-block; margin:12px 0; padding:10px 16px; background:#4f46e5; color:white; text-decoration:none; border-radius:4px;">
       Manage Subscription
    </a>

    <p style="font-size:14px; color:#555; margin-top:20px;">
      Need help? Contact us:
      <a href="${supportLink}" style="color:#4f46e5;">Support</a>
    </p>

    <p style="font-size:13px; color:#888; margin-top:30px;">
      This is an automated message. Please do not reply.
    </p>
  </div>
</div>
`;


export const emailTemplates = [
    {
        label: "7 days before reminder",
        daysLeft: 7,
        generateSubject: ({ subscriptionName }) =>
            `${subscriptionName} Subscription Renews in 7 Days`,
        generateBody: (data) =>
            generateEmailTemplate({ ...data, daysLeft: 7 })
    },
    {
        label: "3 days before reminder",
        daysLeft: 3,
        generateSubject: ({ subscriptionName }) =>
            `${subscriptionName} Subscription Renews in 3 Days`,
        generateBody: (data) =>
            generateEmailTemplate({ ...data, daysLeft: 3 })
    },
    {
        label: "1 day before reminder",
        daysLeft: 1,
        generateSubject: ({ subscriptionName }) =>
            `${subscriptionName} Subscription Renews Tomorrow`,
        generateBody: (data) =>
            generateEmailTemplate({ ...data, daysLeft: 1 })
    }
];
