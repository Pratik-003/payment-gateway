import { z } from "zod";

// Helper function to check if an expiry date is in the past
const isExpiryValid = (val: string) => {
  if (val.length !== 5) return false; // Must be MM/YY
  const [month, year] = val.split("/");
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(`20${year}`, 10); // Assume 20xx

  if (monthNum < 1 || monthNum > 12) return false;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // If the year is in the past, or it's the current year but the month is in the past
  if (
    yearNum < currentYear ||
    (yearNum === currentYear && monthNum < currentMonth)
  ) {
    return false;
  }
  return true;
};

export const paymentSchema = z.object({
  cardholderName: z.string().min(2, "Name must be at least 2 characters"),
  cardNumber: z.string().refine((val) => {
    const cleanNumber = val.replace(/\s/g, "");
    return cleanNumber.length >= 15 && cleanNumber.length <= 16;
  }, "Card number must be 15 or 16 digits"),
  expiryDate: z
    .string()
    .refine(isExpiryValid, "Invalid or expired date (MM/YY)"),
  cvv: z
    .string()
    .refine(
      (val) => val.length === 3 || val.length === 4,
      "CVV must be 3 or 4 digits"
    ),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  currency: z.enum(["INR", "USD"]),
});

// Extract the inferred TypeScript type from the Zod schema
export type PaymentFormData = z.infer<typeof paymentSchema>;
