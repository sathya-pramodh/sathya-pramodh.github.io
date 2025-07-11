import React, { useState, useEffect, useCallback } from 'react';
import { Code } from 'lucide-react';
import { tokenizeRustLine } from '../utils/rustSyntax';
import generatePortfolioCode from '../sections/Portfolio';
import generateEducationCode from "../sections/Education";
import generateInternshipCode from "../sections/Internship";
import generateProjectsCode from "../sections/Projects";
import generateSkillsCode from "../sections/Skills";
import generateCodingCode from "../sections/Coding";
import generateAchievementsCode from "../sections/Achievements";
import generateContactCode from "../sections/Contact";

type FileType = 'portfolio' | 'education' | 'internship' | 'projects' | 'skills' | 'coding' | 'achievements' | 'contact';

interface Position {
  line: number;
  column: number;
}

const fileNames = {
  portfolio: 'portfolio.rs',
  education: 'education.rs',
  internship: 'internship.rs',
  projects: 'projects.rs',
  skills: 'skills.rs',
  coding: 'coding.rs',
  achievements: 'achievements.rs',
  contact: 'contact.rs'
};

const isWordChar = (char: string) => /[a-zA-Z0-9_:",={}/+\-*.![\]%\\()@]/.test(char);
const isWhitespace = (char: string) => /\s/.test(char);

export const Terminal: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<FileType>('portfolio');
  const [code, setCode] = useState(() => generatePortfolioCode());
  const [position, setPosition] = useState<Position>({ line: 0, column: 0 });
  const [mode, setMode] = useState<'NORMAL' | 'INSERT' | 'COMMAND'>('NORMAL');
  const [command, setCommand] = useState('');
  const [showCommand, setShowCommand] = useState(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [navigationHistory, setNavigationHistory] = useState<Array<{ file: FileType, position: Position }>>([]);
  const [lastGPress, setLastGPress] = useState<number>(0);

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
      case 'portfolio':
        newCode = generatePortfolioCode();
        break;
      case 'education':
        newCode = generateEducationCode();
        break;
      case 'internship':
        newCode = generateInternshipCode();
        break;
      case 'projects':
        newCode = generateProjectsCode();
        break;
      case 'skills':
        newCode = generateSkillsCode();
        break;
      case 'coding':
        newCode = generateCodingCode();
        break;
      case 'achievements':
        newCode = generateAchievementsCode();
        break;
      case 'contact':
        newCode = generateContactCode();
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
        case 'portfolio':
          newCode = generatePortfolioCode();
          break;
        case 'education':
          newCode = generateEducationCode();
          break;
        case 'internship':
          newCode = generateInternshipCode();
          break;
        case 'projects':
          newCode = generateProjectsCode();
          break;
        case 'skills':
          newCode = generateSkillsCode();
          break;
        case 'coding':
          newCode = generateCodingCode();
          break;
        case 'achievements':
          newCode = generateAchievementsCode();
          break;
        case 'contact':
          newCode = generateContactCode();
          break;
      }

      setCurrentFile(lastLocation.file);
      setCode(newCode);
      setPosition(lastLocation.position);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const currentLink = links.find(link =>
      link.line === position.line &&
      position.column >= link.column &&
      position.column < link.text.length
    );
    const now = Date.now();
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
          switchToFile('portfolio');
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
            } else if (currentFile !== 'portfolio') {
              switchToFile('portfolio');
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
