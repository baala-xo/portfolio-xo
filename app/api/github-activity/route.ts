import { NextResponse } from "next/server"

type ContributionDay = {
  date: string
  contributionCount: number
  color: string
}

type GraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: { contributionDays: ContributionDay[] }[]
        }
      }
    }
  }
  errors?: { message: string }[]
}

const GITHUB_GRAPHQL = "https://api.github.com/graphql"

const computeStreaks = (days: ContributionDay[]) => {
  if (!days.length) return { current: 0, longest: 0, bestDay: 0 }

  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date))
  let longest = 0
  let current = 0
  let streak = 0
  let bestDay = 0

  const today = new Date()
  const todayString = today.toISOString().slice(0, 10)

  for (let i = 0; i < sorted.length; i += 1) {
    const day = sorted[i]
    bestDay = Math.max(bestDay, day.contributionCount)
    if (day.contributionCount > 0) {
      streak += 1
      longest = Math.max(longest, streak)
    } else {
      streak = 0
    }
  }

  // Compute current streak from the end, stopping at today.
  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const day = sorted[i]
    if (day.date > todayString) continue
    if (day.contributionCount > 0) {
      current += 1
    } else {
      break
    }
  }

  return { current, longest, bestDay }
}

export async function GET(request: Request) {
  const token = process.env.GITHUB_TOKEN
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username") || "baala-xo"

  if (!token) {
    return NextResponse.json(
      { error: "Missing GITHUB_TOKEN" },
      { status: 500 }
    )
  }

  const query = `
    query ($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `

  const response = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { login: username } }),
    next: { revalidate: 600 },
  })

  const payload = (await response.json()) as GraphQLResponse
  if (!response.ok || payload.errors?.length) {
    const message = payload.errors?.[0]?.message || "GitHub API error"
    return NextResponse.json({ error: message }, { status: 500 })
  }

  const calendar = payload.data?.user?.contributionsCollection.contributionCalendar
  if (!calendar) {
    return NextResponse.json({ error: "No contribution data" }, { status: 404 })
  }

  const days = calendar.weeks.flatMap((week) => week.contributionDays)
  const streaks = computeStreaks(days)

  return NextResponse.json({
    username,
    total: calendar.totalContributions,
    currentStreak: streaks.current,
    longestStreak: streaks.longest,
    bestDay: streaks.bestDay,
    days,
    weeks: calendar.weeks,
    updatedAt: new Date().toISOString(),
  })
}
