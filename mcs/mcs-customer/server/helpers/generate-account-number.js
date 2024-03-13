export function generateAccountNumber() {
  const randomBits = Math.floor(Math.random() * 1000000);
  return `000852${randomBits.toString().padEnd(6, "0")}`;
}
