#!/usr/bin/env node
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

import { initAdminUser } from "./init-admin"

async function setup() {
  console.log("Setting up the application...")
  
  // Initialize admin user
  console.log("Creating admin user...")
  const adminResult = await initAdminUser()
  
  if (adminResult.success) {
    console.log("✅ Admin user setup completed")
    if (adminResult.message) {
      console.log(`   ${adminResult.message}`)
    }
  } else {
    console.error("❌ Failed to create admin user:", adminResult.error)
    process.exit(1)
  }
  
  console.log("\n🎉 Setup completed successfully!")
  console.log("\nYou can now log in with the AUTH_ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD values from .env")
}

setup().catch((error) => {
  console.error("Setup failed:", error)
  process.exit(1)
})