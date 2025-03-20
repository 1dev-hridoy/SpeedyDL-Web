# SpeedyDL - Video Downloader

A modern, user-friendly application for downloading videos from popular social media platforms including YouTube, Facebook, Instagram, TikTok, and Twitter.

## 🌟 Features

- **Multi-Platform Support**: Download videos from YouTube, Facebook, Instagram, TikTok, and Twitter
- **Quality Options**: Choose between SD, HD, or audio-only downloads
- **Direct Downloads**: No redirects - videos download directly to your device
- **Download History**: Keep track of your recent downloads
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **User-Friendly Interface**: Clean, intuitive design for easy navigation

## 🚀 Live Demo

Visit our live demo: [SpeedyDL Web](https://speedy-dl-web.vercel.app/)

## 🔧 API Reference

This application uses the SpeedyDL API for video processing and downloads.

**Base URL**: `https://speedydl.hridoy.top/api`

### Endpoints

| Platform  | Endpoint                              | Description                       |
|-----------|--------------------------------------|-----------------------------------|
| YouTube   | `/youtube?url={video_url}`          | Download YouTube videos          |
| Facebook  | `/facebook?url={video_url}`         | Download Facebook videos         |
| Instagram | `/instagram?url={video_url}`        | Download Instagram videos/images |
| TikTok    | `/tiktok?url={video_url}`           | Download TikTok videos           |
| Twitter   | `/twitter?url={video_url}`          | Download Twitter videos          |

For more detailed API documentation, visit [SpeedyDL API Documentation](https://speedydl.hridoy.top/)

## 📋 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/1dev-hridoy/SpeedyDL-Web.git
   cd SpeedyDL-Web
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
SpeedyDL-Web/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── index.html
├── server.js
├── vercel.json
├── package.json
└── README.md
```

## 🚢 Deployment

### Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Sign up or log in to [Vercel](https://vercel.com)
3. Click "New Project" and import your repository
4. Configure your project settings (most can be left as default)
5. Click "Deploy"

## 🔒 Environment Variables

The following environment variables can be set in your Vercel project:

- `PORT`: The port on which the server will run (default: 3000)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [SpeedyDL API](https://speedydl.hridoy.top/) - For providing the video download API
- [Font Awesome](https://fontawesome.com/) - For the icons used in the UI
- [Express.js](https://expressjs.com/) - For the server framework

## 📞 Contact

If you have any questions or feedback, please reach out to us at:

- Facebook: [@hridoy.py](https://facebook.com/hridoy.py)

---

Made with ❤️ by Hridoy

