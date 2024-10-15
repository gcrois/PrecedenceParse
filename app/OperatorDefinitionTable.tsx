import React, { useState } from "react";
import { Operator } from "@src/index";

interface OperatorDefinitionTableProps {
	operators: Operator[];
	onOperatorsChange: (operators: Operator[]) => void;
}

const OperatorDefinitionTable: React.FC<OperatorDefinitionTableProps> = ({
	operators,
	onOperatorsChange,
}) => {
	const [newOperator, setNewOperator] = useState<Operator>({
		symbol: "",
		precedence: 1,
		associativity: "left",
	});

	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editedOperator, setEditedOperator] = useState<Operator | null>(null);

	const handleAddOperator = () => {
		if (newOperator.symbol.trim() !== "") {
			onOperatorsChange([...operators, newOperator]);
			setNewOperator({
				symbol: "",
				precedence: 1,
				associativity: "left",
			});
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		isEdit: boolean = false,
	) => {
		const { name, value } = e.target;
		if (isEdit && editedOperator !== null) {
			setEditedOperator({
				...editedOperator,
				[name]: name === "precedence" ? parseInt(value) : value,
			});
		} else {
			setNewOperator({
				...newOperator,
				[name]: name === "precedence" ? parseInt(value) : value,
			});
		}
	};

	const handleRemoveOperator = (index: number) => {
		const updatedOperators = operators.filter((_, i) => i !== index);
		onOperatorsChange(updatedOperators);
	};

	const handleEditOperator = (index: number) => {
		setEditingIndex(index);
		setEditedOperator(operators[index]);
	};

	const handleSaveOperator = (index: number) => {
		if (editedOperator !== null) {
			const updatedOperators = operators.map((op, i) =>
				i === index ? editedOperator : op,
			);
			onOperatorsChange(updatedOperators);
			setEditingIndex(null);
			setEditedOperator(null);
		}
	};

	return (
		<div>
			<h2>Define Operators</h2>
			<table>
				<thead>
					<tr>
						<th>Symbol</th>
						<th>Precedence</th>
						<th>Associativity</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{operators.map((op, index) => (
						<tr key={index}>
							{editingIndex === index ? (
								<>
									<td>
										<input
											name="symbol"
											value={editedOperator?.symbol}
											onChange={(e) =>
												handleInputChange(e, true)
											}
										/>
									</td>
									<td>
										<input
											name="precedence"
											type="number"
											value={editedOperator?.precedence}
											onChange={(e) =>
												handleInputChange(e, true)
											}
										/>
									</td>
									<td>
										<select
											name="associativity"
											value={
												editedOperator?.associativity
											}
											onChange={(e) =>
												handleInputChange(e, true)
											}
										>
											<option value="left">Left</option>
											<option value="right">Right</option>
										</select>
									</td>
									<td>
										<button
											onClick={() =>
												handleSaveOperator(index)
											}
										>
											Save
										</button>
										<button
											onClick={() =>
												setEditingIndex(null)
											}
										>
											Cancel
										</button>
									</td>
								</>
							) : (
								<>
									<td>{op.symbol}</td>
									<td>{op.precedence}</td>
									<td>{op.associativity}</td>
									<td>
										<button
											onClick={() =>
												handleEditOperator(index)
											}
										>
											Edit
										</button>
										<button
											onClick={() =>
												handleRemoveOperator(index)
											}
										>
											Remove
										</button>
									</td>
								</>
							)}
						</tr>
					))}
					<tr>
						<td>
							<input
								name="symbol"
								value={newOperator.symbol}
								onChange={handleInputChange}
							/>
						</td>
						<td>
							<input
								name="precedence"
								type="number"
								value={newOperator.precedence}
								onChange={handleInputChange}
							/>
						</td>
						<td>
							<select
								name="associativity"
								value={newOperator.associativity}
								onChange={handleInputChange}
							>
								<option value="left">Left</option>
								<option value="right">Right</option>
							</select>
						</td>
						<td>
							<button onClick={handleAddOperator}>
								Add Operator
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default OperatorDefinitionTable;
