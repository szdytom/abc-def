import { useEffect, useState } from 'react';
import { RatingStore } from '../db';
import cn from 'classnames';
import './SpellBox.css';

function wordRegularize(a) {
	return a
		.replaceAll(/\[[^\]*]\]/g, "")
		.replaceAll(/\([^\)]*\)/g, "")
		.toLowerCase().split("")
		.filter(x => 'a' <= x && x <= 'z')
		.join('');
}

function compareAnswer(x, y) {
	return wordRegularize(x) === wordRegularize(y);
}

export function SpellBox({ wordlist }) {
	const [ratingStore] = useState(new RatingStore());

	const [ratingStoreReady, setRatingStore] = useState(false);
	const [combo, setCombo] = useState(0);
	const [question, setQuestion] = useState(null);
	const [isCorrect, setIsCorrect] = useState(true);
	const [userAnswer, setUserAnswer] = useState('');
	const [isNexting, setIsNexting] = useState(false);
	const [answerStatus, setAnswerStatus] = useState('none');
	const [progress, setProgress] = useState({ reviewCount: 0, learnCount: 0 });

	useEffect(() => {
		(async () => {
			await ratingStore.connect();
			for (let word of wordlist.keys()) {
				await ratingStore.touchItem(word);
			}
			setRatingStore(true);
		})();
	}, []);

	const handleInputChange = (e) => {
		setUserAnswer(e.target.value);
	};

	const resetState = () => {
		setAnswerStatus('none');
		setIsNexting(false);
		setUserAnswer('');
	};

	const nextQuestion = async () => {
		resetState();
		setQuestion(null);
		setIsCorrect(true);
		let res = await ratingStore.getItem(wordlist.keys());
		setProgress(res.progress);
		setQuestion(res.next);
	};

	// First question generation
	useEffect(() => {
		if (ratingStoreReady) {
			nextQuestion();
		}
	}, [ratingStoreReady]);

	const handleSubmit = async () => {
		let ok = compareAnswer(question.word, userAnswer);
		let outcome = ok ? 1 : -1;
		if (isCorrect) {
			setQuestion(await ratingStore.markItem(question.word, outcome));
		}

		if (!ok) {
			setIsCorrect(false);
			setCombo(0);
			setUserAnswer(question.word);
			setAnswerStatus('wrong');
		} else {
			if (isCorrect) {
				setCombo(combo + 1);
			}
			setAnswerStatus('correct');
			setIsNexting(true);
			if (isCorrect || answerStatus == 'none') {
				setTimeout(nextQuestion, 500);
			} else {
				resetState();
			}
		}
	};

	const handleSubmitEvent = () => {
		if (!isNexting) {
			handleSubmit();
		}
	};

	const handleInputKeydown = (e) => {
		if (e.code === 'Enter') {
			handleSubmitEvent();
		}
	};

	if (!ratingStoreReady || question == null) {
		return <p>Generating Next Question...</p>;
	}

	let description = wordlist.get(question.word).text;

	return (
		<>
			<p>COMBO: {combo}. Review: {progress.reviewCount}. New: {progress.learnCount}</p>
			<h2>{description}</h2>
			<div id="spell-inputs-container">
				<input
					className={cn('spell-input', {
						'spell-input-wrong': answerStatus === 'wrong',
						'spell-input-correct': answerStatus === 'correct',
					})}
					type='text'
					value={userAnswer}
					onChange={handleInputChange}
					onKeyDown={handleInputKeydown}
					autoFocus
				/>
				<button id='submit-button' onClick={handleSubmitEvent}>
					Submit
				</button>
			</div>
			<p>Rating: {question.rating}. Confidence: {question.confidence}.</p>
		</>
	)
}
