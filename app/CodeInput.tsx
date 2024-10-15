// CodeInput.tsx

import React from "react";

interface CodeInputProps {
	code: string;
	onCodeChange: (code: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, onCodeChange }) => {
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onCodeChange(e.target.value);
	};

	return (
		<div>
			<h2>Input Code</h2>
			<textarea value={code} onChange={handleChange} rows={5} cols={50} />
		</div>
	);
};

export default CodeInput;
