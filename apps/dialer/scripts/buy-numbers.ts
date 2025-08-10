import 'dotenv/config';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function buyNumber(areaCode: string) {
  const numbers = await client
    .availablePhoneNumbers('US')
    .local.list({ areaCode, limit: 1 });

  if (!numbers.length) {
    throw new Error(`No numbers found for area code ${areaCode}`);
  }

  const num = numbers[0];
  const purchased = await client.incomingPhoneNumbers.create({
    phoneNumber: num.phoneNumber,
  });

  return purchased.phoneNumber;
}