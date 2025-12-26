import { entity, enumm, text, boolean } from "bknd";

export default {
	todos: entity(
		"todos",
		{
			title: text(),
			description: text(),
			completed: boolean(),
		},
		{
			primary_format: "uuid",
			name: "Todos",
			name_singular: "Todo",
			description: "The example entity",
		},
	),
};
