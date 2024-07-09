export function isValidEmail(email: string) {
  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  if (emailRegex.test(email)) {
    return {
      ok: true,
      message: null,
    };
  }
  return {
    ok: false,
    message: "Invalid Email",
  };
}
