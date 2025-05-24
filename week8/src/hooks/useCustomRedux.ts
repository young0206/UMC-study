import {
  useDispatch as useDefaultDispatch,
  useSelector as useDefaultSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { Appdispatch, RootState } from "../store/store";

export const useDispatch: () => Appdispatch = useDefaultDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useDefaultSelector;
