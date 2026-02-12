import { CommonActions, createNavigationContainerRef } from '@react-navigation/native';
import type { AuthenticatedStackParamList } from './AppNavigator';

export const navigationRef = createNavigationContainerRef<AuthenticatedStackParamList>();

export const navigateFromModal = <RouteName extends keyof AuthenticatedStackParamList>(
  screen: RouteName,
  params?: AuthenticatedStackParamList[RouteName]
) => {
  if (!navigationRef.isReady()) {
    return;
  }

  navigationRef.dispatch(
    CommonActions.navigate({
      name: screen as string,
      params: params as object | undefined
    })
  );
};
