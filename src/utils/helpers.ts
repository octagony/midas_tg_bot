export const escapeMarkdown = (text: string | undefined | null): string => {
	if (text === undefined || text === null) {
		return "";
	}
	return text.toString().replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
};
