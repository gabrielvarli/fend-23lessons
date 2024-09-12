import { NextResponse } from "next/server";
import { verifyJWT } from "@/utils/jwt"; // Antag att du har en utils-mapp för JWT-hantering

const unsafeMethods = ["POST", "PUT", "DELETE"];

export async function middleware(req) {
  // Kontrollera om metoden är POST, PUT eller DELETE (dvs. potentiellt farliga operationer)
  if (unsafeMethods.includes(req.method)) {
    console.log("JWT Verification Process");

    let jwtPayload;
    try {
      // Hämta authorization header
      const bearer = req.headers.get("Authorization") || "";
      const token = bearer.split(" ")?.[1]; // Split för att extrahera token

      // Kontrollera om token finns
      if (!token) {
        throw new Error("Token saknas i begäran");
      }

      // Verifiera JWT-token
      jwtPayload = await verifyJWT(token);

      // Skapa en ny header och lägg till användaruppgifter från JWT
      const headers = new Headers(req.headers);
      headers.set("userId", JSON.stringify(jwtPayload.userId));

      // Låt begäran gå vidare med uppdaterade headers
      return NextResponse.next({ headers: headers });
    } catch (error) {
      console.error("JWT-verifieringsfel:", error.message);
      return NextResponse.json(
        {
          error: "Unauthorized request - Ogiltig eller saknad token",
        },
        { status: 401 }
      );
    }
  }

  // Om metoden inte är POST, PUT eller DELETE, låt begäran passera
  return NextResponse.next();
}

// Matcher-konfiguration för att gälla för specifika rutter
export const config = {
  matcher: ["/api/items/:path*"], // Använd matcher för att täcka alla item-relaterade rutter
};
