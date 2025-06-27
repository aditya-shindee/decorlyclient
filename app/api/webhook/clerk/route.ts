import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { supabase } from "@/lib/supabase";
import { getSupabaseUserId } from "@/utils/get-supabase-user";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!

if (!webhookSecret) {
  throw new Error("Missing CLERK_WEBHOOK_SECRET");
}

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  // Handle the webhook
  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, created_at, last_sign_in_at } = evt.data;

      const primaryEmail = email_addresses.find((email: any) => email.id === evt.data.primary_email_address_id);

      let image_url = null;
      try {
        if (primaryEmail?.verification?.strategy === "from_oauth_google" ){
          image_url = evt.data.external_accounts[0].avatar_url;
        } else if (primaryEmail?.verification?.strategy === "email_link"){
          image_url = evt.data.image_url;
        }
      } catch (error) {
        image_url = evt.data.image_url;
      }

      const providerType = primaryEmail?.verification?.strategy === "from_oauth_google" 
        ? "google" 
        : primaryEmail?.verification?.strategy === "email_link" 
          ? "email" 
          : null;

      const userData = {
        clerk_user_id: id,
        email: primaryEmail?.email_address || "",
        first_name: first_name || null,
        last_name: last_name || null,
        avatar_url: image_url || null,
        provider_type: providerType,
        updated_at: new Date().toISOString(),
        ...(eventType === "user.created" && {
          created_at: new Date(created_at).toISOString(),
        }),
        ...(last_sign_in_at && {
          last_sign_in_at: new Date(last_sign_in_at).toISOString(),
        }),
      };

      const { error } = await supabase
        .from("user_profiles")
        .upsert(userData, {
          onConflict: "clerk_user_id",
        });

      if (error) {
        console.error("Error syncing user to Supabase:", error);
        return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
      }
      if (eventType === "user.created") {
        const userSupabaseId = await getSupabaseUserId(id);
        if (userSupabaseId) {
          const { error: creditError } = await supabase
            .from("credits")
            .insert({ user_id: userSupabaseId, amount: 25 });
          if (creditError) {
            console.error("Error inserting credits:", creditError);
            return NextResponse.json({ error: "Failed to add credits" }, { status: 500 });
          }
        } else {
          console.error("Could not find user_profiles.id after upsert");
          return NextResponse.json({ error: "User profile not found for credits" }, { status: 500 });
        }
      }

      console.log("User synced successfully:", userData);
    }

    // Handle session created event (when user signs in)
    if (eventType === "session.created") {
      const { user_id } = evt.data;

      const { error } = await supabase
        .from("user_profiles")
        .update({
          last_sign_in_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", user_id);

      if (error) {
        console.error("Error updating last sign in:", error);
        return NextResponse.json({ error: "Failed to update sign in time" }, { status: 500 });
      }

      console.log("Last sign in updated for user:", user_id);
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      const { error } = await supabase
        .from("user_profiles")
        .delete()
        .eq("clerk_user_id", id);

      if (error) {
        console.error("Error deleting user from Supabase:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
      }

      console.log("User deleted successfully:", id);
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 