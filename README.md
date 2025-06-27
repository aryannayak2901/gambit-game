# Gorbagana Gambit: Lucky Ladders

A full-stack Web3 retro arcade game built for Solana testnet where 3 players compete to climb a 10-level ladder by choosing the right doors. Winner takes the entire $GORBA pot!

## 🎮 Game Features

- **3-Player Competition**: Real-time multiplayer matches with 3 players
- **10-Level Ladder**: Climb through 10 levels, each with 3 doors (1 safe, 2 traps)
- **$GORBA Token Integration**: Stake tokens to play, use bribes for better odds
- **Real-time Multiplayer**: Socket.IO powered live gameplay and chat
- **Solana Wallet Support**: Backpack, Phantom, and Solflare wallet integration
- **Retro Pixel Art Design**: CRT effects, neon styling, and arcade aesthetics

## 🛠 Tech Stack

### Frontend
- **React 18** with JavaScript (JSX)
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Socket.IO Client** for real-time communication
- **Solana Wallet Adapter** for Web3 integration
- **React Router** for navigation
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **Socket.IO** for real-time multiplayer
- **CORS** enabled for cross-origin requests

### Blockchain
- **Solana Testnet** (Gorbagana)
- **Anchor Framework** (smart contract structure ready)
- **$GORBA Token** integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Solana wallet (Backpack, Phantom, or Solflare)
- Some testnet SOL for transactions

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gorbagana-gambit-lucky-ladders
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the backend server**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development servers**
   
   Terminal 1 (Frontend):
   ```bash
   npm run dev
   ```
   
   Terminal 2 (Backend):
   ```bash
   cd server
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🎯 How to Play

1. **Connect Wallet**: Connect your Solana wallet (Backpack recommended)
2. **Create/Join Game**: Create a new game or join with a Game ID
3. **Wait for Players**: Games need exactly 3 players to start
4. **Climb the Ladder**: Choose doors (Left, Middle, Right) at each level
5. **Use Bribes**: Spend 1 $GORBA for +10% safe door chance
6. **Win the Pot**: First to Level 10 or last player standing wins all $GORBA

## 🏗 Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── Ladder.jsx      # Main game ladder
│   │   ├── LadderLevel.jsx # Individual level component
│   │   ├── Door.jsx        # Interactive door component
│   │   ├── PlayerAvatar.jsx # Player representation
│   │   ├── BribeButton.jsx # Bribe system UI
│   │   ├── ChatBox.jsx     # Real-time chat
│   │   └── GameHUD.jsx     # Game UI overlay
│   ├── contexts/           # React contexts
│   │   ├── WalletContext.jsx # Solana wallet integration
│   │   ├── GameContext.jsx   # Game state management
│   │   └── SocketContext.jsx # Socket.IO connection
│   ├── pages/              # Main application pages
│   │   ├── Home.jsx        # Landing page
│   │   ├── Lobby.jsx       # Pre-game lobby
│   │   ├── Game.jsx        # Main game interface
│   │   ├── Leaderboard.jsx # Player rankings
│   │   └── Profile.jsx     # Player statistics
│   └── styles/             # CSS and animations
├── server/                 # Backend server
│   ├── index.js           # Main server file
│   └── package.json       # Server dependencies
└── public/                # Static assets
```

## 🎨 Design Features

- **Retro Pixel Art**: Authentic 8-bit style graphics
- **CRT Effects**: Scanlines and screen flicker for retro feel
- **Neon Glow**: Cyan, pink, and yellow accent colors
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Space-themed background with gradient effects

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
SOLANA_NETWORK=testnet
SOLANA_RPC_URL=https://api.testnet.solana.com
ENTRY_FEE=3
MAX_PLAYERS=3
MAX_LEVELS=10
```

### Wallet Configuration

The app supports multiple Solana wallets:
- **Backpack** (Recommended)
- **Phantom**
- **Solflare**

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set start command: `npm start`
3. Add environment variables from `.env.example`
4. Deploy and get your server URL

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.vercel.app
SOLANA_NETWORK=testnet
SOLANA_RPC_URL=https://api.testnet.solana.com
```

## 🎮 Game Mechanics

### Ladder System
- **10 Levels**: Players must climb from Level 1 to Level 10
- **3 Doors per Level**: Left, Middle, Right - only 1 is safe
- **Random Safe Doors**: Each game generates random safe doors using RNG
- **Elimination**: Wrong door choice eliminates the player

### Bribe System
- **Cost**: 1 $GORBA per bribe
- **Effect**: +10% chance of revealing the safe door
- **Strategy**: Use bribes on higher levels for better odds

### Winning Conditions
1. **Reach Level 10**: First player to complete all levels wins
2. **Last Standing**: If all other players are eliminated, remaining player wins
3. **Pot Distribution**: Winner takes the entire pot (3 $GORBA × 3 players = 9 $GORBA)

## 🔗 Smart Contract Integration

The game is designed to integrate with Solana smart contracts:

### Contract Functions (Ready for Implementation)
- `create_match()`: Initialize new game with entry fees
- `join_match()`: Allow players to join with stake
- `select_door()`: Process door selection with RNG verification
- `use_bribe()`: Handle bribe payments and odds modification
- `end_match()`: Distribute winnings to winner

### Token Integration
- **$GORBA Token**: Custom SPL token for the Gorbagana ecosystem
- **Entry Fees**: 3 $GORBA per player
- **Bribes**: 1 $GORBA per bribe usage
- **Winnings**: Automatic distribution via smart contract

## 🎯 Features Implemented

### ✅ Core Game Features
- [x] 3-player multiplayer lobby system
- [x] 10-level ladder with 3 doors per level
- [x] Real-time door selection and elimination
- [x] Bribe system with GORBA spending
- [x] Winner determination and pot distribution
- [x] Game state synchronization

### ✅ UI/UX Features
- [x] Retro pixel art design with CRT effects
- [x] Responsive design for all devices
- [x] Smooth animations and transitions
- [x] Real-time chat system
- [x] Player avatars and status indicators
- [x] Game HUD with live statistics

### ✅ Web3 Integration
- [x] Solana wallet adapter integration
- [x] Support for Backpack, Phantom, Solflare
- [x] Testnet configuration for Gorbagana
- [x] Mock GORBA token balance system
- [x] Ready for smart contract integration

### ✅ Additional Features
- [x] Comprehensive leaderboard system
- [x] Player profile with statistics
- [x] Achievement system
- [x] Game sharing functionality
- [x] Real-time multiplayer synchronization

## 🐛 Known Issues & Future Improvements

### Smart Contract Integration
- [ ] Deploy actual Solana smart contract
- [ ] Implement real $GORBA token transactions
- [ ] Add on-chain game state verification
- [ ] Implement provably fair RNG

### Game Features
- [ ] Spectator mode for finished games
- [ ] Tournament system with brackets
- [ ] Daily challenges and rewards
- [ ] NFT avatar system

### Performance
- [ ] Optimize animations for mobile devices
- [ ] Add progressive loading for better UX
- [ ] Implement game state persistence
- [ ] Add offline mode detection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana Foundation** for the blockchain infrastructure
- **Gorbagana Testnet** for providing the testing environment
- **React Team** for the amazing frontend framework
- **Socket.IO** for real-time communication
- **Tailwind CSS** for the utility-first styling approach

## 📞 Support

For support, email support@luckyladdersGame.com or join our Discord community.

---

**Built with ❤️ for the Solana ecosystem**

*Climb the ladder, choose your doors, win the pot! 🎮*