import React, { useState, useEffect, useCallback } from 'react';
import { Code } from 'lucide-react';
import { tokenizeRustLine } from '../utils/rustSyntax';

interface Position {
  line: number;
  column: number;
}

interface PortfolioData {
  personal: {
    name: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
  };
  education: {
    institution: string;
    duration: string;
    degree: string;
    gpa: string;
    coursework: string[];
  };
  internship: {
    company: string;
    duration: string;
    role: string;
    points: string[];
  };
  projects: Array<{
    name: string;
    tech: string[];
    duration: string;
    points: string[];
    github: string;
  }>;
  skills: {
    languages: string[];
    technologies: string[];
    frameworks: string[];
    developerTools: string[];
  };
  codingPlatforms: Array<{
    name: string;
    count: string;
    link: string;
  }>;
  achievements: string[];
}

const portfolioData: PortfolioData = {
  personal: {
    name: "N Sathya Pramodh",
    phone: "+91-7259469949",
    email: "sathyapramodh10@gmail.com",
    linkedin: "https://linkedin.com/in/sathya-pramodh-606877259",
    github: "https://github.com/sathya-pramodh",
  },
  education: {
    institution: "Ramaiah Institute of Technology, Bengaluru",
    duration: "2022 - 2026",
    degree: "B.E - Information Science and Engineering",
    gpa: "9.17/10.0",
    coursework: ["DSA", "OOPS Concepts", "Operating Systems", "DBMS", "UI/UX Design", "Computer Networks", "Theory of Computation", "Machine Learning*", "Cloud Computing*", "Systems Design*", "Devops*", "System Simulation*"],
  },
  internship: {
    company: "Samsung RND Institute, Bengaluru",
    duration: "Sep 2024 - Present",
    role: "Research Intern",
    points: [
      "Coded the BPR model in Tensorflow to recommend apps using sequential data with an accuracy of 92%.",
      "Gathered metrics for various models and fine-tuned them to increase training speeds by 30%.",
      "Optimized the BPR and MLP models for on-device training with a maximum power efficiency of 80%.",
      "Reviewed about 5 research papers independently to come up with the necessary algorithms to use.",
    ],
  },
  projects: [
    {
      name: "Neovim",
      tech: ["C", "Lua", "Developer Tools", "Text Editor", "MessagePack RPC", "Open Source"],
      duration: "2025 - Present",
      points: [
        "Fixed an issue with \":checkhealth\" not reporting irregular configurations in language providers.",
        "Fixed an issue with stderr messages being highlighted differently in \":!cmd\" outputs.",
        "Implemented the \":restart\" command which removed the need of having to quit out of Neovim to reload.",
        "Created a sample Neovim configuration to demonstrate the usage of the \":restart\" command.",
      ],
      github: "https://github.com/neovim/neovim",
    },
    {
      name: "PaceManBot",
      tech: ["Rust", "Discord API", "Websockets", "Serenity-rs", "Minecraft"],
      duration: "2023 - Present",
      points: [
        "Deployed an end-to-end system using Websockets and Discord API to serve 125+ discord servers.",
        "Built an in-memory caching system from scratch to bring message delays from 10s down to 1s.",
        "Supported multiple versions of Minecraft like 1.15 and 1.7 to improve usability.",
        "Added support for the All Advancements category of Minecraft Speedrunning for the version 1.16.1.",
      ],
      github: "https://github.com/paceman-mcsr/pacemanbot",
    },
    {
      name: "Resetti",
      tech: ["Golang", "Macros", "Linux Desktop Automation", "Github Actions", "Minecraft"],
      duration: "2022 - Present",
      points: [
        "Developed an initial version of the Moving Wall feature which improved end-user experience.",
        "Implemented a simple and lightweight Logging framework which improved developer experience.",
        "Built workflows to automatically distribute the macro through the Arch User Repositories (AUR).",
        "Added support to configure multiple resolutions to enhance compatibility.",
      ],
      github: "https://github.com/tesselslate/resetti",
    },
    {
      name: "AHKLinux",
      tech: ["Python3", "Interpreter Design", "Unit testing"],
      duration: "2021 - 2024",
      points: [
        "Developed a simple interpreter system to parse AutoHotKey scripts on Linux/X11 Desktops natively.",
        "Packaged the CLI system using PyPi for distribution through pip.",
        "Created unit tests using Pytest to improve test coverage.",
        "Wrote integration and system tests to improve GUI testing.",
      ],
      github: "https://github.com/sathya-pramodh/AHKLinux",
    },
  ],
  skills: {
    languages: ["C", "Lua", "Python3", "Rust", "Golang", "Java", "SQL", "Bash"],
    technologies: ["Discord API", "MySQL", "Oracle SQL", "Firebase Cloud Firestore", "MessagePack RPC", "Websockets"],
    frameworks: ["Flutter", "Serenity-rs", "Pytest", "X11 xproto", "tokio", "tokio-tungstenite", "serde", "serde-json"],
    developerTools: ["Neovim", "Figma", "Jupyter Notebook", "Linux terminal", "mdBook", "Git", "Github", "Github Actions", "Docker", "Tmux", "IntelliJ IDEA", "Android Studio"],
  },
  codingPlatforms: [
    {
      name: "Codeforces",
      count: "400+",
      link: "https://codeforces.com/profile/sathya_pramodh",
    },
    {
      name: "LeetCode",
      count: "100+",
      link: "https://leetcode.com/u/sathya-pramodh/",
    },
  ],
  achievements: [
    "Selected in SIH at College Level in 2022-23 and 2023-24 along with 4 other members.",
    "Participated in Solving For India at Zonal Level in 2022 as a team of 4.",
    "Participated in Code To Give, a hackathon by Morgan Stanley in 2025 as a team of 6.",
    "Mentored in wHACKiest, a 24-hour hackathon by CodeRIT (the most active coding club of RIT).",
    "Served as the Lead of CodeRIT in 2025-2026.",
  ],
};

