import { em } from "bknd";
import media from "./media";
import todos from "./todos";

export default em(
	{
		...media,
		...todos,
	},
	() => {},
).toJSON();
