import { useState, useEffect } from 'react';
import { availableData, parseSelectedUnits } from '../data';

export function UnitSelector() {
	const [units, setUnits] = useState(() => parseSelectedUnits());
	useEffect(() => {
	    localStorage.setItem('abc-def-selectedUnits', JSON.stringify(units));
	}, [units]);

	const onUnitSelectionChange = (unit) => {
		if (units.includes(unit)) {
		    setUnits(units.filter((u) => u !== unit));
		} else {
			setUnits(units.concat([unit]));
		}
	};

	return (
		<>
			<h2>Select Unit</h2>
			<div class="unit-selector">
				{availableData.map((unit) => (
					<div key={unit[0]}>
						<input type="checkbox" checked={units.includes(unit[1].href)} name={unit[0]} onChange={() => onUnitSelectionChange(unit[1].href)} />
						<label htmlFor={unit[0]}>{unit[0]}</label>
					</div>
				))}
			</div>
		</>
	);
}