type FileType = 'summary' | 'education' | 'internship' | 'projects' | 'skills' | 'coding' | 'achievements' | 'contact';

const generateSummaryCode = (data: PortfolioData): string => {
  return `// portfolio.rs - Developer Portfolio
// Navigation:
// • Shift+K on any section to view details
// • Ctrl+O to go back to previous location
// • h/j/k/l for vim navigation
// • Enter on links to open them
// • : for command mode
// • :help for command help

let portfolio = Portfolio {
    developer: Developer {
        name: "${data.personal.name}",
        phone: "${data.personal.phone}",
        email: "${data.personal.email}",
        linkedin: "${data.personal.linkedin}",
        github: "${data.personal.github}",
        location: "Bengaluru",
    },

    // Press Shift+K here to view detailed education or type :education
    education: "${data.education.degree}",

    // Press Shift+K here to view detailed internship or type :internship
    internship: "${data.internship.role} at ${data.internship.company}",

    // Press Shift+K here to view project details or type :projects
    projects: vec![
${data.projects.map(project => `        "${project.name}",`).join('\n')}
    ],

    // Press Shift+K here to view all skills or type :skills
    skills: "View all skills",

    // Press Shift+K here to view coding platforms or type :coding
    coding_platforms: "View coding platforms",

    // Press Shift+K here to view achievements or type :achievements
    achievements: "View achievements",

    // Press Shift+K here to view contact information or type :contact
    contact: "View contact information",
};`;
};

const generateEducationCode = (data: PortfolioData): string => {
  return `// education.rs - Education\n\nlet education = Education {\n    institution: "${data.education.institution}",\n    duration: "${data.education.duration}",\n    degree: "${data.education.degree}",\n    gpa: "${data.education.gpa}",\n    coursework: vec![\n${data.education.coursework.map(course => `        "${course}",`).join('\n')}\n    ],\n};`;
}

const generateInternshipCode = (data: PortfolioData): string => {
  return `// internship.rs - Internship Experience\n\nlet internship = Internship {\n    company: "${data.internship.company}",\n    duration: "${data.internship.duration}",\n    role: "${data.internship.role}",\n    responsibilities: vec![\n${data.internship.points.map(point => `        "${point.replace(/"/g, '\\"')}",`).join('\n')}\n    ],\n};`;
}

const generateProjectsCode = (data: PortfolioData): string => {
  return `// projects.rs - Portfolio Projects\n\nlet projects = vec![\n${data.projects.map((project, index) => `    Project {\n        id: ${index + 1},\n        name: "${project.name}",\n        duration: "${project.duration}",\n        technologies: vec![${project.tech.map(tech => `"${tech}"`).join(', ')}],\n        github_url: "${project.github}",\n        description: vec![\n${project.points.map(point => `            "${point.replace(/"/g, '\\"')}",`).join('\n')}\n        ],\n    },`).join('\n\n')}\n];`;
};

