# d2api-timer

Destiny 2 Live Activity Timer — a small web app that shows live timers/countdowns for Destiny 2 activities using the Destiny API. It's lightweight and focused on giving accurate, easy-to-read timers for in-game activities.

What it does
- Fetches live activity data and displays countdowns for active activities.
- Updates timers in the browser so you can track activity windows without switching apps.
- Minimal, easy-to-run frontend.

Tech stack
- TypeScript (primary)
- JavaScript
- CSS
- React
- Uses Bungie.net API to fetch activity information

Quick start
1. Clone the repo
   git clone https://github.com/Tbearden10/d2api-timer.git
   cd d2api-timer

2. Install dependencies
   npm install

3. Configure environment
   - Create a .env (or similar) if the app needs a Bungie API key:
     BUNGIE_API_KEY=your_api_key_here

4. Run (development)
   npm run dev

5. Build (production)
   npm run build

Notes
- If you plan to use the Bungie API, obtain an API key from Bungie.net and add it to your environment.
- The repo is primarily TypeScript and browser-based; adjust commands if your environment uses yarn or pnpm.

Contributing
- Bug reports, improvements, and PRs are welcome.
