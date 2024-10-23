import React, { useState, useEffect } from "react";
import OperatorDefinitionTable from "./OperatorDefinitionTable";
import CodeInput from "./CodeInput";
import Output from "./Output";
import { generateGrammar, Operator, parseAndParenthesize } from "@src/index";
import { Grammar } from "ohm-js";

import "./styles/App.scss";

function App() {
	const [operators, setOperators] = useState<Operator[]>([{
        symbol: "+",
        precedence: 1,
        associativity: "left",
    },{
        symbol: "-",
        precedence: 1,
        associativity: "left",
    },{
        symbol: "*",
        precedence: 2,
        associativity: "left",
    },{
        symbol: "/",
        precedence: 2,
        associativity: "left",
    },{
        symbol: "**",
        precedence: 3,
        associativity: "right",
    }
    ]);
	const [inputCode, setInputCode] = useState("1 + 1 * 4 ** 2");
	const [outputCode, setOutputCode] = useState("");
	const [grammar, setGrammar] = useState<Grammar | undefined>(undefined);
	const [grammarText, setGrammarText] = useState<string>("");

	// Update grammar and parsed code whenever operators or inputCode changes
	useEffect(() => {
		if (operators.length > 0) {
			const { grammar, definition } = generateGrammar(operators);
			setGrammar(grammar);

			// Assuming generateGrammar returns a Grammar object that has a textual representation
			setGrammarText(definition);

			if (grammar && inputCode) {
				const result = parseAndParenthesize(
					grammar,
					inputCode,
					operators,
				);
				setOutputCode(result);
			}
		}
	}, [operators, inputCode]);

	const handleOperatorsChange = (newOperators: Operator[]) => {
		setOperators(newOperators);
	};

	const handleCodeChange = (code: string) => {
		setInputCode(code);
	};

	return (
		<div className="App">
			<h1>Operator Parenthesizer</h1>
			<OperatorDefinitionTable
				operators={operators}
				onOperatorsChange={handleOperatorsChange}
			/>
			<CodeInput code={inputCode} onCodeChange={handleCodeChange} />

			<h2>Ohm.js Grammar</h2>
			<pre>{grammarText}</pre>

			<Output outputCode={outputCode} />
		</div>
	);
}

export default App;