const generateSkillsCode = (data: PortfolioData): string => {
  return `// skills.rs - Technical Skills\n\nlet skills = SkillSet {\n    languages: vec![\n${data.skills.languages.map(lang => `        "${lang}",`).join('\n')}\n    ],\n    technologies: vec![\n${data.skills.technologies.map(tech => `        "${tech}",`).join('\n')}\n    ],
    frameworks: vec![\n${data.skills.frameworks.map(framework => `        "${framework}",`).join('\n')}\n    ],
    developer_tools: vec![\n${data.skills.developerTools.map(tool => `        "${tool}",`).join('\n')}\n    ],\n};`;
};

const generateCodingCode = (data: PortfolioData): string => {
  return `// coding.rs - Coding Platforms\n\nlet coding_platforms = vec![\n${data.codingPlatforms.map(platform => `    Platform {\n        name: "${platform.name}",\n        problems_solved: "${platform.count}",\n        profile_link: "${platform.link}",\n    },`).join('\n\n')}\n];`;
}

const generateAchievementsCode = (data: PortfolioData): string => {
  return `// achievements.rs - Achievements\n\nlet achievements = vec![\n${data.achievements.map(achievement => `    "${achievement.replace(/"/g, '\\"')}",`).join('\n')}\n];`;
}

const generateContactCode = (data: PortfolioData): string => {
  return `// contact.rs - Contact Information\n\nlet contact = ContactInfo {\n    personal: PersonalInfo {\n        email: "${data.personal.email}",\n        phone: "${data.personal.phone}",\n    },\n\n    social_links: SocialLinks {\n        github: "${data.personal.github}",\n        linkedin: "${data.personal.linkedin}",\n    },\n};`;
};

