import { format } from "@date-io/date-fns";

/**
 * Formats an iso date (such as one from OrderCloud)
 * to a user friendly date/time
 * ex: November 13th at 3:52 PM
 *
 * https://date-fns.org/v2.29.2/docs/format
 */
export function formatDate(isoDateString: string) {
  const date = new Date(isoDateString);
  const formattedDate = format(date, "MMMM do 'at' h:mmaaa");
  return formattedDate;
}

/**
 * Formats an iso date (such as one from OrderCloud)
 * to a user friendly creditcard date
 * ex: 02/24
 *
 * https://date-fns.org/v2.29.2/docs/format
 */
export function formatCreditCardDate(isoDateString: string) {
  const date = new Date(isoDateString);
  const formattedDate = format(date, "MM/yy");
  return formattedDate;
}
