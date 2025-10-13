import React from 'react';
import { Github, ExternalLink, Rocket, Calendar, Users } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">A World Away</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              An AI-powered exoplanet detection system that analyzes light curves to identify 
              planetary transits with state-of-the-art machine learning algorithms.
            </p>
          </div>

          {/* Hackathon Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              NASA Space Apps 2024
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Challenge: "Leveraging AI for Exoplanet Detection"</p>
              <p>Location: Global Virtual Event</p>
              <p>October 5-6, 2024</p>
            </div>
          </div>

          {/* Team & Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              Project Links
            </h4>
            <div className="space-y-3">
              <a
                href="https://github.com/your-repo/exoplanet-detection"
                className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors group"
              >
                <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">GitHub Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.spaceappschallenge.org"
                className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors group"
              >
                <Rocket className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">NASA Space Apps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 A World Away Team. Built with 🚀 for NASA Space Apps Challenge.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Made with React + Tailwind + AI</span>
            <span>•</span>
            <span>Deployed on Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  );
};