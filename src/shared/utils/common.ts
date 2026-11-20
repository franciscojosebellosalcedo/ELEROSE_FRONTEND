export const formattDate = (date: string | Date | undefined, withTime?: boolean ): string => {

      if (!date) return "";

	let year: number, month: number, day: number;
	let hours = 0, minutes = 0;

	if (date instanceof Date) {
		year = date.getFullYear();
		month = date.getMonth() + 1;
		day = date.getDate();

		hours = date.getHours();
		minutes = date.getMinutes();

	} else {
		const parsedDate = new Date(date);

		if (isNaN(parsedDate.getTime())) return "";

		year = parsedDate.getFullYear();
		month = parsedDate.getMonth() + 1;
		day = parsedDate.getDate();

		hours = parsedDate.getHours();
		minutes = parsedDate.getMinutes();
	}

	const formattedDay = String(day).padStart(2, "0");
	const formattedMonth = String(month).padStart(2, "0");
	const formattedYear = String(year);

	const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;

	if (!withTime) return formattedDate;

	const period = hours >= 12 ? "PM" : "AM";
	const formattedHours = String(hours % 12 || 12).padStart(2, "0");
	const formattedMinutes = String(minutes).padStart(2, "0");

	return `${formattedDate} ${formattedHours}:${formattedMinutes} ${period}`;
};