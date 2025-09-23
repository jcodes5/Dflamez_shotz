#!/usr/bin/env node
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

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
  console.log("\nYou can now log in to the admin panel with:")
  console.log("Email: dflamez@example.com")
  console.log("Password: goldsdashboard2025")
  console.log("\nRemember to change the default password after your first login!")
}

setup().catch((error) => {
  console.error("Setup failed:", error)
  process.exit(1)
})