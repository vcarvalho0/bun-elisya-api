export async function hashPassword(password: string, salt = 10) {
  return await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: salt
  });
}

export async function comparePasswords(password: string, hashed: string) {
  return await Bun.password.verify(password, hashed);
}
