import data from "./Data";

export default function(): string {
	return `// skills.rs - Technical Skills\n\nlet skills = SkillSet {\n    languages: vec![\n${data.skills.languages.map(lang => `        "${lang}",`).join('\n')}\n    ],\n    technologies: vec![\n${data.skills.technologies.map(tech => `        "${tech}",`).join('\n')}\n    ],
    frameworks: vec![\n${data.skills.frameworks.map(framework => `        "${framework}",`).join('\n')}\n    ],
    developer_tools: vec![\n${data.skills.developerTools.map(tool => `        "${tool}",`).join('\n')}\n    ],\n};`;
};
