interface PortfolioData {
	personal: {
		name: string;
		phone: string;
		email: string;
		linkedin: string;
		github: string;
	};
	education: {
		institution: string;
		duration: string;
		degree: string;
		gpa: string;
		coursework: string[];
	};
	internship: {
		company: string;
		duration: string;
		role: string;
		points: string[];
	};
	projects: Array<{
		name: string;
		tech: string[];
		duration: string;
		points: string[];
		github: string;
	}>;
	skills: {
		languages: string[];
		technologies: string[];
		frameworks: string[];
		developerTools: string[];
	};
	codingPlatforms: Array<{
		name: string;
		count: string;
		link: string;
	}>;
	achievements: string[];
}

const portfolioData: PortfolioData = {
	personal: {
		name: "N Sathya Pramodh",
		phone: "+91-7259469949",
		email: "sathyapramodh10@gmail.com",
		linkedin: "https://linkedin.com/in/sathya-pramodh-606877259",
		github: "https://github.com/sathya-pramodh",
	},
	education: {
		institution: "Ramaiah Institute of Technology, Bengaluru",
		duration: "2022 - 2026",
		degree: "B.E - Information Science and Engineering",
		gpa: "9.17/10.0",
		coursework: ["DSA", "OOPS Concepts", "Operating Systems", "DBMS", "UI/UX Design", "Computer Networks", "Theory of Computation", "Machine Learning*", "Cloud Computing*", "Systems Design*", "Devops*", "System Simulation*"],
	},
	internship: {
		company: "Samsung RND Institute, Bengaluru",
		duration: "Sep 2024 - Present",
		role: "Research Intern",
		points: [
			"Coded the BPR model in Tensorflow to recommend apps using sequential data with an accuracy of 92%.",
			"Gathered metrics for various models and fine-tuned them to increase training speeds by 30%.",
			"Optimized the BPR and MLP models for on-device training with a maximum power efficiency of 80%.",
			"Reviewed about 5 research papers independently to come up with the necessary algorithms to use.",
		],
	},
	projects: [
		{
			name: "Neovim",
			tech: ["C", "Lua", "Developer Tools", "Text Editor", "MessagePack RPC", "Open Source"],
			duration: "2025 - Present",
			points: [
				"Fixed an issue with \":checkhealth\" not reporting irregular configurations in language providers.",
				"Fixed an issue with stderr messages being highlighted differently in \":!cmd\" outputs.",
				"Implemented the \":restart\" command which removed the need of having to quit out of Neovim to reload.",
				"Created a sample Neovim configuration to demonstrate the usage of the \":restart\" command.",
			],
			github: "https://github.com/neovim/neovim",
		},
		{
			name: "PaceManBot",
			tech: ["Rust", "Discord API", "Websockets", "Serenity-rs", "Minecraft"],
			duration: "2023 - Present",
			points: [
				"Deployed an end-to-end system using Websockets and Discord API to serve 125+ discord servers.",
				"Built an in-memory caching system from scratch to bring message delays from 10s down to 1s.",
				"Supported multiple versions of Minecraft like 1.15 and 1.7 to improve usability.",
				"Added support for the All Advancements category of Minecraft Speedrunning for the version 1.16.1.",
			],
			github: "https://github.com/paceman-mcsr/pacemanbot",
		},
		{
			name: "Resetti",
			tech: ["Golang", "Macros", "Linux Desktop Automation", "Github Actions", "Minecraft"],
			duration: "2022 - Present",
			points: [
				"Developed an initial version of the Moving Wall feature which improved end-user experience.",
				"Implemented a simple and lightweight Logging framework which improved developer experience.",
				"Built workflows to automatically distribute the macro through the Arch User Repositories (AUR).",
				"Added support to configure multiple resolutions to enhance compatibility.",
			],
			github: "https://github.com/tesselslate/resetti",
		},
		{
			name: "AHKLinux",
			tech: ["Python3", "Interpreter Design", "Unit testing"],
			duration: "2021 - 2024",
			points: [
				"Developed a simple interpreter system to parse AutoHotKey scripts on Linux/X11 Desktops natively.",
				"Packaged the CLI system using PyPi for distribution through pip.",
				"Created unit tests using Pytest to improve test coverage.",
				"Wrote integration and system tests to improve GUI testing.",
			],
			github: "https://github.com/sathya-pramodh/AHKLinux",
		},
	],
	skills: {
		languages: ["C", "Lua", "Python3", "Rust", "Golang", "Java", "SQL", "Bash"],
		technologies: ["Discord API", "MySQL", "Oracle SQL", "Firebase Cloud Firestore", "MessagePack RPC", "Websockets"],
		frameworks: ["Flutter", "Serenity-rs", "Pytest", "X11 xproto", "tokio", "tokio-tungstenite", "serde", "serde-json"],
		developerTools: ["Neovim", "Figma", "Jupyter Notebook", "Linux terminal", "mdBook", "Git", "Github", "Github Actions", "Docker", "Tmux", "IntelliJ IDEA", "Android Studio"],
	},
	codingPlatforms: [
		{
			name: "Codeforces",
			count: "400+",
			link: "https://codeforces.com/profile/sathya_pramodh",
		},
		{
			name: "LeetCode",
			count: "100+",
			link: "https://leetcode.com/u/sathya-pramodh/",
		},
	],
	achievements: [
		"Selected in SIH at College Level in 2022-23 and 2023-24 along with 4 other members.",
		"Participated in Solving For India at Zonal Level in 2022 as a team of 4.",
		"Participated in Code To Give, a hackathon by Morgan Stanley in 2025 as a team of 6.",
		"Mentored in wHACKiest, a 24-hour hackathon by CodeRIT (the most active coding club of RIT).",
		"Served as the Lead of CodeRIT in 2025-2026.",
	],
};


export default portfolioData;
