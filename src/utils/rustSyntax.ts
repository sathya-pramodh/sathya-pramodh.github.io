export interface SyntaxToken {
  type: 'keyword' | 'type' | 'string' | 'comment' | 'number' | 'function' | 'macro' | 'attribute' | 'lifetime' | 'operator' | 'punctuation' | 'text';
  value: string;
  className: string;
}

export function tokenizeRustLine(line: string): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  let i = 0;
  
  const keywords = new Set([
    'use', 'pub', 'struct', 'impl', 'fn', 'let', 'const', 'enum', 'trait', 'match', 
    'if', 'else', 'for', 'while', 'loop', 'return', 'break', 'continue', 'mod',
    'extern', 'crate', 'self', 'super', 'as', 'where', 'mut', 'ref', 'move',
    'static', 'unsafe', 'async', 'await', 'dyn', 'type', 'in'
  ]);
  
  const types = new Set([
    'String', 'Vec', 'HashMap', 'DateTime', 'Utc', 'Self', 'usize', 'isize',
    'i8', 'i16', 'i32', 'i64', 'i128', 'u8', 'u16', 'u32', 'u64', 'u128',
    'f32', 'f64', 'bool', 'char', 'str', 'Option', 'Result', 'Box', 'Rc', 'Arc'
  ]);
  
  while (i < line.length) {
    const char = line[i];
    
    // Skip whitespace
    if (/\s/.test(char)) {
      let whitespace = '';
      while (i < line.length && /\s/.test(line[i])) {
        whitespace += line[i];
        i++;
      }
      tokens.push({ type: 'text', value: whitespace, className: '' });
      continue;
    }
    
    // Comments
    if (char === '/' && line[i + 1] === '/') {
      const comment = line.slice(i);
      tokens.push({ type: 'comment', value: comment, className: 'text-tokyo-comment' });
      break;
    }
    
    // Strings
    if (char === '"') {
      let string = '"';
      i++;
      while (i < line.length && line[i] !== '"') {
        if (line[i] === '\\' && i + 1 < line.length) {
          string += line[i] + line[i + 1];
          i += 2;
        } else {
          string += line[i];
          i++;
        }
      }
      if (i < line.length) {
        string += '"';
        i++;
      }
      tokens.push({ type: 'string', value: string, className: 'text-tokyo-green' });
      continue;
    }
    
    // Character literals
    if (char === "'" && i + 2 < line.length && line[i + 2] === "'") {
      const charLit = line.slice(i, i + 3);
      tokens.push({ type: 'string', value: charLit, className: 'text-tokyo-green' });
      i += 3;
      continue;
    }
    
    // Numbers
    if (/\d/.test(char)) {
      let number = '';
      while (i < line.length && /[\d._]/.test(line[i])) {
        number += line[i];
        i++;
      }
      // Check for type suffix (like 32u, 64i, etc.)
      while (i < line.length && /[a-zA-Z]/.test(line[i])) {
        number += line[i];
        i++;
      }
      tokens.push({ type: 'number', value: number, className: 'text-tokyo-cyan' });
      continue;
    }
    
    // Attributes
    if (char === '#' && line[i + 1] === '[') {
      let attr = '#[';
      i += 2;
      let depth = 1;
      while (i < line.length && depth > 0) {
        if (line[i] === '[') depth++;
        if (line[i] === ']') depth--;
        attr += line[i];
        i++;
      }
      tokens.push({ type: 'attribute', value: attr, className: 'text-tokyo-yellow' });
      continue;
    }
    
    // Macros
    if (/[a-zA-Z_]/.test(char)) {
      let word = '';
      while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) {
        word += line[i];
        i++;
      }
      
      // Check if it's followed by ! (macro)
      if (i < line.length && line[i] === '!') {
        word += '!';
        i++;
        tokens.push({ type: 'macro', value: word, className: 'text-tokyo-magenta' });
        continue;
      }
      
      // Check if it's a keyword
      if (keywords.has(word)) {
        tokens.push({ type: 'keyword', value: word, className: 'text-tokyo-purple' });
        continue;
      }
      
      // Check if it's a type
      if (types.has(word) || /^[A-Z]/.test(word)) {
        tokens.push({ type: 'type', value: word, className: 'text-tokyo-yellow' });
        continue;
      }
      
      // Check if it's followed by ( (function call)
      let j = i;
      while (j < line.length && /\s/.test(line[j])) j++;
      if (j < line.length && line[j] === '(') {
        tokens.push({ type: 'function', value: word, className: 'text-tokyo-blue' });
        continue;
      }
      
      // Regular identifier
      tokens.push({ type: 'text', value: word, className: 'text-tokyo-fg' });
      continue;
    }
    
    // Operators and punctuation
    if (/[+\-*/%=<>!&|^~?:;,.]/.test(char)) {
      let op = char;
      i++;
      // Handle multi-character operators
      if (i < line.length) {
        const twoChar = char + line[i];
        if (['==', '!=', '<=', '>=', '&&', '||', '->', '=>', '..', '::'].includes(twoChar)) {
          op = twoChar;
          i++;
        }
      }
      tokens.push({ type: 'operator', value: op, className: 'text-tokyo-orange' });
      continue;
    }
    
    // Brackets and braces
    if (/[(){}\[\]]/.test(char)) {
      tokens.push({ type: 'punctuation', value: char, className: 'text-tokyo-fg' });
      i++;
      continue;
    }
    
    // Everything else
    tokens.push({ type: 'text', value: char, className: 'text-tokyo-fg' });
    i++;
  }
  
  return tokens;
}
