import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env' })

async function initDatabase() {
  // Check if required environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Missing required Supabase environment variables')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    return { success: false, error: 'Missing Supabase environment variables' }
  }

  // Create a proper Supabase client for server-side scripts using service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), 'scripts', '01_create_tables.sql')
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8')

    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`Found ${statements.length} SQL statements to execute`)

    // Execute each statement using direct SQL execution
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`)
        try {
          // Use the REST API to execute raw SQL
          const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
            },
            body: JSON.stringify({ sql: statement })
          })

          if (!response.ok) {
            const errorText = await response.text()
            console.error(`Error executing statement ${i + 1}:`, errorText)
          } else {
            console.log(`Statement ${i + 1} executed successfully`)
          }
        } catch (error) {
          console.error(`Error executing statement ${i + 1}:`, error)
        }
      }
    }

    console.log('Database initialization completed')
    return { success: true, message: 'Database initialized successfully' }
  } catch (error) {
    console.error('Error initializing database:', error)
    return { success: false, error: 'Failed to initialize database' }
  }
}

// Run the initialization
initDatabase()
  .then(result => {
    console.log('Result:', result)
    process.exit(result.success ? 0 : 1)
  })
  .catch(error => {
    console.error('Unexpected error:', error)
    process.exit(1)
  })