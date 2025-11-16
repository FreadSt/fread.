import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/index';

// Используем типизированный dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Используем типизированный useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
