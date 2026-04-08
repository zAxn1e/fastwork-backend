const { AppError } = require("./http");

function parseId(value, fieldName = "id") {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(400, `${fieldName} must be a positive integer`);
  }
  return parsed;
}

function parseOptionalId(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }
  return parseId(value, fieldName);
}

function parseBooleanQuery(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new AppError(400, `${fieldName} must be true or false`);
}

function requireNonEmptyString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(400, `${fieldName} is required`);
  }
  return value.trim();
}

function requirePositiveInt(value, fieldName) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(400, `${fieldName} must be a positive integer`);
  }
  return parsed;
}

function optionalPositiveInt(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }
  return requirePositiveInt(value, fieldName);
}

function requireRating(value) {
  const rating = Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AppError(400, "rating must be an integer between 1 and 5");
  }
  return rating;
}

function requireEnum(value, fieldName, allowedValues) {
  if (!allowedValues.includes(value)) {
    throw new AppError(
      400,
      `${fieldName} must be one of: ${allowedValues.join(", ")}`,
    );
  }
  return value;
}

module.exports = {
  parseId,
  parseOptionalId,
  parseBooleanQuery,
  requireNonEmptyString,
  requirePositiveInt,
  optionalPositiveInt,
  requireRating,
  requireEnum,
};
