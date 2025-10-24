import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext.jsx';

export const useAuth = () => useSelector((state) => state.auth);
export const useDilemmas = () => useSelector((state) => state.dilemmas);
export const useAppDispatch = () => useDispatch();

export const useAuthState = () => {
  const { isAuthenticated, loading } = useAuth();
  return { isAuthenticated, authLoading: loading };
};

export const useDilemmaState = () => {
  const { dilemmas, loading, page, hasMore } = useDilemmas();
  return { dilemmas, loading, page, hasMore };
};

export const useUserDilemmas = () => {
  const { userDilemmas, loading } = useDilemmas();
  return { userDilemmas, loading: loading.user };
};

export const useSingleDilemma = () => {
  const { singleDilemma, loading } = useDilemmas();
  return { singleDilemma, loading: loading.single };
};

export const useAsyncAction = (loadingKey) => {
  const dispatch = useAppDispatch();
  const loading = useLoading(loadingKey);

  const execute = useCallback(async (action, loadingMessage) => {
    return loading.withLoading(async () => {
      return await dispatch(action).unwrap();
    }, loadingMessage);
  }, [dispatch, loading]);

  return { execute, isLoading: loading.isLoading };
};
