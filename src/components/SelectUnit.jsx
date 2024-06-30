import { useState, useEffect } from 'react';
import { availableData, parseSelectedUnits, parseFilterOptions } from '../data';
import './select-unit.css';

const filterPredicates = [{
		name: 'isStarred',
		desc: 'If this item is marked bold on the book.',
	}, {
		name: 'isPhrase',
		desc: 'If this item is a phrase.',
	}, {
		name: 'isProper',
		desc: 'If this item is a proper noun.',
	}
];

const filterExamples = [{
		expr: 'isStarred',
		desc: 'Show bold words on the books only.',
	}, {
		expr: 'isPhrase || isStarred',
		desc: 'Show phrases or bold words only.',
	}, {
		expr: '!isProper',
		desc: 'Show common words only.',
	}, {
		expr: 'true',
		desc: 'Select everything.',
	}
];

export function UnitSelector() {
	const [units, setUnits] = useState(parseSelectedUnits);
	const [filterOptions, setFilterOptions] = useState(parseFilterOptions);
	
	useEffect(() => {
		localStorage.setItem('abc-def-selectedUnits', JSON.stringify(units));
	}, [units]);

	useEffect(() => {
	    localStorage.setItem('abc-def-filterOptions', filterOptions);
	}, [filterOptions])

	const onUnitSelectionChange = (unit) => {
		if (units.includes(unit)) {
			setUnits(units.filter((u) => u !== unit));
		} else {
			setUnits(units.concat([unit]));
		}
	};

	return (
		<div>
			<h2>Select Unit</h2>
			<section className="filter-selector">
				<div className="filter-input-container">
					<label htmlFor='filter-input'>Filter Expression:</label>
					<input id="filter-input" name="filter-input" type="text" value={filterOptions} onChange={(e) => setFilterOptions(e.target.value)} placeholder="Filter expression..." />
				</div>
				<div className="filter-desc desc-text">
					<p>Write a expression to filter the items you need, available predicate are:</p>
					<ul>
						{filterPredicates.map((predicate) => (
						    <li key={predicate.name}><code>{predicate.name}</code>: {predicate.desc}</li>
						))}
					</ul>
					<p>Combine these predicates with "not"(<code>!</code>), "or"(<code>||</code>) and "and"(<code>&&</code>). Here are some examples:</p>
					<ul>
						{filterExamples.map((example) => (
						    <li key={example.expr}><a className="a-button" onClick={() => setFilterOptions(example.expr)}><code>{example.expr}</code></a>: {example.desc}</li>
						))}
					</ul>
				</div>
			</section>
			<fieldset className="unit-selector">
				<legend>Choose units:</legend>
				{availableData.map((unit) => (
					<div key={unit[0]} className='unit-selection'>
						<input type="checkbox" checked={units.includes(unit[1].href)} name={unit[0]} onChange={() => onUnitSelectionChange(unit[1].href)} />
						<label htmlFor={unit[0]}>{unit[0]}</label>
					</div>
				))}
			</fieldset>
		</div>
	);
}
