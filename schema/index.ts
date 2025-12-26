import { em } from "bknd";
import media from "./media";

export default em(
	{
		...media,
	},
	() => {},
).toJSON();
