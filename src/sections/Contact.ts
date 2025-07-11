import data from "./Data";

export default function(): string {
	return `// contact.rs - Contact Information\n\nlet contact = ContactInfo {\n    personal: PersonalInfo {\n        email: "${data.personal.email}",\n        phone: "${data.personal.phone}",\n    },\n\n    social_links: SocialLinks {\n        github: "${data.personal.github}",\n        linkedin: "${data.personal.linkedin}",\n    },\n};`;
};
