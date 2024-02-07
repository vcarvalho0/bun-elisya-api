export async function generateOtp(): Promise<string> {
  return Math.floor(Math.random() * 1000)
    .toString()
    .padStart(4, "0");
}
