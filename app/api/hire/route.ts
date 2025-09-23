import { type NextRequest, NextResponse } from "next/server"

// Mock database - in a real app, this would be a proper database
const hireRequests: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const hireRequest = {
      id: Date.now().toString(),
      ...body,
      submittedAt: new Date().toISOString(),
      status: "pending",
    }

    hireRequests.push(hireRequest)

    return NextResponse.json({ success: true, message: "Hire request submitted successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to submit hire request" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ hireRequests })
}
