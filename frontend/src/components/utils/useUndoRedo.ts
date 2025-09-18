import { useCallback, useRef, useState } from 'react';

export interface HistoryState<T> {
	past: T[];
	present: T;
	future: T[];
}

export default function useUndoRedo<T>(initial: T) {
	const [state, setState] = useState<HistoryState<T>>({ past: [], present: initial, future: [] });
	const isUpdating = useRef(false);

	const set = useCallback((next: T) => {
		if (isUpdating.current) return;
		setState(prev => ({ past: [...prev.past, prev.present], present: next, future: [] }));
	}, []);

	const undo = useCallback(() => {
		setState(prev => {
			if (prev.past.length === 0) return prev;
			const previous = prev.past[prev.past.length - 1];
			const newPast = prev.past.slice(0, prev.past.length - 1);
			return { past: newPast, present: previous, future: [prev.present, ...prev.future] };
		});
	}, []);

	const redo = useCallback(() => {
		setState(prev => {
			if (prev.future.length === 0) return prev;
			const next = prev.future[0];
			const newFuture = prev.future.slice(1);
			return { past: [...prev.past, prev.present], present: next, future: newFuture };
		});
	}, []);

	const replace = useCallback((next: T) => {
		isUpdating.current = true;
		setState(prev => ({ ...prev, present: next }));
		isUpdating.current = false;
	}, []);

	return { state, set, undo, redo, replace };
}