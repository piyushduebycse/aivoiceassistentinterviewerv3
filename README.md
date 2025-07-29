# AI Voice Agent Interview Platform

A modern, AI-powered interview practice platform that enables users to conduct realistic voice interviews with an AI interviewer. Built with Next.js, Firebase, and Vapi AI for real-time voice interactions.

## 🚀 Features

### Core Functionality
- **AI-Powered Voice Interviews**: Conduct realistic interviews with an AI interviewer using natural voice conversations
- **Real-time Speech Recognition**: Powered by Deepgram for accurate transcriptions
- **Natural Voice Synthesis**: Uses 11labs for human-like AI voice responses
- **Interview Generation**: AI-generated interview questions based on role, level, and tech stack
- **Comprehensive Feedback**: Detailed scoring and feedback across multiple categories
- **User Authentication**: Secure Firebase-based authentication system

### Interview Types
- **Technical Interviews**: Focus on technical skills and knowledge
- **Behavioral Interviews**: Assess soft skills and cultural fit
- **Mixed Interviews**: Combination of technical and behavioral questions

### Feedback System
- **Communication Skills**: Evaluation of verbal communication abilities
- **Technical Knowledge**: Assessment of domain-specific expertise
- **Problem Solving**: Analysis of logical thinking and solution approaches
- **Cultural Fit**: Evaluation of team compatibility and values alignment
- **Confidence and Clarity**: Assessment of presentation and self-assurance

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation

### Backend & AI
- **Firebase**: Authentication and database
- **Vapi AI**: Voice AI platform for real-time conversations
- **Google AI SDK**: AI-powered question generation
- **Deepgram**: Speech-to-text transcription
- **11labs**: Text-to-speech synthesis

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Turbopack**: Fast bundling for development

## 📁 Project Structure

```
my-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (root)/            # Main application routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── Agent.tsx         # AI interview agent
│   ├── InterviewCard.tsx # Interview display cards
│   └── Authform.tsx      # Authentication forms
├── lib/                  # Utility functions and configurations
│   ├── actions/          # Server actions
│   ├── vapi.sdk.ts      # Vapi AI integration
│   └── utils.ts         # Helper functions
├── firebase/             # Firebase configuration
├── constants/            # Application constants
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Vapi AI account
- Google AI API access

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key

# Vapi AI Configuration
NEXT_PUBLIC_VAPI_KEY=your-vapi-key
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your-workflow-id

# Google AI Configuration
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-voice-agent-interview-platform.git
   cd ai-voice-agent-interview-platform/my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Download service account key and add to environment variables

4. **Configure Vapi AI**
   - Sign up for Vapi AI
   - Create a workflow for interview generation
   - Add API key to environment variables

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Starting an Interview

1. **Navigate to the interview page**
   - Click "Start an Interview" on the homepage
   - Or visit `/interview` directly

2. **Configure interview parameters**
   - Select job role (e.g., Frontend Developer)
   - Choose experience level (Junior, Mid, Senior)
   - Specify interview type (Technical, Behavioral, Mixed)
   - Add relevant tech stack
   - Set number of questions

3. **Begin the interview**
   - Click "Start Call" to begin
   - Speak naturally with the AI interviewer
   - Answer questions as you would in a real interview

### Reviewing Feedback

1. **Access feedback after interview completion**
   - Navigate to `/interview/[id]/feedback`
   - View detailed scoring across categories
   - Review strengths and areas for improvement

2. **Track interview history**
   - View all past interviews on the homepage
   - Access feedback for any completed interview

## 🔧 Configuration

### Vapi AI Workflow Setup

The platform uses Vapi AI workflows for interview generation. Configure your workflow to:

1. **Handle user input** for interview parameters
2. **Generate questions** using AI
3. **Store interview data** in Firebase
4. **Provide real-time voice interaction**

### Firebase Collections

The application uses the following Firestore collections:

- `users`: User authentication data
- `interviews`: Interview metadata and questions
- `feedback`: Interview feedback and scoring

## 🎨 Customization

### Styling
- Modify `app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize component styles in individual component files

### AI Behavior
- Adjust interviewer personality in `constants/index.ts`
- Modify question generation prompts in API routes
- Customize feedback scoring algorithms

### Voice Configuration
- Change AI voice settings in the interviewer configuration
- Adjust speech recognition parameters
- Modify voice synthesis settings

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- **Netlify**: Configure build settings for Next.js
- **Railway**: Add environment variables and deploy
- **AWS Amplify**: Connect repository and configure build

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vapi AI](https://vapi.ai/) for voice AI capabilities
- [Firebase](https://firebase.google.com/) for backend services
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for accessible components

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the code comments for implementation details

---

**Built with ❤️ using Next.js, Firebase, and Vapi AI**
