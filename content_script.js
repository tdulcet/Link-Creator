"use strict";

// communication type
const CONTENT = "content";

browser.runtime.onMessage.addListener((message) => {
	if (message.type === CONTENT) {
		const links = document.querySelectorAll("link[rel=shortlink],link[rel=shorturl]");

		const response = {
			type: CONTENT,
			links: Array.from(links, (link) => link.href).filter(Boolean)
		};
		// console.log(response);

		return Promise.resolve(response);

	}
});
