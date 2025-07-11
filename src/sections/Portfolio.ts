import data from "./Data";

export default function(): string {
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
