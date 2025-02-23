// src/core/recaptcha.ts
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

interface RecaptchaOptions {
  projectID: string;
  recaptchaSiteKey: string;
  recaptchaAction: string;
  token: string;
}

export async function verifyRecaptcha({
  projectID,
  recaptchaSiteKey,
  recaptchaAction,
  token,
}: RecaptchaOptions): Promise<number> {
  // Create a new client instance, explicitly passing the keyFilename
  const client = new RecaptchaEnterpriseServiceClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
  const projectPath = client.projectPath(projectID);

  const request = {
    parent: projectPath,
    assessment: {
      event: {
        token,
        siteKey: recaptchaSiteKey,
      },
    },
  };

  const [response] = await client.createAssessment(request);

  if (!response.tokenProperties || !response.tokenProperties.valid) {
    throw new Error(
      `reCAPTCHA verification failed: ${response.tokenProperties?.invalidReason || 'Unknown reason'}`
    );
  }

  // Only enforce the action if one is provided in the token properties.
  if (response.tokenProperties.action && response.tokenProperties.action !== recaptchaAction) {
    throw new Error(
      `Unexpected reCAPTCHA action: expected "${recaptchaAction}", got "${response.tokenProperties.action}"`
    );
  }

  return response.riskAnalysis?.score || 0;
}
