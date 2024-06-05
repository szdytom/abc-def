import './index.css';
import { SpellBox } from './components/SpellBox';
import { UnitSelector } from './components/SelectUnit';
import { useEffect, useState } from 'react';
import { parseSelectedUnits, loadWordList } from './data';

export function App() {
	// const [page, setPage] = useState(() => {
	// 	return parseSelectedUnits().length > 0 ? 'spell' : 'select';
	// });

	const [page, setPage] = useState(parseSelectedUnits().length > 0 ? 'spell' : 'select');

	const [wordlist, setWordlist] = useState(null);
	useEffect(() => {
		setWordlist(null);
		if (page === 'spell') {
			loadWordList().then(setWordlist);
		}
	}, [page]);

	if (page === 'select') {
	    return (
			<main>
				<UnitSelector />
				<button onClick={() => setPage('spell')}>Done</button>
			</main>
		);
	}

	if (wordlist === null) {
	    return <main>Loading...</main>;
	}

	if (page === 'spell') {
	    return (
	        <main>
				<SpellBox wordlist={wordlist} />
				<a class="a-button" onClick={() => setPage('select')}>Reselect Units</a>
			</main>
	    )
	}
}
