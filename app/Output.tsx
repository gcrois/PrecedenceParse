// Output.tsx

import React from "react";

interface OutputProps {
	outputCode: string;
}

const Output: React.FC<OutputProps> = ({ outputCode }) => {
	return (
		<div>
			<h2>Output</h2>
			<pre>{outputCode}</pre>
		</div>
	);
};

export default Output;
