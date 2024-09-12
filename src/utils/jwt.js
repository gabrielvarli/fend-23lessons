import * as jose from "jose";

export async function signJWT(
  payload,
  secret = process.env.JWT_SECRET,
  options = {}
) {
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }

  try {
    console.log("SIGN JWT", secret);
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(secret));

    return token;
  } catch (error) {
    console.error("Error signing JWT:", error);
    throw new Error("Error signing JWT");
  }
}

export async function verifyJWT(token, secret = process.env.JWT_SECRET) {
  console.log("VERIFY JWT", secret);
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }

  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    return payload;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    throw new Error("Invalid or expired token");
  }
}
