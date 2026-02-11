# YardCrop

A map-based produce sharing platform for North County San Diego, built with Next.js.

## Local Development Setup (Mac)

### Step 1: Install Node.js
1. Go to https://nodejs.org
2. Download the **LTS** version (the big green button on the left)
3. Open the downloaded file and follow the installer prompts
4. When finished, restart your computer

### Step 2: Install GitHub Desktop
1. Go to https://desktop.github.com
2. Download and install it
3. Open GitHub Desktop and sign in with your GitHub account

### Step 3: Clone the Repository
1. In GitHub Desktop, click **File → Clone Repository**
2. Click the **URL** tab
3. Paste: `https://github.com/TomSchuck/yardcrop`
4. Choose where to save it (the default is fine)
5. Click **Clone**

### Step 4: Set Up Environment Variables
1. Open Finder and navigate to where you cloned the project
2. Find the file called `.env.example`
3. Duplicate it (right-click → Duplicate)
4. Rename the duplicate to `.env.local`
5. Open `.env.local` in TextEdit (right-click → Open With → TextEdit)
6. Replace `your_mapbox_public_token_here` with the actual Mapbox token (ask the developer for this)
7. Save and close the file

### Step 5: Install Dependencies
1. Open the **Terminal** app (search for "Terminal" in Spotlight with Cmd+Space)
2. Type `cd ` (with a space after it)
3. Drag the project folder from Finder into the Terminal window - it will paste the path
4. Press Enter
5. Type this command and press Enter:
   ```
   npm install
   ```
6. Wait for it to finish (may take a few minutes)

### Step 6: Run the App
1. In the same Terminal window, type:
   ```
   npm run dev
   ```
2. Wait until you see a message like `Ready on http://localhost:3000`
3. Open your web browser and go to: **http://localhost:3000**

### Step 7: Stopping the App
- To stop the app, go to the Terminal and press **Ctrl+C**

## Troubleshooting

**"command not found: npm"**
→ Restart your computer after installing Node.js

**The map doesn't show up**
→ Make sure `.env.local` has the correct Mapbox token

**"Port 3000 is already in use"**
→ You may already have the app running. Check for other Terminal windows, or restart your computer

---

## Supabase Setup (for project owner)

### Step 1: Create a Supabase Account
1. Go to https://supabase.com
2. Click "Start your project" and sign up (GitHub login is easiest)

### Step 2: Create a New Project
1. Click "New Project"
2. Choose an organization (or create one)
3. Enter project details:
   - **Name:** `yardcrop` (or similar)
   - **Database Password:** Generate a strong password and save it somewhere secure
   - **Region:** Choose the closest to San Diego (e.g., West US)
4. Click "Create new project" and wait ~2 minutes for setup

### Step 3: Get the API Keys
1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values:

| Setting | What to copy |
|---------|--------------|
| **Project URL** | The URL under "Project URL" |
| **anon public** | The key under "Project API keys" labeled `anon` `public` |

### Step 4: Send to Developer
Send the developer these two values (they're safe to share - the anon key is meant to be public):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## Developer Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

**Note:** This project uses the `--webpack` flag instead of Turbopack due to compatibility issues with mapbox-gl.
