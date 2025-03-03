export const socialFusionEmailTemplate = (title, name, message, ctaText, ctaLink) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 5px; background: #ffffff;">
    <h2 style="color: #333; text-align: center;">🌐 SocialFusion</h2>
    <h3 style="color: #555; text-align: center;">${title}</h3>
    
    <p>Hi <strong>${name}</strong>,</p>
    <p>${message}</p>

    ${ctaText && ctaLink ? `
      <div style="text-align: center; margin-top: 20px;">
        <a href="${ctaLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          ${ctaText}
        </a>
      </div>
    ` : ''}

    <hr style="margin-top: 20px;">
    <p style="font-size: 12px; color: #999; text-align: center;">
      If you didn't request this email, please ignore it.
    </p>
  </div>
`;
