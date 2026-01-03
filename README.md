# CV to Infographic

Transform your CV/resume into a beautiful, shareable infographic page using AI.

## Features

- Upload any PDF CV (supports English and Hebrew)
- Add custom style preferences via natural language prompts
- AI-powered extraction using Claude
- Auto-generated unique shareable URL
- RTL support for Hebrew CVs
- Responsive design

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **AI**: Claude API (Anthropic)
- **PDF Parsing**: pdf-parse

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/cv-infographic.git
cd cv-infographic
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your Anthropic API key to `.env.local`:
```
ANTHROPIC_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Visit the homepage
2. Upload your CV (PDF format)
3. Optionally add style preferences (e.g., "minimal and clean", "focus on tech skills")
4. Click "Generate Infographic"
5. Share your unique URL!

## Deployment

Deploy easily on Vercel:

1. Push to GitHub
2. Connect to Vercel
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy!

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

## License

MIT
