export class Unauthorized extends Error {
  constructor() {
    super("Unauthorized");
  }
}

export class AlreadyExistError extends Error {
  constructor() {
    super("E-mail already exist");
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid e-mail or password");
  }
}

export class NotFound extends Error {
  constructor() {
    super("Not found");
  }
}
