import data from "../sections/Data";

export default function(): string {
	return `// internship.rs - Internship Experience\n\nlet internship = Internship {\n    company: "${data.internship.company}",\n    duration: "${data.internship.duration}",\n    role: "${data.internship.role}",\n    responsibilities: vec![\n${data.internship.points.map(point => `        "${point.replace(/"/g, '\\"')}",`).join('\n')}\n    ],\n};`;
}