export const Terminal: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<FileType>('summary');
  const [code, setCode] = useState(() => generateSummaryCode(portfolioData));
  const [position, setPosition] = useState<Position>({ line: 0, column: 0 });
  const [mode, setMode] = useState<'NORMAL' | 'INSERT' | 'COMMAND'>('NORMAL');
  const [command, setCommand] = useState('');
  const [showCommand, setShowCommand] = useState(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [navigationHistory, setNavigationHistory] = useState<Array<{ file: FileType, position: Position }>>([]);
  const [lastGPress, setLastGPress] = useState<number>(0);

  const fileNames = {
    summary: 'portfolio.rs',
    education: 'education.rs',
    internship: 'internship.rs',
    projects: 'projects.rs',
    skills: 'skills.rs',
    coding: 'coding.rs',
    achievements: 'achievements.rs',
    contact: 'contact.rs'
  };

  const codeContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const lineHeight = 20; // Assuming 20px per line
      const fixedBottomHeight = 168;

      const targetY = position.line * lineHeight; // Top of the current line
      const targetBottomY = (position.line + 1) * lineHeight; // Bottom of the current line

      const containerHeight = node.clientHeight; // Height of the scrollable div
      const scrollTop = node.scrollTop;

      // The effective bottom boundary for the cursor to be visible above the fixed bottom elements
      const scrollTriggerBottom = scrollTop + containerHeight - fixedBottomHeight;

      // When scrolling down: if the bottom of the cursor line is below the scroll trigger bottom
      if (targetBottomY > scrollTriggerBottom) {
        // Scroll up just enough to make the bottom of the cursor line visible above the fixed bottom elements
        node.scrollTo({
          top: targetBottomY - (containerHeight - fixedBottomHeight),
          behavior: 'smooth'
        });
      }
      // When scrolling up: if the top of the cursor line is above the visible top
      else if (targetY < scrollTop) {
        // Scroll down just enough to make the top of the cursor line visible
        node.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
      }
    }
  }, [position]);

  const lines = code.split('\n');
  const totalLines = lines.length;

  const extractLinks = useCallback(() => {
    const links: Array<{ line: number; column: number; url: string; text: string }> = [];
    lines.forEach((line, lineIndex) => {
      const urlRegex = /(https?:\/\/[^\s"]+)/g;
      let match;
      while ((match = urlRegex.exec(line)) !== null) {
        links.push({
          line: lineIndex,
          column: match.index!,
          url: match[1],
          text: match[1]
        });
      }
    });
    return links;
  }, [lines]);

  // Word navigation helpers
  const isWordChar = (char: string) => /[a-zA-Z0-9_:",={}/+\-*.![\]%\\()@]/.test(char);
  const isWhitespace = (char: string) => /\s/.test(char);

  const findNextWord = (currentPos: Position) => {
    const currentLine = lines[currentPos.line];
    if (!currentLine) return currentPos;

    let { line, column } = currentPos;

    // Skip current word if we're in the middle of one
    while (column < currentLine.length && isWordChar(currentLine[column])) {
      column++;
    }

    // Skip whitespace
    while (column < currentLine.length && isWhitespace(currentLine[column])) {
      column++;
    }

    // If we reached end of line, go to next line
    if (column >= currentLine.length) {
      line++;
      column = 0;
      // Skip empty lines and find first word
      while (line < lines.length) {
        const nextLine = lines[line];
        if (nextLine.trim().length > 0) {
          // Find first non-whitespace character
          while (column < nextLine.length && isWhitespace(nextLine[column])) {
            column++;
          }
          break;
        }
        line++;
        column = 0;
      }
    }

    return { line: Math.min(line, lines.length - 1), column };
  };

  const findPrevWord = (currentPos: Position) => {
    let { line, column } = currentPos;

    // Move back one character first
    if (column > 0) {
      column--;
    } else if (line > 0) {
      line--;
      column = lines[line]?.length || 0;
      if (column > 0) column--;
    }

    // Skip whitespace backwards
    while (line >= 0) {
      const currentLine = lines[line];
      if (!currentLine) break;

      while (column >= 0 && isWhitespace(currentLine[column])) {
        column--;
      }

      if (column >= 0) break;

      line--;
      if (line >= 0) {
        column = lines[line]?.length || 0;
        if (column > 0) column--;
      }
    }

    // Find start of current word
    if (line >= 0) {
      const currentLine = lines[line];
      while (column > 0 && isWordChar(currentLine[column - 1])) {
        column--;
      }
    }

    return { line: Math.max(0, line), column: Math.max(0, column) };
  };
  const links = extractLinks();

  const findNearestLink = (currentPos: Position, direction: 'next' | 'prev') => {
    const sortedLinks = [...links].sort((a, b) => {
      if (a.line === b.line) return a.column - b.column;
      return a.line - b.line;
    });

    if (direction === 'next') {
      return sortedLinks.find(link =>
        link.line > currentPos.line ||
        (link.line === currentPos.line && link.column > currentPos.column)
      ) || sortedLinks[0];
    } else {
      return [...sortedLinks].reverse().find(link =>
        link.line < currentPos.line ||
        (link.line === currentPos.line && link.column < currentPos.column)
      ) || sortedLinks[sortedLinks.length - 1];
    }
  };

  const detectSection = (lineIndex: number): FileType | null => {
    const line = lines[lineIndex];
    if (!line) return null;

    if (line.includes('education:')) return 'education';
    if (line.includes('internship:')) return 'internship';
    if (line.includes('projects:')) return 'projects';
    if (line.includes('skills:')) return 'skills';
    if (line.includes('coding_platforms:')) return 'coding';
    if (line.includes('achievements:')) return 'achievements';
    if (line.includes('contact:')) return 'contact';

    return null;
  };

  const switchToFile = (fileType: FileType) => {
    // Save current position to history
    setNavigationHistory(prev => [...prev, { file: currentFile, position }]);

    let newCode = '';
    switch (fileType) {
      case 'summary':
        newCode = generateSummaryCode(portfolioData);
        break;
      case 'education':
        newCode = generateEducationCode(portfolioData);
        break;
      case 'internship':
        newCode = generateInternshipCode(portfolioData);
        break;
      case 'projects':
        newCode = generateProjectsCode(portfolioData);
        break;
      case 'skills':
        newCode = generateSkillsCode(portfolioData);
        break;
      case 'coding':
        newCode = generateCodingCode(portfolioData);
        break;
      case 'achievements':
        newCode = generateAchievementsCode(portfolioData);
        break;
      case 'contact':
        newCode = generateContactCode(portfolioData);
        break;
    }

    setCurrentFile(fileType);
    setCode(newCode);
    setPosition({ line: 0, column: 0 });
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const lastLocation = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));

      let newCode = '';
      switch (lastLocation.file) {
        case 'summary':
          newCode = generateSummaryCode(portfolioData);
          break;
        case 'education':
          newCode = generateEducationCode(portfolioData);
          break;
        case 'internship':
          newCode = generateInternshipCode(portfolioData);
          break;
        case 'projects':
          newCode = generateProjectsCode(portfolioData);
          break;
        case 'skills':
          newCode = generateSkillsCode(portfolioData);
          break;
        case 'coding':
          newCode = generateCodingCode(portfolioData);
          break;
        case 'achievements':
          newCode = generateAchievementsCode(portfolioData);
          break;
        case 'contact':
          newCode = generateContactCode(portfolioData);
          break;
      }

      setCurrentFile(lastLocation.file);
      setCode(newCode);
      setPosition(lastLocation.position);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (showCommand) {
      setMessage('');
      setError('');
      if (e.key === 'Enter') {
        if (command === 'q' || command === 'quit') {
          setError('Cannot quit from portfolio! Close tab manually.');
        } else if (command === 'w' || command === 'write') {
          setMessage('Portfolio saved! (not actually).');
        } else if (command.startsWith('help')) {
          setMessage('Available commands: q, w, help, portfolio, education, internship, projects, skills, coding, achievements, contact');
        } else if (command === 'portfolio') {
          switchToFile('summary');
        } else if (command === 'education') {
          switchToFile('education');
        } else if (command === 'internship') {
          switchToFile('internship');
        } else if (command === 'projects') {
          switchToFile('projects');
        } else if (command === 'skills') {
          switchToFile('skills');
        } else if (command === 'coding') {
          switchToFile('coding');
        } else if (command === 'achievements') {
          switchToFile('achievements');
        } else if (command === 'contact') {
          switchToFile('contact');
        } else if (command) {
          setError(`Unknown command: ${command}`);
        }
        setShowCommand(false);
        setCommand('');
        setMode('NORMAL');
        return;
      } else if (e.key === 'Escape') {
        setShowCommand(false);
        setCommand('');
        setMode('NORMAL');
        return;
      } else if (e.key === 'Backspace') {
        if (command.length === 0) {
          setShowCommand(false);
          setMode('NORMAL');
        } else {
          setCommand(prev => prev.slice(0, -1));
        }
        return;
      } else if (e.key.length === 1) {
        setCommand(prev => prev + e.key);
        return;
      }
    }
    if (mode === 'NORMAL') {
      // Ctrl+O to go back
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        goBack();
        return;
      }

      switch (e.key) {
        case 'h':
          e.preventDefault();
          setPosition(prev => ({
            ...prev,
            column: Math.max(0, prev.column - 1)
          }));
          break;
        case 'j':
          e.preventDefault();
          setPosition(prev => ({
            ...prev,
            line: Math.min(totalLines - 1, prev.line + 1)
          }));
          break;
        case 'k':
          e.preventDefault();
          setPosition(prev => ({
            ...prev,
            line: Math.max(0, prev.line - 1)
          }));
          break;
        case 'l':
          e.preventDefault();
          setPosition(prev => ({
            ...prev,
            column: Math.min(lines[prev.line]?.length || 0, prev.column + 1)
          }));
          break;
        case 'K':
          if (e.shiftKey) {
            e.preventDefault();
            const section = detectSection(position.line);
            if (section && section !== currentFile) {
              switchToFile(section);
            } else if (currentFile !== 'summary') {
              switchToFile('summary');
            } else {
              const nextLink = findNearestLink(position, 'next');
              if (nextLink) {
                setPosition({ line: nextLink.line, column: nextLink.column });
              }
            }
          }
          break;
        case 'J':
          if (e.shiftKey) {
            e.preventDefault();
            const prevLink = findNearestLink(position, 'prev');
            if (prevLink) {
              setPosition({ line: prevLink.line, column: prevLink.column });
            }
          }
          break;
        case 'Enter':
          e.preventDefault();
          const currentLink = links.find(link =>
            link.line === position.line &&
            position.column >= link.column &&
            position.column < link.text.length
          );
          if (currentLink) {
            window.open(currentLink.url, '_blank');
          }
          break;
        case ':':
          e.preventDefault();
          setShowCommand(true);
          setMode('COMMAND');
          setCommand('');
          break;
        case 'g':
          e.preventDefault();
          const now = Date.now();
          if (now - lastGPress < 500) {
            // Double g - go to top
            setPosition({ line: 0, column: 0 });
            setLastGPress(0);
          } else {
            // Single g - wait for second g
            setLastGPress(now);
          }
          break;
        case 'G':
          if (e.shiftKey) {
            e.preventDefault();
            setPosition({ line: totalLines - 1, column: 0 });
          }
          break;
        case 'w':
          e.preventDefault();
          setPosition(findNextWord(position));
          break;
        case 'b':
          e.preventDefault();
          setPosition(findPrevWord(position));
          break;
      }
    }
  }, [mode, position, totalLines, lines, links, showCommand, command, currentFile, navigationHistory, lastGPress]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderSyntaxHighlighted = (line: string, lineIndex: number) => {
    const isCurrentLine = lineIndex === position.line;
    const tokens = tokenizeRustLine(line);
    let charIndex = 0;

    return (
      <div key={lineIndex} className="flex">
        <span className="text-tokyo-fg-gutter w-8 text-right mr-4 select-none">
          {(lineIndex + 1).toString().padStart(3, ' ')}
        </span>
        <div className="flex-1 relative">
          {tokens.map((token, tokenIndex) => {
            return token.value.split('').map((char, charInTokenIndex) => {
              const currentCharIndex = charIndex++;
              const isCurrentChar = isCurrentLine && currentCharIndex === position.column;
              const isLink = links.some(link =>
                link.line === lineIndex &&
                currentCharIndex >= link.column &&
                currentCharIndex < link.column + link.text.length
              );

              return (
                <span
                  key={`${tokenIndex}-${charInTokenIndex}`}
                  className={`
                  ${token.className}
                  ${isCurrentChar && !showCommand ? 'bg-tokyo-blue text-tokyo-bg' : ''}
                  ${isLink ? 'text-tokyo-cyan underline' : ''}
                  ${char === ' ' ? 'inline-block' : ''}
                `}
                  style={{ minWidth: char === ' ' ? '0.5rem' : 'auto' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            });
          }).flat()}
          {isCurrentLine && position.column >= line.length && (
            <span className="bg-tokyo-blue text-tokyo-bg inline-block w-2">\u00A0</span>
          )}
        </div>
      </div>
    );
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleBlur = () => {
    // Re-focus the input if it loses focus (e.g., when touch keyboard is dismissed)
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="bg-tokyo-bg text-tokyo-fg h-screen font-mono text-sm flex flex-col">
      {/* Hidden input to trigger mobile keyboard */}
      <input
        ref={inputRef}
        type="text"
        className="absolute top-0 left-0 w-0 h-0 opacity-0"
        onBlur={handleBlur}
        aria-hidden="true"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />
      {/* Main content */}
      <div
        ref={codeContainerRef}
        className="flex-1 p-4 overflow-auto"
      >
        <div className="max-w-none">
          {lines.map((line, index) => renderSyntaxHighlighted(line, index))}
        </div>
      </div>

      {/* Messages */}

      {/* Lualine-style statusline */}
      <div className="bg-tokyo-bg-dark border-t border-tokyo-terminal-black flex items-center h-6">
        {/* Left section - Mode */}
        <div className={`px-3 py-1 text-xs font-semibold ${mode === 'NORMAL' ? 'bg-tokyo-blue text-tokyo-bg' :
          mode === 'INSERT' ? 'bg-tokyo-green text-tokyo-bg' :
            'bg-tokyo-yellow text-tokyo-bg'
          }`}>
          {mode}
        </div>

        {/* Left section - File info */}
        <div className="bg-tokyo-bg-highlight px-3 py-1 flex items-center space-x-2">
          <Code className="w-3 h-3 text-tokyo-blue" />
          <span className="text-tokyo-fg text-xs">{fileNames[currentFile]}</span>
          <span className="text-tokyo-orange text-xs">●</span>
        </div>

        {/* Center section - Empty */}
        <div className="flex-1 px-3 py-1">
          {/* Empty space */}
        </div>

        {/* Right section - Position info */}
        <div className="bg-tokyo-bg-highlight px-3 py-1 text-tokyo-fg-dark text-xs">
          {position.line + 1}:{position.column + 1}
        </div>

        {/* Right section - File stats */}
        <div className="bg-tokyo-blue px-3 py-1 text-tokyo-bg text-xs font-semibold">
          {Math.round((position.line + 1) / totalLines * 100)}% ☰ {totalLines}
        </div>
      </div>

      {/* Command line below statusline - always visible */}
      <div className="bg-tokyo-bg px-4 py-1 border-t border-tokyo-terminal-black min-h-[24px]">
        {showCommand ? (
          <>
            <span className="text-tokyo-fg text-sm">:</span>
            <span className="text-tokyo-yellow text-sm">{command}</span>
            <span className="bg-tokyo-blue text-tokyo-bg inline-block w-2 ml-1">\u00A0</span>
          </>
        ) : (
          <>
            <span className={(message === "") ? "text-tokyo-red1" : "text-tokyo-yellow" + "text-sm"}>{(message === "") ? error : message}</span>
            <span className="text-transparent text-sm">\u00A0</span>
          </>
        )}
      </div>
    </div>
  );
};
