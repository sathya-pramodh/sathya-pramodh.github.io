import data from "./Data";

export default function(): string {
	return `// education.rs - Education\n\nlet education = Education {\n    institution: "${data.education.institution}",\n    duration: "${data.education.duration}",\n    degree: "${data.education.degree}",\n    gpa: "${data.education.gpa}",\n    coursework: vec![\n${data.education.coursework.map(course => `        "${course}",`).join('\n')}\n    ],\n};`;
}
