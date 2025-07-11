import data from "./Data";

export default function(): string {
	return `// projects.rs - Portfolio Projects\n\nlet projects = vec![\n${data.projects.map((project, index) => `    Project {\n        id: ${index + 1},\n        name: "${project.name}",\n        duration: "${project.duration}",\n        technologies: vec![${project.tech.map(tech => `"${tech}"`).join(', ')}],\n        github_url: "${project.github}",\n        description: vec![\n${project.points.map(point => `            "${point.replace(/"/g, '\\"')}",`).join('\n')}\n        ],\n    },`).join('\n\n')}\n];`;
};
