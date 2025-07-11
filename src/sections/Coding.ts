import data from "./Data";

export default function(): string {
	return `// coding.rs - Coding Platforms\n\nlet coding_platforms = vec![\n${data.codingPlatforms.map(platform => `    Platform {\n        name: "${platform.name}",\n        problems_solved: "${platform.count}",\n        profile_link: "${platform.link}",\n    },`).join('\n\n')}\n];`;
}
