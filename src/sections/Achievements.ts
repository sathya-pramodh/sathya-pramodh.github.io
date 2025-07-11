import data from "./Data";

export default function(): string {
	return `// achievements.rs - Achievements\n\nlet achievements = vec![\n${data.achievements.map(achievement => `    "${achievement.replace(/"/g, '\\"')}",`).join('\n')}\n];`;
}
